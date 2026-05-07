import { useEffect, useRef, useState, useCallback, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getChat,
  getChatMessages,
  sendChatMessage,
  markChatAsRead,
} from "../services/chats";
import { AuthContext } from "../contexts/AuthContext";
import { useUnreadCounts } from "../contexts/UnreadCountsContext";
import BtnBack from "../components/elementos/BtnBack";

const POLL_MS = 7000;

function formatTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MessageBubble({ msg }) {
  const mine = msg.mine;
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={
          "max-w-[75%] rounded-2xl px-4 py-2 " +
          (mine
            ? "bg-app-primary text-[#003730] rounded-br-md"
            : "bg-app-bg-card border border-app-border text-app-text rounded-bl-md")
        }
      >
        <p className="whitespace-pre-wrap break-words text-body-base font-body">
          {msg.contingut}
        </p>
        <p
          className={
            "text-[10px] mt-1 text-right " +
            (mine ? "text-[#003730]/70" : "text-app-text-secondary")
          }
        >
          {formatTime(msg.created_at)}
        </p>
      </div>
    </div>
  );
}

function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { refresh: refreshUnread } = useUnreadCounts();

  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [draft, setDraft] = useState("");

  const scrollRef = useRef(null);
  const pollRef = useRef(null);
  const lastIdRef = useRef(null);

  // Auto-scroll quan arriben missatges nous (només si l'usuari està a baix)
  const scrollToBottom = useCallback((force = false) => {
    const el = scrollRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (force || isNearBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  // Càrrega inicial
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [chatData, msgsData] = await Promise.all([
          getChat(id),
          getChatMessages(id, { per_page: 100 }),
        ]);
        if (cancelled) return;

        setChat(chatData);
        setMessages(msgsData.data || []);
        lastIdRef.current = msgsData.data?.length
          ? msgsData.data[msgsData.data.length - 1].id
          : null;

        // Marcar com llegits i refrescar comptador global
        try {
          await markChatAsRead(id);
          refreshUnread();
        } catch {}

        // Scroll al final
        setTimeout(() => scrollToBottom(true), 50);
      } catch (e) {
        if (cancelled) return;
        if (e.response?.status === 403) {
          setError("No tienes acceso a esta conversación.");
        } else if (e.response?.status === 404) {
          setError("Esta conversación no existe.");
        } else {
          setError("No se ha podido cargar el chat.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, scrollToBottom, refreshUnread]);

  // Polling cada 7s — només els nous
  useEffect(() => {
    if (!chat || error) return;

    pollRef.current = setInterval(async () => {
      try {
        const msgsData = await getChatMessages(id, { per_page: 100 });
        const newMsgs = msgsData.data || [];

        const lastNew = newMsgs.length ? newMsgs[newMsgs.length - 1].id : null;
        if (lastNew !== lastIdRef.current) {
          setMessages(newMsgs);
          lastIdRef.current = lastNew;

          // Marcar llegits si la pestanya està activa
          if (!document.hidden) {
            try {
              await markChatAsRead(id);
              refreshUnread();
            } catch {}
          }

          setTimeout(() => scrollToBottom(false), 50);
        }
      } catch {}
    }, POLL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [id, chat, error, scrollToBottom, refreshUnread]);

  async function handleSend() {
    const text = draft.trim();
    if (!text || sending) return;

    setSending(true);
    try {
      const newMsg = await sendChatMessage(id, text);
      setMessages((prev) => [...prev, newMsg]);
      lastIdRef.current = newMsg.id;
      setDraft("");
      setTimeout(() => scrollToBottom(true), 50);
    } catch (e) {
      console.error("Error enviando mensaje:", e);
      alert(
        e.response?.data?.message ||
          "No se ha podido enviar el mensaje. Inténtalo de nuevo.",
      );
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (loading) {
    return (
      <div className="pt-24 flex justify-center">
        <div
          className="h-10 w-10 rounded-full border-4 border-app-border border-t-app-primary animate-spin"
          role="status"
          aria-label="Cargando"
        />
      </div>
    );
  }

  if (error) {
    return (
      <section className="mx-auto w-full max-w-2xl px-4 pt-6 pb-32">
        <BtnBack />
        <div className="mt-8 rounded-xl border border-app-border bg-app-bg-card p-10 text-center">
          <p className="text-app-text-secondary">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/chats")}
            className="mt-4 text-app-primary font-bold hover:underline"
          >
            Volver a Chats
          </button>
        </div>
      </section>
    );
  }

  const altre = chat?.altre_usuari;

  return (
    <section className="mx-auto w-full max-w-2xl px-4 pt-6 pb-32 flex flex-col h-[calc(100vh-120px)]">
      {/* Capçalera */}
      <header className="flex items-center gap-3 pb-4 border-b border-app-border">
        <BtnBack />
        {altre && (
          <Link
            to={`/profile/${altre.username}`}
            className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
          >
            <img
              src={altre.avatar_url || "/assets/icons/empty-user-icon.svg"}
              alt={altre.nom}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="font-bold text-app-text truncate">
                {altre.nom} {altre.cognoms}
              </p>
              <p className="text-caption text-app-text-secondary">
                @{altre.username}
              </p>
            </div>
          </Link>
        )}
      </header>

      {/* Context d'objecte (si hi és) */}
      {chat?.objecte && (
        <Link
          to={`/objects/${chat.objecte.id}`}
          className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg border border-app-border bg-app-bg-card text-label text-app-text-secondary hover:bg-app-bg-card-secondary transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">label</span>
          <span className="truncate">
            Sobre{" "}
            <span className="font-bold text-app-text">{chat.objecte.nom}</span>
          </span>
        </Link>
      )}

      {/* Llista de missatges */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-4 flex flex-col gap-2"
      >
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-app-text-secondary text-center">
              Empieza la conversación con un mensaje 👋
            </p>
          </div>
        ) : (
          messages.map((m) => <MessageBubble key={m.id} msg={m} />)
        )}
      </div>

      {/* Input */}
      <div className="pt-3 border-t border-app-border flex items-end gap-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          maxLength={2000}
          placeholder="Escribe un mensaje…"
          className="flex-1 resize-none rounded-2xl border border-app-border bg-app-bg-card px-4 py-2.5 text-body-base text-app-text font-body focus:outline-none focus:ring-2 focus:ring-app-primary max-h-32"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={sending || !draft.trim()}
          className="shrink-0 flex items-center justify-center h-11 w-11 rounded-full bg-app-primary text-[#003730] disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95"
          aria-label="Enviar"
        >
          <span className="material-symbols-outlined">send</span>
        </button>
      </div>
    </section>
  );
}

export default ChatPage;
