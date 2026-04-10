import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            getUser();
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        const res = await api.post('/auth/login', credentials);
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        setUser(user);
        return user;
    };

    const register = async (data) => {
        const res = await api.post('/auth/register', data);
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        setUser(user);
        return user;
    };

    const logout = async () => {
        try {
            const resp = await api.post('/api/v1/logout');
            if (resp.status == 200) {
                localStorage.removeItem('auth_token');
            }
            setUser(null);
        } catch (error) {
            console.error('Error al hacer logout:', error);
        }
    };

    const getUser = async () => {
        try {
            const res = await api.get('/api/v1/me');
            setUser(res.data.data);
        } catch (error) {
            console.error(error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, getUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};