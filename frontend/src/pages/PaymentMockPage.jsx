import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTransactions } from "../services/transactions";
import { useAuth } from "../contexts/AuthContext";
import { isPaid, markAsPaid } from "../utils/paymentMock";
import BtnBack from "../components/elementos/BtnBack";

function PaymentMockPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Camps simulats — no es validen ni s'envien enlloc
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvv: "" });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
    let cancelled = false;
    setLoading(true);
    getTransactions({ role: "requester" })
      .then((all) => {
        if (cancelled) return;
        const found = all.find((t) => String(t.id) === String(id));
        if (!found) {
          setError("Transacción no encontrada.");
        } else if (found.estat !== "acceptat") {
          setError("Solo se puede pagar una transacción aceptada.");
        } else if (found.tipus !== "lloguer") {
          setError(
            "Esta transacción no requiere pago (es un préstamo gratuito).",
          );
        } else if (isPaid(found.id)) {
          setError("Esta transacción ya estaba pagada.");
        } else {
          setTx(found);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Error cargando los datos.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, user, authLoading, navigate]);

  const handleConfirm = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulació: 1.5s d'espera, després marcar com pagat
    setTimeout(() => {
      markAsPaid(tx.id);
      setDone(true);
      setSubmitting(false);
      setTimeout(() => navigate("/transactions?role=requester"), 3000);
    }, 1500);
  };

  if (loading || authLoading) {
    return (
      <section className="max-w-md mx-auto px-4 pt-12 text-center">
        <p className="text-app-text-secondary">Cargando…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-md mx-auto px-4 pt-12">
        <BtnBack />
        <div className="mt-6 rounded-2xl border border-red-500/50 bg-red-500/10 p-6 text-red-400 text-center">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-md mx-auto px-4 pt-6 pb-32">
      <BtnBack />

      <div className="mt-6 rounded-2xl bg-app-card border border-app-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-vecilend-dark-primary text-3xl">
            verified_user
          </span>
          <div>
            <h1 className="font-heading text-h3-desktop text-app-text">
              Pasarela de pago
            </h1>
            <p className="text-caption text-app-text-secondary">
              Es una simulación, no se cobrará nada real
            </p>
          </div>
        </div>

        {/* Resum de la transacció */}
        <div className="rounded-xl bg-vecilend-dark-neutral border border-app-border p-4 mb-6">
          <p className="text-caption text-app-text-secondary mb-1">
            Vas a pagar
          </p>
          <p className="font-heading text-h2-desktop text-vecilend-dark-primary font-bold">
            {tx.preu_total?.toFixed(2)}€
          </p>
          <p className="text-label text-app-text-secondary mt-2">
            {tx.objecte?.nom} · {tx.dies} día{tx.dies === 1 ? "" : "s"}
          </p>
          <p className="text-caption text-app-text-secondary">
            {tx.data_inici} → {tx.data_fi}
          </p>
        </div>

        {done ? (
          <div className="text-center py-6">
            <span className="material-symbols-outlined text-emerald-400 text-6xl mb-3 inline-block">
              check_circle
            </span>
            <p className="text-h3-desktop text-emerald-400 font-bold mb-1">
              ¡Pago efectuado!
            </p>
            <p className="text-app-text-secondary text-label">
              Te redirigimos a tus transacciones…
            </p>
          </div>
        ) : (
          <form onSubmit={handleConfirm} className="flex flex-col gap-4">
            <label className="block">
              <span className="text-label text-app-text-secondary font-body">
                Número de tarjeta
              </span>
              <input
                required
                inputMode="numeric"
                placeholder="0000 0000 0000 0000"
                value={card.number}
                onChange={(e) => setCard({ ...card, number: e.target.value })}
                className="mt-1 w-full bg-vecilend-dark-neutral border border-app-border rounded-lg px-4 py-3 text-app-text focus:ring-2 focus:ring-vecilend-dark-primary outline-none"
              />
            </label>

            <label className="block">
              <span className="text-label text-app-text-secondary font-body">
                Titular
              </span>
              <input
                required
                placeholder="NOMBRE APELLIDOS"
                value={card.name}
                onChange={(e) =>
                  setCard({ ...card, name: e.target.value.toUpperCase() })
                }
                className="mt-1 w-full bg-vecilend-dark-neutral border border-app-border rounded-lg px-4 py-3 text-app-text focus:ring-2 focus:ring-vecilend-dark-primary outline-none"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-label text-app-text-secondary font-body">
                  Caducidad
                </span>
                <input
                  required
                  placeholder="MM/AA"
                  value={card.exp}
                  onChange={(e) => setCard({ ...card, exp: e.target.value })}
                  className="mt-1 w-full bg-vecilend-dark-neutral border border-app-border rounded-lg px-4 py-3 text-app-text focus:ring-2 focus:ring-vecilend-dark-primary outline-none"
                />
              </label>
              <label className="block">
                <span className="text-label text-app-text-secondary font-body">
                  CVV
                </span>
                <input
                  required
                  inputMode="numeric"
                  placeholder="123"
                  value={card.cvv}
                  onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                  className="mt-1 w-full bg-vecilend-dark-neutral border border-app-border rounded-lg px-4 py-3 text-app-text focus:ring-2 focus:ring-vecilend-dark-primary outline-none"
                />
              </label>
            </div>

            <p className="text-caption text-app-text-secondary mt-2">
              ⓘ Esto es una simulación. Puedes introducir cualquier dato ya que
              no se enviará a ningún sitio.
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 rounded-full bg-gradient-to-br from-vecilend-dark-primary to-[#4fdbc8] px-6 py-3 text-body-base font-bold text-[#003730] disabled:opacity-50 active:scale-95"
            >
              {submitting
                ? "Procesando…"
                : `Confirmar pago de ${tx.preu_total?.toFixed(2)}€`}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default PaymentMockPage;
