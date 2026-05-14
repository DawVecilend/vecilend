import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getTransactions,
  payTransaction,
} from "../../services/transactions";

import { useAuth } from "../../contexts/AuthContext";
import { useUnreadCounts } from "../../contexts/UnreadCountsContext";

import BtnBack from "../../components/elementos/BtnBack";

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

function validateCardNumber(value) {
  const digits = onlyDigits(value);

  if (digits.length === 0) return "El número de tarjeta es obligatorio.";
  if (digits.length !== 16) return "Debe tener exactamente 16 dígitos.";

  return null;
}

function validateName(value) {
  const v = value.trim();

  if (!v) return "El titular es obligatorio.";
  if (v.length < 3) return "El titular debe tener al menos 3 caracteres.";

  if (!/^[a-zA-ZÀ-ÿñÑ\s]+$/.test(v)) {
    return "Solo se permiten letras y espacios.";
  }

  return null;
}

function validateExp(value) {
  const digits = onlyDigits(value);

  if (digits.length === 0) return "La caducidad es obligatoria.";
  if (digits.length !== 4) return "Formato MM/AA.";

  const month = parseInt(digits.slice(0, 2), 10);
  const year = parseInt(digits.slice(2, 4), 10);

  if (month < 1 || month > 12) return "Mes inválido (01-12).";

  const now = new Date();
  const yearNow = now.getFullYear() % 100;
  const monthNow = now.getMonth() + 1;

  if (year < yearNow || (year === yearNow && month < monthNow)) {
    return "La tarjeta está caducada.";
  }

  return null;
}

function validateCvv(value) {
  const digits = onlyDigits(value);

  if (digits.length === 0) return "El CVV es obligatorio.";

  if (digits.length < 3 || digits.length > 4) {
    return "Debe tener 3 o 4 dígitos.";
  }

  return null;
}

function FieldError({ message }) {
  if (!message) return null;

  return (
    <p className="text-xs text-[#ffb4ab] mt-1 ml-1 font-body">{message}</p>
  );
}

function RedirectCountdown({ onCancel }) {
  const [remaining, setRemaining] = useState(10);

  useEffect(() => {
    if (remaining <= 0) return;

    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);

    return () => clearTimeout(t);
  }, [remaining]);

  return (
    <div className="mt-4 text-center">
      <p className="text-app-text-secondary text-label">
        Te redirigimos a tus pedidos en{" "}
        <span className="font-bold text-vecilend-dark-primary">
          {remaining}
        </span>{" "}
        segundo{remaining === 1 ? "" : "s"}…
      </p>

      <button
        type="button"
        onClick={onCancel}
        className="mt-3 text-app-primary font-bold hover:underline text-label"
      >
        ¿No se te redirige automáticamente? Vuelve aquí
      </button>
    </div>
  );
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

  const [card, setCard] = useState({
    number: "",
    name: "",
    exp: "",
    cvv: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

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
          if (found.paid) {
            setError("Esta transacción ya está pagada.");
          } else if (found.tipus !== "lloguer") {
            setError(
              "Esta transacción no requiere pago (es un préstamo gratuito).",
            );
          } else {
            setError("Esta transacción no puede pagarse en este momento.");
          }
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

  useEffect(() => {
    if (!done) return;

    const timer = setTimeout(() => {
      navigate("/orders?tab=transactions");
    }, 10000);

    return () => clearTimeout(timer);
  }, [done, navigate]);

  const runValidation = () => {
    const errs = {};

    const numErr = validateCardNumber(card.number);
    if (numErr) errs.number = numErr;

    const nameErr = validateName(card.name);
    if (nameErr) errs.name = nameErr;

    const expErr = validateExp(card.exp);
    if (expErr) errs.exp = expErr;

    const cvvErr = validateCvv(card.cvv);
    if (cvvErr) errs.cvv = cvvErr;

    return errs;
  };

  const handleConfirm = async (e) => {
    e.preventDefault();

    const errs = runValidation();

    setFieldErrors(errs);

    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);

    try {
      await new Promise((r) => setTimeout(r, 1200));

      await payTransaction(tx.id);

      setDone(true);
      refresh();
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
            {Number(tx.preu_total || 0).toFixed(2)}€
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

            <RedirectCountdown
              onCancel={() => navigate("/orders?tab=transactions")}
            />
          </div>
        ) : (
          <form
            onSubmit={handleConfirm}
            className="flex flex-col gap-4"
            noValidate
          >
            <div>
              <label className="block">
                <span className="text-label text-app-text-secondary font-body">
                  Número de tarjeta
                </span>

                <input
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="0000 0000 0000 0000"
                  value={card.number}
                  maxLength={19}
                  onChange={(e) => {
                    setCard({
                      ...card,
                      number: formatCardNumber(e.target.value),
                    });

                    setFieldErrors((prev) => ({
                      ...prev,
                      number: undefined,
                    }));
                  }}
                  onBlur={() =>
                    setFieldErrors((prev) => ({
                      ...prev,
                      number: validateCardNumber(card.number),
                    }))
                  }
                  className="mt-1 w-full bg-vecilend-dark-neutral border border-app-border rounded-lg px-4 py-3 text-app-text font-mono tracking-wider focus:ring-2 focus:ring-vecilend-dark-primary outline-none"
                />
              </label>

              <FieldError message={fieldErrors.number} />
            </div>

            <div>
              <label className="block">
                <span className="text-label text-app-text-secondary font-body">
                  Titular
                </span>

                <input
                  autoComplete="cc-name"
                  placeholder="NOMBRE APELLIDOS"
                  value={card.name}
                  maxLength={50}
                  onChange={(e) => {
                    setCard({
                      ...card,
                      name: e.target.value
                        .replace(/[^a-zA-ZÀ-ÿñÑ ]/g, "")
                        .toUpperCase(),
                    });

                    setFieldErrors((prev) => ({
                      ...prev,
                      name: undefined,
                    }));
                  }}
                  onBlur={() =>
                    setFieldErrors((prev) => ({
                      ...prev,
                      name: validateName(card.name),
                    }))
                  }
                  className="mt-1 w-full bg-vecilend-dark-neutral border border-app-border rounded-lg px-4 py-3 text-app-text focus:ring-2 focus:ring-vecilend-dark-primary outline-none"
                />
              </label>

              <FieldError message={fieldErrors.name} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block">
                  <span className="text-label text-app-text-secondary font-body">
                    Caducidad
                  </span>

                  <input
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/AA"
                    value={card.exp}
                    maxLength={5}
                    onChange={(e) => {
                      setCard({
                        ...card,
                        exp: formatExp(e.target.value),
                      });

                      setFieldErrors((prev) => ({
                        ...prev,
                        exp: undefined,
                      }));
                    }}
                    onBlur={() =>
                      setFieldErrors((prev) => ({
                        ...prev,
                        exp: validateExp(card.exp),
                      }))
                    }
                    className="mt-1 w-full bg-vecilend-dark-neutral border border-app-border rounded-lg px-4 py-3 text-app-text font-mono tracking-wider focus:ring-2 focus:ring-vecilend-dark-primary outline-none"
                  />
                </label>

                <FieldError message={fieldErrors.exp} />
              </div>

              <div>
                <label className="block">
                  <span className="text-label text-app-text-secondary font-body">
                    CVV
                  </span>

                  <input
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    value={card.cvv}
                    maxLength={4}
                    onChange={(e) => {
                      setCard({
                        ...card,
                        cvv: onlyDigits(e.target.value).slice(0, 4),
                      });

                      setFieldErrors((prev) => ({
                        ...prev,
                        cvv: undefined,
                      }));
                    }}
                    onBlur={() =>
                      setFieldErrors((prev) => ({
                        ...prev,
                        cvv: validateCvv(card.cvv),
                      }))
                    }
                    className="mt-1 w-full bg-vecilend-dark-neutral border border-app-border rounded-lg px-4 py-3 text-app-text font-mono tracking-wider focus:ring-2 focus:ring-vecilend-dark-primary outline-none"
                  />
                </label>

                <FieldError message={fieldErrors.cvv} />
              </div>
            </div>

            <p className="text-caption text-app-text-secondary mt-2">
              ⓘ Esto es una simulación. Puedes introducir cualquier dato siempre
              que cumpla el formato — no se enviará a ningún sitio.
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 rounded-full bg-gradient-to-br from-vecilend-dark-primary to-[#4fdbc8] px-6 py-3 text-body-base font-bold text-[#003730] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {submitting
                ? "Procesando…"
                : `Confirmar pago de ${Number(tx.preu_total || 0).toFixed(2)}€`}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default PaymentMockPage;