import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";
import { getUnreadCounts } from "../services/chats";

const UnreadCountsContext = createContext(null);

const POLL_MS = 30000;

export function UnreadCountsProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [counts, setCounts] = useState({ chats: 0, notifications: 0 });
  const intervalRef = useRef(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setCounts({ chats: 0, notifications: 0 });
      return;
    }
    try {
      const data = await getUnreadCounts();
      setCounts({
        chats: Number(data?.chats ?? 0),
        notifications: Number(data?.notifications ?? 0),
      });
    } catch {
      // Silenci — no volem que el polling provoqui errors visibles
    }
  }, [isAuthenticated]);

  // Refrescar quan l'usuari es loga / deslloga
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Polling periòdic
  useEffect(() => {
    if (!isAuthenticated) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(refresh, POLL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAuthenticated, refresh]);

  // Refresc quan torna el focus a la finestra
  useEffect(() => {
    const onFocus = () => refresh();
    const onVisibility = () => {
      if (!document.hidden) refresh();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refresh]);

  // Helpers per actualitzar localment quan sabem que ha canviat
  // (ex.: després de marcar un xat com a llegit). Estalvia esperar al pròxim poll.
  const decrementChats = useCallback((amount = 1) => {
    setCounts((c) => ({ ...c, chats: Math.max(0, c.chats - amount) }));
  }, []);

  const decrementNotifications = useCallback((amount = 1) => {
    setCounts((c) => ({
      ...c,
      notifications: Math.max(0, c.notifications - amount),
    }));
  }, []);

  return (
    <UnreadCountsContext.Provider
      value={{ counts, refresh, decrementChats, decrementNotifications }}
    >
      {children}
    </UnreadCountsContext.Provider>
  );
}

export function useUnreadCounts() {
  const ctx = useContext(UnreadCountsContext);
  if (!ctx) {
    throw new Error(
      "useUnreadCounts ha de ser usat dins un UnreadCountsProvider",
    );
  }
  return ctx;
}
