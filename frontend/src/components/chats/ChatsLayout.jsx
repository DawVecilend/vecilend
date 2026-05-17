import { useEffect, useState, useCallback, useRef } from "react";
import { Link, Outlet, useLocation, useParams, useNavigate } from "react-router-dom";
import { getChats, deleteChat } from "../../services/chats";
import { formatDateTimeSmart } from "../../utils/datetime";
import { getDraft, subscribeToDrafts, clearDraft } from "../../services/chatDrafts";

const POLL_MS = 7000;
const PER_PAGE = 20;

function ChatRow({ chat, active, draft, onDelete }) {
  const altre = chat.altre_usuari;
  const ultim = chat.ultim_missatge;
  const noLlegits = chat.missatges_no_llegits || 0;

  const hasDraft = !!draft;
  const preview = hasDraft
    ? draft
    : ultim
      ? (ultim.mine ? "Tú: " : "") + ultim.contingut
      : "Aún no hay mensajes";

  const hora = ultim?.created_at || chat.updated_at;

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(chat.id);
  };

  return (
    <div className="relative">
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
                (hasDraft
                  ? "text-app-text-secondary italic"
                  : noLlegits > 0
                    ? "text-app-text font-semibold"
                    : "text-app-text-secondary")
              }
            >
              {hasDraft && (
                <span className="not-italic font-semibold text-vecilend-dark-primary mr-1">
                  Borrador:
                </span>
              )}
              {preview}
            </p>
            {noLlegits > 0 && (
              <span className="shrink-0 flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-[11px] font-bold text-white bg-red-500 rounded-full">
                {noLlegits > 99 ? "99+" : noLlegits}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          aria-label="Eliminar conversación"
          title="Eliminar conversación"
          className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-app-text-secondary hover:bg-[var(--color-app-danger)]/10 hover:text-[var(--color-app-danger)] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </Link>
    </div>
  );
}

function ConfirmDeleteDialog({ open, onCancel, onConfirm, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-app-border bg-app-bg-card p-6 shadow-2xl">
        <h3 className="font-heading text-lg font-bold text-app-text mb-2">
          ¿Eliminar conversación?
        </h3>
        <p className="text-sm text-app-text-secondary mb-6 leading-relaxed">
          La conversación se ocultará de tu lista. El otro usuario seguirá
          viéndola y, si te envía un mensaje nuevo, volverá a aparecer.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-app-text-secondary hover:bg-app-bg-card-secondary transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-[var(--color-app-danger)] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Eliminando…" : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatsLayout() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [, setDraftsVersion] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const pollRef = useRef(null);
  const scrollRef = useRef(null);

  const onChatRoute = !!id;

  // Carrega inicial (pàgina 1) — substitueix tota la llista.
  const loadInitial = useCallback(async () => {
    try {
      const { data, meta } = await getChats({ page: 1, per_page: PER_PAGE });
      setChats(Array.isArray(data) ? data : []);
      setPage(1);
      setHasMore(meta ? meta.current_page < meta.last_page : false);
      setError(null);
    } catch (e) {
      console.error("Error cargando chats:", e);
      setError("No se han podido cargar los chats.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresc silenciós (polling): manté la pàgina 1 al dia sense afegir
  // pàgines posteriors ja carregades — re-fetch només la pàgina 1.
  const refreshFirstPage = useCallback(async () => {
    try {
      const { data } = await getChats({ page: 1, per_page: PER_PAGE });
      if (!Array.isArray(data)) return;
      setChats((prev) => {
        // Substitueix els ID que tornen a la primera pàgina i conserva la resta
        // (pàgines posteriors ja carregades).
        const ids = new Set(data.map((c) => c.id));
        const keep = prev.filter((c) => !ids.has(c.id));
        return [...data, ...keep];
      });
    } catch (e) {
      console.error("Error refrescando chats:", e);
    }
  }, []);

  // Carrega la pròxima pàgina (infinite scroll).
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const next = page + 1;
      const { data, meta } = await getChats({ page: next, per_page: PER_PAGE });
      if (Array.isArray(data) && data.length > 0) {
        setChats((prev) => {
          const ids = new Set(prev.map((c) => c.id));
          const fresh = data.filter((c) => !ids.has(c.id));
          return [...prev, ...fresh];
        });
        setPage(next);
      }
      setHasMore(meta ? meta.current_page < meta.last_page : false);
    } catch (e) {
      console.error("Error cargando más chats:", e);
    } finally {
      setLoadingMore(false);
    }
  }, [page, hasMore, loadingMore]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial, location.pathname]);

  // Polling silenciós quan la pestanya és visible — només refresca pàgina 1.
  useEffect(() => {
    pollRef.current = setInterval(() => {
      if (!document.hidden) refreshFirstPage();
    }, POLL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [refreshFirstPage]);

  useEffect(() => {
    const handler = () => refreshFirstPage();
    window.addEventListener("chats:refresh", handler);
    return () => window.removeEventListener("chats:refresh", handler);
  }, [refreshFirstPage]);

  useEffect(() => {
    return subscribeToDrafts(() => setDraftsVersion((v) => v + 1));
  }, []);

  // Infinite scroll: detecta quan el scroll arriba prop del final.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      if (!hasMore || loadingMore) return;
      const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
      if (remaining < 200) loadMore();
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [hasMore, loadingMore, loadMore]);

  const handleDeleteRequest = (chatId) => {
    setDeleteTarget(chatId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteChat(deleteTarget);
      clearDraft(deleteTarget);
      setChats((prev) => prev.filter((c) => c.id !== deleteTarget));
      if (String(id) === String(deleteTarget)) {
        navigate("/chats", { replace: true });
      }
      setDeleteTarget(null);
    } catch (e) {
      console.error("Error eliminando chat:", e);
    } finally {
      setDeleting(false);
    }
  };

  const visibleChats = chats.filter((c) => {
    if (c.ultim_missatge) return true;
    if (getDraft(c.id)) return true;
    if (String(c.id) === String(id)) return true;
    return false;
  });

  const sidebar = (
    <aside className="flex flex-col h-full">
      <header className="px-4 pt-6 pb-4 border-b border-app-border">
        <h1 className="text-h1-mobile md:text-h2-desktop font-extrabold text-app-text font-heading">
          Chats
        </h1>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
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
        ) : visibleChats.length === 0 ? (
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
          <>
            <div className="flex flex-col gap-2">
              {visibleChats.map((c) => (
                <ChatRow
                  key={c.id}
                  chat={c}
                  active={String(c.id) === String(id)}
                  draft={getDraft(c.id)}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
            {loadingMore && (
              <div className="flex justify-center py-6">
                <div
                  className="h-6 w-6 rounded-full border-2 border-app-border border-t-app-primary animate-spin"
                  role="status"
                  aria-label="Cargando más"
                />
              </div>
            )}
            {!hasMore && visibleChats.length >= PER_PAGE && (
              <p className="text-center text-caption text-app-text-secondary py-4">
                No hay más conversaciones.
              </p>
            )}
          </>
        )}
      </div>
    </aside>
  );

  return (
    <>
      <section className="mx-auto w-full max-w-[1380px] h-[calc(100vh-80px)] md:h-[calc(100vh-100px)]">
        <div className="flex h-full">
          <div
            className={
              "w-full md:w-[360px] md:shrink-0 md:border-r md:border-app-border " +
              (onChatRoute ? "hidden md:flex md:flex-col" : "flex flex-col")
            }
          >
            {sidebar}
          </div>

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

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        onCancel={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </>
  );
}

export default ChatsLayout;
