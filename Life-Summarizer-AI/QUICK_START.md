# Quick Start Guide - Login & Admin System

## What's New

### ✨ User Registration & Login
- Brand new registration page for creating accounts
- Secure JWT-based authentication
- Login page with demo admin credentials
- Auto-logout with session persistence

### 🔐 Admin Dashboard
- Comprehensive admin panel to manage users
- View all registered user accounts with stats
- Access any user's journal entries
- Delete user accounts (with confirmation)
- Platform statistics (total users, entries, admins)

### 📊 Role-Based Access
- **Regular Users**: See only their own entries
- **Admin Users**: See all users and all entries
- Protected routes that redirect unauthorized access

---

## Getting Started (5 Minutes)

### Step 1: Update Python Packages
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Start Backend
```bash
cd backend
python app.py
# Output: Backend running on http://localhost:5000
```
The database file (`daily_insights.db`) is created automatically.

### Step 3: Start Frontend
```bash
cd frontend/my-app
npm install  # Only needed first time
npm start
# Frontend opens at http://localhost:3000
```

### Step 4: Test the System

#### Try Admin Demo (Fastest)
1. Click the **"👨‍💼 Try Admin Demo"** button on login page
2. You're logged in as admin automatically
3. Go to **"👨‍💼 Admin"** tab in navbar
4. View all users and their entries

#### Register as New User
1. Click **"📝 Register"** link on login page
2. Enter: username, email, password
3. Auto-redirects to login on success
4. Login with your new account
5. Create journal entries
6. (Switch to admin to view your entries)

---

## Key Files Changed

### Backend
- **[models.py](backend/models.py)** - New: User & JournalEntry database models
- **[app.py](backend/app.py)** - Updated: JWT auth, admin endpoints, user isolation
- **[requirements.txt](backend/requirements.txt)** - Updated: Added flask-sqlalchemy, flask-jwt-extended, flask-bcrypt

### Frontend
- **[App.js](frontend/my-app/src/App.js)** - Updated: Auth routing, navbar changes
- **[Login.js](frontend/my-app/src/pages/Login.js)** - New: Login page component
- **[Register.js](frontend/my-app/src/pages/Register.js)** - New: Registration page
- **[AdminDashboard.js](frontend/my-app/src/pages/AdminDashboard.js)** - New: Admin panel
- **[AuthContext.js](frontend/my-app/src/context/AuthContext.js)** - New: Auth state management
- **[Home.js](frontend/my-app/src/pages/Home.js)** - Updated: Use JWT auth headers
- **[styles/Auth.css](frontend/my-app/src/styles/Auth.css)** - New: Auth page styling
- **[styles/Admin.css](frontend/my-app/src/styles/Admin.css)** - New: Admin dashboard styling
- **[styles.css](frontend/my-app/src/styles.css)** - Updated: Navbar auth user styles

---

## Credentials

### Default Admin Account
```
Username: admin
Password: admin123
```
⚠️ **Change this in production!**

### Create Test Accounts
Use the registration page to create as many test users as needed.

---

## Navigation Changes

### Before (No Auth)
```
Navbar: Home | About | Contact Us
```

### After (With Auth)

**Not Logged In:**
```
Navbar: About | Contact Us | 🔐 Login | 📝 Register
```

**Logged In (Regular User):**
```
Navbar: 📝 Journal | About | Contact Us | 👤 username | 🚪 Logout
```

**Logged In (Admin):**
```
Navbar: 📝 Journal | 👨‍💼 Admin | About | Contact Us | 👤 username | 🚪 Logout
```

---

## Admin Dashboard Tabs

### 📊 Statistics
Shows:
- Total users registered
- Total journal entries across platform
- Number of admin accounts

### 👥 All Users
Table view with:
- Username, Email, Entry count
- User role (Admin/User badge)
- Join date
- View entries button
- Delete user button

### 📝 View Entries
When you click "View" on a user:
- Shows all entries for that user
- Date, full entry text
- AI summary
- Sentiment analysis
- Polarity score

---

## API Changes

All journal endpoints now require JWT authentication:

### Before
```javascript
fetch('http://localhost:5000/journal', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ entry: 'text' })
})
```

### After
```javascript
fetch('http://localhost:5000/journal', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // ← NEW
  },
  body: JSON.stringify({ entry: 'text' })
})
```

---

## Features Summary

| Feature | Before | After |
|---------|--------|-------|
| Registration | ❌ | ✅ |
| Login/Logout | ❌ | ✅ |
| User Accounts | ❌ | ✅ |
| Data Isolation | ❌ | ✅ |
| Admin Panel | ❌ | ✅ |
| User Management | ❌ | ✅ |
| JWT Auth | ❌ | ✅ |
| Role-Based Access | ❌ | ✅ |
| Password Hashing | ❌ | ✅ |
| Session Persistence | ❌ | ✅ |

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Login button does nothing | Check backend is running (`python app.py`) |
| "Invalid username/password" | Default is admin/admin123 |
| Admin page shows nothing | Must be logged in as admin account |
| App asks to login after refresh | The system correctly restores session from localStorage |
| Database error on start | Delete `backend/daily_insights.db` and restart |

---

## What Users Can Do

### Regular Users
✅ Register and login  
✅ Create journal entries  
✅ View their own entries  
✅ See their personal mood trends  
✅ Delete their entries  
✅ Logout  

### Admin Users
✅ Everything regular users can do +  
✅ View all registered users  
✅ View any user's journal entries  
✅ Delete user accounts  
✅ See platform statistics  

---

## Database

The application uses SQLite with these tables:
- **users**: Stores account info, hashed passwords, admin flags
- **journal_entries**: Stores entries with user_id (keeps each user's data separate)

Each time you enter a journal entry, it's stored with your user_id, ensuring:
- Your entries are only visible to you
- Admin can view all entries but they remain organized by user
- Your data is completely isolated from other users

---

## Next Steps

1. ✅ Backend changes complete
2. ✅ Frontend changes complete
3. ⏳ Test the system with demo admin account
4. ⏳ Create a test user account
5. ⏳ Create entries and check isolation
6. ⏳ Verify admin can see everything
7. (Optional) Deploy to production with proper environment variables

---

## Production Checklist

Before deploying to production:
- [ ] Change default admin password
- [ ] Set strong JWT_SECRET_KEY
- [ ] Enable HTTPS only
- [ ] Restrict CORS to your domain
- [ ] Set up database backups
- [ ] Enable audit logging
- [ ] Review security guide (see AUTHENTICATION_GUIDE.md)

---

**Need detailed documentation?** → See [AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md)
