import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";

function AdminDashboard() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserEntries, setSelectedUserEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("users"); // users, entries, stats

  const API_BASE =
    process.env.REACT_APP_API_URL ||
    "https://daily-insights-4.onrender.com";

  // Redirect if not admin
  useEffect(() => {
    if (!user || !user.is_admin) {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch all users
  useEffect(() => {
    if (user && user.is_admin) {
      fetchAllUsers();
      fetchStats();
    }
  }, [user]);

  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUsers(data);
        setError("");
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setStats(data);
      } else {
        console.error("Failed to fetch stats:", data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserEntries = async (userId) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/admin/users/${userId}/entries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setSelectedUser(data.user);
        setSelectedUserEntries(data.entries);
        setViewMode("entries");
        setError("");
      } else {
        setError(data.error || "Failed to fetch user entries");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId, username) => {
    if (
      !window.confirm(
        `Are you sure you want to delete user "${username}" and all their entries? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        fetchAllUsers();
        setSelectedUser(null);
        setSelectedUserEntries([]);
      } else {
        setError(data.error || "Failed to delete user");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
      console.error(err);
    }
  };

  if (!user || !user.is_admin) {
    return null;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>👨‍💼 Admin Dashboard</h1>
        <p>Manage users and view all journal entries</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${viewMode === "stats" ? "active" : ""}`}
          onClick={() => setViewMode("stats")}
        >
          📊 Statistics
        </button>
        <button
          className={`admin-tab ${viewMode === "users" ? "active" : ""}`}
          onClick={() => setViewMode("users")}
        >
          👥 All Users
        </button>
        <button
          className={`admin-tab ${viewMode === "entries" ? "active" : ""}`}
          onClick={() => setViewMode("entries")}
        >
          📝 View Entries
        </button>
      </div>

      {/* Statistics View */}
      {viewMode === "stats" && stats && (
        <div className="admin-section">
          <h2>Platform Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-label">Total Users</div>
                <div className="stat-value">{stats.total_users}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-content">
                <div className="stat-label">Total Entries</div>
                <div className="stat-value">{stats.total_entries}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔑</div>
              <div className="stat-content">
                <div className="stat-label">Admin Accounts</div>
                <div className="stat-value">{stats.total_admins}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users View */}
      {viewMode === "users" && (
        <div className="admin-section">
          <h2>Registered Users</h2>
          {isLoading ? (
            <p>Loading users...</p>
          ) : users.length === 0 ? (
            <p>No users found</p>
          ) : (
            <div className="users-table">
              <div className="table-header">
                <div className="column-username">Username</div>
                <div className="column-email">Email</div>
                <div className="column-entries">Entries</div>
                <div className="column-role">Role</div>
                <div className="column-joined">Joined</div>
                <div className="column-actions">Actions</div>
              </div>

              {users.map((u) => (
                <div key={u.id} className="table-row">
                  <div className="column-username">{u.username}</div>
                  <div className="column-email">{u.email}</div>
                  <div className="column-entries">{u.entry_count}</div>
                  <div className="column-role">
                    {u.is_admin ? (
                      <span className="badge badge-admin">Admin</span>
                    ) : (
                      <span className="badge badge-user">User</span>
                    )}
                  </div>
                  <div className="column-joined">{u.created_at}</div>
                  <div className="column-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => fetchUserEntries(u.id)}
                    >
                      👁️ View
                    </button>
                    {u.id !== user.id && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteUser(u.id, u.username)}
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* User Entries View */}
      {viewMode === "entries" && selectedUser && (
        <div className="admin-section">
          <div className="user-header">
            <h2>Entries for {selectedUser.username}</h2>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setViewMode("users");
                setSelectedUser(null);
                setSelectedUserEntries([]);
              }}
            >
              ← Back to Users
            </button>
          </div>

          {selectedUserEntries.length === 0 ? (
            <p className="no-entries">
              This user has no journal entries yet.
            </p>
          ) : (
            <div className="entries-list">
              {selectedUserEntries.map((entry) => (
                <div key={entry.id} className="entry-card">
                  <div className="entry-header">
                    <div className="entry-date">{entry.date}</div>
                    <div
                      className={`sentiment-badge sentiment-${entry.sentiment.toLowerCase()}`}
                    >
                      {entry.sentiment}
                    </div>
                  </div>

                  <div className="entry-content">
                    <h3>Entry</h3>
                    <p className="entry-text">{entry.entry}</p>
                  </div>

                  {entry.summary && (
                    <div className="entry-summary">
                      <h3>AI Summary</h3>
                      <p>{entry.summary}</p>
                    </div>
                  )}

                  <div className="entry-metrics">
                    <div className="metric">
                      <span>Polarity Score:</span>
                      <strong>{entry.polarity.toFixed(3)}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
