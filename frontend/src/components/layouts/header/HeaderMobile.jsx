import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import SearchModal from "../../search/SearchModal";

function HeaderMobile() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const isObjectsPage = location.pathname === "/objects";

  useEffect(() => {
    if (isObjectsPage) {
      setQuery(searchParams.get("search") || "");
    } else {
      setQuery("");
    }
  }, [isObjectsPage, searchParams]);

  if (!auth) return null;
  const { user, loading } = auth;
  if (loading) return null;

  const submitSearch = (e) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    const next = new URLSearchParams(
      isObjectsPage ? searchParams : new URLSearchParams(),
    );
    if (trimmed) next.set("search", trimmed);
    else next.delete("search");
    navigate(`/objects?${next.toString()}`);
  };

  return (
    <>
      {/* ── Barra superior móvil ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-app-bg/90 backdrop-blur-md border-b border-app-border">
        <div className="flex items-center gap-1.5 px-2 py-2">
          {/* Notificaciones */}
          <Link
            to={user ? "/notifications" : "/login"}
            aria-label="Notificaciones"
            className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-app-card border border-app-border text-app-text"
          >
            <span className="material-symbols-outlined text-[20px]">
              notifications
            </span>
          </Link>

          {/* Input búsqueda */}
          <form
            onSubmit={submitSearch}
            className="flex-1 min-w-0 flex items-center gap-1.5 bg-app-card border border-app-border rounded-full px-3 py-1.5"
          >
            <span className="material-symbols-outlined text-app-text-secondary text-[18px] shrink-0">
              search
            </span>
            <input
              type="text"
              inputMode="search"
              placeholder="Buscar…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 min-w-0 bg-transparent text-app-text text-sm font-body outline-none placeholder:text-app-text-secondary"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Limpiar búsqueda"
                className="shrink-0 text-app-text-secondary"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            )}
          </form>

          {/* Filtros */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Filtros"
            className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-vecilend-dark-primary text-[#003730]"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </div>
      </header>

      {/* Espaciador para que el contenido no quede bajo la barra superior */}
      <div className="md:hidden h-[52px]" />

      {/* ── Bottom nav ── */}
      <nav className="fixed bottom-4 left-1/2 z-50 w-[94%] max-w-[430px] -translate-x-1/2 rounded-[15px] bg-vecilend-dark-primary px-3 py-3 shadow-[0_-6px_20px_rgba(0,0,0,0.25)] md:hidden">
        <div className="flex items-end justify-between gap-1">
          {/* Inicio */}
          <Link
            to="/"
            className="flex flex-col items-center justify-center text-white"
          >
            <img
              src="/assets/icons/home-icon.svg"
              alt="Inicio"
              className="h-[22px] w-[22px] object-contain"
            />
            <span className="mt-1 text-center font-body text-caption leading-caption text-white">
              Inicio
            </span>
          </Link>

          {/* Publicar */}
          <Link
            to={user ? "/objects/create" : "/login"}
            className="flex flex-col items-center justify-center text-white"
          >
            <img
              src="/assets/icons/add-object-icon.svg"
              alt="Publicar"
              className="h-[22px] w-[22px] object-contain"
            />
            <span className="mt-1 text-center font-body text-caption leading-caption text-white">
              Publicar
            </span>
          </Link>

          {/* Transacciones */}
          <Link
            to={user ? "/transactions" : "/login"}
            className="flex flex-col items-center justify-center text-white"
          >
            <span className="material-symbols-outlined text-[22px] text-white">
              swap_horiz
            </span>
            <span className="mt-1 text-center font-body text-caption leading-caption text-white">
              Transacciones
            </span>
          </Link>

          {/* Chats */}
          <Link
            to={user ? "/chats" : "/login"}
            className="flex flex-col items-center justify-center text-white"
          >
            <span className="material-symbols-outlined text-[22px] text-white">
              chat_bubble
            </span>
            <span className="mt-1 text-center font-body text-caption leading-caption text-white">
              Chats
            </span>
          </Link>

          {/* Perfil */}
          <Link
            to={user ? `/profile/${user.username}` : "/login"}
            className="flex flex-col items-center justify-center text-white"
          >
            <img
              src="/assets/icons/person-white-icon.svg"
              alt="Mi perfil"
              className="h-[22px] w-[22px] object-contain"
            />
            <span className="mt-1 text-center font-body text-caption leading-caption text-white">
              Perfil
            </span>
          </Link>
        </div>
      </nav>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

export default HeaderMobile;
