import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
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

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const getUser = async () => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data);
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