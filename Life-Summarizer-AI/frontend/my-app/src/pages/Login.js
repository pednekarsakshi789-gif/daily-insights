import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Auth.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!username || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const API_BASE =
        process.env.REACT_APP_API_URL ||
        "https://daily-insights-4.onrender.com";

      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token and user to context and localStorage
        // Backend returns { token, user }, not access_token
        const authToken = data.token || data.access_token;
        if (!authToken) {
          setError("Login succeeded but no token returned from server.");
          setIsLoading(false);
          return;
        }
        login(authToken, data.user);
        navigate("/");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    setUsername("admin");
    setPassword("admin123");
    setError("");
    setIsLoading(true);

    try {
      const API_BASE =
        process.env.REACT_APP_API_URL ||
        "https://daily-insights-4.onrender.com";

      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "pednekarsakshi789@gmail.com", password: "abyd ucbj qmxk hfny" }),
      });

      const data = await res.json();

      if (res.ok) {
        const authToken = data.token || data.access_token;
        if (!authToken) {
          setError("Demo login succeeded but no token returned from server.");
          setIsLoading(false);
          return;
        }
        login(authToken, data.user);
        navigate("/");
      } else {
        setError(data.error || "Demo login failed");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🔐 Login</h1>
          <p>Welcome back to Daily Insights</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-button"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "🔓 Login"}
          </button>
        </form>

        <div className="divider">OR</div>

        <button
          onClick={handleDemoLogin}
          className="btn btn-secondary auth-button"
          disabled={isLoading}
        >
          {isLoading ? "Loading Demo..." : "👨‍💼 Try Admin Demo"}
        </button>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="link-button"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
