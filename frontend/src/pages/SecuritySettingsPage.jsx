import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { updatePassword } from "../services/profile";

function SecuritySettingsPage() {
  const { user } = useContext(AuthContext);

  const [passwords, setPasswords] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  // Cambiamos la forma de guardar los mensajes
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswords((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (
      !passwords.current_password ||
      !passwords.password ||
      !passwords.password_confirmation
    ) {
      setErrorMessage("Por favor, rellena todos los campos.");
      return;
    }

    if (passwords.password !== passwords.password_confirmation) {
      setErrorMessage("Las contraseñas nuevas no coinciden.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await updatePassword(user?.username, passwords);

      setSuccessMessage(
        response.message || "Contraseña actualizada correctamente.",
      );
      setPasswords({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
    } catch (error) {
      if (error.response?.status === 422) {
        const firstError = Object.values(error.response.data.errors).flat()[0];
        setErrorMessage(firstError);
      } else {
        setErrorMessage("Error al conectar con el servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0e1513] text-[#dde4e1] antialiased flex flex-col dark font-inter">
      <div className="flex min-h-[calc(100vh-80px)]">
        <aside className="hidden md:flex flex-col p-4 bg-[#090f0e] w-64 border-r border-[#3c4947] transition-all duration-150 text-sm z-40">
          <div className="mb-8 px-2">
            <h2 className="text-[#4fdbc8] font-bold text-lg">Configuración</h2>
            <p className="text-[#859490] text-xs">Gestiona tu cuenta</p>
          </div>
          <nav className="space-y-1">
            <Link
              to={`/settings/profile/${user?.username}`}
              className="flex items-center gap-3 px-3 py-3 text-[#859490] hover:bg-[#161d1b] hover:text-[#dde4e1] transition-all duration-150"
            >
              <span className="material-symbols-outlined">home</span>
              <span>Página principal</span>
            </Link>
            <Link
              to={`/settings/profile/${user?.username}/editing`}
              className="flex items-center gap-3 px-3 py-3 text-[#859490] hover:bg-[#161d1b] hover:text-[#dde4e1] transition-all duration-150"
            >
              <span className="material-symbols-outlined">person</span>
              <span>Perfil</span>
            </Link>
            <Link
              to={`/settings/profile/${user?.username}/security`}
              className="flex items-center gap-3 px-3 py-3 bg-[#4fdbc8]/10 text-[#4fdbc8] font-semibold border-r-4 border-[#4fdbc8] transition-all duration-150"
            >
              <span className="material-symbols-outlined">security</span>
              <span>Seguridad</span>
            </Link>
            <Link
              to={`/settings/profile/${user?.username}/notifications`}
              className="flex items-center gap-3 px-3 py-3 text-[#859490] hover:bg-[#161d1b] hover:text-[#dde4e1] transition-all duration-150"
            >
              <span className="material-symbols-outlined">privacy</span>
              <span>Privacidad</span>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6 md:px-12 lg:px-16 max-w-7xl mx-auto bg-[#0e1513] flex flex-col justify-center">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#dde4e1] mb-2 tracking-tight">
              Seguridad de la <span className="text-[#4fdbc8]">Cuenta</span>
            </h1>
            <p className="text-[#bbcac6] text-lg max-w-2xl leading-relaxed">
              Administra tus credenciales de acceso y protege tu información
              personal.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Tarjeta: Cambiar Contraseña */}
            <section className="lg:col-span-7 bg-[#2f3634]/40 backdrop-blur-md rounded-xl p-8 border border-[#3c4947]/20 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-[#4fdbc8]">
                  lock
                </span>
                <h2 className="text-xl font-bold">Cambiar Contraseña</h2>
              </div>

              {/* Nuevos mensajes de éxito y error integrados */}
              {successMessage && (
                <div className="mb-6 bg-[#4fdbc8]/10 border border-[#4fdbc8]/50 text-[#4fdbc8] px-4 py-3 rounded-lg flex items-center gap-2 animate-pulse">
                  <span className="material-symbols-outlined text-base">
                    check_circle
                  </span>
                  <p className="font-semibold text-xs tracking-wide uppercase">
                    {successMessage}
                  </p>
                </div>
              )}
              {errorMessage && (
                <div className="mb-6 bg-[#ef4444]/10 border border-[#ef4444]/50 text-[#ef4444] px-4 py-3 rounded-lg flex items-center gap-2 animate-pulse">
                  <span className="material-symbols-outlined text-base">
                    error
                  </span>
                  <p className="font-semibold text-xs tracking-wide uppercase">
                    {errorMessage}
                  </p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handlePasswordSubmit}>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#bbcac6] uppercase tracking-widest ml-1">
                    Contraseña Actual
                  </label>
                  <input
                    name="current_password"
                    value={passwords.current_password}
                    onChange={handlePasswordChange}
                    className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#4fdbc8] focus:border-transparent transition-all outline-none text-[#dde4e1]"
                    placeholder="••••••••••••"
                    type="password"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#bbcac6] uppercase tracking-widest ml-1">
                      Nueva Contraseña
                    </label>
                    <input
                      name="password"
                      value={passwords.password}
                      onChange={handlePasswordChange}
                      className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#4fdbc8] focus:border-transparent transition-all outline-none text-[#dde4e1]"
                      type="password"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#bbcac6] uppercase tracking-widest ml-1">
                      Confirmar Contraseña
                    </label>
                    <input
                      name="password_confirmation"
                      value={passwords.password_confirmation}
                      onChange={handlePasswordChange}
                      className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#4fdbc8] focus:border-transparent transition-all outline-none text-[#dde4e1]"
                      type="password"
                    />
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    disabled={isLoading}
                    className={`bg-[#4fdbc8] text-[#003731] px-10 py-3 rounded-lg font-bold shadow-lg transition-all ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#14b8a6] active:scale-95"}`}
                    type="submit"
                  >
                    {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
                  </button>
                </div>
              </form>
            </section>

            {/* Tarjeta: Autenticación 2FA */}
            <section className="lg:col-span-5 bg-[#2f3634]/40 backdrop-blur-md rounded-xl p-8 border border-[#3c4947]/20 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#ffb59e]">
                      verified_user
                    </span>
                    <h2 className="text-xl font-bold">Autenticación 2FA</h2>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      defaultChecked
                      className="sr-only peer"
                      type="checkbox"
                    />
                    <div className="w-11 h-6 bg-[#161d1b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#161d1b] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#bbcac6] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4fdbc8]"></div>
                  </label>
                </div>
                <p className="text-sm text-[#bbcac6] mb-6 leading-relaxed">
                  Añade una capa extra de seguridad a tu cuenta usando una
                  aplicación de autenticación.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-[#161d1b] rounded-lg border border-[#3c4947]/20">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#bbcac6]">
                      smartphone
                    </span>
                    <span className="text-sm font-bold text-[#dde4e1]">
                      Authenticator App
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-[#14b8a6]/20 text-[#4fdbc8] px-2 py-0.5 rounded">
                    Activo
                  </span>
                </div>
                <button className="w-full py-3 border border-[#4fdbc8]/50 text-[#4fdbc8] rounded-lg text-sm font-bold hover:bg-[#4fdbc8]/10 transition-colors mt-2">
                  Configurar métodos alternativos
                </button>
              </div>
            </section>

            {/* Tarjeta: Zona de Peligro (Larga, ocupa 12 columnas) */}
            <section className="lg:col-span-12 bg-[#93000a]/10 border border-[#ffb4ab]/20 rounded-xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-lg font-bold text-[#ffb4ab] mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    warning
                  </span>
                  Zona de Peligro
                </h2>
                <p className="text-[13px] text-[#bbcac6]">
                  Una vez que elimines tu cuenta, no hay vuelta atrás. Por
                  favor, asegúrate de que esto es lo que quieres hacer.
                </p>
              </div>
              <button className="whitespace-nowrap w-full md:w-auto px-8 py-3 rounded-lg border border-[#ffb4ab] text-[#ffb4ab] font-bold hover:bg-[#ffb4ab] hover:text-[#690005] transition-all active:scale-95">
                Eliminar Cuenta
              </button>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SecuritySettingsPage;
