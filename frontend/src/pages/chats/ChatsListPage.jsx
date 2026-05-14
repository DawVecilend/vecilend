import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getChats } from "../../services/chats";

function formatHora(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();

  const sameDay = date.toDateString() === now.toDateString();

  if (sameDay) {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const diffDays = Math.floor((now - date) / 86400000);
  if (diffDays < 7) {
    return date.toLocaleDateString("es-ES", { weekday: "short" });
  }

  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
  });
}

function ChatRow({ chat }) {
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
      className="flex items-center gap-3 p-3 rounded-xl border border-app-border bg-app-bg-card hover:bg-app-bg-card-secondary transition-colors"
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
            {formatHora(hora)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p
            className={`text-label truncate ${
              noLlegits > 0
                ? "text-app-text font-semibold"
                : "text-app-text-secondary"
            }`}
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

function ChatsListPage() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="mx-auto w-full max-w-2xl px-4 pt-6 pb-32">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-h1-mobile md:text-h1-desktop font-extrabold text-app-text font-heading">
          Chats
        </h1>
        <button
          type="button"
          onClick={load}
          className="text-app-text-secondary hover:text-app-primary transition-colors"
          aria-label="Refrescar"
        >
          <span className="material-symbols-outlined">refresh</span>
        </button>
      </header>

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
            <ChatRow key={c.id} chat={c} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ChatsListPage;
