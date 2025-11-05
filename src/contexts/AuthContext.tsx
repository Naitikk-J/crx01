'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

interface User {
  email: string;
  walletAddress: string;
  role: 'buyer' | 'seller' | 'verifier' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('crx-token');
    if (storedToken) {
      try {
        const decoded: User & { exp: number } = jwtDecode(storedToken);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ email: decoded.email, walletAddress: decoded.walletAddress, role: decoded.role });
          setToken(storedToken);
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        } else {
          logout();
        }
      } catch (e) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken: string) => {
    const decoded: User = jwtDecode(newToken);
    localStorage.setItem('crx-token', newToken);
    setUser({ email: decoded.email, walletAddress: decoded.walletAddress, role: decoded.role });
    setToken(newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('crx-token');
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
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
