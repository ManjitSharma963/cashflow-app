import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './NavigationBar.css';

const NavigationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [quickSearch, setQuickSearch] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      // Navigate to customers page with search term
      navigate(`/customers?search=${encodeURIComponent(quickSearch.trim())}`);
      setQuickSearch('');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <nav className="navigation-bar">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-brand">
          <div className="brand-content">
            <span className="brand-name">CashFlow</span>
            {user?.shopName && (
              <span className="shop-name">{user.shopName}</span>
            )}
          </div>
        </Link>
        
        <div className="nav-center">
          <form onSubmit={handleQuickSearch} className="quick-search-form">
            <input
              type="text"
              placeholder="Quick search by mobile..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              className="quick-search-input"
            />
            <button type="submit" className="quick-search-btn">
              🔍
            </button>
          </form>
        </div>

        <div className="nav-links">
          <Link 
            to="/dashboard" 
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/customers" 
            className={`nav-link ${location.pathname === '/customers' ? 'active' : ''}`}
          >
            Customers
          </Link>
          <Link 
            to="/settings" 
            className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}
          >
            Settings
          </Link>

          {/* User Menu */}
          <div className="user-menu-container">
            <button 
              className="user-menu-trigger"
              onClick={toggleUserMenu}
              aria-expanded={showUserMenu}
            >
              <div className="user-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showUserMenu && (
              <div className="user-menu-dropdown">
                <div className="user-menu-header">
                  <div className="user-info">
                    <div className="user-name-large">{user?.name}</div>
                    <div className="user-email">{user?.email}</div>
                    {user?.shopName && (
                      <div className="user-shop">{user.shopName}</div>
                    )}
                  </div>
                </div>
                
                <div className="user-menu-divider"></div>
                
                <div className="user-menu-items">
                  <Link 
                    to="/profile" 
                    className="user-menu-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <span className="menu-icon">👤</span>
                    Profile Settings
                  </Link>
                  <Link 
                    to="/settings" 
                    className="user-menu-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <span className="menu-icon">⚙️</span>
                    App Settings
                  </Link>
                  <button 
                    className="user-menu-item logout-item"
                    onClick={handleLogout}
                  >
                    <span className="menu-icon">🚪</span>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar; 