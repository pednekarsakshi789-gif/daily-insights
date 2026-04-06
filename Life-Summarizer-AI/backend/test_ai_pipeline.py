#!/usr/bin/env python3
"""Test script for AI pipeline"""
import requests
import json
import time

# Wait for backend to fully start
time.sleep(3)

BASE_URL = "http://localhost:5000"

# First, register a test user
print("=" * 60)
print("STEP 1: Registering test user...")
print("=" * 60)

import random
test_num = random.randint(1000, 9999)
register_data = {
    "username": f"testuser{test_num}",
    "email": f"test{test_num}@example.com",
    "password": "testpass123"
}

response = requests.post(f"{BASE_URL}/register", json=register_data)
print(f"Register Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

if response.status_code not in [201, 409]:  # 409 if user already exists
    print("ERROR: Registration failed!")
    exit(1)

# Login to get JWT token
print("\n" + "=" * 60)
print("STEP 2: Logging in...")
print("=" * 60)

login_data = {
    "username": f"testuser{test_num}",
    "password": "testpass123"
}

response = requests.post(f"{BASE_URL}/login", json=login_data)
print(f"Login Status: {response.status_code}")
response_json = response.json()
print(f"Response: {json.dumps(response_json, indent=2)}")

if response.status_code != 200:
    print("ERROR: Login failed!")
    exit(1)

access_token = response_json["access_token"]
print(f"✓ Got access token: {access_token[:20]}...")

# Submit a journal entry
print("\n" + "=" * 60)
print("STEP 3: Submitting journal entry...")
print("=" * 60)

journal_data = {
    "entry": "Today was an amazing day! I spent time with my family and we went to the park. It was wonderful to see my kids playing and enjoying themselves. The weather was beautiful and perfect for outdoor activities. I felt very happy and content throughout the day. This is a great memory that I will cherish forever."
}

headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json"
}

response = requests.post(f"{BASE_URL}/journal", json=journal_data, headers=headers)
print(f"Journal POST Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

if response.status_code == 200:
    print("\n✓ SUCCESS! Journal entry processed!")
    result = response.json()
    if "summary" in result:
        print(f"Summary:  {result['summary']}")
    if "sentiment" in result:
        print(f"Sentiment: {result['sentiment']} ({result['polarity']})")
else:
    print("\nERROR: Journal submission failed!")
    print(f"Full response: {response.text}")

# Get history
print("\n" + "=" * 60)
print("STEP 4: Retrieving journal history...")
print("=" * 60)

response = requests.get(f"{BASE_URL}/history", headers=headers)
print(f"History Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

print("\n" + "=" * 60)
print("TEST COMPLETE")
print("=" * 60)
