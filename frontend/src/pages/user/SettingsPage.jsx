import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import SettingsNav from "../../components/layouts/SettingsNav";
import BtnBack from "../../components/elementos/BtnBack";

function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="bg-app-bg text-app-text antialiased font-inter min-h-[calc(100vh-80px)]">
      <div className="mx-auto w-full max-w-[1380px] px-4 md:px-8 py-3 md:py-6">
        <BtnBack />
        <div className="flex flex-col md:flex-row md:items-stretch gap-0 md:gap-6 md:min-h-[calc(100vh-80px-48px)] mt-4 md:mt-0">
          <SettingsNav username={user?.username} current="home" />

          <section className="flex-1 min-w-0 p-0 md:p-6">
            <header className="mb-8">
              <h1 className="text-3xl md:text-5xl font-extrabold text-app-text mb-2 tracking-tight">
                Hola,{" "}
                <span className="text-vecilend-dark-primary">{user?.nom || "Usuario"}</span>
              </h1>
              <p className="text-app-text-secondary text-base md:text-lg max-w-2xl leading-relaxed">
                Gestiona tu experiencia en Vecilend. Aquí puedes controlar tu
                información personal, la seguridad de tu cuenta y tus
                preferencias de visualización.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to={`/settings/profile/${user?.username}/editing`}
                className="bg-app-bg-card-secondary/40 backdrop-blur-md border border-app-border group p-8 rounded-xl flex flex-col justify-between hover:border-vecilend-dark-primary/40 transition-all duration-300 cursor-pointer active:scale-[0.98]"
              >
                <div>
                  <div className="w-14 h-14 bg-vecilend-dark-primary/10 text-vecilend-dark-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span
                      className="material-symbols-outlined text-3xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      person
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-app-text mb-3">
                    Información personal
                  </h3>
                  <p className="text-app-text-secondary text-sm leading-relaxed mb-6">
                    Gestiona tus datos personales y la apariencia de tu perfil
                    público en la comunidad de Vecilend.
                  </p>
                </div>
                <div className="flex items-center text-vecilend-dark-primary font-semibold text-sm group-hover:gap-2 transition-all">
                  <span>Gestionar información</span>
                  <span className="material-symbols-outlined text-sm ml-1">
                    arrow_forward
                  </span>
                </div>
              </Link>

              <Link
                to={`/settings/profile/${user?.username}/security`}
                className="bg-app-bg-card-secondary/40 backdrop-blur-md border border-app-border group p-8 rounded-xl flex flex-col justify-between hover:border-vecilend-dark-primary/40 transition-all duration-300 cursor-pointer active:scale-[0.98]"
              >
                <div>
                  <div className="w-14 h-14 bg-[var(--color-app-warning)]/20 text-[var(--color-app-warning)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span
                      className="material-symbols-outlined text-3xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      security
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-app-text mb-3">
                    Seguridad
                  </h3>
                  <p className="text-app-text-secondary text-sm leading-relaxed mb-6">
                    Mantén tu cuenta protegida cambiando tu contraseña
                    periódicamente y gestionando los métodos de verificación y
                    acceso.
                  </p>
                </div>
                <div className="flex items-center text-vecilend-dark-primary font-semibold text-sm group-hover:gap-2 transition-all">
                  <span>Reforzar seguridad</span>
                  <span className="material-symbols-outlined text-sm ml-1">
                    arrow_forward
                  </span>
                </div>
              </Link>

              <div className="bg-app-bg-card-secondary/40 backdrop-blur-md border border-app-border p-8 rounded-xl flex flex-col justify-between md:col-span-2 lg:col-span-1">
                <div>
                  <div className="w-14 h-14 bg-vecilend-dark-primary/10 text-vecilend-dark-primary rounded-xl flex items-center justify-center mb-6">
                    <span
                      className="material-symbols-outlined text-3xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      widgets
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-app-text mb-3">
                    Preferencias
                  </h3>
                  <p className="text-app-text-secondary text-sm leading-relaxed mb-6">
                    Personaliza la apariencia de la aplicación y revisa nuestra
                    política de tratamiento de datos.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-app-bg-card rounded-lg border border-app-border">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="material-symbols-outlined text-app-text-secondary shrink-0">
                        {isDark ? "dark_mode" : "light_mode"}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-app-text">
                          Modo {isDark ? "oscuro" : "claro"}
                        </span>
                        <span className="text-xs text-app-text-secondary">
                          Cambia la apariencia
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={toggleTheme}
                      aria-label={
                        isDark ? "Activar modo claro" : "Activar modo oscuro"
                      }
                      className="relative inline-flex items-center cursor-pointer shrink-0 w-11 h-6 self-start sm:self-auto"
                    >
                      <span
                        className={`absolute inset-0 w-11 h-6 rounded-full transition-colors ${
                          isDark
                            ? "bg-vecilend-dark-primary"
                            : "bg-app-bg border border-app-border"
                        }`}
                      />
                      <span
                        className={`absolute top-[2px] left-[2px] bg-white border border-app-border rounded-full h-5 w-5 transition-transform ${
                          isDark ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <Link
                    to="/privacy-policy"
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 bg-app-bg-card rounded-lg border border-app-border hover:border-vecilend-dark-primary/40 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="material-symbols-outlined text-app-text-secondary shrink-0">
                        privacy_tip
                      </span>
                      <span className="text-sm font-bold text-app-text">
                        Política de privacidad
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-app-text-secondary text-base group-hover:text-vecilend-dark-primary transition-colors self-end sm:self-auto">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
