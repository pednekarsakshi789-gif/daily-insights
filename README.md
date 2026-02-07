# Daily Insights - AI-Powered Journal Summarizer

A full-stack web application that transforms daily journal entries into AI-generated summaries, sentiment analysis, and emotional trend visualizations. Write freely, and let AI extract meaningful insights from your thoughts.

## Features

- 📝 **Journal Entry Processing**: Write journal entries and instantly receive AI-generated summaries
- 🧠 **Sentiment Analysis**: Automatic emotion detection (Positive, Neutral, Negative)
- 📊 **Mood Trend Visualization**: 7-day emotional journey tracked with interactive charts
- 🔐 **Encrypted Data Storage**: Journal entries stored securely with Fernet encryption
- 💾 **CSV-Based Persistence**: All data stored in encrypted CSV files
- 📱 **Responsive UI**: Clean, intuitive React interface with TailwindCSS styling
- ⚡ **Real-Time Analysis**: Instant summarization and sentiment scoring

## Tech Stack

### Backend
- **Framework**: Flask
- **AI/NLP**: 
  - T5-small (Transformers) for abstractive summarization
  - TextBlob for sentiment analysis
  - PyTorch for model inference
- **Security**: Fernet encryption (cryptography library)
- **Database**: CSV with encrypted storage

### Frontend
- **Library**: React 19
- **Visualization**: Recharts 3.6
- **Styling**: CSS3
- **HTTP Client**: Fetch API

## Project Structure

```
daily-insights/
├── Life-Summarizer-AI/
│   ├── backend/
│   │   ├── app.py                 # Flask server & API endpoints
│   │   ├── ai_logic/
│   │   │   ├── summarizer.py      # T5 summarization pipeline
│   │   │   ├── sentiment.py       # TextBlob sentiment analysis
│   │   │   ├── preprocess.py      # Text preprocessing
│   │   │   ├── security.py        # Encryption/decryption logic
│   │   │   ├── metrics.py         # Compression & stats
│   │   │   └── __init__.py
│   │   └── data/
│   │       └── journal_entries.csv # Encrypted journal data
│   │
│   ├── frontend/
│   │   └── my-app/
│   │       ├── src/
│   │       │   ├── App.js         # Main React component
│   │       │   ├── App.css        # Styling
│   │       │   └── pages/         # Page components
│   │       ├── public/            # Static assets
│   │       └── package.json
│   │
│   └── requirements.txt           # Python dependencies
│
├── .gitignore
└── README.md
```

## Installation & Setup

### Prerequisites
- Python 3.9 or higher
- Node.js 16+ and npm
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd Life-Summarizer-AI/backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run Flask server:**
   ```bash
   python app.py
   ```
   The backend will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd Life-Summarizer-AI/frontend/my-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```
   The frontend will open on `http://localhost:3000`

## API Endpoints

### POST `/journal`
Submit a new journal entry for processing.

**Request:**
```json
{
  "entry": "Your journal text here..."
}
```

**Response:**
```json
{
  "summary": "AI-generated summary...",
  "sentiment": "Positive|Neutral|Negative",
  "polarity": 0.45,
  "original_length": 250,
  "summary_length": 50,
  "compression_ratio": 0.2
}
```

### GET `/history`
Retrieve all journal entries with summaries and sentiment analysis.

**Response:**
```json
[
  {
    "date": "2026-02-07",
    "entry": "Original journal text...",
    "summary": "Summary...",
    "sentiment": "Positive",
    "polarity": 0.45
  }
]
```

### GET `/weekly-trends`
Get aggregated sentiment data for the past 7 days.

**Response:**
```json
{
  "dates": ["2026-02-01", "2026-02-02", ...],
  "sentiments": [0.3, -0.1, 0.5, ...],
  "average_mood": 0.22
}
```

## Key Features Explained

### Summarization
- Uses **T5-small** model for neural abstractive summarization
- Automatically skips entries with fewer than 30 words
- Configurable summary length (default: 100 tokens)

### Sentiment Analysis
- **TextBlob** polarity-based scoring (-1.0 to 1.0)
- Classification thresholds:
  - Polarity > 0.1: **Positive** 😊
  - Polarity < -0.1: **Negative** 😞
  - Otherwise: **Neutral** 😐

### Data Security
- All journal entries encrypted with **Fernet symmetric encryption**
- Encryption key stored in `data/secret.key`
- Automatic key generation on first run

### Mood Tracking
- Daily sentiment aggregation over 7-day window
- Visual trend chart with Recharts LineChart
- Sentiment-to-numeric mapping for trend visualization

## Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
FLASK_ENV=development
FLASK_DEBUG=True
```

### Customization
- **Summary Length**: Edit `max_length` in [backend/ai_logic/summarizer.py](Life-Summarizer-AI/backend/ai_logic/summarizer.py)
- **Sentiment Thresholds**: Modify thresholds in [backend/ai_logic/sentiment.py](Life-Summarizer-AI/backend/ai_logic/sentiment.py)
- **Encryption**: Key location can be changed in [backend/ai_logic/security.py](Life-Summarizer-AI/backend/ai_logic/security.py)

## Usage

1. **Start both servers** (backend on :5000, frontend on :3000)
2. **Write your journal entry** in the text area
3. **Click "Analyze"** to process the entry
4. **View results**:
   - AI-generated summary
   - Sentiment classification
   - Emotional polarity score
5. **Track trends** with the 7-day mood chart
6. **Browse history** to revisit past entries and their insights

## Performance Notes

- **First run**: Model downloading may take 2-3 minutes (T5-small ~250MB)
- **Subsequent runs**: Instant processing (model cached)
- **Encryption**: Overhead negligible for typical journal sizes

## Limitations

- No user authentication (local storage only)
- Sentiment analysis limited to English text
- 7-day trend window (fixed lookback period)
- Mobile responsiveness not fully optimized

## Future Enhancements

- User authentication & multi-user support
- Custom mood categories
- Emotion trends (anger, joy, sadness detection)
- Export to PDF/journals
- Mobile app version
- Cloud data sync
- Advanced NLP: named entity recognition, topic detection

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add YourFeature'`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation

---

**Made with ❤️ to help you understand yourself better through writing.**
