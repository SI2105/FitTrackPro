'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
  validateToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const validateToken = useCallback(async (): Promise<boolean> => {
    const savedToken = Cookies.get('token');
    if (!savedToken) {
      return false;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${savedToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return true;
      } else if (response.status === 401) {
        // Token is invalid or expired
        clearAuth();
        return false;
      }
      return false;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }, []);

  const clearAuth = useCallback(() => {
    setToken(null);
    setUser(null);
    Cookies.remove('token');
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = Cookies.get('token');
      if (savedToken) {
        setToken(savedToken);
        // Validate the token
        const isValid = await validateToken();
        if (!isValid) {
          clearAuth();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [validateToken, clearAuth]);

  const login = (token: string) => {
    setToken(token);
    Cookies.set('token', token, { expires: 7 }); // 7 days
    // In a real app, you'd decode the JWT to get user info or make an API call
  };

  const logout = () => {
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, validateToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}