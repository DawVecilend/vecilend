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

const EMPTY_COUNTS = {
  chats: 0,
  notifications: 0,
  orders: {
    requests_sent_pending: 0,
    requests_received_pending: 0,
    transactions_payment_due: 0,
  },
};

export function UnreadCountsProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [counts, setCounts] = useState(EMPTY_COUNTS);
  const intervalRef = useRef(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setCounts(EMPTY_COUNTS);
      return;
    }
    try {
      const data = await getUnreadCounts();
      setCounts({
        chats: Number(data?.chats ?? 0),
        notifications: Number(data?.notifications ?? 0),
        orders: {
          requests_sent_pending: Number(
            data?.orders?.requests_sent_pending ?? 0,
          ),
          requests_received_pending: Number(
            data?.orders?.requests_received_pending ?? 0,
          ),
          transactions_payment_due: Number(
            data?.orders?.transactions_payment_due ?? 0,
          ),
        },
      });
    } catch {
      // silenci
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!isAuthenticated) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(refresh, POLL_MS);
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [isAuthenticated, refresh]);

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

  const decrementChats = useCallback((amount = 1) => {
    setCounts((c) => ({ ...c, chats: Math.max(0, c.chats - amount) }));
  }, []);

  const decrementNotifications = useCallback((amount = 1) => {
    setCounts((c) => ({
      ...c,
      notifications: Math.max(0, c.notifications - amount),
    }));
  }, []);

  // Total per al badge del bottom-nav
  const ordersTotalBadge =
    counts.orders.requests_sent_pending +
    counts.orders.requests_received_pending +
    counts.orders.transactions_payment_due;

  return (
    <UnreadCountsContext.Provider
      value={{
        counts,
        refresh,
        decrementChats,
        decrementNotifications,
        ordersTotalBadge,
      }}
    >
      {children}
    </UnreadCountsContext.Provider>
  );
}

export function useUnreadCounts() {
  const ctx = useContext(UnreadCountsContext);
  if (!ctx)
    throw new Error(
      "useUnreadCounts ha de ser usat dins un UnreadCountsProvider",
    );
  return ctx;
}
