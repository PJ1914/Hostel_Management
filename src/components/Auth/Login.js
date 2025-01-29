import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { login } from '../../services/api';
import './Login.css';

const Login = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        throw new Error('Email and password are required');
      }

      console.log('Attempting login with:', {
        email: formData.email,
        password: '****' // Don't log actual password
      });

      const response = await login(formData.email, formData.password);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        history.push('/dashboard');
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to Sreemaan Hostel</h2>
        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value.trim()})}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value.trim()})}
              required
            />
          </div>
          <button 
            type="submit"
            className="login-button"
            disabled={loading || !formData.email || !formData.password}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="signup-prompt">
            Don't have an account? <Link to="/signin">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
