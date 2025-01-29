import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { register } from '../../services/api';
import './Signin.css';

const Signin = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    parentPhoneNumber: '',
    parentEmail: '',
    roomNumber: '',
    joiningDate: '',
    role: 'student' // Default role is student
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validations
      if (!formData.name || !formData.email || !formData.password || 
          !formData.phoneNumber || !formData.parentPhoneNumber || 
          !formData.parentEmail || !formData.roomNumber || !formData.joiningDate) {
        throw new Error('All fields are required');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      if (!/^\d{10}$/.test(formData.phoneNumber)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      if (!/^\d{10}$/.test(formData.parentPhoneNumber)) {
        throw new Error('Please enter a valid 10-digit parent phone number');
      }

      // Create registration data
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        phoneNumber: formData.phoneNumber.trim(),
        parentPhoneNumber: formData.parentPhoneNumber.trim(),
        parentEmail: formData.parentEmail.toLowerCase().trim(),
        roomNumber: formData.roomNumber.trim(),
        joiningDate: formData.joiningDate,
        role: 'student'
      };

      console.log('Attempting registration with:', {
        ...registrationData,
        password: '****'
      });

      const response = await register(registrationData);

      if (response.data.token) {
        setSuccess('Registration successful! Redirecting to dashboard...');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.user.role);
        
        setTimeout(() => {
          history.push('/dashboard');
        }, 2000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2 className="signin-title">Student Registration</h2>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        {success && (
          <div className="success-message">
            {success}
          </div>
        )}
        <form className="signin-form" onSubmit={handleSubmit} autoComplete="on">
          <div className="form-group">
            <input
              type="text"
              name="name"
              autoComplete="name"
              className="form-control"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              autoComplete="email"
              className="form-control"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="new-password"
              autoComplete="new-password"
              className="form-control"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
            >
              <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
            </button>
          </div>
          <div className="form-group password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirm-password"
              autoComplete="new-password"
              className="form-control"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <i className="fas fa-eye-slash"></i>
              ) : (
                <i className="fas fa-eye"></i>
              )}
            </button>
          </div>
          <div className="form-group">
            <input
              type="tel"
              name="tel"
              autoComplete="tel"
              className="form-control"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="tel"
              className="form-control"
              placeholder="Parent's Phone Number"
              value={formData.parentPhoneNumber}
              onChange={(e) => setFormData({...formData, parentPhoneNumber: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              placeholder="Parent's Email"
              value={formData.parentEmail}
              onChange={(e) => setFormData({...formData, parentEmail: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Room Number"
              value={formData.roomNumber}
              onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="date"
              className="form-control"
              placeholder="Joining Date"
              value={formData.joiningDate}
              onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
              required
            />
          </div>
          <button 
            type="submit" 
            className="signin-button"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          <p className="signup-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signin;
