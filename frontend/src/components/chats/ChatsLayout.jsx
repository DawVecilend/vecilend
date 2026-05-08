import { useEffect, useState, useCallback, useRef } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { getChats } from "../../services/chats";
import { formatDateTimeSmart } from "../../utils/datetime";

const POLL_MS = 7000;

function ChatRow({ chat, active }) {
  const altre = chat.altre_usuari;
  const ultim = chat.ultim_missatge;
  const noLlegits = chat.missatges_no_llegits || 0;

  const preview = ultim
    ? (ultim.mine ? "Tú: " : "") + ultim.contingut
    : "Aún no hay mensajes";

  const hora = ultim?.created_at || chat.updated_at;

  return (
    <Link
      to={`/chats/${chat.id}`}
      className={
        "flex items-center gap-3 p-3 rounded-xl border transition-colors " +
        (active
          ? "border-app-primary/60 bg-app-primary/5"
          : "border-app-border bg-app-bg-card hover:bg-app-bg-card-secondary")
      }
    >
      <img
        src={altre?.avatar_url || "/assets/icons/empty-user-icon.svg"}
        alt={altre?.nom || "Usuario"}
        className="h-12 w-12 rounded-full object-cover shrink-0"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-bold text-app-text truncate">
            {altre ? `${altre.nom} ${altre.cognoms || ""}`.trim() : "Usuario"}
          </p>
          <span className="text-caption text-app-text-secondary shrink-0">
            {formatDateTimeSmart(hora)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p
            className={
              "text-label truncate " +
              (noLlegits > 0
                ? "text-app-text font-semibold"
                : "text-app-text-secondary")
            }
          >
            {preview}
          </p>
          {noLlegits > 0 && (
            <span className="shrink-0 flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-[11px] font-bold text-white bg-red-500 rounded-full">
              {noLlegits > 99 ? "99+" : noLlegits}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

/**
 * Layout de l'àrea de chats.
 *
 *  - Desktop (md+): sidebar fix (350 px) amb la llista + outlet a la dreta.
 *  - Mobile: comportament actual — quan no estàs a /chats/:id mostres la llista,
 *    i quan estàs dins un chat, només el chat.
 *
 * El polling de la llista de converses corre cada 7 segons (substitueix el
 * botó manual de "refrescar"), i s'atura quan la pestanya no és visible.
 */
function ChatsLayout() {
  const { id } = useParams();
  const location = useLocation();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);

  const onChatRoute = !!id;

  const load = useCallback(async () => {
    try {
      const data = await getChats();
      setChats(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e) {
      console.error("Error cargando chats:", e);
      setError("No se han podido cargar los chats.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Càrrega inicial + cada vegada que tornem a /chats sense id
  useEffect(() => {
    load();
  }, [load, location.pathname]);

  // Polling silenciós quan la pestanya és visible
  useEffect(() => {
    pollRef.current = setInterval(() => {
      if (!document.hidden) load();
    }, POLL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [load]);

  const sidebar = (
    <aside className="flex flex-col h-full">
      <header className="px-4 pt-6 pb-4 border-b border-app-border">
        <h1 className="text-h1-mobile md:text-h2-desktop font-extrabold text-app-text font-heading">
          Chats
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <div
              className="h-10 w-10 rounded-full border-4 border-app-border border-t-app-primary animate-spin"
              role="status"
              aria-label="Cargando"
            />
          </div>
        ) : error ? (
          <p className="text-center text-red-400 py-12">{error}</p>
        ) : chats.length === 0 ? (
          <div className="rounded-xl border border-app-border bg-app-bg-card p-10 text-center">
            <span className="material-symbols-outlined text-5xl text-app-text-secondary">
              forum
            </span>
            <p className="mt-3 text-app-text-secondary">
              Todavía no tienes ningún chat. Empieza una conversación desde el
              perfil de un usuario o solicitando un objeto.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {chats.map((c) => (
              <ChatRow
                key={c.id}
                chat={c}
                active={String(c.id) === String(id)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );

  // ─── Mobile: o sidebar o chat, mai els dos ──────────────────────────
  // ─── Desktop: sidebar + outlet costat a costat ──────────────────────
  return (
    <section className="mx-auto w-full max-w-[1380px] h-[calc(100vh-80px)] md:h-[calc(100vh-100px)]">
      <div className="flex h-full">
        {/* Sidebar */}
        <div
          className={
            // Mobile: visible només si no estem a /chats/:id
            "w-full md:w-[360px] md:shrink-0 md:border-r md:border-app-border " +
            (onChatRoute ? "hidden md:flex md:flex-col" : "flex flex-col")
          }
        >
          {sidebar}
        </div>

        {/* Outlet (chat individual o placeholder) */}
        <div
          className={
            "flex-1 min-w-0 " + (onChatRoute ? "flex" : "hidden md:flex")
          }
        >
          {onChatRoute ? (
            <Outlet />
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center">
              <div className="text-center max-w-sm px-6">
                <span className="material-symbols-outlined text-6xl text-app-text-secondary opacity-60">
                  forum
                </span>
                <p className="mt-3 text-app-text-secondary">
                  Selecciona una conversación para empezar a chatear.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ChatsLayout;
