#!/usr/bin/env python
"""Test script to verify email configuration for Daily Insights contact form."""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from app import app, mail
from flask_mail import Message

def test_email_configuration():
    """Test if email configuration is correct."""
    
    print("🔍 Testing Email Configuration...")
    print("-" * 50)
    
    # Check environment variables
    mail_username = os.environ.get('MAIL_USERNAME', '')
    mail_password = os.environ.get('MAIL_PASSWORD', '')
    
    if not mail_username:
        print("❌ MAIL_USERNAME not set in .env file")
        return False
    
    if not mail_password:
        print("❌ MAIL_PASSWORD not set in .env file")
        return False
    
    print(f"✅ MAIL_USERNAME: {mail_username}")
    print(f"✅ MAIL_PASSWORD: {'*' * len(mail_password)} (hidden)")
    print("-" * 50)
    
    # Test sending email
    print("\n📧 Attempting to send test email...")
    
    with app.app_context():
        try:
            msg = Message(
                subject='🎉 Daily Insights - Email Configuration Test',
                recipients=['dailyinsightsx@gmail.com'],
                body='''
Hello!

This is a test email from Daily Insights application.

If you received this email, your email configuration is working correctly! ✅

---
Daily Insights Team
                ''',
                reply_to='noreply@dailyinsights.com'
            )
            
            mail.send(msg)
            print("✅ Email sent successfully!")
            print("\nPlease check dailyinsightsx@gmail.com for the test email.")
            return True
            
        except Exception as e:
            print(f"❌ Error sending email: {e}")
            print("\nTroubleshooting steps:")
            print("1. Verify MAIL_USERNAME and MAIL_PASSWORD in .env file")
            print("2. Ensure 2-Step Verification is enabled on Gmail")
            print("3. Use App Password (not regular Gmail password)")
            print("4. Check firewall/network allows port 587")
            return False

if __name__ == "__main__":
    success = test_email_configuration()
    sys.exit(0 if success else 1)
