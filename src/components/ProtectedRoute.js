import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, the App component will handle showing login
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render the protected content
  return children;
};

export default ProtectedRoute; 