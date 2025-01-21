import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => (
  <nav>
    <div className="nav-links">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/booking">Book Room</Link>
      <Link to="/payment">Payments</Link>
      <Link to="/notifications">Notifications</Link>
    </div>
    <div className="nav-login">
      <Link to="/login" className="login-btn">Login</Link>
    </div>
  </nav>
);

export default Navbar;
