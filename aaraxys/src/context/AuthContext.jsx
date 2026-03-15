import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for user object on load
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
        // Technically we should hit /api/auth/me to verify token validity, but we'll trust localStorage for fast load
        setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      const message = error.code === 'ERR_NETWORK' || !error.response 
        ? 'Network Error: Cannot connect to server. Please make sure the backend is running.'
        : error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  const googleLogin = async (token) => {
    try {
      const { data } = await api.post('/auth/google', { token });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      const message = error.code === 'ERR_NETWORK' || !error.response 
        ? 'Network Error: Cannot connect to server.'
        : error.response?.data?.message || 'Google Login failed';
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      const message = error.code === 'ERR_NETWORK' || !error.response 
        ? 'Network Error: Cannot connect to server. Please make sure the backend is running.'
        : error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  const updateProfile = async (profileData) => {
    try {
      // Must include token in headers, interceptors usually handle this, but let's be explicit if needed or rely on api setup
      const { data } = await api.put('/auth/profile', profileData);
      
      const currentToken = user?.token || JSON.parse(localStorage.getItem('userInfo'))?.token;
      const updatedUser = { ...data, token: currentToken };
      
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      return { success: true, data: updatedUser };
    } catch (error) {
      console.error('Failed to update profile:', error);
      const message = error.response?.data?.message || 'Failed to update profile';
      return { success: false, message };
    }
  };

  const refreshProfile = async () => {
      try {
          const { data } = await api.get('/auth/me');
          // Update the user object preserving token
          const currentToken = user?.token || JSON.parse(localStorage.getItem('userInfo'))?.token;
          const updatedUser = { ...data, token: currentToken };
          setUser(updatedUser);
          localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      } catch (error) {
          console.error('Failed to refresh profile:', error);
      }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, googleLogin, register, logout, refreshProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
