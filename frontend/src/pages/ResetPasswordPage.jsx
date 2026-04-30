import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== passwordConfirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No se ha podido restablecer la contraseña.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="bg-[#0e1513] text-[#dde4e1] min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">Enlace inválido</h1>
          <p className="text-[#bbcac6] mb-6">
            Este enlace de recuperación no es válido o ha caducado.
          </p>
          <Link
            to="/forgot-password"
            className="text-[#4fdbc8] font-bold hover:underline"
          >
            Solicitar uno nuevo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0e1513] text-[#dde4e1] min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          Crear contraseña nueva
        </h1>
        <p className="text-[#859490] mb-6">
          Para la cuenta <strong className="text-[#dde4e1]">{email}</strong>
        </p>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#bbcac6]">
                Nueva contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-3 text-[#dde4e1] focus:ring-2 focus:ring-[#4fdbc8] focus:border-transparent outline-none"
                placeholder="••••••••"
              />
              <p className="text-xs text-[#859490]">Al menos 8 caracteres.</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#bbcac6]">
                Confirmar contraseña
              </label>
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-3 text-[#dde4e1] focus:ring-2 focus:ring-[#4fdbc8] focus:border-transparent outline-none"
                placeholder="••••••••"
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
              className="w-full bg-[#4fdbc8] text-[#003731] font-bold py-4 rounded-lg shadow-lg transition-all disabled:opacity-70 hover:bg-[#14b8a6] active:scale-[0.97]"
            >
              {submitting ? "Guardando…" : "Cambiar contraseña"}
            </button>
          </form>
        ) : (
          <div className="bg-[#161d1b] border border-[#3c4947] rounded-lg p-6 text-center">
            <span className="material-symbols-outlined text-[#4fdbc8] text-5xl mb-2">
              check_circle
            </span>
            <h2 className="text-xl font-bold mb-2">¡Contraseña actualizada!</h2>
            <p className="text-[#bbcac6]">
              Te redirigimos al inicio de sesión…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
