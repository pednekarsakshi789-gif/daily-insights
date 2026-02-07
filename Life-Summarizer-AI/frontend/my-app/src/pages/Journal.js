import React, { useState } from "react";

function Journal() {
  const [entry, setEntry] = useState("");

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "Arial" }}>
      <h2>Write About Your Day</h2>

      <textarea
        rows="8"
        style={{ width: "100%", padding: "10px", fontSize: "16px" }}
        placeholder="Write your thoughts here..."
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
      />

      <button
        style={{ marginTop: "15px", padding: "10px 20px", fontSize: "16px" }}
        disabled
      >
        Analyze My Day
      </button>

      <p style={{ marginTop: "10px", color: "gray" }}>
        (Backend integration coming next)
      </p>
    </div>
  );
}

export default Journal;
