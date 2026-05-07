import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await api.post("/forgot-password", { email });
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error al enviar el correo. Inténtalo de nuevo.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-app-bg text-app-text min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-app-text-secondary hover:text-[#4fdbc8] mb-6"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Volver al inicio de sesión
        </Link>

        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          ¿Olvidaste tu contraseña?
        </h1>

        {!success ? (
          <>
            <p className="text-[#859490] mb-6">
              Introduce tu email y te enviaremos un enlace para restablecerla.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-app-text-secondary">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-app-bg-card border border-app-border rounded-lg px-4 py-3 text-app-text focus:ring-2 focus:ring-[#4fdbc8] focus:border-transparent outline-none transition-all"
                  placeholder="tu@email.com"
                />
              </div>

              {error && (
                <div className="bg-[#93000a]/20 border border-[#93000a] text-[#ffb4ab] px-4 py-2 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#4fdbc8] text-[#003731] font-bold py-4 rounded-lg shadow-lg shadow-[#4fdbc8]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-[#14b8a6] active:scale-[0.97]"
              >
                {submitting ? "Enviando…" : "Enviar enlace de restablecimiento"}
              </button>
            </form>
          </>
        ) : (
          <div className="bg-app-bg-card border border-app-border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#4fdbc8] text-3xl">
                mark_email_read
              </span>
              <h2 className="text-xl font-bold">Email enviado</h2>
            </div>
            <p className="text-app-text-secondary">
              Si la dirección <strong className="text-app-text">{email}</strong>{" "}
              está registrada, recibirás un correo con instrucciones para
              restablecer tu contraseña.
            </p>
            <p className="text-sm text-[#859490]">
              Revisa también la carpeta de spam. El enlace caduca en 60 minutos.
            </p>
            <Link
              to="/login"
              className="inline-block mt-4 text-[#4fdbc8] font-bold hover:underline"
            >
              ← Volver al inicio de sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
