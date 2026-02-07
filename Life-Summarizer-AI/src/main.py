import pandas as pd
from datetime import date
import os
from metrics import log_metrics


# Existing AI modules
from preprocess import clean_text
from summarizer import summarize_text
from sentiment import analyze_sentiment

# New security, visuals, and prompt modules
from security import encrypt_data, decrypt_data
from visuals_pro import show_advanced_dashboard
from prompts import get_random_prompt

DATA_PATH = "data/journal_entries.csv"

def get_journal_df():
    if not os.path.exists(DATA_PATH):
        return pd.DataFrame(columns=["date", "entry", "summary", "polarity", "sentiment"])
    try:
        return decrypt_data(DATA_PATH)
    except Exception:
        # Fallback if the file exists but isn't encrypted yet
        return pd.read_csv(DATA_PATH)

def process_entry(text: str):
    cleaned_text = clean_text(text)
    summary = summarize_text(cleaned_text)

    metrics = log_metrics(cleaned_text, summary)

    print("\nAIML Evaluation Metrics")
    print("----------------------")
    print(f"Original Length  : {metrics['original_length']} words")
    print(f"Summary Length   : {metrics['summary_length']} words")
    print(f"Compression Ratio: {metrics['compression_ratio']}")

    polarity, sentiment = analyze_sentiment(cleaned_text)
    metrics = log_metrics(cleaned_text, summary)
    print(f"Compression Ratio: {metrics['compression_ratio']}")

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

    print("\n--- SECURE SUMMARY GENERATED ---")
    print(f"Mood Detected: {sentiment}")
    print(f"Summary: {summary}")

if __name__ == "__main__":
    print("====================================")
    print("      LIFE SUMMARY AI ASSISTANT     ")
    print("====================================")
    print(f"Today's Suggestion: {get_random_prompt()}")
    print("------------------------------------")
    print("1. Write New Entry")
    print("2. View Dashboard")
    
    choice = input("\nSelect (1/2): ")

    if choice == "1":
        user_input = input("\nEnter your thoughts:\n")
        if user_input.strip():
            process_entry(user_input)
    elif choice == "2":
        show_advanced_dashboard()