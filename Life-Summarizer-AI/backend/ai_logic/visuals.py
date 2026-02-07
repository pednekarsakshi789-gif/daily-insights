import pandas as pd
import matplotlib.pyplot as plt

DATA_PATH = "data/journal_entries.csv"

def generate_trends():
    try:
        # Load the data
        df = pd.read_csv(DATA_PATH)
        
        # Ensure date is in datetime format for proper plotting
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')

        # Create a figure with two subplots
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 10))
        plt.subplots_adjust(hspace=0.4)

        # 1. Sentiment Polarity Over Time (Line Graph)
        ax1.plot(df['date'], df['polarity'], marker='o', linestyle='-', color='b')
        ax1.axhline(0, color='red', linestyle='--', linewidth=1) # Neutral line
        ax1.set_title('Emotional Patterns Over Time')
        ax1.set_xlabel('Date')
        ax1.set_ylabel('Polarity (Negative < 0 < Positive)')
        ax1.grid(True, alpha=0.3)

        # 2. Mood Distribution (Bar Chart)
        sentiment_counts = df['sentiment'].value_counts()
        colors = {'Positive': 'green', 'Neutral': 'gray', 'Negative': 'red'}
        
        sentiment_counts.plot(kind='bar', ax=ax2, color=[colors.get(x, 'blue') for x in sentiment_counts.index])
        ax2.set_title('Overall Mood Distribution')
        ax2.set_xlabel('Sentiment Type')
        ax2.set_ylabel('Number of Entries')

        print("Graphs generated successfully.")
        plt.show()

    except FileNotFoundError:
        print("Error: journal_entries.csv not found. Please run main.py first.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    generate_trends()