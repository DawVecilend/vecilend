import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getTransactions,
  acceptTransaction,
  rejectTransaction,
  returnTransaction,
} from "../services/transactions";
import { isPaid } from "../utils/paymentMock";
import { cldTransform } from "../utils/cloudinary";
import BtnBack from "../components/elementos/BtnBack";
import ReviewModal from "../components/transactions/ReviewModal";

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
  finalitzat: {
    label: "Finalizada",
    classes: "bg-sky-500/15 text-sky-400 border-sky-500/40",
  },
};

const ROLE_TABS = [
  { id: "requester", label: "Solicitudes enviadas" },
  { id: "owner", label: "Solicitudes recibidas" },
];

const STATUS_FILTERS = [
  { id: "all", label: "Todas" },
  { id: "pendent", label: "Pendientes" },
  { id: "acceptat", label: "Aceptadas" },
  { id: "rebutjat", label: "Rechazadas" },
  { id: "finalitzat", label: "Finalizadas" },
];

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

function TransactionCard({ tx, role, onAction, busyId }) {
  const navigate = useNavigate();
  const otherUser = role === "requester" ? tx.owner : tx.requester;
  const image =
    cldTransform(tx.objecte?.imatges?.[0]?.url, "card") ||
    "/assets/product1-image.jpg";
  const isLloguer = tx.tipus === "lloguer";
  const paid = isPaid(tx.id);
  const busy = busyId === tx.id;

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
              {role === "requester" ? "Propietario" : "Solicitante"}:{" "}
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
          <StatusPill estat={tx.estat} />
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

        {/* ── Accions per rol/estat ── */}
        <div className="flex flex-wrap gap-2 mt-1 flex-col">
          {role === "requester" &&
            tx.estat === "acceptat" &&
            isLloguer &&
            !paid && (
              <button
                type="button"
                onClick={() => navigate(`/transactions/${tx.id}/payment`)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-vecilend-dark-primary to-[#4fdbc8] px-5 py-2 text-label font-bold text-[#003730] active:scale-95 max-w-max"
              >
                <span className="material-symbols-outlined text-base align-middle mr-1">
                  payments
                </span>
                Efectuar pago
              </button>
            )}
          {role === "requester" &&
            tx.estat === "acceptat" &&
            isLloguer &&
            paid && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-400 px-4 py-1.5 text-label font-bold border border-emerald-500/40 max-w-max">
                <span className="material-symbols-outlined text-base">
                  check_circle
                </span>
                Pago realizado
              </span>
            )}
          {role === "requester" && tx.estat === "acceptat" && (
            <span className="text-caption text-app-text-secondary italic mt-3 w-full">
              Coordina la recogida con el propietario.
            </span>
          )}
          {role === "requester" && tx.estat === "finalitzat" && (
            <button
              type="button"
              onClick={() => onAction("review", tx.id, tx)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-vecilend-dark-primary to-[#4fdbc8] px-5 py-2 text-label font-bold text-[#003730] active:scale-95 max-w-max"
            >
              <span className="material-symbols-outlined text-base align-middle mr-1">
                star
              </span>
              Valorar
            </button>
          )}
          {role === "owner" && tx.estat === "finalitzat" && (
            <button
              type="button"
              onClick={() => onAction("review", tx.id, tx)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-vecilend-dark-primary to-[#4fdbc8] px-5 py-2 text-label font-bold text-[#003730] active:scale-95 max-w-max"
            >
              <span className="material-symbols-outlined text-base align-middle mr-1">
                star
              </span>
              Valorar
            </button>
          )}
          {role === "owner" && tx.estat === "pendent" && (
            <div className="flex gap-2">
              {" "}
              {/* Contenedor flex para los botones Aceptar y Rechazar */}
              <button
                type="button"
                disabled={busy}
                onClick={() => onAction("accept", tx.id)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 px-5 py-2 text-label font-bold text-white active:scale-95 disabled:opacity-50 max-w-max"
              >
                Aceptar
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => onAction("reject", tx.id)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 px-5 py-2 text-label font-bold text-red-400 active:scale-95 disabled:opacity-50 max-w-max"
              >
                Rechazar
              </button>
            </div>
          )}
          {role === "owner" && tx.estat === "acceptat" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onAction("return", tx.id)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-vecilend-dark-primary to-[#4fdbc8] px-5 py-2 text-label font-bold text-[#003730] active:scale-95 disabled:opacity-50 max-w-max"
            >
              <span className="material-symbols-outlined text-base align-middle mr-1">
                assignment_turned_in
              </span>
              Registrar devolución
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function TransactionsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialRole =
    searchParams.get("role") === "owner" ? "owner" : "requester";
  const initialStatus = searchParams.get("status") || "all";

  const [role, setRole] = useState(initialRole);
  const [status, setStatus] = useState(initialStatus);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [reviewModalTx, setReviewModalTx] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTransactions({
        role,
        status: status === "all" ? null : status,
      });
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando transacciones:", err);
      setError("No se han podido cargar las transacciones.");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [role, status]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: "/transactions" } });
      return;
    }
    if (user) load();
  }, [user, authLoading, load, navigate]);

  // Mantenir l'URL sincronitzada amb els filtres
  useEffect(() => {
    const next = new URLSearchParams();
    next.set("role", role);
    if (status !== "all") next.set("status", status);
    setSearchParams(next, { replace: true });
  }, [role, status, setSearchParams]);

  const handleAction = async (action, id, tx) => {
    if (action === "review") {
      setReviewModalTx(tx);
      return;
    }
    setBusyId(id);
    try {
      if (action === "accept") await acceptTransaction(id);
      else if (action === "reject") await rejectTransaction(id);
      else if (action === "return") await returnTransaction(id);
      await load();
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

  const counts = useMemo(() => {
    const base = { all: transactions.length };
    for (const s of ["pendent", "acceptat", "rebutjat", "finalitzat"]) {
      base[s] = transactions.filter((t) => t.estat === s).length;
    }
    return base;
  }, [transactions]);

  return (
    <section className="mx-auto w-full max-w-[1100px] px-4 md:px-8 pt-6 pb-32">
      <BtnBack />

      <h1 className="font-heading text-h2-desktop text-app-text mt-6 mb-2">
        Mis transacciones
      </h1>
      <p className="text-app-text-secondary text-body-base mb-6">
        Gestiona las solicitudes que has enviado y las que has recibido.
      </p>

      {/* Tabs de rol */}
      <div className="flex gap-2 mb-4 border-b border-app-border">
        {ROLE_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setRole(t.id)}
            className={`relative px-4 py-3 font-body text-body-base font-semibold transition-colors ${
              role === t.id
                ? "text-vecilend-dark-primary"
                : "text-app-text-secondary hover:text-app-text"
            }`}
          >
            {t.label}
            {role === t.id && (
              <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-vecilend-dark-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Chips d'estat */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStatus(s.id)}
            className={`px-4 py-2 rounded-full text-label font-body font-medium transition-all ${
              status === s.id
                ? "bg-vecilend-dark-primary text-[#003730]"
                : "bg-app-card border border-app-border text-app-text hover:border-vecilend-dark-primary"
            }`}
          >
            {s.label}
            {s.id === "all" && counts.all != null && ` (${counts.all})`}
            {s.id !== "all" && counts[s.id] > 0 && ` (${counts[s.id]})`}
          </button>
        ))}
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

      {!loading && !error && transactions.length === 0 && (
        <div className="rounded-2xl border border-app-border bg-app-card p-10 text-center">
          <span className="material-symbols-outlined text-6xl text-app-text-secondary opacity-50 mb-2">
            inbox
          </span>
          <p className="text-app-text-secondary">
            {role === "requester"
              ? "Aún no has enviado ninguna solicitud."
              : "No has recibido ninguna solicitud todavía."}
          </p>
          {role === "requester" && (
            <Link
              to="/objects"
              className="inline-block mt-4 rounded-full bg-vecilend-dark-primary px-6 py-2 text-label font-bold text-[#003730]"
            >
              Explorar objetos
            </Link>
          )}
        </div>
      )}

      {!loading && !error && transactions.length > 0 && (
        <div className="flex flex-col gap-4">
          {transactions.map((tx) => (
            <TransactionCard
              key={tx.id}
              tx={tx}
              role={role}
              onAction={handleAction}
              busyId={busyId}
            />
          ))}
        </div>
      )}
      <ReviewModal
        open={!!reviewModalTx}
        transactionId={reviewModalTx?.id}
        otherUserName={
          reviewModalTx
            ? (role === "requester"
                ? reviewModalTx.owner?.nom
                : reviewModalTx.requester?.nom) || "el usuario"
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

export default TransactionsPage;
