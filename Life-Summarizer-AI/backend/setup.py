#!/usr/bin/env python3
"""
Setup script for Daily Insights AI backend
Ensures all dependencies, data files, and configurations are ready
"""
import sys
import os

print("=" * 60)
print("DAILY INSIGHTS AI - BACKEND SETUP")
print("=" * 60)

# Step 1: Check Python version
print("\n[1/6] Checking Python version...")
if sys.version_info < (3, 8):
    print("❌ Python 3.8+ required")
    sys.exit(1)
print(f"✅ Python {sys.version.split()[0]}")

# Step 2: Check virtual environment
print("\n[2/6] Checking virtual environment...")
if hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
    print("✅ Virtual environment active")
else:
    print("⚠️  Virtual environment not detected (but may still work)")

# Step 3: Import core packages
print("\n[3/6] Checking required packages...")
packages_to_check = [
    ('flask', 'Flask'),
    ('flask_cors', 'Flask-CORS'),
    ('flask_sqlalchemy', 'Flask-SQLAlchemy'),
    ('flask_jwt_extended', 'Flask-JWT-Extended'),
    ('flask_bcrypt', 'Flask-Bcrypt'),
    ('textblob', 'TextBlob'),
    ('sumy', 'Sumy'),
    ('pandas', 'Pandas'),
    ('cryptography', 'Cryptography'),
]

missing_packages = []
for module, name in packages_to_check:
    try:
        __import__(module)
        print(f"  ✅ {name}")
    except ImportError:
        print(f"  ❌ {name} - MISSING")
        missing_packages.append(module)

if missing_packages:
    print(f"\n❌ Missing packages: {', '.join(missing_packages)}")
    print("Run: pip install -r requirements.txt")
    sys.exit(1)

# Step 4: Download NLTK data
print("\n[4/6] Setting up NLTK data...")
try:
    import nltk
    # Check if punkt is already downloaded
    try:
        nltk.data.find('tokenizers/punkt')
        print("  ✅ NLTK punkt tokenizer already present")
    except LookupError:
        print("  ⏳ Downloading NLTK punkt tokenizer...")
        nltk.download('punkt', quiet=True)
        print("  ✅ NLTK punkt tokenizer downloaded")
except Exception as e:
    print(f"  ⚠️  NLTK setup warning: {e}")

# Step 5: Check database
print("\n[5/6] Checking database...")
try:
    from app import app, db
    with app.app_context():
        db.create_all()
    print("  ✅ Database initialized (daily_insights.db)")
except Exception as e:
    print(f"  ❌ Database error: {e}")
    sys.exit(1)

# Step 6: Verify AI modules
print("\n[6/6] Verifying AI logic modules...")
ai_modules = [
    'ai_logic.preprocess',
    'ai_logic.summarizer',
    'ai_logic.sentiment',
    'ai_logic.metrics',
]

for module in ai_modules:
    try:
        __import__(module)
        print(f"  ✅ {module}")
    except Exception as e:
        print(f"  ❌ {module}: {e}")
        sys.exit(1)

print("\n" + "=" * 60)
print("✅ SETUP COMPLETE!")
print("=" * 60)
print("\nYou can now run the backend:")
print("  python app.py")
print("\nThe backend will be available at:")
print("  http://localhost:5000")
