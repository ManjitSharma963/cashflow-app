import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      if (authAPI.isAuthenticated()) {
        const currentUser = authAPI.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
        
        // Optionally verify token with server
        try {
          const profile = await authAPI.getProfile();
          setUser(profile);
        } catch (error) {
          // Token might be expired, clear auth
          console.warn('Token verification failed:', error);
          await logout();
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      setUser(response.user);
      setIsAuthenticated(true);
      setRegistrationSuccess(false); // Clear registration success state
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      // Don't automatically log in user after registration
      // Just set registration success state
      setRegistrationSuccess(true);
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear the token that might have been stored by the API call
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setRegistrationSuccess(false);
      setLoading(false);
    }
  };

  const updateProfile = async (userData) => {
    try {
      const updatedUser = await authAPI.updateProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const clearRegistrationSuccess = () => {
    setRegistrationSuccess(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    registrationSuccess,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus,
    clearRegistrationSuccess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 