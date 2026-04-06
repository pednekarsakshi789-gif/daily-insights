# 🎯 Daily Insights AI - Complete Setup & Troubleshooting

## ✅ What's Fixed

### Backend Fixes (Flask API)
1. ✅ **JWT Token Authentication** - Fixed string/int identity issues
2. ✅ **AI Pipeline Integration** - Clean text → Summarization → Sentiment analysis
3. ✅ **Database Models** - User and JournalEntry with proper relationships
4. ✅ **API Endpoints** - POST `/journal`, GET `/history`, GET `/weekly-trends`, DELETE `/history`
5. ✅ **Error Handling** - Comprehensive logging and error messages
6. ✅ **CORS Configuration** - Allows frontend on localhost:3000

### Frontend Fixes (React)
1. ✅ **Environment Setup** - `.env` file configured for localhost:5000
2. ✅ **Authentication Context** - Token management with localStorage persistence
3. ✅ **API Integration** - All endpoints properly connected
4. ✅ **Error Handling** - Comprehensive try-catch blocks
5. ✅ **UI Components** - Sentiment badges, charts, entry display

### AI/ML Components
1. ✅ **Text Preprocessing** - `clean_text()` normalizes input
2. ✅ **Summarization** - `summarize_text()` uses Sumy LSA algorithm
3. ✅ **Sentiment Analysis** - `analyze_sentiment()` uses TextBlob
4. ✅ **Metrics** - `log_metrics()` calculates compression ratios

---

## 🚀 Quick Start (2 Steps)

### Option 1: Python Script (Recommended)
```bash
cd dailyInsights
python start_app.py
```
This will automatically:
- Verify all dependencies
- Start Flask backend on http://localhost:5000
- Start React frontend on http://localhost:3000
- Open your browser (may need manual)

### Option 2: Manual Setup
```bash
# Terminal 1 - Backend
cd dailyInsights/Life-Summarizer-AI/backend
python app.py

# Terminal 2 - Frontend  
cd dailyInsights/Life-Summarizer-AI/frontend/my-app
npm start
```

### Option 3: Batch Script (Windows)
```bash
cd dailyInsights
START_APP.bat
```

---

## 📋 First Time Setup

### 1. Install Dependencies (If not already done)
```bash
cd dailyInsights

# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Install Python packages
cd Life-Summarizer-AI/backend
pip install -r requirements.txt

# Install Node packages
cd ../frontend/my-app
npm install
```

### 2. Verify Setup
```bash
cd Life-Summarizer-AI/backend
python setup.py
```

You should see:
```
✅ Flask
✅ Flask-CORS
✅ Flask-SQLAlchemy
✅ TextBlob
✅ Sumy
✅ NLTK punkt tokenizer
✅ Database initialized
✅ All AI modules verified
============================================================
✅ SETUP COMPLETE!
```

---

## 💻 Usage Guide

### Access the Application
- **Frontend**: Open http://localhost:3000 in your browser
- **Backend API**: http://localhost:5000

### Create Account or Login
1. Go to Login page
2. **Option A**: Create new account (Register)
3. **Option B**: Use demo account:
   - Username: `admin`
   - Password: `admin123`

### Write Journal Entry
1. Click on "Journal" in navigation
2. Respond to the daily prompt (or skip it)
3. Write your thoughts in the text area
4. Click **"⚡ Capture Insights"**

### What Happens
- ✅ Text is cleaned and processed
- ✅ Summary is generated (must be >30 words)
- ✅ Sentiment is analyzed (Positive/Neutral/Negative)
- ✅ Entry is saved to database
- ✅ Results displayed in AI Analysis card

### View Past Entries & Trends
- **Past Entries** - Scroll down to see all your entries
- **Weekly Chart** - See your mood trends over 7 days
- **Delete All** - Button to clear your history

### Admin Features (if logged in as admin)
1. Click "👨‍💼 Admin" in navigation
2. View statistics, users, and all entries
3. Delete users or their entries

---

## 🔍 Troubleshooting

### Issue: "Capture Insights" does nothing
**Diagnosis**:
1. Open browser console (F12 → Console tab)
2. Check for red error messages
3. Watch backend terminal for [DEBUG] or [ERROR] logs

**Fix**:
- Ensure backend is running (step 1 above)
- Check .env file points to `http://localhost:5000`
- Try refreshing the page

### Issue: "No AI Analysis" appears
**Causes**:
1. Entry too short (must be >30 words)
2. Sumy library issue
3. NLTK punkt not downloaded

**Fix**:
```bash
cd Life-Summarizer-AI/backend

# Check NLTK data
python -c "import nltk; nltk.download('punkt')"

# Reinstall Sumy
pip install --upgrade sumy

# Test it
python -c "from ai_logic.summarizer import summarize_text; print(summarize_text('This is a test entry with more than thirty words to see if the summarization is working correctly for our application.'))"
```

### Issue: Past entries don't show
**Causes**:
1. Database not saving entries
2. Looking at different user's account
3. Wrong token/authentication

**Fix**:
- Make sure you're logged in
- Try creating a new entry (check [DEBUG] logs)
- Look at database: `sqlite3 Life-Summarizer-AI/backend/daily_insights.db`

### Issue: Graph isn't showing
**Causes**:
1. Not enough entries (need 2+)
2. Entries not spanning multiple days
3. Recharts library issue

**Fix**:
```bash
cd Life-Summarizer-AI/frontend/my-app
npm install recharts
npm start
```

### Issue: Backend crashes on startup
**Diagnosis**:
- Watch terminal output for specific error
- Common errors:
  - `ModuleNotFoundError`: Missing Python package
  - `Address already in use`: Port 5000 taken
  - `database is locked`: Delete `daily_insights.db` and restart

**Fix**:
```bash
# Kill stuck processes
taskkill /F /IM python.exe

# Clean slate
cd Life-Summarizer-AI/backend
del daily_insights.db
python setup.py
python app.py
```

---

## 📊 Testing the Full Flow

### Terminal Test With cURL
```bash
# Register user
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"pass123"}'

# Copy the access_token from response, then:

# Submit entry (replace TOKEN with actual token)
curl -X POST http://localhost:5000/journal \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"entry":"Today was amazing. I feel very happy and accomplished a lot. The work was productive and I enjoyed every moment of it."}'

# Get history
curl http://localhost:5000/history \
  -H "Authorization: Bearer TOKEN"

# Get trends
curl http://localhost:5000/weekly-trends \
  -H "Authorization: Bearer TOKEN"
```

---

## 🔧 Configuration Files

### Backend
- **`app.py`** - Main Flask application with all endpoints
- **`models.py`** - Database models (User, JournalEntry)
- **`requirements.txt`** - Python dependencies
- **`setup.py`** - Setup verification script

### Frontend
- **`src/App.js`** - Main React component with routing
- **`src/pages/Home.js`** - Journal interface
- **`src/context/AuthContext.js`** - Authentication state
- **`.env`** - Environment variables (API_URL)

### AI Logic
- **`ai_logic/preprocess.py`** - Text cleaning
- **`ai_logic/summarizer.py`** - Summarization (Sumy LSA)
- **`ai_logic/sentiment.py`** - Sentiment analysis (TextBlob)
- **`ai_logic/metrics.py`** - Compression metrics

---

## 📚 Project Structure
```
dailyInsights/
├── Life-Summarizer-AI/
│   ├── backend/
│   │   ├── app.py              ← Main Flask app
│   │   ├── models.py           ← Database models
│   │   ├── setup.py            ← Setup verification
│   │   ├── requirements.txt    ← Python dependencies
│   │   ├── ai_logic/
│   │   │   ├── preprocess.py
│   │   │   ├── summarizer.py
│   │   │   ├── sentiment.py
│   │   │   └── metrics.py
│   │   └── daily_insights.db   ← SQLite database
│   └── frontend/
│       └── my-app/
│           ├── src/
│           │   ├── App.js      ← Main component
│           │   ├── pages/
│           │   │   ├── Home.js ← Journal interface
│           │   │   ├── Login.js
│           │   │   └── ...
│   │       └── .env            ← Frontend config
├── venv/                       ← Python virtual environment
├── start_app.py               ← One-click launcher
├── START_APP.bat              ← Windows batch launcher
└── COMPREHENSIVE_TROUBLESHOOTING.md
```

---

## 🎓 How It Works

### User Flow
1. User registers/logs in
2. Frontend sends credentials to POST `/login`
3. Backend returns JWT token
4. Frontend stores token in localStorage
5. Each API call includes token in Authorization header

### Journal Entry Flow
1. User writes entry and clicks "Capture Insights"
2. Frontend sends to POST `/journal` with Bearer token
3. Backend processes:
   - Validates token → gets user_id
   - Cleans text
   - Summarizes text (if >30 words)
   - Analyzes sentiment (TextBlob polarity)
   - Calculates metrics
   - Saves to database
4. Returns summary, sentiment, polarity
5. Frontend displays results

### History & Trends
1. Frontend requests GET `/history` with token
2. Backend returns all user's entries
3. Frontend displays in reverse chronological order
4. Trends calculated from last 7 days of data

---

## ⚡ Performance Tips

1. **First summarization is slow** - Sumy model loads on first use (~5 seconds)
2. **Requires internet** - For sentiment analysis (TextBlob may need corpus)
3. **Database queries** - SQLite, fine for dev/small deployments
4. **Token duration** - 30 days stored in JWT

---

## 🐛 Debug Mode

To see detailed backend logs:

```bash
cd Life-Summarizer-AI/backend
python app.py
```

Watch for messages like:
```
[DEBUG] Starting AI pipeline for entry length: 123
[DEBUG] Cleaned text: 105
[DEBUG] Summary generated: 45
[DEBUG] Sentiment analyzed: Positive (0.852)
[DEBUG] Metrics calculated
[DEBUG] Entry saved to database with ID: 42
```

If you see `[ERROR]`, the message will explain what failed.

---

## 📞 Still Need Help?

1. **Read** `COMPREHENSIVE_TROUBLESHOOTING.md` - has 90% of all issues
2. **Check logs**:
   - Browser console (F12)
   - Backend terminal output
   - Network tab (F12 → Network)
3. **Verify setup** - Run `python setup.py` again
4. **Fresh start** - Delete `daily_insights.db` and restart

---

**Made with ❤️ for Daily Insights AI**
