import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import backofficeApi from "../services/backofficeApi";

export const BackofficeAuthContext = createContext(null);

export function BackofficeAuthProvider({ children }) {
  const [empleat, setEmpleat] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getEmpleat = useCallback(async () => {
    try {
      const res = await backofficeApi.get("/backoffice/me", { skipAuthRedirect: true });
      setEmpleat(res.data.data);
    } catch {
      setEmpleat(null);
      localStorage.removeItem("backoffice_token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("backoffice_token")) {
      getEmpleat();
    } else {
      setLoading(false);
    }
  }, [getEmpleat]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setEmpleat(null);
      if (window.location.pathname !== "/backoffice") {
        navigate("/backoffice", { replace: true });
      }
    };
    window.addEventListener("backoffice:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("backoffice:unauthorized", handleUnauthorized);
  }, [navigate]);

  const login = async (credentials) => {
    const res = await backofficeApi.post("/backoffice/login", credentials);
    const { empleat: empleatData, token } = res.data.data;
    localStorage.setItem("backoffice_token", token);
    setEmpleat(empleatData);
    return empleatData;
  };

  const logout = async () => {
    try {
      await backofficeApi.post("/backoffice/logout");
    } catch {}
    localStorage.removeItem("backoffice_token");
    setEmpleat(null);
    navigate("/backoffice", { replace: true });
  };

  const isAdmin  = empleat?.rol === "admin";
  const isSuport = empleat?.rol === "suport";

  return (
    <BackofficeAuthContext.Provider
      value={{
        empleat,
        loading,
        login,
        logout,
        getEmpleat,
        isAuthenticated: !!empleat,
        isAdmin,
        isSuport,
      }}
    >
      {children}
    </BackofficeAuthContext.Provider>
  );
}

export function useBackofficeAuth() {
  const ctx = useContext(BackofficeAuthContext);
  if (!ctx) throw new Error("useBackofficeAuth ha de ser usat dins un BackofficeAuthProvider");
  return ctx;
}
