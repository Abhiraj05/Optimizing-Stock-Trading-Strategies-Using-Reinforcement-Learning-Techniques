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
from stable_baselines3 import DQN
import torch
import warnings
from typing import Dict, List, Any, Optional, Union

# Suppress warnings
warnings.filterwarnings('ignore')

# Initialize Flask app 
app = Flask(__name__)

# Constants 
MARKETAUX_API_KEY = "7wQyV3iXT79MtqY2e8YqrIX9qQAcZabyfHRTa5va"
DEFAULT_ACTION = "hold"
ACTION_MAP = {0: "hold", 1: "buy", 2: "sell"}
SENTIMENT_THRESHOLD = 0.3

# Load Models and Metadata 
def load_model_with_fallback(model_path: str, fallback_path: str = None):
    """Helper function to load models with fallback option"""
    try:
        return load_model(model_path)
    except Exception as e:
        print(f"Error loading model from {model_path}: {e}")
        if fallback_path:
            return load_model(fallback_path)
        raise

# Load prediction models
MODEL_PATHS = {
    "IOB.BO": {
        "model": r"C:\Users\Abhiraj Shilkar\OneDrive\Documents\myproject\Backend model\models\prediction_models\open_close_high_low_iob.keras",
        "meta": r"C:\Users\Abhiraj Shilkar\OneDrive\Documents\myproject\Backend model\models\prediction_models\iob_extended.pkl"
    },
    "IRCTC.BO": {
        "model": r"C:\Users\Abhiraj Shilkar\OneDrive\Documents\myproject\Backend model\models\prediction_models\open_close_high_low_irctc.keras",
        "meta": r"C:\Users\Abhiraj Shilkar\OneDrive\Documents\myproject\Backend model\models\prediction_models\irctc_extended.pkl"
    },
    "INFY.BO": {
        "model": r"C:\Users\Abhiraj Shilkar\OneDrive\Documents\myproject\Backend model\models\prediction_models\open_close_high_low_infy.keras",
        "meta": r"C:\Users\Abhiraj Shilkar\OneDrive\Documents\myproject\Backend model\models\prediction_models\infy_extended.pkl"
    },
        "WIPRO.BO": {
        "model": r"C:\Users\Abhiraj Shilkar\OneDrive\Documents\myproject\Backend model\models\prediction_models\open_close_high_low_wipro.keras",
        "meta": r"C:\Users\Abhiraj Shilkar\OneDrive\Documents\myproject\Backend model\models\prediction_models\wipro_extended.pkl"
    }


}


# Load DQN Models
DQN_MODELS = {
    "IOB.BO": {
        "model": DQN.load(r"C:\Users\Abhiraj Shilkar\OneDrive\Documents\myproject\Backend model\models\agent_models\dqn_IOB_BO_model.zip"),
        "meta": joblib.load(r"C:\Users\Abhiraj Shilkar\OneDrive\Documents\myproject\Backend model\models\agent_models\dqn_IOB_BO_model_meta.pkl")
    },
    "IRCTC.BO": {
        "model": DQN.load(r"C:\Users\Abhiraj Shilkar\OneDrive\Documents\myproject\Backend model\models\agent_models\dqn_IRCTC_BO_model.zip"),
        "meta": joblib.load(r"C:\Users\Abhiraj Shilkar\OneDrive\Documents\myproject\Backend model\models\agent_models\dqn_IRCTC_BO_model_meta.pkl")
    },
    "INFY.BO": {
        "model": DQN.load(r"C:\Users\Abhiraj Shilkar\OneDrive\Documents\myproject\Backend model\models\agent_models\dqn_INFY_BO_model.zip"),
        "meta": joblib.load(r"C:\Users\Abhiraj Shilkar\OneDrive\Documents\myproject\Backend model\models\agent_models\dqn_INFY_BO_model_meta.pkl")
    },
    "WIPRO.BO": {
        "model": DQN.load(r"C:\Users\Abhiraj Shilkar\OneDrive\Documents\myproject\Backend model\models\agent_models\dqn_WIPRO_BO_model.zip"),
        "meta": joblib.load(r"C:\Users\Abhiraj Shilkar\OneDrive\Documents\myproject\Backend model\models\agent_models\dqn_WIPRO_BO_model_meta.pkl")
    }
}

# Initialize all models
company_map = {}
for symbol, paths in MODEL_PATHS.items():
    try:
        company_map[symbol] = {
            "name": {
                "IOB.BO": "Indian Overseas Bank",
                "IRCTC.BO": "Indian Railway Catering and Tourism",
                "INFY.BO": "Infosys Limited",
                "WIPRO.BO": "Wipro Limited"
            }[symbol],
            "model": load_model(paths["model"]),
            "meta": joblib.load(paths["meta"])
        }
    except Exception as e:
        print(f"Error loading model for {symbol}: {e}")
        continue

# Helper Functions 
def prepare_features(df: pd.DataFrame) -> pd.DataFrame:
    """Prepare technical features for the stock data"""
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

# def fetch_bse_news(company_name: str, ticker: str) -> List[Dict[str, Any]]:
#     """Fetch news articles for the given company"""
#     print(f"Fetching news for {company_name} ({ticker})...")
#     url = f"https://api.marketaux.com/v1/news/all?symbols={ticker}&filter_entities=true&language=en&countries=in&api_token={MARKETAUX_API_KEY}"
    
#     trusted_sources = [
#         'economic times', 'business standard', 'moneycontrol', 'livemint', 
#         'financial express', 'bloomberg', 'reuters', 'mint', 'ndtv', 
#         'hindustan times', 'zeebiz', 'cnbc', 'businesstoday', 'rediff.com',
#         'timesofindia.indiatimes.com', 'economictimes.indiatimes.com',
#         'thehindubusinessline.com', 'thehindu.com', 'businesstoday.in',
#         'bloombergquint.com', 'livemint.com', 'telecom.economictimes.indiatimes.com',
#         'rbi.org.in','inc42.com','seekingalpha.com'
#     ]
    
#     try:
#         response = requests.get(url, timeout=30)
#         response.raise_for_status()
#         data = response.json()

#         if 'data' not in data or not data['data']:
#             print(f"No articles found for {company_name}.")
#             return []
            
#         articles = []
#         for article in data['data']:
#             source = article.get('source', 'Unknown source').lower()
#             if any(trusted_source in source for trusted_source in trusted_sources):
#                 articles.append({
#                     'title': article['title'],
#                     'source': article.get('source', 'Unknown source'),
#                     'published_at': article['published_at'],
#                     'sentiment': float(article.get('sentiment_score', 0))
#                 })
#         return articles
        
#     except requests.exceptions.RequestException as e:
#         print(f"Error fetching news: {e}")
#         return []
#     except Exception as e:
#         print(f"Error parsing news data: {e}")
#         return []

from datetime import datetime, timedelta
import requests
from typing import List, Dict, Any

def fetch_bse_news(company_name: str, ticker: str) -> List[Dict[str, Any]]:
    """Fetch news articles for the given company within the past 2 days."""
    print(f"Fetching news for {company_name} ({ticker})...")
    
    url = f"https://api.marketaux.com/v1/news/all?symbols={ticker}&filter_entities=true&language=en&countries=in&api_token={MARKETAUX_API_KEY}"

    trusted_sources = [
        'economic times', 'business standard', 'moneycontrol', 'livemint', 
        'financial express', 'bloomberg', 'reuters', 'mint', 'ndtv', 
        'hindustan times', 'zeebiz', 'cnbc', 'businesstoday', 'rediff.com',
        'timesofindia.indiatimes.com', 'economictimes.indiatimes.com',
        'thehindubusinessline.com', 'thehindu.com', 'businesstoday.in',
        'bloombergquint.com', 'livemint.com', 'telecom.economictimes.indiatimes.com',
        'rbi.org.in','inc42.com','seekingalpha.com'
    ]

    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        data = response.json()

        if 'data' not in data or not data['data']:
            print(f"No articles found for {company_name}.")
            return []

        # Time filter: Only include articles from the past 2 days
        now = datetime.utcnow()
        two_days_ago = now - timedelta(days=5)

        articles = []
        for article in data['data']:
            published_at_str = article.get('published_at', '')
            try:
                published_at = datetime.strptime(published_at_str, "%Y-%m-%dT%H:%M:%S.%fZ")
            except ValueError:
                continue  # Skip if date format is unexpected

            if published_at < two_days_ago:
                continue  # Skip old articles

            source = article.get('source', 'Unknown source').lower()
            if any(trusted_source in source for trusted_source in trusted_sources):
                articles.append({
                    'title': article['title'],
                    'source': article.get('source', 'Unknown source'),
                    'published_at': published_at_str,
                    'sentiment': float(article.get('sentiment_score', 0))
                })

        return articles

    except requests.exceptions.RequestException as e:
        print(f"Error fetching news: {e}")
        return []
    except Exception as e:
        print(f"Error parsing news data: {e}")
        return []


def analyze_sentiment(articles: List[Dict[str, Any]]) -> Dict[str, float]:
    """Analyze sentiment scores for news articles"""
    print(f"Analyzing sentiment for {len(articles)} articles...")
    analyzer = SentimentIntensityAnalyzer()

    # Financial lexicon enhancements
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
            article['combined_sentiment'] = 0.7 * vader_score + 0.3 * api_score
        except Exception as e:
            print(f"Error in sentiment analysis: {e}")
            article['combined_sentiment'] = 0.0

    if not articles:
        return {'score': 0.0}

    # Time-weighted sentiment calculation
    latest_date = max(parser.isoparse(a['published_at']) for a in articles)
    total_weighted = 0.0
    total_weight = 0.0

    for article in articles:
        article_date = parser.isoparse(article['published_at'])
        hours_old = (latest_date - article_date).total_seconds() / 3600
        weight = max(0.5, 1 - (hours_old / 48))  # Older articles get less weight
        total_weighted += article['combined_sentiment'] * weight
        total_weight += weight

    return {'score': total_weighted / total_weight if total_weight > 0 else 0.0}

# def calculate_adjustment(sentiment_score: float, last_close: float, open_price: float) -> float:
#     """Calculate price adjustment based on sentiment score"""
#     base_multiplier = 1.3
#     if sentiment_score > 0.7:
#         adjustment = 0.06 * base_multiplier
#     elif sentiment_score > 0.5:
#         adjustment = 0.04 * base_multiplier
#     elif sentiment_score > 0.2:
#         adjustment = 0.02 * base_multiplier
#     elif sentiment_score < -0.7:
#         adjustment = -0.07 * base_multiplier
#     elif sentiment_score < -0.5:
#         adjustment = -0.05 * base_multiplier
#     elif sentiment_score < -0.2:
#         adjustment = -0.03 * base_multiplier
#     else:
#         adjustment = 0.0
        
#     recent_volatility = max(last_close * 0.01, open_price * 0.01)
#     return adjustment * (1 - min(recent_volatility, 0.6))

def calculate_adjustment(sentiment_score: float, last_close: float, open_price: float) -> float:
    """Calculate price adjustment based on sentiment score with more conservative multipliers"""
    # More conservative base multiplier
    base_multiplier = 1.0
    
    if sentiment_score > 0.7:
        adjustment = 0.04 * base_multiplier
    elif sentiment_score > 0.5:
        adjustment = 0.025 * base_multiplier
    elif sentiment_score > 0.2:
        adjustment = 0.015 * base_multiplier
    elif sentiment_score < -0.7:
        adjustment = -0.05 * base_multiplier
    elif sentiment_score < -0.5:
        adjustment = -0.035 * base_multiplier
    elif sentiment_score < -0.2:
        adjustment = -0.02 * base_multiplier
    else:
        adjustment = 0.0
        
    # Cap the maximum adjustment
    adjustment = max(min(adjustment, 0.05), -0.05)
    
    recent_volatility = max(last_close * 0.01, open_price * 0.01)
    return adjustment * (1 - min(recent_volatility, 0.6))


def get_dqn_recommendation(
    symbol: str,
    predicted_open: float,
    predicted_high: float,
    predicted_low: float,
    predicted_close: float,
    sentiment_score: float
) -> str:
    """Get trading recommendation with explicit sell rules for negative sentiment"""
    if symbol not in DQN_MODELS:
        return DEFAULT_ACTION
    
    try:
        # normalization and observation code 
        meta = DQN_MODELS[symbol]["meta"]
        min_values = np.array(meta["min_values"], dtype=np.float32)
        max_values = np.array(meta["max_values"], dtype=np.float32)
        
        preds = np.array([predicted_open, predicted_high, predicted_low, predicted_close], dtype=np.float32)
        
        # Safe normalization
        denominator = max_values - min_values
        denominator[denominator == 0] = 1.0
        normalized = (preds - min_values) / denominator
        normalized = np.clip(normalized, 0, 1)
        
        observation = normalized.reshape(-1, 1)
        
        if hasattr(torch, 'from_numpy'):
            observation = torch.from_numpy(observation.astype(np.float32))
        
        action, _ = DQN_MODELS[symbol]["model"].predict(observation, deterministic=True)
        rounded_sentiment = round(sentiment_score, 1)
        
        # Strong Negative Sentiment Override
        if rounded_sentiment <= -0.3:
            return "sell"
            
        # Mild Negative Sentiment Rules
        elif -0.3 < rounded_sentiment < 0:
            # Escalate holds to sells
            if ACTION_MAP.get(int(action)) == "hold":
                return "sell"
            # Downgrade buys to holds
            elif ACTION_MAP.get(int(action)) == "buy":
                return "hold"
        
        # Neutral Sentiment Handling (-0.1 to 0.1)
        elif -0.1 <= rounded_sentiment <= 0.1:
            if ACTION_MAP.get(int(action)) == "buy":
                return "hold"
        
        return ACTION_MAP.get(int(action), DEFAULT_ACTION)
        
    except Exception as e:
        print(f"[ERROR] DQN prediction failed for {symbol}: {e}")
        return DEFAULT_ACTION




# def get_recommendation_explanation(final_action: str, sentiment_score: float) -> str:
#     """Simplified explanation generator"""
#     explanations = {
#         "buy": "Agent recommends buying based on positive technical indicators",
#         "sell": "Agent recommends selling based on negative technical indicators",
#         "hold": "Agent recommends holding due to neutral market conditions"
#     }
    
#     base = explanations.get(final_action.lower(), "No specific trading recommendation")
#     rounded_score = round(sentiment_score, 1)
    
#     if final_action == "buy":
#         if rounded_score >= SENTIMENT_THRESHOLD:
#             return f"{base} and positive market sentiment."
#         return f"{base} & neutral sentiment."
#     elif final_action == "sell":
#         if rounded_score <= -SENTIMENT_THRESHOLD:
#             return f"{base} due to negative market sentiment."
#         return f"{base} & neutral sentiment."
#     return f"{base} & sentiment score."
def get_recommendation_explanation(final_action: str, sentiment_score: float) -> str:
    """Generate explanation for trading recommendation"""
    explanations = {
        "buy": "AI recommends buying based on positive technical indicators",
        "sell": "AI recommends selling based on negative technical indicators",
        "hold": "AI recommends holding due to neutral market conditions"
    }
    
    base = explanations.get(final_action.lower(), "No specific trading recommendation")
    rounded_score = round(sentiment_score, 1)
    
    sentiment_desc = ""
    if rounded_score >= SENTIMENT_THRESHOLD:
        sentiment_desc = "strong positive market sentiment"
    elif rounded_score <= -SENTIMENT_THRESHOLD:
        sentiment_desc = "strong negative market sentiment"
    else:
        sentiment_desc = "neutral market sentiment"
    
    return f"{base} ({sentiment_desc} with score: {rounded_score})"



# Prediction Route
@app.route('/predict/<symbol>', methods=['GET'])
def predict_stock(symbol: str):
    """Main prediction endpoint"""
    symbol = symbol.upper()
    if not symbol.endswith('.BO'):
        symbol += '.BO'

    if symbol not in company_map:
        return jsonify({"error": "Model not available for this stock."}), 404

    company_data = company_map[symbol]
    company_name = company_data["name"]
    model = company_data["model"]
    meta = company_data["meta"]

    try:
        # Get historical data
        today = datetime.now()
        yesterday = today - timedelta(days=1)
        start_predict = yesterday - timedelta(days=meta['lookback'] + 10)

        df = yf.download(symbol, start=start_predict.strftime('%Y-%m-%d'), 
                        end=yesterday.strftime('%Y-%m-%d'))
        if df.empty:
            raise ValueError("No historical stock data available")

        df = prepare_features(df)
        scaled_input = meta['scaler'].transform(df[meta['features']])
        X_today = np.array([scaled_input[-meta['lookback']:]])

        # Get current market data
        ticker = yf.Ticker(symbol)
        last_close = float(ticker.info.get("previousClose", df['Close'].iloc[-1]))
        open_price = float(ticker.info.get("open", df['Open'].iloc[-1]))

        # News and sentiment analysis
        articles = fetch_bse_news(company_name, symbol)
        sentiment_analysis = analyze_sentiment(articles)
        sentiment_score = sentiment_analysis['score']

        # Process news articles
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

        # Make prediction
        prediction_scaled = model.predict(X_today, verbose=0)
        dummy_input = np.zeros((1, len(meta['features'])))
        
        target_cols = [
            meta['features'].index("Open"),
            meta['features'].index("Close"),
            meta['features'].index("High"),
            meta['features'].index("Low")
        ]
        
        for i, idx in enumerate(target_cols):
            dummy_input[0, idx] = prediction_scaled[0][i]
            
        actual_prediction = meta['scaler'].inverse_transform(dummy_input)[0]

        predicted_open = float(actual_prediction[meta['features'].index("Open")])
        predicted_close = float(actual_prediction[meta['features'].index("Close")])
        predicted_high = float(actual_prediction[meta['features'].index("High")])
        predicted_low = float(actual_prediction[meta['features'].index("Low")])

        # Apply sentiment adjustment
        adjustment = calculate_adjustment(sentiment_score, last_close, open_price)
        adjusted_open = predicted_open * (1 + adjustment)
        adjusted_close = predicted_close * (1 + adjustment)
        adjusted_high = predicted_high * (1 + adjustment)
        adjusted_low = predicted_low * (1 + adjustment)

      
        # Get DQN trading recommendation
        trading_action = get_dqn_recommendation(
            symbol=symbol,
            predicted_open=adjusted_open,
            predicted_high=adjusted_high,
            predicted_low=adjusted_low,
            predicted_close=adjusted_close,
            sentiment_score=sentiment_score
        )
        explanation = get_recommendation_explanation(sentiment_score=sentiment_score,
    final_action=trading_action)

        # Prepare historical prices
        historical_prices = [{
            "date": str(idx.date()),
            "open": float(round(row['Open'], 2)),
            "close": float(round(row['Close'], 2)),
            "high": float(round(row['High'], 2)),
            "low": float(round(row['Low'], 2))
        } for idx, row in df.tail(10).iterrows()]

        # Prepare response
        result = {
            "stock_name": symbol,
            "company": company_name,
            "sentiment_score": round(sentiment_score, 4),
            "sentiment_breakdown": sentiment_counts,
            "news": news_list,
            "historical_prices": historical_prices,
            "next_day_price": {
                "predicted_open": round(adjusted_open, 2),
                "predicted_close": round(adjusted_close, 2),
                "predicted_high": round(adjusted_high, 2),
                "predicted_low": round(adjusted_low, 2),
            },
            "trading_recommendation": trading_action,
            "trading_strategy": "DQN (Deep Q-Network) AI Agent with LSTM predictions",
            "recommendation_explanation": get_recommendation_explanation(trading_action, sentiment_score)
        }

        return jsonify(result)

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({"error": str(e)}), 500

# Run the app 
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)