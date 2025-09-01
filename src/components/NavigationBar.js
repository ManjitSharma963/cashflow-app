import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './NavigationBar.css';

const NavigationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quickSearch, setQuickSearch] = useState('');

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      // Navigate to customers page with search term
      navigate(`/customers?search=${encodeURIComponent(quickSearch.trim())}`);
      setQuickSearch('');
    }
  };

  return (
    <nav className="navigation-bar">
      <div className="nav-container">
        <Link to="/customers" className="nav-brand">
          Credit Ledger
        </Link>
        <div className="nav-links">
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
          <Link 
            to="/customers" 
            className={`nav-link ${location.pathname === '/customers' ? 'active' : ''}`}
          >
            Customers
          </Link>
          <Link 
            to="/dashboard" 
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/settings" 
            className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}
          >
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar; 