import { NavLink } from "react-router-dom";

function SettingsNav({ username, current }) {
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

  return (
    <>
      <aside className="hidden md:flex flex-col p-4 bg-[#0e2925] dark:bg-[#0e2925] w-64 shrink-0 self-stretch border-r border-vecilend-dark-primary/20 transition-all duration-150 font-inter text-sm z-40 rounded-l-xl">
        <div className="mb-8 px-2">
          <h2 className="text-[#4fdbc8] font-bold text-lg">Configuración</h2>
          <p className="text-[#bbcac6] text-xs">Gestiona tu cuenta</p>
        </div>

        <nav className="space-y-1">
          {items.map((item) => {
            const isActive = current === item.key;
            return (
              <NavLink
                key={item.key}
                to={item.to}
                end={item.end}
                className={
                  isActive
                    ? "flex items-center gap-3 px-3 py-3 bg-[#4fdbc8]/15 text-[#4fdbc8] font-semibold border-r-4 border-[#4fdbc8] rounded-l-md transition-all duration-150"
                    : "flex items-center gap-3 px-3 py-3 text-[#bbcac6] hover:bg-[#4fdbc8]/10 hover:text-white rounded-md transition-all duration-150"
                }
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="md:hidden mb-3">
        <nav className="flex gap-1 overflow-x-auto py-1 vecilend-carousel">
          {items.map((item) => {
            const isActive = current === item.key;
            return (
              <NavLink
                key={item.key}
                to={item.to}
                end={item.end}
                className={
                  isActive
                    ? "flex shrink-0 items-center gap-1.5 rounded-full bg-[#4fdbc8]/10 px-3 py-1.5 text-xs font-semibold text-[#4fdbc8] border border-[#4fdbc8]/40"
                    : "flex shrink-0 items-center gap-1.5 rounded-full bg-app-bg-card px-3 py-1.5 text-xs font-medium text-app-text-secondary border border-app-border"
                }
              >
                <span className="material-symbols-outlined text-sm">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
}

export default SettingsNav;
