import React, { useState, useEffect, useCallback, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_URL || "https://daily-insights-4.onrender.com";

function Home() {
  /* ---------- STATE ---------- */
  const { token, logout } = useContext(AuthContext);
  const [entry, setEntry] = useState("");
  const [promptResponse, setPromptResponse] = useState("");
  const [response, setResponse] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState(0);

  /* ---------- PROMPTS DATA ---------- */
  const prompts = [
    "What is one thing you accomplished today that you are proud of?",
    "Describe a challenge you faced today and how you handled it.",
    "Who was someone that made you smile today, and why?",
    "What is a goal you want to focus on tomorrow?",
    "Reflect on a moment today when you felt particularly stressed or calm.",
    "What is something new you learned or realized about yourself today?",
    "If you could change one thing about how today went, what would it be?",
    "How will you break down your tasks to manage your time effectively?",
    "What is one thing you can do today to make tomorrow easier?"
  ];

  /* ---------- API CALLS ---------- */
  const submitEntry = async () => {
    if (!token) {
      alert("You must be logged in to capture insights. Please log in.");
      return;
    }

    if (!entry.trim()) {
      alert("Please write something first.");
      return;
    }

    try {
      if (!token || token.split('.').length !== 3) {
        alert('Authentication token invalid or expired. Please log in again.');
        logout();
        return;
      }

      const res = await fetch(`${API_BASE}/journal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ entry })
      });

      if (!res.ok) {
        let msg = "Unknown error";
        let lowerError = null;
        try {
          const errorData = await res.json();
          msg =
            errorData.error ||
            errorData.message ||
            (typeof errorData === "object" ? JSON.stringify(errorData) : errorData);
          lowerError = (errorData.error || "").toLowerCase();
        } catch (parseErr) {
          console.warn("Could not parse error response", parseErr);
        }

        if (lowerError && (lowerError.includes("invalid token") || lowerError.includes("token expired") || lowerError.includes("authorization header missing"))) {
          alert("Authentication issue: " + msg + "\nPlease login again.");
          logout();
        } else {
          alert("Error saving entry: " + msg);
        }
        return;
      }

      const data = await res.json();
      setResponse(data);
      setEntry("");
      fetchHistory();
    } catch (error) {
      console.error("Error submitting entry:", error);
      alert("Connection error. Please try again.");
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/history`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        console.error("Error fetching history:", res.status);
        setHistory([]);
        return;
      }
      
      const data = await res.json();
      
      // Ensure data is an array before calling reverse
      if (Array.isArray(data)) {
        setHistory(data.reverse());
      } else {
        console.warn("History data is not an array:", data);
        setHistory([]);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      setHistory([]);
    }
  };




  /* ---------- GET RANDOM PROMPT ---------- */
  const getRandomPrompt = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setCurrentPrompt(randomIndex);
  }, [prompts.length]);


  /* ---------- LOAD DATA ---------- */
 

  /* ---------- ADD PROMPT RESPONSE TO ENTRY ---------- */
  const addPromptResponseToEntry = () => {
    if (promptResponse.trim()) {
      setEntry(prev => prev ? prev + "\n\n" + promptResponse : promptResponse);
      setPromptResponse("");
    }
  };

  /* ---------- DELETE HISTORY ---------- */
  const deleteHistory = async () => {
    if (window.confirm("Are you absolutely sure you want to delete ALL journal entries? This action cannot be undone.")) {
      try {
        const res = await fetch(`${API_BASE}/history`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          alert("All Past Entries has been deleted successfully.");
          setHistory([]);
          setResponse(null);
        } else {
          alert("Error deleting history: " + (data.error || "Unknown error"));
        }
      } catch (error) {
        console.error("Error deleting history:", error);
        alert("Connection error while deleting history. Please try again.");
      }
    }
  };


  /* ---------- UI ---------- */
  return (
    <div className="main-container">
      {/* Header Section */}
      <div className="header-section">
        <h1>Daily Insights</h1>
        <p>Reflect, Analyze, and Grow with your Daily Journal Insights</p>
      </div>

      {/* Daily Prompt Section */}
      <div className="prompt-section">
        <div className="prompt-card">
          <div className="prompt-header">
            <span className="prompt-icon">💡</span>
            <span className="prompt-label">Today's Prompt</span>
          </div>
          <p className="prompt-text">{prompts[currentPrompt]}</p>
          
          {/* Prompt Response Section */}
          <div className="prompt-response-section">
            <label className="prompt-response-label">Your Response:</label>
            <textarea
              className="prompt-response-textarea"
              placeholder="Respond to the prompt here..."
              value={promptResponse}
              onChange={(e) => setPromptResponse(e.target.value)}
              rows="4"
            />
            <div className="prompt-button-group">
              <button className="btn btn-secondary" onClick={addPromptResponseToEntry}>
                ➕ Add Response
              </button>
              <button className="btn btn-secondary" onClick={getRandomPrompt}>
                ✨ Next Prompt
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Journal Input Section */}
      <div className="input-section">
        <h2>📝 Write Your Thoughts</h2>
        <div className="textarea-wrapper">
          <textarea
            placeholder="Share what's on your mind today..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={submitEntry}>
          ⚡ Capture Insights
        </button>
      </div>

      {/* AI Analysis Result */}
      {response && (
        <div className="card">
          <h2>🤖 AI Analysis</h2>
          <p>
            <strong>Summary:</strong> {response.summary}
          </p>
          <div>
            <strong>Sentiment:</strong>{" "}
            <span
              className={`sentiment-badge sentiment-${response.sentiment.toLowerCase()}`}
            >
              {response.sentiment}
            </span>
          </div>
          <p>
            <strong>Polarity Score:</strong>{" "}
            {typeof response.polarity === "number" ? response.polarity.toFixed(3) : "N/A"}
          </p>
          <p>
            <strong>Compression Ratio:</strong>{" "}
            {typeof response.compression_ratio === "number"
              ? (response.compression_ratio * 100).toFixed(1) + "%"
              : "N/A"}
          </p>
        </div>
      )}


      {/* Past History Section */}
      <div className="history-section">
        <div className="history-header">
          <h2>📚 Past Entries</h2>
          {history.length > 0 && (
            <button className="btn btn-danger" onClick={deleteHistory}>
              🗑️ Delete Past Entries
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="card" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "18px", opacity: 0.8 }}>
              No entries yet. Start writing to see your history here!
            </p>
          </div>
        ) : (
          <div className="history-list">
            {history.map((item, index) => (
              <div key={index} className="history-card">
                <div className="date">📅 {item.date}</div>
                <div className="summary">{item.summary}</div>
                <div className="sentiment">
                  <strong>Mood:</strong>
                  <span
                    className={`sentiment-badge sentiment-${item.sentiment.toLowerCase()}`}
                  >
                    {item.sentiment}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
