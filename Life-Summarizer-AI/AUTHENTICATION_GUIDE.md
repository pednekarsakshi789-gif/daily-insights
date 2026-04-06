# Daily Insights - Authentication & Admin System

## Overview
The Daily Insights application now includes a complete user authentication system with role-based access control. Users can register accounts, log in securely, and regular users' journal entries are kept private. Admin accounts have access to a comprehensive dashboard to manage all registered users and view their journal entries.

## Features

### User Authentication
- **Registration**: New users can create accounts with username, email, and password
- **Login**: Secure JWT token-based authentication
- **Password Security**: Passwords are hashed using bcrypt before storage
- **Session Management**: Tokens are stored securely in localStorage

### Role-Based Access Control
- **Regular Users**: Can write journal entries, view personal history, see personal mood trends
- **Admin Users**: Can view all registered users, see their journal entries, manage user accounts, view platform statistics

### Default Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Note**: Change this password in production!

## Backend Architecture

### Database Models
Located in [backend/models.py](backend/models.py):

#### User Model
```python
- id: Primary Key
- username: Unique identifier (String, 150 chars)
- email: User email (Unique String, 150 chars)
- password_hash: Bcrypt hashed password (String, 255 chars)
- is_admin: Boolean flag for admin privileges (Default: False)
- created_at: Account creation timestamp
- journal_entries: Relationship to user's journal entries (One-to-Many)
```

#### JournalEntry Model
```python
- id: Primary Key
- user_id: Foreign Key to User
- date: Entry creation date/time
- entry: Original journal text
- summary: AI-generated summary
- polarity: Sentiment polarity score
- sentiment: Sentiment classification (Positive/Negative/Neutral)
```

### API Endpoints

#### Authentication Endpoints

**POST `/register`**
- Register a new user account
- Request: `{ username, email, password }`
- Response: `{ message, user: { id, username, email, is_admin, created_at, entry_count } }`
- Status Codes: 201 (Created), 400 (Bad Request), 409 (Conflict - User Exists), 500 (Error)

**POST `/login`**
- Authenticate user and receive JWT token
- Request: `{ username, password }`
- Response: `{ message, access_token, user: { ... } }`
- Status Codes: 200 (OK), 400 (Bad Request), 401 (Unauthorized)

#### Protected Journal Endpoints (Require JWT Token)

**POST `/journal`**
- Submit a new journal entry
- Requires: Bearer token in Authorization header
- Request: `{ entry: string }`
- Response: `{ message, entry, summary, sentiment, polarity, original_length, summary_length, compression_ratio }`

**GET `/history`**
- Retrieve user's journal entries (newest first)
- Requires: Bearer token
- Response: Array of journal entries for authenticated user only

**GET `/weekly-trends`**
- Get 7-day mood trend data for authenticated user
- Requires: Bearer token
- Response: Array of daily mood aggregates: `{ date, avg_mood }`

**DELETE `/history`**
- Delete all user's journal entries
- Requires: Bearer token
- Response: `{ message }`

#### Admin Endpoints (Admin Only)

**GET `/admin/users`**
- Get list of all registered users
- Requires: Admin token
- Response: Array of user objects with account info

**GET `/admin/users/<user_id>/entries`**
- Get all journal entries for a specific user
- Requires: Admin token
- Response: `{ user: {...}, entries: [...] }`

**DELETE `/admin/users/<user_id>`**
- Delete a user account and all their entries
- Requires: Admin token
- Response: `{ message }`
- Restriction: Admin cannot delete their own account

**GET `/admin/stats`**
- Get platform statistics
- Requires: Admin token
- Response: `{ total_users, total_entries, total_admins }`

### Database Configuration
- Type: SQLite (development) - `daily_insights.db`
- Location: Backend root directory
- Automatically created on first run
- Tracks users separately from journal entries (multi-user support)

## Frontend Architecture

### Authentication Context
Located in [frontend/my-app/src/context/AuthContext.js](frontend/my-app/src/context/AuthContext.js)

Provides application-wide authentication state:
```javascript
{
  user: {id, username, email, is_admin, created_at, entry_count},
  token: JWT string,
  isAuthenticated: boolean,
  isLoading: boolean,
  login(token, user): function,
  logout(): function
}
```

State is persisted in localStorage for session resumption.

### Pages

#### Login Page
[frontend/my-app/src/pages/Login.js](frontend/my-app/src/pages/Login.js)
- Form for username/password authentication
- Demo login button (triggers admin credentials)
- Link to registration page
- Error message display
- Redirects to home on successful login

#### Register Page
[frontend/my-app/src/pages/Register.js](frontend/my-app/src/pages/Register.js)
- Form for creating new account
- Password confirmation validation
- Email format validation
- Minimum password length enforcement (6 characters)
- Redirects to login on successful registration

#### Admin Dashboard
[frontend/my-app/src/pages/AdminDashboard.js](frontend/my-app/src/pages/AdminDashboard.js)

Three main sections:

1. **Statistics Tab**
   - Total user count
   - Total journal entries across all users
   - Total admin accounts
   - Metric cards with visual icons

2. **Users Tab**
   - Sortable table of all registered users
   - Columns: Username, Email, Entry Count, Role, Join Date, Actions
   - View user's entries button
   - Delete user button (with confirmation)

3. **View Entries Tab**
   - Selected user's full journal entries
   - Entry displays include:
     - Date/time of entry
     - Original full entry text
     - AI summary
     - Sentiment classification
     - Polarity score
   - Back button to users list

#### Home Page (Journal)
[frontend/my-app/src/pages/Home.js](frontend/my-app/src/pages/Home.js)
- Updated to require JWT authentication
- All API calls include Bearer token in headers
- User's entries only (isolated from other users)
- Weekly trends only for logged-in user

### Navigation Bar Updates
[frontend/my-app/src/App.js](frontend/my-app/src/App.js)

**When Logged Out:**
- About link
- Contact Us link
- Login button
- Register button

**When Logged In:**
- Journal link
- Admin link (if user.is_admin)
- About link
- Contact Us link
- User display: "👤 username"
- Logout button

### Styling

**Authentication Styles**: [frontend/my-app/src/styles/Auth.css](frontend/my-app/src/styles/Auth.css)
- Gradient backgrounds
- Form input styling
- Error/success messages
- Login/register card layouts
- Responsive design

**Admin Styles**: [frontend/my-app/src/styles/Admin.css](frontend/my-app/src/styles/Admin.css)
- Admin dashboard layout
- Statistics cards
- Data table styling
- Entry cards
- Sentiment badges
- Responsive behavior for mobile

## Setup & Installation

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **New Dependencies**
   - flask-sqlalchemy==3.0.5
   - flask-jwt-extended==4.5.2
   - flask-bcrypt==1.0.1
   - torch
   - transformers

3. **Run Backend**
   ```bash
   python app.py
   # Backend runs on http://localhost:5000
   ```

4. **Database**
   - SQLite database auto-created on first run
   - Located at: `backend/daily_insights.db`
   - Default admin account created automatically

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend/my-app
   npm install
   ```

2. **Run Frontend**
   ```bash
   npm start
   # Frontend runs on http://localhost:3000
   ```

3. **Test Flows**
   - Try demo admin login
   - Register new user account
   - Create journal entries as user
   - View entries in admin panel

## Environment Variables

### Backend
```env
JWT_SECRET_KEY=your-secret-key-change-in-production
PORT=5000
FLASK_ENV=development
```

### Frontend
```env
REACT_APP_API_URL=http://localhost:5000
# or for production:
REACT_APP_API_URL=https://your-backend-url.com
```

## Security Considerations

### Current Implementation
✅ JWT token-based authentication
✅ Bcrypt password hashing (12 rounds)
✅ Role-based access control
✅ Protected API endpoints
✅ Token stored only in localStorage
✅ User data isolation (can only see own entries)

### Production Recommendations
⚠️ Change default admin password
⚠️ Use HTTPS only
⚠️ Set strong JWT_SECRET_KEY
⚠️ Implement rate limiting on auth endpoints
⚠️ Add CORS restrictions for specific domains
⚠️ Use HTTPOnly cookies instead of localStorage for tokens
⚠️ Implement refresh token rotation
⚠️ Add two-factor authentication for admin accounts
⚠️ Implement audit logging for admin actions
⚠️ Regular security audits

## Troubleshooting

### Login Issues
- **"Invalid username or password"**: Check credentials (default admin/admin123)
- **"User already exists"**: Choose different username
- **Login button doesn't respond**: Check backend connection at http://localhost:5000

### Admin Dashboard Issues
- **"Admin access required"**: Ensure you're logged in with admin account
- **Empty users list**: No users registered yet, try demo login
- **Can't delete user**: Cannot delete currently logged-in admin account

### Database Issues
- **Database locked**: Ensure backend isn't running multiple instances
- **Missing tables**: Delete `daily_insights.db` and restart backend

## Testing

### Quick Test Flow
1. Start backend: `python app.py`
2. Start frontend: `npm start`
3. Click "Try Admin Demo" on login page
4. Navigate to Admin dashboard
5. Create new user via register
6. Login as new user and create journal entry
7. Switch back to admin to see user and entries

### Test Accounts
- **Admin**: username `admin`, password `admin123`
- **Create any new account**: Registration page

## API Response Examples

### Login Success
```json
{
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@dailyinsights.com",
    "is_admin": true,
    "created_at": "2024-01-15 10:30:00",
    "entry_count": 5
  }
}
```

### Journal Entry Success
```json
{
  "message": "Journal saved securely",
  "entry": {
    "id": 1,
    "user_id": 2,
    "date": "2024-01-15 14:22:00",
    "entry": "Today was productive...",
    "summary": "Had a productive day with good results.",
    "polarity": 0.654,
    "sentiment": "Positive"
  },
  "summary": "Had a productive day with good results.",
  "sentiment": "Positive",
  "polarity": 0.654,
  "original_length": 150,
  "summary_length": 45,
  "compression_ratio": 0.30
}
```

## Future Enhancements
- [ ] Email verification on registration
- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] User profile page
- [ ] Custom export of entries (PDF, CSV)
- [ ] Admin user role management
- [ ] Entry sharing between users
- [ ] AI-powered insights and trends
- [ ] Mobile app with biometric auth

## Support
For issues or questions, please refer to the main project README or contact the development team.
