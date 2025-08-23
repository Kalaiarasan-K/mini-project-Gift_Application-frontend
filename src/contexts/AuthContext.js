import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { id, token, email: userEmail, role } = response.data;
      
      // ✅ Include the user ID in the user data
      const userData = { 
        id: id,           // Add this line
        email: userEmail, 
        role: role 
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      await api.post('/auth/register', { name, email, password, role });
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const isAdmin = () => hasRole('ADMIN');
  const isReviewer = () => hasRole('REVIEWER');
  const isApplicant = () => hasRole('APPLICANT');

  // ✅ Add helper function to get user ID safely
  const getUserId = () => {
    if (user?.id) return user.id;
    
    // Fallback to localStorage if context user doesn't have ID
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        return parsedUser?.id;
      }
    } catch (error) {
      console.error('Error parsing stored user:', error);
    }
    
    return null;
  };

  const value = {
    user,
    login,
    register,
    logout,
    hasRole,
    isAdmin,
    isReviewer,
    isApplicant,
    getUserId,  // ✅ Add this helper function
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};