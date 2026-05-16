import { NavLink, Outlet } from "react-router-dom";
import { useBackofficeAuth } from "../../contexts/BackofficeAuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import Logo from "../../components/elementos/Logo";

function AdminLayout() {
  const { empleat, logout, isAdmin } = useBackofficeAuth();
  const { theme, toggleTheme } = useTheme();

  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? "bg-app-primary/15 text-app-primary" : "text-app-text-secondary hover:bg-app-neutral hover:text-app-text"
    }`;

  const rolLabel = empleat?.rol === "admin" ? "Administrador" : "Soporte técnico";

  return (
    <div className="flex min-h-screen bg-app-bg">
      <aside className="fixed top-0 left-0 h-full w-60 flex flex-col border-r border-app-border bg-app-bg-card z-40">
        <div className="px-6 py-5 border-b border-app-border flex flex-col items-center text-center">
          <Logo className="h-9 w-auto" />
          <span className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-app-primary/10 text-app-primary">
            {empleat?.rol === "admin" ? "Admin Panel" : "Soporte"}
          </span>
        </div>

        <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
          <NavLink to="/backoffice/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/backoffice/users" className={linkClass}>Usuarios</NavLink>
          <NavLink to="/backoffice/reports" className={linkClass}>Reportes</NavLink>
          {isAdmin && (
            <>
              <NavLink to="/backoffice/empleats" className={linkClass}>Empleados</NavLink>
              <NavLink to="/backoffice/categories" className={linkClass}>Categorías</NavLink>
              <NavLink to="/backoffice/logs" className={linkClass}>Log de acciones</NavLink>
            </>
          )}
        </nav>

        <div className="px-4 py-4 border-t border-app-border flex flex-col items-center text-center">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
            className="w-full mb-3 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-app-text-secondary hover:bg-app-neutral hover:text-app-text transition-colors"
          >
            <span className="material-symbols-outlined text-base">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
            <span>{theme === "dark" ? "Modo claro" : "Modo oscuro"}</span>
          </button>

          <p className="w-full text-sm font-medium text-app-text truncate">{empleat?.nom} {empleat?.cognoms}</p>
          <p className="w-full text-xs text-app-text-secondary truncate">{rolLabel}</p>
          <p className="w-full text-xs text-app-text-secondary truncate mb-3">{empleat?.email}</p>
          <button onClick={logout} className="w-full px-3 py-2 rounded-lg text-sm text-app-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-colors text-center">
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-60 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
