import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Sreemaan Hostel</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/payment" 
              className={`nav-link ${isActive('/payment') ? 'active' : ''}`}
            >
              Payments
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/notifications" 
              className={`nav-link ${isActive('/notifications') ? 'active' : ''}`}
            >
              Notifications
              <span className="notification-badge">2</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/profile" 
              className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
            >
              Profile
            </Link>
          </li>
          {userRole === 'admin' && (
            <li className="nav-item">
              <Link 
                to="/admindashboard"
                className={`nav-link ${isActive('/admindashboard') ? 'active' : ''}`}
              >
                Admin Dashboard
              </Link>
            </li>
          )}
          {!localStorage.getItem('token') ? (
            <>
              <li className="nav-item">
                <Link 
                  to="/login"
                  className={`nav-link ${isActive('/login') || isActive('/signin') ? 'active' : ''}`}
                >
                  Login / Sign Up
                </Link>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link 
                to="/login" 
                className="nav-link logout"
                onClick={() => {
                  localStorage.removeItem('token');
                }}
              >
                Logout
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
