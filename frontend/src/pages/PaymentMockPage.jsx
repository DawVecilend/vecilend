import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTransactions, payTransaction } from "../services/transactions";
import { useAuth } from "../contexts/AuthContext";
import { useUnreadCounts } from "../contexts/UnreadCountsContext";
import BtnBack from "../components/elementos/BtnBack";

const onlyDigits = (s) => s.replace(/\D/g, "");

function formatCardNumber(raw) {
  const digits = onlyDigits(raw).slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExp(raw) {
  const digits = onlyDigits(raw).slice(0, 4);
  if (digits.length < 3) return digits;
  return digits.slice(0, 2) + "/" + digits.slice(2);
}

function isCardComplete(card) {
  const numDigits = onlyDigits(card.number);
  const expDigits = onlyDigits(card.exp);
  const cvvDigits = onlyDigits(card.cvv);
  if (numDigits.length !== 16) return false;
  if (expDigits.length !== 4) return false;
  const month = parseInt(expDigits.slice(0, 2), 10);
  if (month < 1 || month > 12) return false;
  if (cvvDigits.length < 3 || cvvDigits.length > 4) return false;
  if (!card.name?.trim()) return false;
  return true;
}

function PaymentMockPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { refresh } = useUnreadCounts();

  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [card, setCard] = useState({ number: "", name: "", exp: "", cvv: "" });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
    let cancelled = false;
    setLoading(true);
    getTransactions({ view: "transactions" })
      .then(({ data }) => {
        if (cancelled) return;
        const found = data.find((t) => String(t.id) === String(id));
        if (!found) {
          setError("Transacción no encontrada.");
        } else if (!found.can_pay) {
          if (found.paid) setError("Esta transacción ya está pagada.");
          else if (found.tipus !== "lloguer")
            setError(
              "Esta transacción no requiere pago (es un préstamo gratuito).",
            );
          else setError("Esta transacción no puede pagarse en este momento.");
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

  const handleConfirm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      await payTransaction(tx.id);
      setDone(true);
      refresh();
      setTimeout(() => navigate("/orders?tab=transactions"), 2500);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "No se ha podido procesar el pago.",
      );
    } finally {
      setSubmitting(false);
    }
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
              Te redirigimos a tus pedidos…
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
                autoComplete="cc-number"
                placeholder="0000 0000 0000 0000"
                value={card.number}
                maxLength={19}
                onChange={(e) =>
                  setCard({ ...card, number: formatCardNumber(e.target.value) })
                }
                className="mt-1 w-full bg-vecilend-dark-neutral border border-app-border rounded-lg px-4 py-3 text-app-text font-mono tracking-wider focus:ring-2 focus:ring-vecilend-dark-primary outline-none"
              />
            </label>

            <label className="block">
              <span className="text-label text-app-text-secondary font-body">
                Titular
              </span>
              <input
                required
                autoComplete="cc-name"
                placeholder="NOMBRE APELLIDOS"
                value={card.name}
                maxLength={50}
                onChange={(e) =>
                  setCard({
                    ...card,
                    name: e.target.value
                      .replace(/[^a-zA-ZÀ-ÿñÑ ]/g, "")
                      .toUpperCase(),
                  })
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
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/AA"
                  value={card.exp}
                  maxLength={5}
                  onChange={(e) =>
                    setCard({ ...card, exp: formatExp(e.target.value) })
                  }
                  className="mt-1 w-full bg-vecilend-dark-neutral border border-app-border rounded-lg px-4 py-3 text-app-text font-mono tracking-wider focus:ring-2 focus:ring-vecilend-dark-primary outline-none"
                />
              </label>
              <label className="block">
                <span className="text-label text-app-text-secondary font-body">
                  CVV
                </span>
                <input
                  required
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  value={card.cvv}
                  maxLength={4}
                  onChange={(e) =>
                    setCard({
                      ...card,
                      cvv: onlyDigits(e.target.value).slice(0, 4),
                    })
                  }
                  className="mt-1 w-full bg-vecilend-dark-neutral border border-app-border rounded-lg px-4 py-3 text-app-text font-mono tracking-wider focus:ring-2 focus:ring-vecilend-dark-primary outline-none"
                />
              </label>
            </div>

            <p className="text-caption text-app-text-secondary mt-2">
              ⓘ Esto es una simulación. Puedes introducir cualquier dato siempre
              que cumpla el formato — no se enviará a ningún sitio.
            </p>

            <button
              type="submit"
              disabled={submitting || !isCardComplete(card)}
              className="w-full mt-2 rounded-full bg-gradient-to-br from-vecilend-dark-primary to-[#4fdbc8] px-6 py-3 text-body-base font-bold text-[#003730] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
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
