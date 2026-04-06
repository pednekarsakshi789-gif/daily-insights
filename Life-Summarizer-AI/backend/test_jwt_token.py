#!/usr/bin/env python3
"""Test JWT token generation"""
import sys
sys.path.insert(0, 'c:/Users/Sakshi P Pednekar/OneDrive/Desktop/dailyInsights/venv/Lib/site-packages')

from flask import Flask
from flask_jwt_extended import JWTManager, create_access_token
from datetime import timedelta
import json
import base64

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'test-secret-key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)
jwt = JWTManager(app)

with app.app_context():
    # Test with string identity
    print("Creating token with string identity '5'...")
    token = create_access_token(identity='5')
    print(f"Token created: {token[:50]}...")
    
    # Decode token to check payload
    parts = token.split('.')
    payload = parts[1]
    # Add padding if needed
    payload += '=' * (4 - len(payload) % 4)
    decoded = base64.urlsafe_b64decode(payload)
    print(f"Decoded payload: {decoded}")
    print()
    
    # Test with integer identity (should fail)
    print("Attempting to create token with integer identity 5 (should fail or warn)...")
    try:
        token2 = create_access_token(identity=5)
        print(f"Token created: {token2[:50]}...")
        parts2 = token2.split('.')
        payload2 = parts2[1]
        payload2 += '=' * (4 - len(payload2) % 4)
        decoded2 = base64.urlsafe_b64decode(payload2)
        print(f"Decoded payload: {decoded2}")
    except Exception as e:
        print(f"ERROR: {e}")
