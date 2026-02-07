import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from security import decrypt_data # Importing your new security module

DATA_PATH = "data/journal_entries.csv"

def show_advanced_dashboard():
    # Use our new decryption logic to read the file
    try:
        df = decrypt_data(DATA_PATH)
        df['date'] = pd.to_datetime(df['date'])
        
        plt.figure(figsize=(12, 6))

        # 1. Emotional Trend (Area Chart)
        plt.subplot(1, 2, 1)
        plt.fill_between(df['date'], df['polarity'], color="skyblue", alpha=0.4)
        plt.plot(df['date'], df['polarity'], color="Slateblue", alpha=0.6)
        plt.title("Emotional Flow Over Time")
        plt.xticks(rotation=45)

        # 2. Sentiment Heatmap (Mockup of frequency)
        plt.subplot(1, 2, 2)
        df['day'] = df['date'].dt.day_name()
        pivot = df.groupby('day')['polarity'].mean().reindex([
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
        ]).fillna(0)
        
        sns.barplot(x=pivot.index, y=pivot.values, palette="vlag")
        plt.title("Average Sentiment by Day of Week")
        plt.xticks(rotation=45)

        plt.tight_layout()
        plt.show()
    except Exception as e:
        print(f"Error loading dashboard: {e}. (Ensure you have encrypted data first!)")

if __name__ == "__main__":
    show_advanced_dashboard()