import React, { useState, useEffect, useContext } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from "recharts";
import { AuthContext } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_URL || "https://daily-insights-4.onrender.com";

function GraphPage() {
  const { token } = useContext(AuthContext);
  const [weeklyData, setWeeklyData] = useState([]);
  const [weeksByNumber, setWeeksByNumber] = useState([]);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [error, setError] = useState(null);

  const organizeDataByWeeks = (data) => {
    if (!Array.isArray(data) || data.length === 0) return [];

    const weeks = [];
    let currentWeek = [];
    let currentWeekStart = null;

    data.forEach((entry) => {
      const entryDate = new Date(entry.date);
      const dayOfWeek = entryDate.getDay();

      if (currentWeekStart === null) {
        currentWeekStart = new Date(entryDate);
        currentWeekStart.setDate(entryDate.getDate() - dayOfWeek);
        currentWeekStart.setHours(0, 0, 0, 0);
      }

      const weekStart = new Date(entryDate);
      weekStart.setDate(entryDate.getDate() - dayOfWeek);
      weekStart.setHours(0, 0, 0, 0);

      if (weekStart.getTime() === currentWeekStart.getTime()) {
        currentWeek.push(entry);
      } else {
        if (currentWeek.length > 0) {
          weeks.push(currentWeek);
        }
        currentWeek = [entry];
        currentWeekStart = weekStart;
      }
    });

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  };

  useEffect(() => {
    const fetchWeeklyTrends = async () => {
      if (!token) {
        setError("Login required to view graph.");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/weekly-trends`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to fetch weekly trends");
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          const sorted = data
            .map((d) => ({
              ...d,
              date: d.date ? new Date(d.date).toISOString() : null,
              score: Number(d.score || d.score === 0 ? d.score : 0)
            }))
            .filter((d) => d.date)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

          const organizedWeeks = organizeDataByWeeks(sorted);

          setWeeklyData(sorted);
          setWeeksByNumber(organizedWeeks);
          setSelectedWeekIndex(organizedWeeks.length > 0 ? organizedWeeks.length - 1 : 0);
          setError(null);
        } else {
          setWeeklyData([]);
          setWeeksByNumber([]);
          setSelectedWeekIndex(0);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchWeeklyTrends();
  }, [token]);

  const getCurrentWeekData = () => {
    if (!Array.isArray(weeksByNumber) || weeksByNumber.length === 0) {
      return weeklyData;
    }
    return weeksByNumber[selectedWeekIndex] || [];
  };

  const getWeekRange = () => {
    const currentWeekData = getCurrentWeekData();
    if (currentWeekData.length === 0) return "";

    const firstDate = new Date(currentWeekData[0].date);
    const lastDate = new Date(currentWeekData[currentWeekData.length - 1].date);

    return `${firstDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${lastDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  };

  const totalWeeks = weeksByNumber.length || (weeklyData.length ? 1 : 0);
  const activeWeekNumber = weeksByNumber.length ? selectedWeekIndex + 1 : 1;

  const getWeeklySentimentSummary = () => {
    const weekData = getCurrentWeekData();
    if (!weekData.length) return "No data to analyze this week.";

    const avgScore = weekData.reduce((sum, d) => sum + Number(d.score || 0), 0) / weekData.length;

    if (avgScore > 0.25) return "This week was emotionally positive and uplifting.";
    if (avgScore < -0.25) return "This week was a bit negative; consider self-care and support.";
    return "This week was emotionally balanced.";
  };

  const displayedData = getCurrentWeekData().map((d) => ({
    ...d,
    date: d.date ? new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
    score: Number(d.score || d.score === 0 ? d.score : 0)
  }));

  const goToPreviousWeek = () => {
    if (selectedWeekIndex > 0) {
      setSelectedWeekIndex((prev) => prev - 1);
    }
  };

  const goToNextWeek = () => {
    if (selectedWeekIndex < weeksByNumber.length - 1) {
      setSelectedWeekIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="main-container" style={{ padding: "30px" }}>
      <div className="header-section">
        <h1>📊 Weekly Graph View</h1>
        <p>Independent chart panel for trend analysis.</p>
      </div>

      {error && <div style={{ color: "#ff7777", marginBottom: "15px" }}>{error}</div>}

      {weeklyData.length === 0 && !error && <p>No trend data available yet. Please add journal entries first.</p>}

      {weeklyData.length > 0 && (
        <div style={{ width: "100%", maxWidth: "1150px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "15px" }}>
            <button
              onClick={goToPreviousWeek}
              disabled={selectedWeekIndex <= 0}
              style={{
                background: "transparent",
                border: "1px solid #f3d674",
                color: selectedWeekIndex <= 0 ? "rgba(243,214,116,0.5)" : "#f3d674",
                cursor: selectedWeekIndex <= 0 ? "not-allowed" : "pointer",
                padding: "10px 16px",
                borderRadius: "8px",
                minWidth: "140px"
              }}
            >
              Previous Week
            </button>

            <div style={{ color: "#FCE7A5", fontWeight: 600, textAlign: "center" }}>
              <div>{`Week ${activeWeekNumber} of ${totalWeeks}`}</div>
              <div style={{ fontSize: "0.88rem", color: "#D1D5DB" }}>{getWeekRange()}</div>
              <div style={{ marginTop: "8px", fontSize: "0.9rem", color: "#E5E7EB" }}>{getWeeklySentimentSummary()}</div>
            </div>

            <button
              onClick={goToNextWeek}
              disabled={selectedWeekIndex >= weeksByNumber.length - 1}
              style={{
                background: "transparent",
                border: "1px solid #f3d674",
                color: selectedWeekIndex >= weeksByNumber.length - 1 ? "rgba(243,214,116,0.5)" : "#f3d674",
                cursor: selectedWeekIndex >= weeksByNumber.length - 1 ? "not-allowed" : "pointer",
                padding: "10px 16px",
                borderRadius: "8px",
                minWidth: "140px"
              }}
            >
              Next Week
            </button>
          </div>

          <div
            style={{
              width: "100%",
              borderRadius: "12px",
              background: "rgba(18, 17, 33, 0.35)",
              padding: "18px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)"
            }}
          >
            <ResponsiveContainer width="100%" height={480}>
              <AreaChart data={displayedData} margin={{ top: 20, right: 30, left: 0, bottom: 70 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00B4D8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#90E0EF" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#D1D5DB" tick={{ fontSize: 12 }} angle={-30} textAnchor="end" height={60} />
                <YAxis domain={["dataMin - 0.2", "dataMax + 0.2"]} stroke="#D1D5DB" tick={{ fontSize: 12 }} />
                <CartesianGrid stroke="rgba(255,255,255,0.15)" />
                <ReferenceLine y={0} stroke="#ffffff" strokeDasharray="3 3" />
                <Tooltip
                  contentStyle={{ background: "rgba(20, 20, 40, 0.95)", border: "1px solid #00B4D8" }}
                  labelStyle={{ color: "white" }}
                  formatter={(value) => [Number(value).toFixed(2), "Avg Mood"]}
                />
                <Legend verticalAlign="top" align="center" />
                <Area type="monotone" dataKey="score" name="Average Score" stroke="#00B4D8" fill="url(#scoreGradient)" fillOpacity={0.6} activeDot={{ r: 8 }} dot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default GraphPage;
