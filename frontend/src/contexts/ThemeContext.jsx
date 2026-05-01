import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "vecilend_theme";

function getInitialTheme() {
  // 1. Preferència guardada
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;

  // 2. Preferència del sistema
  if (window.matchMedia("(prefers-color-scheme: light)").matches)
    return "light";

  // 3. Default: dark (l'identitat actual de Vecilend)
  return "dark";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // Aplicar tema al <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme ha de ser usat dins un ThemeProvider");
  return ctx;
}
