import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Login.css'; // Reuse the same styles

const Register = ({ onSwitchToLogin }) => {
  const { register, loading, registrationSuccess } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    mobile: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Shop name validation
    if (!formData.shopName.trim()) {
      newErrors.shopName = 'Shop name is required';
    }

    // Mobile validation
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
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
      const { confirmPassword, ...registrationData } = formData;
      await register(registrationData);
      // Success message will be shown by registrationSuccess state
    } catch (error) {
      setErrors({
        general: error.message || 'Registration failed. Please try again.'
      });
    }
  };

  // Show success message after registration
  if (registrationSuccess) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Registration Successful! 🎉</h1>
            <p>Your shop account has been created successfully</p>
          </div>

          <div className="success-message">
            <div className="success-content">
              <div className="success-icon">✅</div>
              <h3>Welcome to CashFlow!</h3>
              <p>Your account for <strong>{formData.shopName}</strong> has been created.</p>
              <p>You can now sign in to start managing your customers and transactions.</p>
            </div>
          </div>

          <div className="auth-footer">
            <button
              type="button"
              className="auth-button primary"
              onClick={onSwitchToLogin}
            >
              Continue to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join CashFlow to manage your shop's transactions</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
                placeholder="Your full name"
                disabled={loading}
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="your@email.com"
                disabled={loading}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'error' : ''}
                  placeholder="Create password"
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

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  placeholder="Confirm password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="shopName">Shop Name *</label>
            <input
              type="text"
              id="shopName"
              name="shopName"
              value={formData.shopName}
              onChange={handleInputChange}
              className={errors.shopName ? 'error' : ''}
              placeholder="Your shop name"
              disabled={loading}
            />
            {errors.shopName && (
              <span className="error-message">{errors.shopName}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mobile">Mobile Number *</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className={errors.mobile ? 'error' : ''}
                placeholder="10-digit mobile number"
                disabled={loading}
              />
              {errors.mobile && (
                <span className="error-message">{errors.mobile}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="address">Shop Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={errors.address ? 'error' : ''}
                placeholder="Shop address"
                disabled={loading}
              />
              {errors.address && (
                <span className="error-message">{errors.address}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="auth-button primary"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              className="link-button"
              onClick={onSwitchToLogin}
              disabled={loading}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 