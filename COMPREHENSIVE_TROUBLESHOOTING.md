# 🐛 Complete Troubleshooting Guide for Daily Insights AI

## What's Working ✅
- User registration and login system  
- Authentication with JWT tokens
- Database tables creation
- AI logic modules (summarizer, sentiment, metrics, preprocess)
- All required Python packages installed
- Frontend configured to use localhost:5000

## Common Issues & Solutions

### Issue 1: "Capture Insights" button doesn't work
**Symptoms**: Click button, nothing happens, no error shown

**Solutions in order**:
1. **Check browser console (F12 → Console tab)** for errors
2. **Check backend logs** - watch the terminal where you ran `python app.py`
3. **Check network tab (F12 → Network)** - look for failed requests to `/journal`

### Issue 2: Backend not responding
**Symptoms**: 
- Connection refused error
- Backend shows in terminal but requests fail

**Fix**:
```bash
# Kill any existing processes
taskkill /F /IM python.exe

# Start fresh backend
cd Life-Summarizer-AI/backend
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

### Issue 3: JWT Token errors
**Symptoms**: "Subject must be a string" error

**Status**: ✅ Already fixed in app.py. Tokens now use string identities properly.

### Issue 4: AI analysis not showing
**Symptoms**: 
- Entry saves but summary/sentiment not displayed
- Only shows "Entry saved" message

**Causes & Fixes**:

a) **NLTK punkt not downloaded**
```bash
cd backend
python -c "import nltk; nltk.download('punkt')"
```

b) **Sumy having issues**
```bash
pip install --upgrade sumy
```

c) **Text too short** (must be >30 words)
- Write at least 30 words for summarization to work
- Shorter entries return as-is

### Issue 5: History not showing
**Symptoms**: 
- "No entries yet" message always shown
- Even after saving entries

**Solutions**:
1. **Check database has entries**:
   ```bash
   cd backend
   python -c "
from app import db, JournalEntry
entries = JournalEntry.query.count()
print(f'Total entries: {entries}')
   "
   ```

2. **Check you're logged in with same user**
   - Entries are per-user, only you can see your own

3. **Check network request** (F12 → Network)
   - Look for `/history` request
   - Should return 200 status with array of entries

### Issue 6: Graph not showing
**Symptoms**:
- "Weekly Mood Insight" but no chart below it

**Causes & Fixes**:

a) **Not enough data**
- Need at least 2-3 entries
- Ideally spanning multiple days

b) **Missing sentiment data**
- Check entries have valid sentiment values
- They should be: "Positive", "Negative", or "Neutral"

c) **Chart library issue**
```bash
cd frontend/my-app
npm install recharts
```

### Issue 7: Sentiment analysis not working
**Symptoms**: 
- Sentiment shows as "Unknown" or undefined
- Polarity shows as 0

**Fixes**:
1. Install TextBlob corpora:
   ```bash
   python -c "from textblob import TextBlob; TextBlob('test').correct()"
   ```

2. Check text preprocessing is working:
   ```bash
   cd backend
   python -c "
from ai_logic.preprocess import clean_text
text = 'This is a wonderful day!'
print(clean_text(text))
   "
   ```

## Step-by-Step Verification

### Step 1: Test Backend Health
```bash
curl http://localhost:5000/health
```
Expected: `{"status":"Backend is running"}`

### Step 2: Test User Creation
```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testdebug","email":"debug@test.com","password":"password123"}'
```

### Step 3: Test Login
```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testdebug","password":"password123"}'
```

Save the `access_token` from response (copy the whole string).

### Step 4: Test Journal Entry
```bash
curl -X POST http://localhost:5000/journal \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"entry":"Today was an absolutely incredible day. I accomplished all my goals, worked on an exciting project, and felt completely satisfied with everything I did. The team collaboration was fantastic and we made real progress together."}'
```

Expected response should include:
- `"summary": "..."`
- `"sentiment": "Positive"` or `"Neutral"`
- `"polarity": 0.xxx"`
- `"message": "Journal saved securely"`

### Step 5: Test History Retrieval
```bash
curl -X GET http://localhost:5000/history \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected: Array of entries like:
```json
[{
  "id": 1,
  "date": "2026-03-12 10:30:00",
  "entry": "...",
  "summary": "...",
  "sentiment": "Positive",
  "polarity": 0.8
}]
```

### Step 6: Test Weekly Trends
```bash
curl -X GET http://localhost:5000/weekly-trends \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected: Array of daily trends like:
```json
[{
  "date": "2026-03-12",
  "avg_mood": 1
}]
```

## Debugging Backend Errors

### Check Backend Logs
When you run `python app.py`, watch for these DEBUG messages when submitting an entry:
```
[DEBUG] Starting AI pipeline for entry length: XXX
[DEBUG] Cleaned text: XXX
[DEBUG] Summary generated: XXX
[DEBUG] Sentiment analyzed: XXX
[DEBUG] Metrics calculated
[DEBUG] Entry saved to database with ID: XXX
```

If you see `[ERROR]` instead, the error message will tell you what failed.

### Common Backend Errors

**"Error processing journal entry: list index out of range"**
- Summarizer can't parse the text
- Try with simpler/longer text (>60 words)

**"TextBlob has no attribute sentiment"**
- TextBlob not installed properly
- Run: `pip install textblob`

**"No module named 'sumy'"**
- Sumy not installed
- Run: `pip install sumy`

## Fresh Start Instructions

If everything is broken:

```bash
# 1. Stop everything
taskkill /F /IM python.exe
taskkill /F /IM node.exe

# 2. Delete database and cache
cd Life-Summarizer-AI/backend
del daily_insights.db
rmdir /S __pycache__
rmdir /S ai_logic/__pycache__

# 3. Verify setup
python setup.py

# 4. Start backend
python app.py

# 5. In another terminal, start frontend
cd ../frontend/my-app
npm start
```

## Need More Help?

Check:
1. **Browser Console** (F12) for frontend errors
2. **Backend Terminal** for [DEBUG] and [ERROR] messages  
3. **Network Tab** (F12) for request/response details
4. **Database** - verify entries are being saved

Then follow the step-by-step verification above to isolate the issue.
