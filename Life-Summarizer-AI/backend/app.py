from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_mail import Mail, Message
from dotenv import load_dotenv
from datetime import timedelta
from sqlalchemy.exc import IntegrityError
import pandas as pd
import os

# Load environment variables
load_dotenv()

# ---- MODEL IMPORTS ----
from models import db, bcrypt, User, JournalEntry

# ---- AI LOGIC IMPORTS ----
from ai_logic.preprocess import clean_text
from ai_logic.summarizer import summarize_text
from ai_logic.sentiment import analyze_sentiment
from ai_logic.metrics import log_metrics

# ---- FLASK APP SETUP ----
app = Flask(__name__)

CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:3000",
            "http://localhost:3001",
            "https://daily-insight-nu.vercel.app"
        ],
        "methods": ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# ---- DATABASE CONFIG (SQLITE) ---- 
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///daily_insights.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
print("DB:", app.config['SQLALCHEMY_DATABASE_URI'])

# ---- JWT CONFIG ----
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)

# ---- EMAIL CONFIG ----
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', 'amxxnk@gmail.com')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD', '')  # set your app-specific password here
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', 'amxxnk@gmail.com')
app.config['CONTACT_RECEIVER'] = os.environ.get('CONTACT_RECEIVER', 'amxxnk@gmail.com')

# ---- INIT ----
db.init_app(app)
bcrypt.init_app(app)
jwt = JWTManager(app)
mail = Mail(app)

# ---- JWT ERROR HANDLERS ----
@jwt.unauthorized_loader
def handle_missing_auth(err):
    return jsonify({"error": "Authorization header missing", "details": err}), 401

@jwt.invalid_token_loader
def handle_invalid_token(err):
    return jsonify({"error": "Invalid token", "details": err}), 422

@jwt.expired_token_loader
def handle_expired_token(jwt_header, jwt_payload):
    return jsonify({"error": "Token expired", "details": "Please log in again"}), 401

@jwt.revoked_token_loader
def handle_revoked_token(jwt_header, jwt_payload):
    return jsonify({"error": "Token revoked", "details": "Login required"}), 401

# ---- CREATE DATABASE ----
with app.app_context():
    db.create_all()

# ---- ROOT ----
@app.route("/", methods=["GET"])
def index():
    return jsonify({"message": "Daily Insights API", "status": "ok"}), 200

# ---- HEALTH CHECK ----
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "Backend is running"}), 200

# ---- CONTACT ----
@app.route("/contact", methods=["POST"])
def contact():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing data"}), 400

    full_name = data.get("name") or data.get("full_name")
    email = data.get("email")
    subject = data.get("subject")
    message_text = data.get("message")

    if not all([full_name, email, subject, message_text]):
        return jsonify({"error": "Missing required fields. Please provide name, email, subject and message."}), 400

    try:
        receiver = app.config.get('CONTACT_RECEIVER', 'amxxnk@gmail.com')
        msg = Message(
            subject=f"[Contact Us] {subject}",
            recipients=[receiver],
            body=f"""
Name: {full_name}
Email: {email}
Subject: {subject}

Message:
{message_text}
""",
            reply_to=email,
        )
        mail.send(msg)

        return jsonify({"message": "Email sent successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---- REGISTER ----
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing data"}), 400

    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Username exists"}), 409

    user = User(username=data["username"], email=data["email"])
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered"}), 201

# ---- LOGIN ----
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    user = User.query.filter_by(username=data["username"]).first()

    if not user or not user.check_password(data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user.id))

    return jsonify({"token": token, "user": user.to_dict()}), 200

# ---- JOURNAL ----
@app.route("/journal", methods=["POST"])
@jwt_required()
def journal():
    user_identity = get_jwt_identity()

    if not user_identity:
        app.logger.warning("/journal called without user identity")
        return jsonify({"error": "Authentication required"}), 401

    try:
        user_id = int(user_identity)
    except (TypeError, ValueError) as exc:
        app.logger.error("Invalid JWT identity in /journal: %s", user_identity)
        return jsonify({"error": "Invalid user identity"}), 401

    data = request.get_json(silent=True)

    if not data:
        app.logger.warning("/journal called with empty or invalid JSON payload")
        return jsonify({"error": "Missing JSON payload"}), 400

    if "entry" not in data or not isinstance(data["entry"], str) or not data["entry"].strip():
        app.logger.warning("/journal missing 'entry' in request data: %s", data)
        return jsonify({"error": "Request must include non-empty 'entry' field"}), 400

    text = data["entry"].strip()

    try:
        cleaned = clean_text(text)
        summary = summarize_text(cleaned)
        polarity, sentiment = analyze_sentiment(cleaned)
        metrics = log_metrics(cleaned, summary)

        entry = JournalEntry(
            user_id=user_id,
            entry=text,
            summary=summary,
            polarity=float(polarity),
            sentiment=sentiment
        )

        db.session.add(entry)
        db.session.commit()

        return jsonify({
            "summary": summary,
            "sentiment": sentiment,
            "polarity": polarity,
            "compression_ratio": metrics.get("compression_ratio"),
            "metrics": metrics
        }), 201

    except Exception as e:
        app.logger.exception("/journal: failed to save entry for user %s", user_id)
        db.session.rollback()
        return jsonify({"error": "Failed to save entry", "details": str(e)}), 500

# ---- HISTORY ----
@app.route("/history", methods=["GET"])
@jwt_required()
def history():
    user_id = int(get_jwt_identity())

    entries = JournalEntry.query.filter_by(user_id=user_id).all()

    return jsonify([e.to_dict() for e in entries])

@app.route("/history", methods=["DELETE"])
@jwt_required()
def delete_history():
    user_id = int(get_jwt_identity())

    try:
        deleted_count = JournalEntry.query.filter_by(user_id=user_id).delete()
        db.session.commit()
        return jsonify({
            "message": f"Deleted {deleted_count} entries",
            "deleted_count": deleted_count
        }), 200
    except Exception as e:
        db.session.rollback()
        app.logger.exception("/history DELETE: failed to delete entries for user %s", user_id)
        return jsonify({"error": "Failed to delete history", "details": str(e)}), 500

# ---- ADMIN ROUTES ----

def _assert_is_admin():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({"error": "Admin access required"}), 403
    return user

@app.route("/admin/users", methods=["GET"])
@jwt_required()
def admin_users():
    admin = _assert_is_admin()
    if isinstance(admin, tuple):
        return admin

    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200

@app.route("/admin/users/<int:user_id>/entries", methods=["GET"])
@jwt_required()
def admin_user_entries(user_id):
    admin = _assert_is_admin()
    if isinstance(admin, tuple):
        return admin

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    entries = [e.to_dict() for e in user.journal_entries]
    return jsonify({"user": user.to_dict(), "entries": entries}), 200

@app.route("/admin/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
def admin_delete_user(user_id):
    admin = _assert_is_admin()
    if isinstance(admin, tuple):
        return admin

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200

@app.route("/admin/stats", methods=["GET"])
@jwt_required()
def admin_stats():
    admin = _assert_is_admin()
    if isinstance(admin, tuple):
        return admin

    total_users = User.query.count()
    total_entries = JournalEntry.query.count()
    total_admins = User.query.filter_by(is_admin=True).count()

    return jsonify({
        "total_users": total_users,
        "total_entries": total_entries,
        "total_admins": total_admins
    }), 200

# ---- WEEKLY GRAPH ----
@app.route("/weekly-trends", methods=["GET"])
@jwt_required()
def weekly():
    user_id = int(get_jwt_identity())

    entries = JournalEntry.query.filter_by(user_id=user_id).all()

    data = [{
        "date": e.date,
        "sentiment": e.sentiment
    } for e in entries]

    df = pd.DataFrame(data)

    if df.empty:
        return jsonify([])

    df["date"] = pd.to_datetime(df["date"])

    sentiment_map = {"Positive": 1, "Neutral": 0, "Negative": -1}
    df["score"] = df["sentiment"].map(sentiment_map)

    trend = df.groupby(df["date"].dt.date)["score"].mean().reset_index()

    return jsonify(trend.to_dict(orient="records"))

# ---- RUN ----
if __name__ == "__main__":
    app.run(debug=True)
