import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = ({ onSwitchToRegister }) => {
  const { login, loading, registrationSuccess, clearRegistrationSuccess } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Clear registration success when component mounts
  useEffect(() => {
    if (registrationSuccess) {
      // Clear the registration success after a short delay to show the message
      const timer = setTimeout(() => {
        clearRegistrationSuccess();
      }, 5000); // Clear after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [registrationSuccess, clearRegistrationSuccess]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      // User will be redirected to dashboard automatically by App.js
    } catch (error) {
      setErrors({
        general: error.message || 'Login failed. Please check your credentials.'
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your CashFlow account</p>
        </div>

        {registrationSuccess && (
          <div className="success-message registration-success">
            <div className="success-content">
              <div className="success-icon">🎉</div>
              <h3>Registration Successful!</h3>
              <p>Your account has been created. Please sign in to continue.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
              disabled={loading}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="auth-button primary"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              className="link-button"
              onClick={onSwitchToRegister}
              disabled={loading}
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 