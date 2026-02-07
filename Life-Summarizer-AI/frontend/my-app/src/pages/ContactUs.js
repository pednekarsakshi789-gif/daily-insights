import React, { useState } from "react";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Show success message
    alert(`Thank you, ${formData.name}! We've received your message and will get back to you soon at ${formData.email}.`);

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
    setSubmitted(true);

    // Hide success message after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="main-container">
      {/* Header Section */}
      <div className="header-section">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Send us a message!</p>
      </div>

      <div className="contact-container">
        {/* Contact Form */}
        <div className="card contact-form-card">
          <h2>📧 Send us a Message</h2>

          {submitted && (
            <div className="success-message">
              ✅ Your message has been sent successfully! Thank you for reaching out.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="What is this about?"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us what you think..."
                className="form-textarea"
                rows="6"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              💬 Send Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="contact-info">
          <div className="card">
            <h2>📞 Other Ways to Reach Us</h2>

            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <div className="contact-details">
                <h3>Email</h3>
                <p><a href="mailto:amxxnk@gmail.com">amxxnk@gmail.com</a></p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">💬</div>
              <div className="contact-details">
                <h3>Social Media</h3>
                <p>Follow us on social media for updates and tips</p>
                <div className="social-links">
                  <a href="#twitter" className="social-link">Twitter</a>
                  <a href="#facebook" className="social-link">Facebook</a>
                  <a href="#instagram" className="social-link">Instagram</a>
                </div>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">🐙</div>
              <div className="contact-details">
                <h3>GitHub</h3>
                <p><a href="https://github.com" target="_blank" rel="noopener noreferrer">Visit our GitHub repository</a></p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">🚀</div>
              <div className="contact-details">
                <h3>Feature Requests</h3>
                <p>Have an idea? We'd love to hear it! Submit your feature request on our GitHub issues page.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>⏰ Response Time</h2>
            <p>We typically respond to messages within <strong>24-48 hours</strong> during business days.</p>
            <p style={{ marginTop: "15px" }}>
              For urgent matters, please include "URGENT" in the subject line.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="card">
        <h2>❓ Frequently Asked Questions</h2>
        <div className="faq-item">
          <h3>Is my data safe?</h3>
          <p>Yes! All your journal entries are encrypted using Fernet encryption and stored locally. We never access or share your data.</p>
        </div>
        <div className="faq-item">
          <h3>Can I export my journal entries?</h3>
          <p>Currently, entries are stored locally in your backend. We're working on an export feature for a future release.</p>
        </div>
        <div className="faq-item">
          <h3>How does the AI analysis work?</h3>
          <p>We use T5 (a transformer model) for text summarization and TextBlob for sentiment analysis. Your data is processed locally.</p>
        </div>
        <div className="faq-item">
          <h3>Is Daily Insights free?</h3>
          <p>Yes! Daily Insights is completely free and open-source. You can use it without any limitations.</p>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
