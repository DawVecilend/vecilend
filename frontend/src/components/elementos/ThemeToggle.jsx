import { useTheme } from "../../contexts/ThemeContext";

function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"
      }
      className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-app-neutral)] cursor-pointer ${className}`}
    >
      <span
        className="material-symbols-outlined"
        style={{ color: "var(--color-app-text)" }}
      >
        {theme === "dark" ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}

export default ThemeToggle;
