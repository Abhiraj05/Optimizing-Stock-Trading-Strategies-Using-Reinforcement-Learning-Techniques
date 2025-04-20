import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
from flask import Flask, jsonify
import numpy as np
import pandas as pd
import yfinance as yf
from datetime import datetime, timedelta
from tensorflow.keras.models import load_model
import joblib
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import requests

app = Flask(__name__)

# --- Load Models and Metadata ---
tcs_model = load_model(r"C:\Users\Abhiraj Shilkar\OneDrive\Documents\myproject\Backend model\models\open_close_tcs.keras")
tcs_meta = joblib.load(r"C:\Users\Abhiraj Shilkar\OneDrive\Documents\myproject\Backend model\models\tcs.pkl")

reliance_model = load_model(r"C:\Users\Abhiraj Shilkar\OneDrive\Documents\myproject\Backend model\models\open_close_reliance.keras")
reliance_meta = joblib.load(r"C:\Users\Abhiraj Shilkar\OneDrive\Documents\myproject\Backend model\models\reliance.pkl")

MARKETAUX_API_KEY = "7wQyV3iXT79MtqY2e8YqrIX9qQAcZabyfHRTa5va"

# --- Helper Functions ---

def prepare_features(df):
    df = df.copy()
    df['Daily_Return'] = df['Close'].pct_change()
    df['Log_Return'] = np.log(df['Close'] / df['Close'].shift(1))
    df['MA_10'] = df['Close'].rolling(10).mean()
    df['MA_30'] = df['Close'].rolling(30).mean()
    df['Volatility'] = df['Close'].rolling(20).std()
    df['Close_Lag_1'] = df['Close'].shift(1)
    df['Close_Lag_3'] = df['Close'].shift(3)
    df.dropna(inplace=True)
    return df

def fetch_bse_news(company_name, ticker):
    url = "https://api.marketaux.com/v1/news/all"
    params = {
        "api_token": MARKETAUX_API_KEY,
        "symbols": ticker,
        "countries": "in",
        "language": "en",
        "limit": 10,
        "filter_entities": True,
        "published_after": (datetime.now() - timedelta(days=3)).strftime("%Y-%m-%dT%H:%M:%S")
    }
    trusted_sources = [
        'economic times', 'business standard', 'moneycontrol',
        'livemint', 'financial express', 'bloomberg', 'reuters',
        'mint', 'ndtv', 'hindustan times', 'zeebiz', 'cnbc',
        'businesstoday', 'rediff'
    ]
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        if 'data' not in data or not data['data']:
            return []
        articles = []
        for article in data['data']:
            source = article.get('source', 'Unknown source')
            if any(s in source.lower() for s in trusted_sources):
                articles.append({
                    'title': article['title'],
                    'source': source,
                    'published_at': article['published_at'],
                    'sentiment': float(article.get('sentiment_score', 0))
                })
        return articles
    except:
        return []

def analyze_sentiment(articles):
    analyzer = SentimentIntensityAnalyzer()
    for article in articles:
        try:
            vader_score = analyzer.polarity_scores(article['title'])['compound']
            api_score = article.get('sentiment', 0)
            article['combined_sentiment'] = 0.6 * vader_score + 0.4 * api_score
        except:
            article['combined_sentiment'] = 0.0

    weights = [1.0 - (i * 0.1) for i in range(len(articles))]
    weighted_scores = sum(a['combined_sentiment'] * w for a, w in zip(articles, weights))
    total_weight = sum(weights)
    return {
        'score': (weighted_scores / total_weight) if articles else 0.0
    }

def calculate_adjustment(sentiment_score, last_close):
    score = float(sentiment_score)
    if score > 0.5:
        adjustment = 0.02 + (score - 0.5) * 0.03
    elif score > 0.2:
        adjustment = 0.01 + (score - 0.2) * 0.03
    elif score > 0:
        adjustment = score * 0.05
    elif score < -0.5:
        adjustment = -0.02 + (score + 0.5) * 0.03
    elif score < -0.2:
        adjustment = -0.01 + (score + 0.2) * 0.03
    else:
        adjustment = score * 0.05

    recent_volatility = last_close * 0.01
    return adjustment * (1 - min(recent_volatility, 0.5))

# --- Prediction Route ---

@app.route('/predict/<symbol>', methods=['GET'])
def predict_stock(symbol):
    symbol = symbol.upper()
    if not symbol.endswith('.BO'):
        symbol += '.BO'

    company_map = {
        "TCS.BO": {
            "name": "Tata Consultancy Services",
            "model": tcs_model,
            "meta": tcs_meta
        },
        "RELIANCE.BO": {
            "name": "Reliance Industries",
            "model": reliance_model,
            "meta": reliance_meta
        }
    }

    if symbol not in company_map:
        return jsonify({"error": "Model not available for this stock."}), 404

    company_data = company_map[symbol]
    company_name = company_data["name"]
    model = company_data["model"]
    meta = company_data["meta"]

    scaler = meta['scaler']
    features = meta['features']
    LOOKBACK = meta['lookback']
    target_cols = [features.index("Open"), features.index("Close")]

    today = datetime.now()
    yesterday = today - timedelta(days=1)
    start_predict = yesterday - timedelta(days=LOOKBACK + 10)

    try:
        df = yf.download(symbol, start=start_predict.strftime('%Y-%m-%d'), end=yesterday.strftime('%Y-%m-%d'))
        if df.empty:
            raise ValueError("No historical stock data available")

        df = prepare_features(df)
        scaled_input = scaler.transform(df[features])
        X_today = np.array([scaled_input[-LOOKBACK:]])
        last_close = float(yf.Ticker(symbol).info.get("previousClose", df['Close'].iloc[-1]))

        # --- News + Sentiment ---
        articles = fetch_bse_news(company_name, symbol)
        sentiment_analysis = analyze_sentiment(articles)
        sentiment_score = sentiment_analysis['score']

        # Sentiment classification & breakdown
        news_list = []
        sentiment_counts = {"positive": 0, "negative": 0, "neutral": 0}
        for article in articles:
            score = article.get('combined_sentiment', 0)
            if score > 0.05:
                category = "positive"
            elif score < -0.05:
                category = "negative"
            else:
                category = "neutral"
            sentiment_counts[category] += 1
            news_list.append({
                "title": article['title'],
                "source": article['source'],
                "published_at": article['published_at'],
                "sentiment_score": round(score, 4),
                "sentiment": category
            })

        # --- Predict and Adjust ---
        prediction_scaled = model.predict(X_today, verbose=0)
        dummy_input = np.zeros((1, len(features)))
        dummy_input[0, target_cols[0]] = prediction_scaled[0][0]
        dummy_input[0, target_cols[1]] = prediction_scaled[0][1]
        actual_prediction = scaler.inverse_transform(dummy_input)[0]

        predicted_open = float(actual_prediction[target_cols[0]])
        predicted_close = float(actual_prediction[target_cols[1]])
        adjustment = calculate_adjustment(sentiment_score, last_close)

        adjusted_open = predicted_open * (1 + adjustment)
        adjusted_close = predicted_close * (1 + adjustment)

        result = {
            "stock_name": symbol,
            "company": company_name,
            "sentiment_score": round(sentiment_score, 4),
            "sentiment_breakdown": sentiment_counts,
            "news": news_list,
            "today_price": {
                "open_price": round(adjusted_open, 2),
                "close_price": round(adjusted_close, 2)
            }
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
