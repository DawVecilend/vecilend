import { NavLink } from "react-router-dom";

function SettingsNav({ username }) {
  const base = `/settings/profile/${username}`;

  const items = [
    {
      to: base,
      end: true,
      key: "general",
      label: "General",
      icon: "settings",
    },
    {
      to: `${base}/editing`,
      key: "profile",
      label: "Información personal",
      icon: "person",
    },
    {
      to: `${base}/security`,
      key: "security",
      label: "Seguridad",
      icon: "security",
    },
  ];

  const desktopClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 px-3 py-3 bg-app-primary/15 text-app-primary font-semibold border-r-4 border-app-primary rounded-l-md transition-all duration-150"
      : "flex items-center gap-3 px-3 py-3 text-app-text-secondary hover:bg-app-primary/10 hover:text-app-text rounded-md transition-all duration-150";

  const mobileClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 rounded-xl bg-app-primary/10 px-4 py-3 text-sm font-semibold text-app-primary border border-app-primary/40"
      : "flex items-center gap-3 rounded-xl bg-app-bg-card px-4 py-3 text-sm font-medium text-app-text-secondary border border-app-border";

  return (
    <>
      <aside className="hidden md:flex flex-col p-4 bg-app-bg-secondary w-64 shrink-0 self-stretch border-r border-app-primary/20 transition-all duration-150 font-inter text-sm z-40 rounded-l-xl">
        <div className="mb-8 px-2">
          <h2 className="text-app-primary font-bold text-lg">Configuración</h2>
          <p className="text-app-text-secondary text-xs">Gestiona tu cuenta</p>
        </div>

        <nav className="space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.end}
              className={desktopClass}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="md:hidden mb-3">
        <nav className="flex flex-col gap-2">
          {items.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.end}
              className={mobileClass}
            >
              <span className="material-symbols-outlined text-base">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}

export default SettingsNav;
