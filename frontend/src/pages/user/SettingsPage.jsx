import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import SettingsNav from "../../components/layouts/SettingsNav";

function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="bg-app-bg text-app-text antialiased font-inter min-h-[calc(100vh-80px)]">
      <div className="mx-auto w-full max-w-[1380px] px-4 md:px-8 py-6">
        <div className="flex items-start gap-0 md:gap-6">
          <SettingsNav username={user?.username} current="home" />

          <main className="flex-1 min-w-0 p-2 md:p-6">
            <header className="mb-8">
              <h1 className="text-3xl md:text-5xl font-extrabold text-app-text mb-2 tracking-tight">
                Hola,{" "}
                <span className="text-[#4fdbc8]">{user?.nom || "Usuario"}</span>
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
                className="bg-[#2f3634]/40 backdrop-blur-md border border-[#859490]/10 group p-8 rounded-xl flex flex-col justify-between hover:border-[#4fdbc8]/40 transition-all duration-300 cursor-pointer active:scale-[0.98]"
              >
                <div>
                  <div className="w-14 h-14 bg-[#4fdbc8]/10 text-[#4fdbc8] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
                <div className="flex items-center text-[#4fdbc8] font-semibold text-sm group-hover:gap-2 transition-all">
                  <span>Gestionar información</span>
                  <span className="material-symbols-outlined text-sm ml-1">
                    arrow_forward
                  </span>
                </div>
              </Link>

              <Link
                to={`/settings/profile/${user?.username}/security`}
                className="bg-[#2f3634]/40 backdrop-blur-md border border-[#859490]/10 group p-8 rounded-xl flex flex-col justify-between hover:border-[#4fdbc8]/40 transition-all duration-300 cursor-pointer active:scale-[0.98]"
              >
                <div>
                  <div className="w-14 h-14 bg-[#f38764]/20 text-[#f38764] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
                <div className="flex items-center text-[#4fdbc8] font-semibold text-sm group-hover:gap-2 transition-all">
                  <span>Reforzar seguridad</span>
                  <span className="material-symbols-outlined text-sm ml-1">
                    arrow_forward
                  </span>
                </div>
              </Link>

              <div className="bg-[#2f3634]/40 backdrop-blur-md border border-[#859490]/10 p-8 rounded-xl flex flex-col justify-between md:col-span-2 lg:col-span-1">
                <div>
                  <div className="w-14 h-14 bg-[#a0d0c6]/20 text-[#a0d0c6] rounded-xl flex items-center justify-center mb-6">
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
                    Personaliza la apariencia de la aplicación y revisa nuestras
                    políticas de tratamiento de datos.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-app-bg-card rounded-lg border border-app-border/20">
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
                      className="relative inline-flex items-center cursor-pointer shrink-0 w-11 h-6"
                    >
                      <span
                        className={`absolute inset-0 w-11 h-6 rounded-full transition-colors ${
                          isDark
                            ? "bg-[#4fdbc8]"
                            : "bg-app-bg border border-app-border"
                        }`}
                      />
                      <span
                        className={`absolute top-[2px] left-[2px] bg-[#bbcac6] border border-gray-300 rounded-full h-5 w-5 transition-transform ${
                          isDark ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <Link
                    to="/politica-de-privacidad"
                    className="flex items-center justify-between p-4 bg-app-bg-card rounded-lg border border-app-border/20 hover:border-[#4fdbc8]/40 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-app-text-secondary">
                        privacy_tip
                      </span>
                      <span className="text-sm font-bold text-app-text">
                        Políticas de privacidad
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-app-text-secondary text-base group-hover:text-[#4fdbc8] transition-colors">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
