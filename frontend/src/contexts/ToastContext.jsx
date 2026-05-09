import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const showToast = useCallback((message, opts = {}) => {
    const { type = "success", duration = 3000 } = opts;
    const id = ++counter.current;

    setToasts((prev) => [...prev, { id, type, message }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => dismiss(t.id)}
            className={
              "pointer-events-auto cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md text-label font-bold animate-in fade-in slide-in-from-top-2 duration-300 " +
              (t.type === "success"
                ? "bg-vecilend-dark-primary/20 border-vecilend-dark-primary/40 text-vecilend-dark-primary"
                : t.type === "error"
                  ? "bg-red-500/20 border-red-500/40 text-red-300"
                  : "bg-app-bg-card border-app-border text-app-text")
            }
          >
            <span className="material-symbols-outlined">
              {t.type === "success"
                ? "check_circle"
                : t.type === "error"
                  ? "error"
                  : "info"}
            </span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast ha de ser usat dins ToastProvider");
  return ctx;
}
