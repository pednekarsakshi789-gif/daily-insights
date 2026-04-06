# Email Configuration Guide for Daily Insights

## Overview
The contact form now sends emails to `amxxnk@gmail.com` using Flask-Mail with Gmail's SMTP server.

## Setup Instructions

### Step 1: Generate Gmail App Password
Since Gmail requires enhanced security, you need to use an **App Password** instead of your regular Gmail password:

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click on "Security" in the left sidebar
3. Scroll down to "How you sign in to Google"
4. Make sure **2-Step Verification** is enabled
5. Scroll to "App passwords"
6. Select "Mail" and "Windows Computer" (or your device)
7. Gmail will generate a 16-character password
8. Copy this password

### Step 2: Configure Environment Variables

Create or update `.env` file in `backend/` directory:

```bash
# Email Configuration (Gmail)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=amxxnk@gmail.com
MAIL_PASSWORD=your-16-character-app-password
MAIL_DEFAULT_SENDER=noreply@dailyinsights.com
JWT_SECRET_KEY=your-secret-key-change-in-production
```

### Step 3: Install Dependencies

```bash
cd backend
pip install flask-mail==0.9.1
# Or if requirements.txt is updated:
pip install -r requirements.txt
```

### Step 4: Test the Email Configuration

Run this test script to verify email sending works:

```python
# backend/test_email.py
from app import app, mail
from flask_mail import Message

with app.app_context():
    try:
        msg = Message(
            subject='Test Email from Daily Insights',
            recipients=['amxxnk@gmail.com'],
            body='This is a test email'
        )
        mail.send(msg)
        print("✅ Email sent successfully!")
    except Exception as e:
        print(f"❌ Error: {e}")
```

Run: `python test_email.py`

### Step 5: Test Contact Form

1. Start backend: `python app.py` (runs on http://localhost:5000)
2. Start frontend: `npm start` (runs on http://localhost:3000)
3. Navigate to Contact Us page
4. Fill out the form and submit
5. Check `amxxnk@gmail.com` for the email

## Endpoints

### Contact Form Endpoint
- **URL**: `POST /contact`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "user@example.com",
    "subject": "Feature Request",
    "message": "I would like to request..."
  }
  ```
- **Response**:
  ```json
  {
    "message": "Your message has been sent successfully! We'll get back to you soon.",
    "contact_email": "user@example.com"
  }
  ```

## Troubleshooting

### Issue: "Less secure app access"
**Solution**: Use App Password (not your Gmail password)

### Issue: "Connection refused" or timeout
**Solution**: 
- Verify MAIL_USERNAME and MAIL_PASSWORD are correct
- Ensure firewall allows outbound connections on port 587
- Check that 2-Step Verification is enabled on Gmail account

### Issue: "Authentication failed"
**Solution**: 
- Regenerate App Password on Google Account
- Ensure no spaces in password
- Confirm MAIL_USE_TLS=True

### Issue: Frontend not sending to backend
**Solution**:
- Verify backend is running on http://localhost:5000
- Check CORS configuration in `app.py`
- Open browser DevTools → Network tab to see request status
- Check backend console for errors

## Production Deployment

When deploying to production:

1. **Never commit `.env` file** (should be in `.gitignore`)
2. Set environment variables on your hosting platform:
   - Railway: Settings → Variables
   - Vercel/Heroku: Add to Config Vars
   - Other platforms: Follow their env var documentation

3. Update CORS origins to include production URLs:
   ```python
   "origins": [
       "https://your-domain.com",
       "https://www.your-domain.com"
   ]
   ```

4. Use a reliable email service for production (optional alternatives):
   - SendGrid
   - Mailgun
   - AWS SES
   - Brand email provider

## Security Notes

- **Never share your App Password** - treat it like your Gmail password
- **Never commit `.env` to Git** - always use `.gitignore`
- The contact form doesn't require authentication (intentional for public use)
- Emails are sent to only `amxxnk@gmail.com` (hardcoded for security)
- User's email is captured for reply-to functionality
