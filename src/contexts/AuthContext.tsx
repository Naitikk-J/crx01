'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('crx-token');
    if (storedToken) {
      try {
        const decoded: User & { exp: number } = parseJwt(storedToken);
        if (decoded && decoded.exp * 1000 > Date.now()) {
          setUser({ email: decoded.email, walletAddress: decoded.walletAddress, role: decoded.role });
          setToken(storedToken);
        } else {
          logout();
        }
      } catch (e) {
        logout();
      }
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (newToken: string) => {
    const decoded: User = parseJwt(newToken);
    if(decoded){
        localStorage.setItem('crx-token', newToken);
        setUser({ email: decoded.email, walletAddress: decoded.walletAddress, role: decoded.role });
        setToken(newToken);
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('crx-token');
    setUser(null);
    setToken(null);
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
