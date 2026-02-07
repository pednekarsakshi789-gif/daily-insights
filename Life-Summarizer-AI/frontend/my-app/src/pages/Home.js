import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Home() {
  /* ---------- STATE ---------- */
  const [entry, setEntry] = useState("");
  const [promptResponse, setPromptResponse] = useState("");
  const [response, setResponse] = useState(null);
  const [history, setHistory] = useState([]);
  const [weeklyTrends, setWeeklyTrends] = useState([]);
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
    if (!entry.trim()) {
      alert("Please write something first.");
      return;
    }

    const res = await fetch(`${API_BASE}/journal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entry })
    });

    const data = await res.json();
    setResponse(data);
    setEntry("");
    fetchHistory();
    fetchWeeklyTrends();
  };

  const fetchHistory = async () => {
    const res = await fetch(`${API_BASE}/history`);
    const data = await res.json();
    setHistory(data.reverse());
  };

  const fetchWeeklyTrends = async () => {
    const res = await fetch(`${API_BASE}/weekly-trends`);
    const data = await res.json();
    setWeeklyTrends(data);
  };

  /* ---------- GET RANDOM PROMPT ---------- */
  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setCurrentPrompt(randomIndex);
  };

  /* ---------- WEEKLY INSIGHT ---------- */
  const getWeeklyMoodInsight = () => {
    if (weeklyTrends.length === 0) return "No data for this week.";

    const avg =
      weeklyTrends.reduce((sum, d) => sum + d.avg_mood, 0) /
      weeklyTrends.length;

    if (avg > 0.3) return "Your week was mostly positive 🙂";
    if (avg < -0.3) return "Your week was mostly challenging 😔";
    return "Your week was emotionally balanced ⚖️";
  };

  /* ---------- LOAD DATA ---------- */
  useEffect(() => {
    fetchHistory();
    fetchWeeklyTrends();
    getRandomPrompt();
  }, []);

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
      const res = await fetch(`${API_BASE}/history`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        alert("All Past Entries has been deleted successfully.");
        setHistory([]);
        setWeeklyTrends([]);
        setResponse(null);
      } else {
        alert("Error deleting history: " + data.error);
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
                ➕ Log Response
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
            <strong>Polarity Score:</strong> {response.polarity.toFixed(3)}
          </p>
          <p>
            <strong>Compression Ratio:</strong> {(response.compression_ratio * 100).toFixed(1)}%
          </p>
        </div>
      )}

      {/* Weekly Mood Insight */}
      <div className="card">
        <h2>📊 Weekly Mood Insight</h2>
        <p style={{ fontSize: "18px", marginBottom: "25px" }}>
          {getWeeklyMoodInsight()}
        </p>

        {weeklyTrends.length > 0 && (
          <div className="chart-container">
            <LineChart
              width={800}
              height={350}
              data={weeklyTrends}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffd700" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
              <YAxis domain={[-1, 1]} stroke="rgba(255,255,255,0.5)" />
              <CartesianGrid stroke="rgba(255,255,255,0.1)" />
              <Tooltip
                contentStyle={{
                  background: "rgba(0,0,0,0.8)",
                  border: "1px solid #ffd700",
                  borderRadius: "8px",
                  color: "white"
                }}
              />
              <Line
                type="monotone"
                dataKey="avg_mood"
                stroke="#ffd700"
                strokeWidth={3}
                dot={{ fill: "#667eea", r: 6 }}
                activeDot={{ r: 8 }}
                animationDuration={1000}
              />
            </LineChart>
          </div>
        )}
      </div>

      {/* Past History Section */}
      <div className="history-section">
        <div className="history-header">
          <h2>📚 Past Entries</h2>
          {history.length > 0 && (
            <button className="btn btn-danger" onClick={deleteHistory}>
              🗑️ Delete All History
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
