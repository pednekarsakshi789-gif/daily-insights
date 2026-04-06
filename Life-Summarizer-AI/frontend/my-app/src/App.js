import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import "./styles.css";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import GraphPage from "./pages/GraphPage";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";

function AppContent() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { isAuthenticated, user, logout, isLoading } = useContext(AuthContext);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px"
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav className="navbar">
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            ✨ Daily Insights
          </Link>
          <button
            className={`hamburger ${menuOpen ? "active" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className={`navbar-menu ${menuOpen ? "active" : ""}`}>
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="nav-link"
                  onClick={closeMenu}
                >
                  📝 Journal
                </Link>
                <Link
                  to="/graph"
                  className="nav-link"
                  onClick={closeMenu}
                >
                  📈 Graph
                </Link>
                {user && user.is_admin && (
                  <Link
                    to="/admin"
                    className="nav-link"
                    onClick={closeMenu}
                  >
                    👨‍💼 Admin
                  </Link>
                )}
                <Link
                  to="/about"
                  className="nav-link"
                  onClick={closeMenu}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="nav-link"
                  onClick={closeMenu}
                >
                  Contact Us
                </Link>
                <div className="nav-user">
                  <span className="user-name">👤 {user?.username}</span>
                  <button
                    className="btn btn-logout"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/about"
                  className="nav-link"
                  onClick={closeMenu}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="nav-link"
                  onClick={closeMenu}
                >
                  Contact Us
                </Link>
                <Link
                  to="/login"
                  className="nav-link btn btn-primary"
                  onClick={closeMenu}
                >
                  🔐 Login
                </Link>
                <Link
                  to="/register"
                  className="nav-link btn btn-secondary"
                  onClick={closeMenu}
                >
                  📝 Register
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={isAuthenticated && user?.is_admin ? <AdminDashboard /> : <Navigate to="/" />}
          />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/graph" element={isAuthenticated ? <GraphPage /> : <Navigate to="/login" />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/" /> : <Register />}
          />
        </Routes>

        {/* Footer */}
        <footer className="footer">
          <p>© Daily Insights. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
