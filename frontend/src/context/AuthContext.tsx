import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthState, LoginCredentials } from '../types/auth.ts';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      const response = await authService.getMe();
      if (response.success) {
        setState({
          user: response.data,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Session expired',
      });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        setState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      setState(prev => ({ ...prev, isLoading: false, error: message }));
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
