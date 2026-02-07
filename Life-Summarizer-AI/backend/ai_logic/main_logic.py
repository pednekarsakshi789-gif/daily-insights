import pandas as pd
from datetime import date
import os

from metrics import log_metrics
from preprocess import clean_text
from summarizer import summarize_text
from sentiment import analyze_sentiment
from security import encrypt_data, decrypt_data

DATA_PATH = "data/journal_entries.csv"


def get_journal_df():
    """
    Load existing journal data (encrypted if present).
    """
    if not os.path.exists(DATA_PATH):
        return pd.DataFrame(
            columns=["date", "entry", "summary", "polarity", "sentiment"]
        )

    try:
        return decrypt_data(DATA_PATH)
    except Exception:
        # Fallback if file exists but is not encrypted
        return pd.read_csv(DATA_PATH)


def process_entry_web(text: str) -> dict:
    """
    Core AI logic for web/API usage.
    Takes raw text and returns AI insights as JSON-serializable dict.
    """

    # 1. Preprocess text
    cleaned_text = clean_text(text)

    # 2. Summarization
    summary = summarize_text(cleaned_text)

    # 3. Sentiment analysis
    polarity, sentiment = analyze_sentiment(cleaned_text)

    # 4. Metrics
    metrics = log_metrics(cleaned_text, summary)

    # 5. Persist data securely
    df = get_journal_df()
    new_row = {
        "date": date.today().isoformat(),
        "entry": text,
        "summary": summary,
        "polarity": polarity,
        "sentiment": sentiment,
    }

    df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
    encrypt_data(df, DATA_PATH)

    # 6. Return response for API
    return {
        "summary": summary,
        "sentiment": sentiment,
        "polarity": polarity,
        "metrics": metrics,
    }
