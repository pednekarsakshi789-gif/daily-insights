import React from "react";
import { Link } from "react-router-dom";

function AboutUs() {
  return (
    <div className="main-container">
      {/* Header Section */}
      <div className="header-section">
        <h1>About</h1>
        <p>Learn more about Daily Insights and our mission</p>
      </div>

      {/* Mission Section */}
      <div className="card">
        <h2>🎯 Our Mission</h2>
        <p>
          Daily Insights is dedicated to helping you understand yourself better through the power of 
          journaling and AI-driven analysis. We believe that reflection is the first step toward growth, 
          and technology should make that journey easier and more insightful.
        </p>
        <p>
          Our goal is to provide a simple, secure, and intelligent platform where you can explore your 
          thoughts, track your emotional journey, and discover patterns that help you grow.
        </p>
      </div>

      {/* Features Section */}
      <div className="card">
        <h2>✨ Key Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-item-icon">💡</div>
            <h3>Smart Prompts</h3>
            <p>Get daily writing prompts designed to inspire deeper reflection and meaningful insights.</p>
          </div>
          <div className="feature-item">
            <div className="feature-item-icon">🤖</div>
            <h3>AI Analysis</h3>
            <p>Advanced T5 summarization and TextBlob sentiment analysis provide instant insights into your entries.</p>
          </div>
          <div className="feature-item">
            <div className="feature-item-icon">📊</div>
            <h3>Mood Tracking</h3>
            <p>Visualize your emotional trends with interactive charts that show your weekly mood patterns.</p>
          </div>
          <div className="feature-item">
            <div className="feature-item-icon">🔒</div>
            <h3>Privacy First</h3>
            <p>All your entries are encrypted and stored locally. Your data is yours to control.</p>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="card">
        <h2>🛠️ Technology Stack</h2>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          <li>⚛️ <strong>Frontend:</strong> React 19 with React Router for seamless navigation</li>
          <li>🌶️ <strong>Backend:</strong> Flask for robust API endpoints</li>
          <li>🤖 <strong>AI Models:</strong> T5 (Text-to-Text Transfer Transformer) for summarization</li>
          <li>😊 <strong>Sentiment Analysis:</strong> TextBlob for polarity-based emotion detection</li>
          <li>🔐 <strong>Security:</strong> Fernet encryption for data protection</li>
          <li>📊 <strong>Visualization:</strong> Recharts for interactive mood trend charts</li>
          <li>💾 <strong>Data Storage:</strong> CSV with encrypted persitence</li>
        </ul>
      </div>

      {/* Team Section */}
      <div className="card">
        <h2>👥 About the Team</h2>
        <p>
          Daily Insights was created by a passionate team of developers and designers who believe in the power of 
          self-reflection. We're committed to building tools that help people understand themselves better and 
          make positive changes in their lives.
        </p>
        <p>
          Our team combines expertise in machine learning, full-stack development, and user experience design 
          to create an application that is both powerful and easy to use.
        </p>
      </div>

      {/* Values Section */}
      <div className="card">
        <h2>💎 Our Values</h2>
        <div className="values-list">
          <div className="value-item">
            <h3>🔒 Privacy</h3>
            <p>Your data is sacred. We're committed to keeping your journals secure and private.</p>
          </div>
          <div className="value-item">
            <h3>🤝 Transparency</h3>
            <p>We're open about how our AI works and how your data is used and protected.</p>
          </div>
          <div className="value-item">
            <h3>✨ Simplicity</h3>
            <p>Technology should enhance, not complicate. Our interface is designed to be intuitive and clean.</p>
          </div>
          <div className="value-item">
            <h3>📈 Growth</h3>
            <p>We're committed to continuous improvement and adding features that truly help you grow.</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="card" style={{ textAlign: "center", backgroundColor: "rgba(255, 215, 0, 0.1)", borderColor: "rgba(255, 215, 0, 0.5)" }}>
        <h2>Ready to Start Your Journey?</h2>
        <p style={{ marginBottom: "25px" }}>
          Begin reflecting and growing with Daily Insights today.
        </p>
        <Link to="/" className="btn btn-primary">
          📝 Start Journaling
        </Link>
      </div>
    </div>
  );
}

export default AboutUs;
