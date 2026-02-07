import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./styles.css";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

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
            <Link
              to="/"
              className="nav-link"
              onClick={closeMenu}
            >
              Home
            </Link>
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
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
