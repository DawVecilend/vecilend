import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

const ERROR_MESSAGES = {
  oauth_failed: "No se ha podido completar el inicio de sesión con Google.",
  no_email: "Google no ha devuelto un email asociado a tu cuenta.",
  provisioning_failed:
    "Ha habido un problema al crear tu cuenta. Inténtalo de nuevo.",
  account_disabled: "Tu cuenta está desactivada. Contacta con soporte técnico.",
  access_denied: "Has cancelado el inicio de sesión con Google.",
  invalid_code:
    "El enlace de inicio de sesión ha caducado. Inténtalo de nuevo.",
};

function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getUser } = useAuth();
  const [error, setError] = useState(null);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;

    const code = searchParams.get("code");
    const errorCode = searchParams.get("error");

    if (errorCode) {
      handled.current = true;
      setError(
        ERROR_MESSAGES[errorCode] || "Error al iniciar sesión con Google.",
      );
      window.setTimeout(() => navigate("/login", { replace: true }), 3500);
      return;
    }

    if (!code) {
      handled.current = true;
      setError("No se ha recibido el código de autenticación.");
      window.setTimeout(() => navigate("/login", { replace: true }), 3500);
      return;
    }

    handled.current = true;

    api
      .post("/auth/google/exchange", { code }, { skipAuthRedirect: true })
      .then((response) => {
        const data = response?.data?.data || {};
        if (data.requires_2fa) {
          navigate("/login", {
            replace: true,
            state: { twoFactorToken: data.two_factor_token },
          });
          return;
        }
        const token = data.token;
        if (!token) {
          throw new Error("missing_token");
        }
        localStorage.setItem("auth_token", token);
        return getUser().then(() => navigate("/", { replace: true }));
      })
      .catch(() => {
        localStorage.removeItem("auth_token");
        setError(ERROR_MESSAGES.invalid_code);
        window.setTimeout(() => navigate("/login", { replace: true }), 3500);
      });
  }, [searchParams, navigate, getUser]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {error ? (
          <>
            <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-app-danger)]/20">
              <span className="material-symbols-outlined text-[var(--color-app-danger)] text-3xl">
                error
              </span>
            </div>
            <h1 className="text-2xl font-bold text-app-text mb-2">
              No se ha podido iniciar sesión
            </h1>
            <p className="text-app-text-secondary">{error}</p>
            <p className="text-sm text-app-text-secondary mt-4">
              Te llevamos de vuelta al inicio de sesión...
            </p>
          </>
        ) : (
          <>
            <div className="mb-4 inline-block animate-spin rounded-full h-12 w-12 border-4 border-app-border border-t-app-primary" />
            <h1 className="text-2xl font-bold text-app-text mb-2">
              Iniciando sesión con Google
            </h1>
            <p className="text-app-text-secondary">
              Estamos preparando tu cuenta, un momento...
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default GoogleCallbackPage;
