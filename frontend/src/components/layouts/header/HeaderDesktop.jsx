import { Link, useLocation } from "react-router-dom";
import Logo from "../../elementos/Logo";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import SearchBar from "../../elementos/SearchBar";
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  if (!auth) return null;

  const { user, logout, loading } = auth;
  if (loading) return null;

  const getNavClass = (path) => {
    const isActive =
      location.pathname === path ||
      (path === "/how-it-works/renters" &&
        location.pathname.startsWith("/how-it-works"));
    return isActive
      ? "text-vecilend-dark-primary border-b-2 border-vecilend-dark-primary font-bold p-1 text-sm tracking-tight"
      : "text-app-text-secondary font-medium hover:text-vecilend-dark-primary transition-colors p-1 text-sm tracking-tight";
  };

  return (
    <header
      className="fixed top-0 z-50 w-full border-b backdrop-blur-[20px]"
      style={{
        backgroundColor: "var(--color-app-header-bg)",
        borderColor: "var(--color-app-header-border)",
      }}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
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
            <Link to="/about-us" className={getNavClass("/about-us")}>
              Sobre nosotros
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <SearchBar />

          {user && (
            <Link
              to="/objects/create"
              aria-label="Publicar objeto"
              title="Publicar objeto"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-vecilend-dark-primary text-[var(--color-app-success-on)] shadow-md transition-all hover:bg-vecilend-dark-primary-hover hover:text-white active:scale-95"
            >
              <span className="material-symbols-outlined text-[22px] font-bold">
                add
              </span>
            </Link>
          )}

          {user ? (
            <>
              <div className="flex items-center gap-2">
                <Link
                  to="/chats"
                  className="relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 hover:bg-app-bg-card-secondary cursor-pointer text-app-text-secondary hover:text-app-text"
                >
                  <span className="material-symbols-outlined text-[26px]">
                    chat_bubble
                  </span>
                  <UnreadBadge count={counts.chats} />
                </Link>

                <Link
                  to="/notifications"
                  className="relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 hover:bg-app-bg-card-secondary cursor-pointer text-app-text-secondary hover:text-app-text"
                >
                  <span className="material-symbols-outlined text-[26px]">
                    notifications
                  </span>
                  <UnreadBadge count={counts.notifications} />
                </Link>
              </div>

              <div ref={menuRef} className="relative">
                <div
                  onClick={() => setOpen((o) => !o)}
                  className="cursor-pointer"
                >
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
                {open && (
                  <div className="absolute top-12 right-0 z-20 w-56">
                    <div
                      className="overflow-hidden border border-app-border shadow-lg backdrop-blur-[20px] rounded-lg"
                      style={{ backgroundColor: "var(--color-app-header-bg)" }}
                    >
                      <div className="flex flex-col divide-y divide-app-border">
                        <Link
                          to={`/profile/${user?.username}`}
                          className="px-4 py-3 text-sm text-vecilend-dark-primary transition-colors hover:bg-app-bg-card-secondary"
                        >
                          <p className="py-2 text-base text-app-text">
                            <span>
                              {user.nom} {user.cognoms}
                            </span>
                          </p>
                          Ver perfil
                        </Link>
                        <Link
                          to="/orders"
                          className="px-4 py-3 text-sm text-vecilend-dark-primary transition-colors hover:bg-app-bg-card-secondary"
                        >
                          Mis pedidos
                        </Link>
                        <Link
                          to="/favorites"
                          className="px-4 py-3 text-sm text-vecilend-dark-primary transition-colors hover:bg-app-bg-card-secondary"
                        >
                          Mis favoritos
                        </Link>
                        <Link
                          to={`/settings/profile/${user?.username}`}
                          className="flex gap-2 px-4 py-3 text-sm text-vecilend-dark-primary transition-colors hover:bg-app-bg-card-secondary"
                        >
                          Ajustes
                        </Link>
                        <button
                          onClick={logout}
                          className="w-full cursor-pointer px-4 py-3 text-left text-sm text-vecilend-dark-primary transition-colors hover:bg-[var(--color-app-danger)]/10 hover:text-[var(--color-app-danger)]"
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
                className="hidden px-4 py-2.5 text-sm font-bold text-app-text-secondary transition-colors hover:text-vecilend-dark-primary md:block"
              >
                Iniciar sesión
              </Link>

              <Link
                to="/register"
                className="hidden rounded-full bg-gradient-to-br from-vecilend-dark-primary to-vecilend-dark-primary-hover px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-vecilend-dark-primary/20 transition-transform active:scale-95 md:block"
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
