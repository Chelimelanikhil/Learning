import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Header({ title }) {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

  return (
      <header className={`header ${theme}`}>
          <div className="header-content">
              <h1 className="header-title">{title}</h1>
              <div className="header-links">
                  <Link to="/">Home</Link>
                  <Link to="/about">About</Link>
                  <button onClick={toggleTheme} className="theme-toggle">
                      {theme === "light" ? "Dark" : "Light"} Mode
                  </button>
                  <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded " style={{ cursor: 'pointer' } }>
                      Logout
                  </button>
              </div>
          </div>
      </header>
  );
}

export default Header;