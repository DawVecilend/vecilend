import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Recuperar sessió: si hi ha token, obtenir l'usuari ──
  const getUser = useCallback(async () => {
    try {
      const res = await api.get('/api/v1/me');
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
    const res = await api.post('/api/v1/login', credentials);

    // Backend retorna: { message, data: { user: {...}, token: "..." } }
    const { user: userData, token } = res.data.data;
    localStorage.setItem('auth_token', token);
    setUser(userData);
    return userData;
  };

  // ── Register ──
  const register = async (data) => {
    const res = await api.post('/api/v1/register', data);

    // Backend retorna: { data: {...UserResource}, token: "..." }
    const token = res.data.token;
    const userData = res.data.data;
    localStorage.setItem('auth_token', token);
    setUser(userData);
    return userData;
  };

  // ── Logout ──
  const logout = async () => {
    try {
      await api.post('/api/v1/logout');    // Invalida el token a la BD
    } catch {
      // Si el token ja estava expirat, no passa res
    }
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, getUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalitzat per no haver de fer useContext(AuthContext) a cada component
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth ha de ser usat dins un AuthProvider');
  return ctx;
}