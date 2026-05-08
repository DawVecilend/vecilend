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
import { formatDateTimeSmart } from "../utils/datetime";
import { cldTransform } from "../utils/cloudinary";
import BtnBack from "../components/elementos/BtnBack";

const POLL_MS = 7000;

/**
 * Targeta "Sobre el objeto" — apareix a l'inici del timeline
 * quan la conversa té objecte però sense sol·licitud associada
 * (botó "Consultar sobre el objeto").
 */
function ObjectContextCard({ objecte }) {
  if (!objecte) return null;
  const img = objecte.imatge_principal
    ? cldTransform(objecte.imatge_principal, "thumb")
    : "/assets/icons/empty-object-icon.svg"; // ← usa la teva icona genèrica

  return (
    <div className="my-2 flex justify-center">
      <Link
        to={`/objects/${objecte.id}`}
        className="flex items-center gap-3 rounded-xl border border-app-border bg-app-bg-card-secondary hover:bg-app-bg-card transition-colors px-4 py-3 w-full max-w-[360px]"
      >
        <img
          src={img}
          alt={objecte.nom}
          className="h-12 w-12 rounded-lg object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-caption text-app-text-secondary leading-none mb-0.5">
            Sobre el objeto
          </p>
          <p className="text-label font-bold text-app-text truncate">
            {objecte.nom}
          </p>
          {objecte.preu_diari ? (
            <p className="text-caption text-vecilend-dark-primary font-bold">
              {Number(objecte.preu_diari).toFixed(2)}€ / día
            </p>
          ) : (
            <p className="text-caption text-vecilend-dark-secondary font-bold">
              Préstamo gratuito
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}

/**
 * Targeta "Solicitud del objeto" — apareix inline quan el missatge
 * té solicitud_id (creat per TransactionController).
 */
function SolicitudContextCard({ objecte, solicitud }) {
  if (!objecte) return null;

  const img = objecte.imatge_principal
    ? cldTransform(objecte.imatge_principal, "thumb")
    : "/assets/icons/empty-object-icon.svg";

  let dies = null;
  if (solicitud?.data_inici && solicitud?.data_fi) {
    const inici = new Date(solicitud.data_inici);
    const fi = new Date(solicitud.data_fi);
    dies = Math.round((fi - inici) / (1000 * 60 * 60 * 24));
  }

  const preuTotal =
    dies > 0 && objecte.preu_diari
      ? (Number(objecte.preu_diari) * dies).toFixed(2)
      : null;

  return (
    <div className="my-2 flex justify-center">
      <Link
        to={`/objects/${objecte.id}`}
        className="flex items-center gap-3 rounded-xl border border-app-border bg-app-bg-card-secondary hover:bg-app-bg-card transition-colors px-4 py-3 w-full max-w-[360px]"
      >
        <img
          src={img}
          alt={objecte.nom}
          className="h-12 w-12 rounded-lg object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-caption text-app-text-secondary leading-none mb-0.5">
            Solicitud del objeto
          </p>
          <p className="text-label font-bold text-app-text truncate">
            {objecte.nom}
          </p>
          {preuTotal ? (
            <p className="text-caption text-vecilend-dark-primary font-bold">
              {preuTotal}€ total · {dies} día{dies === 1 ? "" : "s"}
            </p>
          ) : dies > 0 ? (
            <p className="text-caption text-vecilend-dark-secondary font-bold">
              Préstamo gratuito · {dies} día{dies === 1 ? "" : "s"}
            </p>
          ) : (
            <p className="text-caption text-vecilend-dark-secondary font-bold">
              Préstamo gratuito
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}

/**
 * Burbuja d'un missatge. Si té `respon_a`, dibuixa un bloc citat al damunt.
 * El callback `onReply` permet citar aquest missatge.
 */
function MessageBubble({ msg, onReply }) {
  const mine = msg.mine;
  return (
    <div className={`group flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className="flex flex-col max-w-[75%] gap-1">
        <div
          className={
            "rounded-2xl px-4 py-2 " +
            (mine
              ? "bg-app-primary text-[#003730] rounded-br-md"
              : "bg-app-bg-card border border-app-border text-app-text rounded-bl-md")
          }
        >
          {/* Cita al missatge anterior (si n'hi ha) */}
          {msg.respon_a && (
            <div
              className={
                "mb-2 border-l-2 pl-2 text-caption " +
                (mine
                  ? "border-[#003730] text-[#003730]/80"
                  : "border-app-primary text-app-text-secondary")
              }
            >
              <p className="font-bold leading-tight">
                {msg.respon_a.mine
                  ? "Tú"
                  : (msg.respon_a.autor ?? "Otra persona")}
              </p>
              <p className="line-clamp-2 italic leading-snug">
                {msg.respon_a.contingut}
              </p>
            </div>
          )}

          <p className="whitespace-pre-wrap break-words text-body-base font-body">
            {msg.contingut}
          </p>
          <p
            className={
              "text-[10px] mt-1 text-right " +
              (mine ? "text-[#003730]/70" : "text-app-text-secondary")
            }
          >
            {formatDateTimeSmart(msg.created_at)}
          </p>
        </div>

        {/* Botó "Responder" — només visible al hover */}
        <button
          type="button"
          onClick={() => onReply(msg)}
          className={
            "self-end opacity-0 group-hover:opacity-100 transition-opacity text-caption text-app-text-secondary hover:text-app-primary inline-flex items-center gap-1 " +
            (mine ? "self-end" : "self-start")
          }
        >
          <span className="material-symbols-outlined text-base">reply</span>
          Responder
        </button>
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
  const [replyTo, setReplyTo] = useState(null); // missatge citat (objecte)

  const scrollRef = useRef(null);
  const pollRef = useRef(null);
  const lastIdRef = useRef(null);

  // Auto-scroll només si l'usuari ja és a baix
  const scrollToBottom = useCallback((force = false) => {
    const el = scrollRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (force || isNearBottom) el.scrollTop = el.scrollHeight;
  }, []);

  // Càrrega inicial
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setMessages([]);
    setReplyTo(null);

    async function load() {
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

        try {
          await markChatAsRead(id);
          refreshUnread();
        } catch {}

        setTimeout(() => scrollToBottom(true), 50);
      } catch (e) {
        if (cancelled) return;
        if (e.response?.status === 403)
          setError("No tienes acceso a esta conversación.");
        else if (e.response?.status === 404)
          setError("Esta conversación no existe.");
        else setError("No se ha podido cargar el chat.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, scrollToBottom, refreshUnread]);

  // Polling cada 7s
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
      const newMsg = await sendChatMessage(id, {
        contingut: text,
        respon_a_id: replyTo?.id ?? null,
        objecte_id: chat?.objecte?.id ?? null,
      });
      setMessages((prev) => [...prev, newMsg]);
      lastIdRef.current = newMsg.id;
      setDraft("");
      setReplyTo(null);
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
      <div className="flex-1 flex items-center justify-center pt-8">
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
      <section className="flex-1 px-4 pt-6 pb-32">
        <div className="md:hidden">
          <BtnBack />
        </div>
        <div className="mt-8 mx-auto max-w-md rounded-xl border border-app-border bg-app-bg-card p-10 text-center">
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

  // ── Detectar canvis d'objecte_id entre missatges ─────────────────
  // Renderem una targeta entremig quan el missatge anterior tenia
  // un objecte_id diferent (o no en tenia).
  function shouldShowDivider(msg, prev) {
    if (!msg.objecte) return false;
    const prevObjId = prev?.objecte?.id ?? null;
    return prevObjId !== msg.objecte.id;
  }

  return (
    <section className="flex-1 flex flex-col h-full px-4 md:px-6 pt-6 pb-4 min-w-0">
      {/* Capçalera */}
      <header className="flex items-center gap-3 pb-4 border-b border-app-border shrink-0">
        <div className="md:hidden">
          <BtnBack />
        </div>
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

      {/* Missatges */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-4 pr-2 flex flex-col gap-2"
      >
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-app-text-secondary text-center">
              Empieza la conversación con un mensaje 👋
            </p>
          </div>
        ) : (
          messages.map((m, idx) => {
            const prev = idx > 0 ? messages[idx - 1] : null;
            const objecteCanviat =
              m.objecte && (prev?.objecte?.id ?? null) !== m.objecte.id;
            const showSolicitudCard = objecteCanviat && !!m.solicitud;
            const showObjectCard = objecteCanviat && !m.solicitud;

            return (
              <div key={m.id} className="flex flex-col">
                {showSolicitudCard && (
                  <SolicitudContextCard
                    objecte={m.objecte}
                    solicitud={m.solicitud}
                  />
                )}
                {showObjectCard && <ObjectContextCard objecte={m.objecte} />}
                <MessageBubble msg={m} onReply={setReplyTo} />
              </div>
            );
          })
        )}
      </div>

      {/* Banner de cita activa (si hi ha replyTo) */}
      {replyTo && (
        <div className="shrink-0 flex items-start gap-2 mb-2 px-3 py-2 rounded-lg border border-app-border bg-app-bg-card-secondary">
          <span className="material-symbols-outlined text-app-primary mt-0.5">
            reply
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-caption font-bold text-app-text">
              Respondiendo a {replyTo.mine ? "tu mensaje" : "este mensaje"}
            </p>
            <p className="text-caption text-app-text-secondary truncate italic">
              {replyTo.contingut}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setReplyTo(null)}
            className="shrink-0 text-app-text-secondary hover:text-red-400"
            aria-label="Cancelar respuesta"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {/* Input */}
      <div className="pt-3 border-t border-app-border flex items-end gap-2 shrink-0">
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
