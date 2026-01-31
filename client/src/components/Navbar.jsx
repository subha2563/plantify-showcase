import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  
  // Check if a user is logged in by looking for the token
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    // Clear all Google-related session data
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    
    alert("Logged out successfully!");
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm sticky-top">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <span className="me-2">🌱</span> Plantify
        </Link>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            {token ? (
              <>
                {/* Links visible only when logged in */}
                <li className="nav-item">
                  <Link className="nav-link" to="/favorites">My Favorites</Link>
                </li>
                <li className="nav-item ms-lg-3">
                  <span className="nav-link text-white small">
                    Hi, <strong>{username}</strong>
                  </span>
                </li>
                <li className="nav-item">
                  <button 
                    className="btn btn-sm btn-outline-light ms-lg-2 rounded-pill px-3" 
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              /* Link visible only when logged out */
              <li className="nav-item">
                <Link className="btn btn-light btn-sm rounded-pill px-4 ms-lg-3 text-success fw-bold" to="/login">
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;