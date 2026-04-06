# Complete Setup & Debugging Guide

## Step 1: Ensure Backend is Running
```bash
cd Life-Summarizer-AI/backend
python app.py
```
You should see:
```
 * Running on http://127.0.0.1:5000
```

## Step 2: Test Backend Health
```bash
curl http://localhost:5000/health
```
Expected response: `{"status":"Backend is running"}`

## Step 3: Test Full Flow

### Create Test User
```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser1","email":"test1@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser1","password":"password123"}'
```
Save the `access_token` from response.

### Submit Journal Entry
```bash
curl -X POST http://localhost:5000/journal \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"entry":"Today was an amazing day. I accomplished a lot and felt very productive. My team worked together seamlessly and delivered great results. I feel happy and satisfied with the work."}'
```

### Get History
```bash
curl -X GET http://localhost:5000/history \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Weekly Trends
```bash
curl -X GET http://localhost:5000/weekly-trends \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Common Issues & Solutions

### Issue: "Subject must be a string"
**Solution**: Already fixed in app.py. JWT tokens now use string identities.

### Issue: Summarization not working
**Check**:
1. Text must be > 30 words (shorter text returns as-is)
2. Sumy library must be installed: `pip install sumy`
3. NLTK data: `python -c "import nltk; nltk.download('punkt')"`

### Issue: Sentiment not analyzing
**Check**:
1. Text must have words (not just special characters)
2. TextBlob needs to be installed: `pip install textblob`

### Issue: History not showing
**Check**:
1. Entries must be saved to database first
2. Check that you're using the same user token
3. Verify database file exists: `daily_insights.db`

### Issue: Graph not visualizing
**Check**:
1. At least 2-3 entries needed for trends
2. Entries should span multiple days for better visualization
3. Check that sentiment values are not null

## Debug Mode: Check Backend Logs

When submitting an entry, watch backend terminal for:
```
[DEBUG] Starting AI pipeline for entry length: XXX
[DEBUG] Cleaned text: XXX
[DEBUG] Summary generated: XXX
[DEBUG] Sentiment analyzed: XXX (polarity)
[DEBUG] Metrics calculated
[DEBUG] Entry saved to database with ID: XXX
```

If you see `[ERROR]`, there's an issue with the AI pipeline.

## Verify All Dependencies
```bash
pip list | grep -E "flask|textblob|sumy|transformers|torch"
```

Should see:
- Flask 2.3.3
- TextBlob
- Sumy
- Flask-SQLAlchemy 3.0.5
- Flask-JWT-Extended 4.6.0

## Environment Variables
Create `.env` file in frontend directory:
```
REACT_APP_API_URL=http://localhost:5000
```

## Reset Everything (Fresh Start)
```bash
# Stop backend
# Delete database
rm backend/daily_insights.db

# Restart backend
cd backend
python app.py

# In new terminal, start frontend
cd frontend/my-app
npm start
```

## Frontend Verification
In Home.js, verify API_BASE is set correctly:
```javascript
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
```

Should be `http://localhost:5000` for local development, NOT the production URL.
