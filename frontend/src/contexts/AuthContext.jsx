import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Get current user ──
  const getUser = useCallback(async () => {
    try {
      const res = await api.get('/me');
      setUser(res.data.data);
    } catch {
      setUser(null);
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem('auth_token')) {
      getUser();
    } else {
      setLoading(false);
    }
  }, [getUser]);

  // ── Login ──
  const login = async (credentials) => {
    const res = await api.post('/login', credentials);

    const { user: userData, token } = res.data.data;

    localStorage.setItem('auth_token', token);
    setUser(userData);

    return userData;
  };

  // ── Register ──
  const register = async (data) => {
    const res = await api.post('/register', data);

    const { user: userData, token } = res.data.data;

    localStorage.setItem('auth_token', token);
    setUser(userData);

    return userData;
  };

  // ── Logout ──
  const logout = async () => {
    try {
      await api.post('/logout');
    } catch {}

    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        getUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook helper
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth ha de ser usat dins un AuthProvider');
  return ctx;
}