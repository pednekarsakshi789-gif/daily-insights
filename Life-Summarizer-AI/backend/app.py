from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import timedelta

import pandas as pd
from datetime import date
import os

# ---- AI LOGIC IMPORTS ----
from ai_logic.preprocess import clean_text
from ai_logic.summarizer import summarize_text
from ai_logic.sentiment import analyze_sentiment
from ai_logic.metrics import log_metrics
from ai_logic.security import encrypt_data, decrypt_data

# ---- FLASK APP SETUP ----
app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:3000",
    "http://localhost:5000",
    os.getenv("VERCEL_URL", "http://localhost:3000")
])

# ---- DATA STORAGE ----
DATA_DIR = "data"
DATA_PATH = os.path.join(DATA_DIR, "journal_entries.csv")

if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)


def get_journal_df():
    """
    Load encrypted journal data if exists, otherwise create empty DataFrame.
    """
    if not os.path.exists(DATA_PATH):
        return pd.DataFrame(
            columns=["date", "entry", "summary", "polarity", "sentiment"]
        )
    try:
        return decrypt_data(DATA_PATH)
    except Exception:
        return pd.read_csv(DATA_PATH)


# ---- HEALTH CHECK ----
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "Backend is running"}), 200


# ---- JOURNAL ENTRY API ----
@app.route("/journal", methods=["POST"])
def journal_entry():
    data = request.get_json()

    if not data or "entry" not in data:
        return jsonify({"error": "No journal entry provided"}), 400

    text = data["entry"]

    # ---- AI PIPELINE ----
    cleaned_text = clean_text(text)
    summary = summarize_text(cleaned_text)
    polarity, sentiment = analyze_sentiment(cleaned_text)
    metrics = log_metrics(cleaned_text, summary)

    # ---- SAVE SECURELY ----
    df = get_journal_df()

    new_row = {
        "date": date.today(),
        "entry": text,
        "summary": summary,
        "polarity": polarity,
        "sentiment": sentiment
    }

    df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
    encrypt_data(df, DATA_PATH)

    # ---- RESPONSE ----
    return jsonify({
        "message": "Journal saved securely",
        "summary": summary,
        "sentiment": sentiment,
        "polarity": polarity,
        "original_length": metrics["original_length"],
        "summary_length": metrics["summary_length"],
        "compression_ratio": metrics["compression_ratio"]
    }), 200
@app.route("/history", methods=["GET"])
def journal_history():
    df = get_journal_df()

    if df.empty:
        return jsonify([]), 200

    return jsonify(df.to_dict(orient="records")), 200

@app.route("/weekly-trends", methods=["GET"])
def weekly_trends():
    df = get_journal_df()

    if df.empty:
        return jsonify([]), 200

    # Convert date column
    df["date"] = pd.to_datetime(df["date"])

    # Map sentiment to score
    sentiment_map = {
        "Positive": 1,
        "Neutral": 0,
        "Negative": -1
    }
    df["score"] = df["sentiment"].map(sentiment_map).fillna(0)

    # Filter last 7 days
    last_week = date.today() - timedelta(days=6)
    df = df[df["date"].dt.date >= last_week]

    # Aggregate per day
    trend = (
        df.groupby(df["date"].dt.date)["score"]
        .mean()
        .reset_index()
        .rename(columns={"score": "avg_mood"})
    )

    return jsonify(trend.to_dict(orient="records")), 200

# ---- DELETE HISTORY ----
@app.route("/history", methods=["DELETE"])
def delete_history():
    """
    Delete all journal history data.
    """
    try:
        if os.path.exists(DATA_PATH):
            os.remove(DATA_PATH)
        return jsonify({"message": "All journal history has been deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---- RUN SERVER ----
if __name__ == "__main__":
    app.run(debug=True)
