import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "vecilend_cookie_consent";

export function getCookieConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      necessary: true,
      analytics: !!parsed.analytics,
      personalization: !!parsed.personalization,
      version: parsed.version || 1,
      date: parsed.date,
    };
  } catch {
    return null;
  }
}

function saveConsent(consent) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...consent,
      version: 1,
      date: new Date().toISOString(),
    }),
  );
  window.dispatchEvent(new CustomEvent("vecilend:cookie-consent-changed"));
}

function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState({
    analytics: false,
    personalization: false,
  });

  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) setVisible(true);
  }, []);

  if (!visible) return null;

  const acceptAll = () => {
    saveConsent({ necessary: true, analytics: true, personalization: true });
    setVisible(false);
  };

  const rejectAll = () => {
    saveConsent({ necessary: true, analytics: false, personalization: false });
    setVisible(false);
  };

  const acceptSelection = () => {
    saveConsent({
      necessary: true,
      analytics: prefs.analytics,
      personalization: prefs.personalization,
    });
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-[9999] px-4 pb-4 md:px-6 md:pb-6"
    >
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-app-border bg-app-bg-card shadow-2xl">
        <div className="p-5 md:p-6">
          <div className="flex items-start gap-3 mb-3">
            <span className="material-symbols-outlined text-vecilend-dark-primary text-3xl shrink-0">
              cookie
            </span>
            <div className="min-w-0">
              <h2 className="text-h3-desktop font-heading text-app-text mb-1">
                Tu privacidad es importante
              </h2>
              <p className="text-label font-body text-app-text-secondary leading-relaxed">
                Usamos cookies y tecnologías similares para que el sitio
                funcione, recordar tus preferencias y, opcionalmente, medir el
                uso para mejorar el servicio. Puedes aceptar todas, rechazar
                las opcionales o personalizar tu elección. Consulta nuestra{" "}
                <Link
                  to="/privacy-policy"
                  className="text-vecilend-dark-primary hover:underline font-bold"
                >
                  política de privacidad
                </Link>
                .
              </p>
            </div>
          </div>

          {showDetails && (
            <div className="mt-4 space-y-3 border-t border-app-border pt-4">
              <label className="flex items-start gap-3 cursor-not-allowed opacity-90">
                <input aria-label="Cookies esenciales (siempre activas)"
                  type="checkbox"
                  checked
                  disabled
                  className="mt-1 h-4 w-4 accent-vecilend-dark-primary"
                />
                <div className="min-w-0">
                  <p className="text-label font-bold text-app-text">
                    Necesarias{" "}
                    <span className="text-caption text-app-text-secondary font-body">
                      (siempre activas)
                    </span>
                  </p>
                  <p className="text-caption font-body text-app-text-secondary">
                    Sesión, autenticación, preferencias básicas. Sin ellas el
                    sitio no funciona.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input aria-label="Cookies de personalización"
                  type="checkbox"
                  checked={prefs.personalization}
                  onChange={(e) =>
                    setPrefs((p) => ({
                      ...p,
                      personalization: e.target.checked,
                    }))
                  }
                  className="mt-1 h-4 w-4 accent-vecilend-dark-primary"
                />
                <div className="min-w-0">
                  <p className="text-label font-bold text-app-text">
                    Personalización
                  </p>
                  <p className="text-caption font-body text-app-text-secondary">
                    Recordar tema (claro/oscuro), ubicación reciente y
                    filtros.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input aria-label="Cookies analíticas"
                  type="checkbox"
                  checked={prefs.analytics}
                  onChange={(e) =>
                    setPrefs((p) => ({ ...p, analytics: e.target.checked }))
                  }
                  className="mt-1 h-4 w-4 accent-vecilend-dark-primary"
                />
                <div className="min-w-0">
                  <p className="text-label font-bold text-app-text">
                    Analíticas
                  </p>
                  <p className="text-caption font-body text-app-text-secondary">
                    Estadísticas anónimas de uso para mejorar la plataforma.
                  </p>
                </div>
              </label>
            </div>
          )}

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
            {!showDetails ? (
              <button
                type="button"
                onClick={() => setShowDetails(true)}
                className="px-4 py-2.5 text-label font-body text-app-text-secondary underline hover:text-app-text"
              >
                Personalizar
              </button>
            ) : (
              <button
                type="button"
                onClick={acceptSelection}
                className="px-4 py-2.5 text-label font-bold rounded-full border border-app-border text-app-text hover:bg-app-bg-card-secondary"
              >
                Guardar selección
              </button>
            )}
            <button
              type="button"
              onClick={rejectAll}
              className="px-4 py-2.5 text-label font-bold rounded-full border border-app-border text-app-text hover:bg-app-bg-card-secondary"
            >
              Rechazar
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="px-5 py-2.5 text-label font-bold rounded-full bg-gradient-to-br from-vecilend-dark-primary to-vecilend-dark-primary text-[var(--color-app-success-on)] hover:from-vecilend-dark-primary-hover hover:to-vecilend-dark-primary-hover"
            >
              Aceptar todas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookieBanner;
