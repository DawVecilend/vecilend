import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useUnreadCounts } from "../contexts/UnreadCountsContext";
import {
  getTransactions,
  acceptTransaction,
  rejectTransaction,
  returnTransaction,
  cancelTransaction,
} from "../services/transactions";
import { cldTransform } from "../utils/cloudinary";
import BtnBack from "../components/elementos/BtnBack";
import ReviewModal from "../components/transactions/ReviewModal";
import ConfirmDeleteModal from "../components/elementos/ConfirmDeleteModal";

// ── Configuració de pestanyes i filtres ──────────────────────────────────────

const TABS = [
  {
    id: "requests_sent",
    label: "Solicitudes enviadas",
    view: "requests",
    role: "requester",
  },
  {
    id: "requests_received",
    label: "Solicitudes recibidas",
    view: "requests",
    role: "owner",
  },
  {
    id: "transactions",
    label: "Transacciones",
    view: "transactions",
    role: null,
  },
];

// Per a 'requests' no mostrem 'acceptat' (les que han passat a transaccio ja
// no apareixen aquí, com vam acordar).
const REQUEST_FILTERS = [
  { id: "all", label: "Todas" },
  { id: "pendent", label: "Pendientes" },
  { id: "rebutjat", label: "Rechazadas" },
  { id: "cancellat", label: "Canceladas" },
];

const TRANSACTION_FILTERS = [
  { id: "all", label: "Todas" },
  { id: "en_curs", label: "En curso" },
  { id: "finalitzat", label: "Finalizadas" },
  { id: "cancellat", label: "Canceladas" },
];

const STATUS_LABELS = {
  pendent: {
    label: "Pendiente",
    classes: "bg-amber-500/15 text-amber-400 border-amber-500/40",
  },
  acceptat: {
    label: "Aceptada",
    classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
  },
  rebutjat: {
    label: "Rechazada",
    classes: "bg-red-500/15 text-red-400 border-red-500/40",
  },
  cancellat: {
    label: "Cancelada",
    classes: "bg-zinc-500/15 text-zinc-400 border-zinc-500/40",
  },
  en_curs: {
    label: "En curso",
    classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
  },
  finalitzat: {
    label: "Finalizada",
    classes: "bg-sky-500/15 text-sky-400 border-sky-500/40",
  },
};

function StatusPill({ estat }) {
  const s = STATUS_LABELS[estat];
  if (!s) return null;
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${s.classes}`}
    >
      {s.label}
    </span>
  );
}

// ── Targeta d'un pedido ──────────────────────────────────────────────────────

function OrderCard({ tx, tab, onAction, busyId }) {
  const navigate = useNavigate();
  const isRequestsTab = tab.view === "requests";
  const cardStatus = isRequestsTab ? tx.estat : tx.transaccio?.estat;
  const isLloguer = tx.tipus === "lloguer";

  const imatgePrincipal = tx.objecte?.imatges?.[0]?.url;
  const image =
    cldTransform(imatgePrincipal, "card") || "/assets/product1-image.jpg";

  const busy = busyId === tx.id;

  // Etiqueta del "altre usuari" segons pestanya
  let otherLabel, otherUser;
  if (tab.role === "requester") {
    otherLabel = "Propietario";
    otherUser = tx.owner;
  } else if (tab.role === "owner") {
    otherLabel = "Solicitante";
    otherUser = tx.requester;
  } else {
    // Pestanya transactions: depèn de si soc owner o no
    if (tx.am_owner) {
      otherLabel = "Solicitante";
      otherUser = tx.requester;
    } else {
      otherLabel = "Propietario";
      otherUser = tx.owner;
    }
  }

  return (
    <article className="rounded-2xl border border-app-border bg-app-card overflow-hidden flex flex-col md:flex-row">
      <Link
        to={`/objects/${tx.objecte_id}`}
        className="md:w-48 h-40 md:h-auto shrink-0 bg-vecilend-dark-neutral"
      >
        <img
          src={image}
          alt={tx.objecte?.nom}
          className="w-full h-full object-cover"
        />
      </Link>

      <div className="flex-1 p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              to={`/objects/${tx.objecte_id}`}
              className="font-heading text-h3-mobile text-app-text hover:text-vecilend-dark-primary"
            >
              {tx.objecte?.nom}
            </Link>
            <p className="text-caption text-app-text-secondary mt-1">
              {otherLabel}:{" "}
              {otherUser ? (
                <Link
                  to={`/profile/${otherUser.username}`}
                  className="text-vecilend-dark-primary hover:underline"
                >
                  {otherUser.nom}
                </Link>
              ) : (
                "—"
              )}
            </p>
          </div>
          <StatusPill estat={cardStatus} />
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-1 text-caption text-app-text-secondary font-body">
          <span>
            <span className="material-symbols-outlined text-sm align-middle mr-1">
              calendar_month
            </span>
            {tx.data_inici} → {tx.data_fi} · {tx.dies} día
            {tx.dies === 1 ? "" : "s"}
          </span>
          {isLloguer && tx.preu_total != null && (
            <span className="text-vecilend-dark-primary font-bold">
              Total: {tx.preu_total.toFixed(2)}€
            </span>
          )}
          {!isLloguer && (
            <span className="text-vecilend-dark-secondary font-bold">
              Préstamo gratuito
            </span>
          )}
        </div>

        {tx.missatge && (
          <p className="text-caption text-app-text-secondary italic line-clamp-2">
            "{tx.missatge}"
          </p>
        )}

        {/* ── Accions ────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mt-1">
          {/* Solicitudes recibidas — pendent: Aceptar / Rechazar */}
          {tab.id === "requests_received" && tx.estat === "pendent" && (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={() => onAction("accept", tx.id)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 px-5 py-2 text-label font-bold text-white disabled:opacity-50"
              >
                Aceptar
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => onAction("reject", tx.id)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 px-5 py-2 text-label font-bold text-red-400 disabled:opacity-50"
              >
                Rechazar
              </button>
            </>
          )}

          {/* Solicitudes enviadas — pendent: Cancelar */}
          {tab.id === "requests_sent" &&
            tx.estat === "pendent" &&
            tx.can_cancel && (
              <button
                type="button"
                disabled={busy}
                onClick={() => onAction("cancel", tx.id)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 px-5 py-2 text-label font-bold text-red-400 disabled:opacity-50"
              >
                Cancelar solicitud
              </button>
            )}

          {/* Transaccions */}
          {tab.id === "transactions" && tx.transaccio?.estat === "en_curs" && (
            <>
              {/* Pagament (només requester de lloguer no pagat) */}
              {tx.can_pay && (
                <button
                  type="button"
                  onClick={() => navigate(`/transactions/${tx.id}/payment`)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-vecilend-dark-primary to-[#4fdbc8] px-5 py-2 text-label font-bold text-[#003730]"
                >
                  <span className="material-symbols-outlined text-base">
                    payments
                  </span>
                  Efectuar pago
                </button>
              )}
              {tx.paid && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-400 px-4 py-1.5 text-label font-bold border border-emerald-500/40">
                  <span className="material-symbols-outlined text-base">
                    check_circle
                  </span>
                  Pago realizado
                </span>
              )}

              {/* Confirmar recepción (només owner) */}
              {tx.am_owner && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onAction("return", tx.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-vecilend-dark-primary to-[#4fdbc8] px-5 py-2 text-label font-bold text-[#003730] disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base">
                    assignment_turned_in
                  </span>
                  Confirmar recepción del objeto
                </button>
              )}

              {/* Cancel·lar — disponible si encara no efectuada */}
              {tx.can_cancel ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onAction("cancel", tx.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 px-5 py-2 text-label font-bold text-red-400 disabled:opacity-50"
                >
                  Cancelar
                </button>
              ) : (
                <p className="w-full text-caption text-app-text-secondary italic mt-2">
                  Esta transacción ya está efectuada (pago realizado o dentro
                  del rango de fechas pactadas). Para cancelarla, contacta
                  directamente con el otro vecino.
                </p>
              )}
            </>
          )}

          {/* Valorar (transaccions finalitzades) */}
          {tab.id === "transactions" &&
            tx.transaccio?.estat === "finalitzat" && (
              <button
                type="button"
                onClick={() => onAction("review", tx.id, tx)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-vecilend-dark-primary to-[#4fdbc8] px-5 py-2 text-label font-bold text-[#003730]"
              >
                <span className="material-symbols-outlined text-base">
                  star
                </span>
                Valorar
              </button>
            )}
        </div>
      </div>
    </article>
  );
}

// ── Pàgina principal ─────────────────────────────────────────────────────────

function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { counts: badgeCounts, refresh: refreshBadges } = useUnreadCounts();

  // Tab activa: per defecte solicituds enviades
  const initialTabId = searchParams.get("tab") || "requests_sent";
  const initialTab = TABS.find((t) => t.id === initialTabId) || TABS[0];

  const [tab, setTab] = useState(initialTab);
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState(null);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [reviewModalTx, setReviewModalTx] = useState(null);

  const [cancelTarget, setCancelTarget] = useState(null); // { id, label }
  const [cancelBusy, setCancelBusy] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  const filters =
    tab.view === "transactions" ? TRANSACTION_FILTERS : REQUEST_FILTERS;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTransactions({
        view: tab.view,
        role: tab.role,
        status: status === "all" ? null : status,
        page: 1,
        per_page: 8,
      });
      // Marcatge "am_owner" per a la targeta
      const enriched = res.data.map((tx) => ({
        ...tx,
        am_owner: tx.owner_id === user?.id,
      }));
      setOrders(enriched);
      setMeta(res.meta);
      setCounts(res.counts || {});
    } catch (err) {
      console.error("Error cargando pedidos:", err);
      setError("No se han podido cargar los pedidos.");
      setOrders([]);
      setMeta(null);
      setCounts({});
    } finally {
      setLoading(false);
    }
  }, [tab, status, user?.id]);

  const handleLoadMore = useCallback(async () => {
    if (!meta || meta.current_page >= meta.last_page || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await getTransactions({
        view: tab.view,
        role: tab.role,
        status: status === "all" ? null : status,
        page: meta.current_page + 1,
        per_page: 8,
      });
      setOrders((prev) => [
        ...prev,
        ...res.data.map((tx) => ({
          ...tx,
          am_owner: tx.owner_id === user?.id,
        })),
      ]);
      setMeta(res.meta);
      setCounts(res.counts || counts);
    } catch (err) {
      console.error("Error cargando más pedidos:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [meta, loadingMore, tab, status, counts, user?.id]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: "/orders" } });
      return;
    }
    if (user) load();
  }, [user, authLoading, load, navigate]);

  // Sincronitzar URL
  useEffect(() => {
    const next = new URLSearchParams();
    next.set("tab", tab.id);
    if (status !== "all") next.set("status", status);
    setSearchParams(next, { replace: true });
  }, [tab, status, setSearchParams]);

  // Reset filtre status quan canviem de pestanya
  useEffect(() => {
    setStatus("all");
  }, [tab.id]);

  const handleAction = async (action, id, tx) => {
    if (action === "review") {
      setReviewModalTx(tx);
      return;
    }

    if (action === "cancel") {
      setCancelTarget({
        id,
        label: tx?.objecte?.nom ?? "este pedido",
      });
      setCancelError(null);
      return;
    }

    setBusyId(id);
    try {
      if (action === "accept") await acceptTransaction(id);
      else if (action === "reject") await rejectTransaction(id);
      else if (action === "return") await returnTransaction(id);
      await load();
      refreshBadges();
    } catch (err) {
      console.error(`Error en acción ${action}:`, err);
      alert(
        err.response?.data?.message ||
          "No se ha podido procesar la acción. Inténtalo de nuevo.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    setCancelBusy(true);
    setCancelError(null);
    try {
      await cancelTransaction(cancelTarget.id);
      setCancelTarget(null);
      await load();
      refreshBadges();
    } catch (err) {
      setCancelError(
        err?.response?.data?.message ||
          "No se ha podido cancelar. Inténtalo de nuevo.",
      );
    } finally {
      setCancelBusy(false);
    }
  };

  // Badges (bombolles vermelles) per pestanya
  const tabBadge = {
    requests_sent: badgeCounts.orders.requests_sent_pending,
    requests_received: badgeCounts.orders.requests_received_pending,
    transactions: badgeCounts.orders.transactions_payment_due,
  };

  return (
    <section className="mx-auto w-full max-w-[1100px] px-4 md:px-8 pt-6 pb-32">
      <BtnBack />

      <h1 className="font-heading text-h2-desktop text-app-text mt-6 mb-2">
        Mis pedidos
      </h1>
      <p className="text-app-text-secondary text-body-base mb-6">
        Gestiona las solicitudes que has enviado/recibido y las transacciones.
      </p>

      {/* Pestanyes */}
      <div className="flex gap-2 mb-4 border-b border-app-border overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t)}
            className={`relative px-4 py-3 font-body text-body-base font-semibold transition-colors whitespace-nowrap ${
              tab.id === t.id
                ? "text-vecilend-dark-primary"
                : "text-app-text-secondary hover:text-app-text"
            }`}
          >
            <span className="relative inline-flex items-center">
              {t.label}
              {tabBadge[t.id] > 0 && (
                <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full leading-none">
                  {tabBadge[t.id] > 99 ? "99+" : tabBadge[t.id]}
                </span>
              )}
            </span>
            {tab.id === t.id && (
              <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-vecilend-dark-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Filtres d'estat */}
      <div className="flex gap-2 flex-wrap mb-6">
        {filters.map((f) => {
          const n = counts[f.id];
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatus(f.id)}
              className={`px-4 py-2 rounded-full text-label font-body font-medium transition-all ${
                status === f.id
                  ? "bg-vecilend-dark-primary text-[#003730]"
                  : "bg-app-card border border-app-border text-app-text hover:border-vecilend-dark-primary"
              }`}
            >
              {f.label}
              {typeof n === "number" && (
                <span className="opacity-75 ml-1">({n})</span>
              )}
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="rounded-2xl bg-app-card border border-app-border p-8 text-center">
          <p className="text-app-text-secondary">Cargando…</p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-6 text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="rounded-2xl border border-app-border bg-app-card p-10 text-center">
          <span className="material-symbols-outlined text-6xl text-app-text-secondary opacity-50 mb-2">
            inbox
          </span>
          <p className="text-app-text-secondary">
            {tab.id === "requests_sent" &&
              "Aún no has enviado ninguna solicitud."}
            {tab.id === "requests_received" &&
              "No has recibido ninguna solicitud todavía."}
            {tab.id === "transactions" && "No tienes transacciones todavía."}
          </p>
          {tab.id === "requests_sent" && (
            <Link
              to="/objects"
              className="inline-block mt-4 rounded-full bg-vecilend-dark-primary px-6 py-2 text-label font-bold text-[#003730]"
            >
              Explorar objetos
            </Link>
          )}
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <>
          <div className="flex flex-col gap-4">
            {orders.map((tx) => (
              <OrderCard
                key={tx.id}
                tx={tx}
                tab={tab}
                onAction={handleAction}
                busyId={busyId}
              />
            ))}
          </div>

          {meta && meta.current_page < meta.last_page && (
            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="rounded-full bg-app-bg-card border border-app-border hover:border-vecilend-dark-primary px-8 py-3 text-body-base font-bold text-app-text disabled:opacity-50 transition-colors"
              >
                {loadingMore ? "Cargando…" : "Cargar más"}
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmDeleteModal
        open={!!cancelTarget}
        onClose={() => {
          if (!cancelBusy) setCancelTarget(null);
        }}
        onConfirm={confirmCancel}
        title="¿Cancelar este pedido?"
        message={`Vas a cancelar "${cancelTarget?.label ?? ""}".`}
        description="Esta acción no se puede deshacer. Si el otro vecino ya ha aceptado, ten en cuenta que perderás esta reserva."
        confirmLabel="Sí, cancelar"
        busy={cancelBusy}
        errorMessage={cancelError}
      />

      <ReviewModal
        open={!!reviewModalTx}
        transactionId={reviewModalTx?.id}
        otherUserName={
          reviewModalTx
            ? (reviewModalTx.am_owner
                ? reviewModalTx.requester?.nom
                : reviewModalTx.owner?.nom) || "el usuario"
            : ""
        }
        onClose={() => setReviewModalTx(null)}
        onSuccess={() => {
          setReviewModalTx(null);
          load();
        }}
      />
    </section>
  );
}

export default MyOrdersPage;
