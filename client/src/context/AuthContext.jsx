import React, { createContext, useContext, useEffect, useState } from 'react';
import { checkAuth, login as loginRequest, logout as logoutRequest } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    checkAuth()
      .then((res) => {
        if (isMounted) setAdmin(res.data);
      })
      .catch(() => {
        if (isMounted) setAdmin(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials) => {
    const res = await loginRequest(credentials);
    setAdmin(res.data);
    return res.data;
  };

  const logout = async () => {
    await logoutRequest().catch(() => {});
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
