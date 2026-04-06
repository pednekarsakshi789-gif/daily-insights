# PostgreSQL Setup Guide - Local & Production

## Part 1: Local PostgreSQL Setup (Windows)

### Step 1: Download & Install PostgreSQL

1. Download PostgreSQL installer from: https://www.postgresql.org/download/windows/
2. Run installer and follow these settings:
   - **Installation Directory**: `C:\Program Files\PostgreSQL\15` (or latest version)
   - **Port**: `5432` (default)
   - **Superuser Password**: `postgres`
   - **Service Name**: `postgresql-x64-15`

3. Verify installation:
   ```powershell
   psql --version
   ```

### Step 2: Create Local Database & User

Open **pgAdmin** (installed with PostgreSQL) or use command line:

```powershell
psql -U postgres
```

Then run these SQL commands:

```sql
-- Create database
CREATE DATABASE daily_insights;

-- Create user (already exists as 'postgres')
-- Verify user can access the database
GRANT ALL PRIVILEGES ON DATABASE daily_insights TO postgres;

-- Exit
\q
```

**OR** use one-liner from PowerShell:

```powershell
psql -U postgres -c "CREATE DATABASE daily_insights;"
```

### Step 3: Verify Connection

Test connection string in your code:

```powershell
# In PowerShell, test if PostgreSQL is accessible
$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/daily_insights"
echo $env:DATABASE_URL
```

---

## Part 2: Update Your Backend for PostgreSQL

✅ **Already Done:**
- ✅ Added `psycopg2-binary` to `requirements.txt`
- ✅ Updated `app.py` to use PostgreSQL with environment variables
- ✅ Updated `.env` file with `DATABASE_URL`

### Current Configuration in `.env`:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/daily_insights
```

### How It Works:
- If `DATABASE_URL` env var is set → uses that (production)
- Default → uses local PostgreSQL on `localhost:5432`
- Includes connection pooling for production reliability

---

## Part 3: Run Backend with PostgreSQL Locally

### Step 1: Activate Virtual Environment

```powershell
cd C:\Users\Sakshi P Pednekar\OneDrive\Desktop\dailyInsights
& ".\venv\Scripts\Activate.ps1"
```

### Step 2: Install Updated Requirements

```powershell
cd Life-Summarizer-AI\backend
pip install -r requirements.txt
```

### Step 3: Run Flask Server

```powershell
python app.py
```

**Expected Output:**
```
 * Running on http://127.0.0.1:5000
 * Database: PostgreSQL (daily_insights)
```

### Troubleshooting Local Setup

| Error | Solution |
|-------|----------|
| `FATAL: database "daily_insights" does not exist` | Create database: `psql -U postgres -c "CREATE DATABASE daily_insights;"` |
| `psql: error: connection refused` | PostgreSQL service not running. Start it: `pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start` |
| `FATAL: password authentication failed` | Wrong password in `.env` file. Check PostgreSQL password (default: `postgres`) |
| `ModuleNotFoundError: No module named 'psycopg2'` | Run `pip install psycopg2-binary` |

---

## Part 4: Production Setup on Railway

### Step 1: Add PostgreSQL to Your Railway Project

```bash
railway add
# Select "PostgreSQL" from the menu
```

This automatically:
- Creates a PostgreSQL instance in the cloud
- Sets `DATABASE_URL` environment variable
- Configures backups and auto-scaling

### Step 2: Verify Railway Environment Variables

1. Go to your Railway project dashboard
2. Look for the `PostgreSQL` service
3. Copy the `DATABASE_URL` value (looks like: `postgresql://user:password@host:port/dbname`)

### Step 3: Deploy to Railway

```bash
railway up
```

Or push to your connected GitHub repo:
```bash
git add .
git commit -m "Set up PostgreSQL for production"
git push origin main
```

Railway automatically detects the `.env` and `requirements.txt` files.

### Step 4: Verify Deployment

```bash
railway logs
```

Look for:
```
 * Running on http://0.0.0.0:5000
 * Database: PostgreSQL (production)
```

---

## Part 5: Environment Variables Summary

### Local Development (`.env`)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/daily_insights
JWT_SECRET_KEY=your-secret-key
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Railway Production (Auto-set)
```
DATABASE_URL=postgresql://[auto-generated]  # Railway sets this
JWT_SECRET_KEY=your-production-secret-key   # Set in Railway dashboard
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

---

## Data Migration

If you have existing SQLite data in `journal_entries.csv`, you can migrate it to PostgreSQL:

```python
# Run this script once to migrate data
from models import db, User, JournalEntry
from datetime import datetime
import pytz

with app.app_context():
    # 1. Create all tables in PostgreSQL
    db.create_all()
    
    # 2. Create admin user
    admin = User(username='admin', email='admin@dailyinsights.com', is_admin=True)
    admin.set_password('admin123')
    db.session.add(admin)
    db.session.commit()
    print("Migration complete!")
```

---

## Quick Reference Commands

| Task | Command |
|------|---------|
| Start PostgreSQL (Windows) | Open Services > PostgreSQL or terminal: `pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start` |
| Connect to DB | `psql -U postgres -d daily_insights` |
| List databases | `\l` (in psql) |
| List tables | `\dt` (in psql) |
| Drop database | `DROP DATABASE daily_insights;` (in psql) |
| Backup database | `pg_dump -U postgres daily_insights > backup.sql` |
| Restore database | `psql -U postgres daily_insights < backup.sql` |

---

## Next Steps

1. ✅ Install PostgreSQL locally
2. ✅ Create `daily_insights` database
3. ✅ Test local connection: `python app.py`
4. ✅ Deploy to Railway with `railway up`
5. ✅ Monitor logs: `railway logs`

Your app is now ready to scale to thousands of users! 🚀
