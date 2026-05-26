import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { setCurrentUser as setDraftsUser } from "../services/chatDrafts";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ── Get current user ──
  const getUser = useCallback(async () => {
    try {
      const res = await api.get("/me", { skipAuthRedirect: true });
      setUser(res.data.data);
      setDraftsUser(res.data.data?.id ?? null);
    } catch {
      setUser(null);
      setDraftsUser(null);
      localStorage.removeItem("auth_token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("auth_token")) {
      getUser();
    } else {
      setLoading(false);
    }
  }, [getUser]);

  // ── Listener: 401 desde cualquier petición ──
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      if (window.location.pathname !== "/login") {
        navigate("/login", { replace: true });
      }
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [navigate]);

  // ── Login ──
  const login = async (credentials) => {
    const res = await api.post("/login", credentials);
    const data = res.data.data || {};
    if (data.requires_2fa) {
      return {
        requires2fa: true,
        twoFactorToken: data.two_factor_token,
      };
    }
    const { user: userData, token } = data;
    localStorage.setItem("auth_token", token);
    setUser(userData);
    setDraftsUser(userData?.id ?? null);
    return { requires2fa: false, user: userData };
  };

  // ── Verify 2FA login challenge ──
  const verifyLogin2fa = async ({ twoFactorToken, code }) => {
    const res = await api.post("/login/2fa", {
      two_factor_token: twoFactorToken,
      code,
    });
    const { user: userData, token } = res.data.data;
    localStorage.setItem("auth_token", token);
    setUser(userData);
    setDraftsUser(userData?.id ?? null);
    return { user: userData, recoveryCodesUsed: res.data.data.recovery_codes_used, recoveryCodesLeft: res.data.data.recovery_codes_left };
  };

  // ── Register ──
  const register = async (data) => {
    const res = await api.post("/register", data);
    const { user: userData, token } = res.data.data;
    localStorage.setItem("auth_token", token);
    setUser(userData);
    setDraftsUser(userData?.id ?? null);
    return userData;
  };

  // ── Logout ──
  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {}
    localStorage.removeItem("auth_token");
    setUser(null);
    setDraftsUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        verifyLogin2fa,
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
  if (!ctx) throw new Error("useAuth ha de ser usat dins un AuthProvider");
  return ctx;
}
