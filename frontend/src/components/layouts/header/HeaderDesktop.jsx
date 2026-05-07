import { Link, useLocation } from "react-router-dom";
import Logo from "../../elementos/Logo";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import SearchBar from "../../elementos/SearchBar";
import ThemeToggle from "../../elementos/ThemeToggle";
import UnreadBadge from "../../elementos/UnreadBadge";
import { useUnreadCounts } from "../../../contexts/UnreadCountsContext";

function HeaderDesktop() {
  const auth = useContext(AuthContext);
  const { counts } = useUnreadCounts();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!auth) return null;

  const { user, logout, loading } = auth;
  if (loading) return null;

  const getNavClass = (path) => {
    const isActive =
      location.pathname === path ||
      (path === "/how-it-works/renters" &&
        location.pathname.startsWith("/how-it-works"));
    return isActive
      ? "text-[#4fdbc8] border-b-2 border-[#4fdbc8] font-bold p-1 text-sm tracking-tight"
      : "text-[#aebdb9] font-medium hover:text-[#4fdbc8] transition-colors p-1 text-sm tracking-tight";
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#333b39] bg-[#0f1715]/70 backdrop-blur-[20px]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        {/* LEFT */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <Logo className="h-[45px] w-[136px]" />
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/objects" className={getNavClass("/objects")}>
              Objetos
            </Link>
            <Link
              to="/how-it-works/renters"
              className={getNavClass("/how-it-works/renters")}
            >
              ¿Cómo funciona?
            </Link>
            <Link to="/about" className={getNavClass("/about")}>
              Sobre Nosotros
            </Link>
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <SearchBar />

          <ThemeToggle />

          {user ? (
            <>
              <div className="flex items-center gap-2">
                <Link
                  to="/chats"
                  className="relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 hover:bg-[#333b39] cursor-pointer"
                >
                  <img
                    src="/assets/icons/chats-no-fill-icon.svg"
                    alt="Chats"
                    className="h-6 w-6 opacity-80 transition-opacity duration-300 hover:opacity-100"
                  />
                  <UnreadBadge count={counts.chats} />
                </Link>

                <Link
                  to="/notifications"
                  className="relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 hover:bg-[#333b39] cursor-pointer"
                >
                  <img
                    src="/assets/icons/notifications-icon.svg"
                    alt="Notificaciones"
                    className="h-6 w-6 opacity-80 transition-opacity duration-300 hover:opacity-100"
                  />
                  <UnreadBadge count={counts.notifications} />
                </Link>
              </div>

              <div onClick={() => setOpen(!open)} className="cursor-pointer">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="Avatar usuario"
                    className="h-[48px] w-[48px] rounded-full object-cover"
                  />
                ) : (
                  <img
                    src="/assets/icons/empty-user-icon.svg"
                    alt=""
                    className="h-[48px]"
                  />
                )}
              </div>

              <div ref={menuRef} className="relative">
                {open && (
                  <div className="absolute top-10 right-2 z-20 w-56">
                    <div className="overflow-hidden border border-white/5 bg-[#0f1715]/70 shadow-lg backdrop-blur-[20px]">
                      <div className="flex flex-col divide-y divide-[#14B8A6]/10">
                        {user.rol === "admin" ? (
                          <Link
                            to="/dashboard"
                            className="px-4 py-3 text-sm text-[#14B8A6] transition-colors hover:bg-white/5 hover:text-white"
                          >
                            Dashboard
                          </Link>
                        ) : (
                          <Link
                            to={`/profile/${user?.username}`}
                            className="px-4 py-3 text-sm text-[#14B8A6] transition-colors hover:bg-white/5 hover:text-white"
                          >
                            <p className="py-2 text-base text-white">
                              <span>
                                {user.nom} {user.cognoms}
                              </span>
                            </p>
                            Ver Perfil
                          </Link>
                        )}

                        <Link
                          to="/transactions"
                          className="px-4 py-3 text-sm text-[#14B8A6] transition-colors hover:bg-white/5 hover:text-white"
                        >
                          Mis transacciones
                        </Link>

                        <Link
                          to="/favorites"
                          className="px-4 py-3 text-sm text-[#14B8A6] transition-colors hover:bg-white/5 hover:text-white"
                        >
                          Mis favoritos
                        </Link>

                        <Link
                          to={`/settings/profile/${user?.username}`}
                          className="flex gap-2 px-4 py-3 text-sm text-[#14B8A6] transition-colors hover:bg-white/5 hover:text-white"
                        >
                          Ajustes
                        </Link>

                        <button
                          onClick={logout}
                          className="w-full cursor-pointer px-4 py-3 text-left text-sm text-[#14B8A6] transition-colors hover:bg-red-500/10 hover:text-red-400"
                        >
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden px-4 py-2.5 text-sm font-bold text-[#aebdb9] transition-colors hover:text-[#4fdbc8] md:block"
              >
                Iniciar Sesión
              </Link>

              <Link
                to="/register"
                className="hidden rounded-full bg-gradient-to-br from-[#14b8a6] to-[#4fdbc8] px-6 py-2.5 text-sm font-bold text-[#003730] shadow-lg shadow-[#4fdbc8]/20 transition-transform active:scale-95 md:block"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default HeaderDesktop;
