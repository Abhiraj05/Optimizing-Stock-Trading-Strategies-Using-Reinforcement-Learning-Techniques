
import os
from flask import Flask, jsonify
import numpy as np
import pandas as pd
import yfinance as yf
from datetime import datetime, timedelta
from tensorflow.keras.models import load_model
import joblib
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import requests
from dateutil import parser

# --- Initialize Flask app ---
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
    print(f"Fetching news for {company_name} ({ticker})...")
    url = f"https://api.marketaux.com/v1/news/all?symbols={ticker}&filter_entities=true&language=en&countries=in&api_token={MARKETAUX_API_KEY}"
    trusted_sources = [
        'economic times', 'business standard', 'moneycontrol', 'livemint', 'financial express', 'bloomberg',
        'reuters', 'mint', 'ndtv', 'hindustan times', 'zeebiz', 'cnbc', 'businesstoday', 'rediff.com',
        'timesofindia.indiatimes.com','economictimes.indiatimes.com','thehindubusinessline.com'
    ]
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        data = response.json()

        if 'data' not in data or not data['data']:
            print(f"No articles found for {company_name}.")
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

    except requests.exceptions.RequestException as e:
        print(f"Error fetching news: {e}")
        return []
    except Exception as e:
        print(f"Error parsing news data: {e}")
        return []

def analyze_sentiment(articles):
    print(f"Analyzing sentiment for {len(articles)} articles...")
    analyzer = SentimentIntensityAnalyzer()

    # Add BSE-specific financial terms to lexicon
    fin_lexicon = {
        'bullish': 1.5, 'bearish': -1.5, 'rally': 1.3, 'plunge': -1.7,
        'surge': 1.4, 'slump': -1.4, 'dividend': 0.8, 'bonus': 0.9,
        'fii': 0.5, 'dii': 0.5, 'qip': 0.3, 'fpo': 0.3
    }
    analyzer.lexicon.update(fin_lexicon)

    for article in articles:
        try:
            vader_score = analyzer.polarity_scores(article['title'])['compound']
            api_score = article.get('sentiment', 0)
            # Higher weight to VADER for BSE context
            article['combined_sentiment'] = 0.7 * vader_score + 0.3 * api_score
        except Exception as e:
            print(f"Error in sentiment analysis: {e}")
            article['combined_sentiment'] = 0.0

    if articles:
        # Apply time decay (more recent news has more impact)
        latest_date = max(parser.isoparse(a['published_at']) for a in articles)  # Use dateutil.parser
        total_weighted = 0
        total_weight = 0

        for article in articles:
            article_date = parser.isoparse(article['published_at'])  # Use dateutil.parser
            hours_old = (latest_date - article_date).total_seconds() / 3600
            weight = max(0.5, 1 - (hours_old / 48))  # Linear decay over 48 hours
            total_weighted += article['combined_sentiment'] * weight
            total_weight += weight

        return {'score': total_weighted / total_weight}
    else:
        return {'score': 0.0}

def calculate_adjustment(sentiment_score, last_close, open_price):
    """Sentiment-based adjustment for predicted stock price."""
    base_multiplier = 1.3
    # Determine the adjustment magnitude based on sentiment
    if sentiment_score > 0.7:
        adjustment = 0.06 * base_multiplier
    elif sentiment_score > 0.5:
        adjustment = 0.04 * base_multiplier
    elif sentiment_score > 0.2:
        adjustment = 0.02 * base_multiplier
    elif sentiment_score < -0.7:
        adjustment = -0.07 * base_multiplier
    elif sentiment_score < -0.5:
        adjustment = -0.05 * base_multiplier
    elif sentiment_score < -0.2:
        adjustment = -0.03 * base_multiplier
    else:
        adjustment = 0.0
    # Reduce adjustment based on recent volatility
    recent_volatility = max(last_close * 0.01, open_price * 0.01)
    return adjustment * (1 - min(recent_volatility, 0.6))

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

        # Fetch the last close and open prices
        last_close = float(yf.Ticker(symbol).info.get("previousClose", df['Close'].iloc[-1]))
        open_price = float(yf.Ticker(symbol).info.get("open", df['Open'].iloc[-1]))

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

        # Calculate adjustments based on sentiment, previous close, and open price
        adjustment = calculate_adjustment(sentiment_score, last_close, open_price)

        # Apply the adjustment to both open and close prices
        adjusted_open = predicted_open * (1 + adjustment)
        adjusted_close = predicted_close * (1 + adjustment)

        # --- Fetch Last 10 Days Historical Prices ---
        historical_prices = []
        for idx, row in df.tail(10).iterrows():
            historical_prices.append({
                "date": str(idx.date()),  # Converts Timestamp to YYYY-MM-DD string
                "open": float(round(row['Open'], 2)),
                "close": float(round(row['Close'], 2))
            })

        result = {
            "stock_name": symbol,
            "company": company_name,
            "sentiment_score": round(sentiment_score, 4),
            "sentiment_breakdown": sentiment_counts,
            "news": news_list,
            "historical_prices": historical_prices,
            "next_day_price": {
                "open_price": round(adjusted_open, 2),
                "close_price": round(adjusted_close, 2)
            }
        }

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
