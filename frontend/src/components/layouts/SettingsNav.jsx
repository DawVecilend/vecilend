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
      <aside className="hidden md:flex flex-col p-4 bg-[#090f0e] w-64 shrink-0 border-r border-app-border transition-all duration-150 font-inter text-sm z-40">
        <div className="mb-8 px-2">
          <h2 className="text-[#4fdbc8] font-bold text-lg">Configuración</h2>
          <p className="text-[#859490] text-xs">Gestiona tu cuenta</p>
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
                    ? "flex items-center gap-3 px-3 py-3 bg-[#4fdbc8]/10 text-[#4fdbc8] font-semibold border-r-4 border-[#4fdbc8] transition-all duration-150"
                    : "flex items-center gap-3 px-3 py-3 text-[#859490] hover:bg-app-bg-card hover:text-app-text transition-all duration-150"
                }
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="md:hidden sticky top-[52px] z-30 bg-app-bg border-b border-app-border">
        <nav className="flex gap-1 overflow-x-auto px-2 py-2 vecilend-carousel">
          {items.map((item) => {
            const isActive = current === item.key;
            return (
              <NavLink
                key={item.key}
                to={item.to}
                end={item.end}
                className={
                  isActive
                    ? "flex shrink-0 items-center gap-2 rounded-full bg-[#4fdbc8]/10 px-4 py-2 text-sm font-semibold text-[#4fdbc8] border border-[#4fdbc8]/40"
                    : "flex shrink-0 items-center gap-2 rounded-full bg-app-bg-card px-4 py-2 text-sm font-medium text-app-text-secondary border border-app-border"
                }
              >
                <span className="material-symbols-outlined text-base">
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
