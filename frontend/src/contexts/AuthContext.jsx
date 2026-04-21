import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Recuperar sessió: si hi ha token, obtenir l'usuari ──
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

    const login = async (credentials) => {
        const res = await api.post('/api/v1/login', credentials);
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        setUser(user);
        return user;
    };

    const register = async (data) => {
        const res = await api.post('/api/v1/register', data);
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        setUser(user);
        return user;
    };

    // Backend retorna: { message, data: { user: {...}, token: "..." } }
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
      await api.post('/logout');    // Invalida el token a la BD
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