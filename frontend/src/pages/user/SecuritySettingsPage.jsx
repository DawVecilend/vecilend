import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  updatePassword,
  deactivateAccount,
  deleteAccount,
} from "../../services/profile";

import PasswordInput from "../../components/elementos/PasswordInput";
import PasswordRequirements from "../../components/elementos/PasswordRequirements";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useMediaQuery,
} from "@mui/material";

function SecuritySettingsPage() {
  const { user } = useContext(AuthContext);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:768px)");

  const [passwords, setPasswords] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteShowPassword, setDeleteShowPassword] = useState(false);

  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deactivateBusy, setDeactivateBusy] = useState(false);
  const [deactivateError, setDeactivateError] = useState(null);

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

  const handleConfirmDeactivate = async () => {
    setDeactivateBusy(true);
    setDeactivateError(null);

    try {
      await deactivateAccount();
      auth.logout?.();
      navigate("/", { replace: true });
    } catch (err) {
      setDeactivateError(
        err?.response?.data?.message ||
          "No se ha podido desactivar la cuenta. Inténtalo de nuevo.",
      );
    } finally {
      setDeactivateBusy(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleteError(null);

    if (!deletePassword) {
      setDeleteError("Introduce tu contraseña para confirmar.");
      return;
    }

    setDeleteBusy(true);

    try {
      await deleteAccount(deletePassword);
      auth.logout?.();
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError(
        err?.response?.data?.errors?.password?.[0] ||
          err?.response?.data?.message ||
          "No se ha podido eliminar la cuenta. Inténtalo de nuevo.",
      );
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div className="bg-app-bg text-app-text antialiased flex flex-col dark font-inter">
      <div className="flex min-h-[calc(100vh-80px)]">
        <aside className="hidden md:flex flex-col p-4 bg-[#090f0e] w-64 border-r border-app-border transition-all duration-150 text-sm z-40">
          <div className="mb-8 px-2">
            <h2 className="text-[#4fdbc8] font-bold text-lg">Configuración</h2>
            <p className="text-[#859490] text-xs">Gestiona tu cuenta</p>
          </div>

          <nav className="space-y-1">
            <Link
              to={`/settings/profile/${user?.username}`}
              className="flex items-center gap-3 px-3 py-3 text-[#859490] hover:bg-app-bg-card hover:text-app-text transition-all duration-150"
            >
              <span className="material-symbols-outlined">home</span>
              <span>Página principal</span>
            </Link>

            <Link
              to={`/settings/profile/${user?.username}/editing`}
              className="flex items-center gap-3 px-3 py-3 text-[#859490] hover:bg-app-bg-card hover:text-app-text transition-all duration-150"
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
              className="flex items-center gap-3 px-3 py-3 text-[#859490] hover:bg-app-bg-card hover:text-app-text transition-all duration-150"
            >
              <span className="material-symbols-outlined">privacy</span>
              <span>Privacidad</span>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6 md:px-12 lg:px-16 max-w-7xl mx-auto bg-app-bg flex flex-col justify-center">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-app-text mb-2 tracking-tight">
              Seguridad de la <span className="text-[#4fdbc8]">Cuenta</span>
            </h1>

            <p className="text-app-text-secondary text-lg max-w-2xl leading-relaxed">
              Administra tus credenciales de acceso y protege tu información
              personal.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <section className="lg:col-span-7 bg-[#2f3634]/40 backdrop-blur-md rounded-xl p-8 border border-app-border/20 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-[#4fdbc8]">
                  lock
                </span>
                <h2 className="text-xl font-bold">Cambiar Contraseña</h2>
              </div>

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
                  <label className="text-xs font-bold text-app-text-secondary uppercase tracking-widest ml-1">
                    Contraseña Actual
                  </label>

                  <PasswordInput
                    name="current_password"
                    value={passwords.current_password}
                    onChange={handlePasswordChange}
                    className="w-full bg-app-bg-card border border-app-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#4fdbc8] focus:border-transparent transition-all outline-none text-app-text"
                    placeholder="••••••••••••"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-app-text-secondary uppercase tracking-widest ml-1">
                      Nueva Contraseña
                    </label>

                    <PasswordInput
                      name="password"
                      value={passwords.password}
                      onChange={handlePasswordChange}
                      className="w-full bg-app-bg-card border border-app-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#4fdbc8] focus:border-transparent transition-all outline-none text-app-text"
                      placeholder="••••••••"
                    />

                    <PasswordRequirements password={passwords.password} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-app-text-secondary uppercase tracking-widest ml-1">
                      Confirmar Contraseña
                    </label>

                    <PasswordInput
                      name="password_confirmation"
                      value={passwords.password_confirmation}
                      onChange={handlePasswordChange}
                      className="w-full bg-app-bg-card border border-app-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#4fdbc8] focus:border-transparent transition-all outline-none text-app-text"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    disabled={isLoading}
                    className={`bg-[#4fdbc8] text-[#003731] px-10 py-3 rounded-lg font-bold shadow-lg transition-all ${
                      isLoading
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-[#14b8a6] active:scale-95"
                    }`}
                    type="submit"
                  >
                    {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
                  </button>
                </div>
              </form>
            </section>

            <section className="lg:col-span-5 bg-[#2f3634]/40 backdrop-blur-md rounded-xl p-8 border border-app-border/20 shadow-xl flex flex-col justify-between">
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
                    <div className="w-11 h-6 bg-app-bg-card peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#161d1b] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#bbcac6] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4fdbc8]"></div>
                  </label>
                </div>

                <p className="text-sm text-app-text-secondary mb-6 leading-relaxed">
                  Añade una capa extra de seguridad a tu cuenta usando una
                  aplicación de autenticación.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-app-bg-card rounded-lg border border-app-border/20">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-app-text-secondary">
                      smartphone
                    </span>
                    <span className="text-sm font-bold text-app-text">
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

            <section className="lg:col-span-12 bg-[#93000a]/10 border border-[#ffb4ab]/20 rounded-xl p-6 shadow-xl flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#ffb4ab] mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    warning
                  </span>
                  Zona de Peligro
                </h2>

                <p className="text-[13px] text-app-text-secondary">
                  Acciones que afectan tu cuenta de forma permanente o duradera.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-[#ffb59e]/30 bg-[#0e1513]/40 p-4 flex flex-col gap-3">
                  <div>
                    <h3 className="font-bold text-app-text mb-1">
                      Desactivar cuenta
                    </h3>

                    <p className="text-caption text-app-text-secondary leading-relaxed">
                      Tu perfil y tus objetos dejarán de aparecer para los
                      demás. Tus datos no se borran. Para reactivar la cuenta,
                      contacta con soporte.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setDeactivateError(null);
                      setDeactivateOpen(true);
                    }}
                    className="w-full px-5 py-2.5 rounded-lg border border-[#ffb59e] text-[#ffb59e] font-bold hover:bg-[#ffb59e]/10 transition-all active:scale-95"
                  >
                    Desactivar cuenta
                  </button>
                </div>

                <div className="rounded-lg border border-[#ffb4ab]/30 bg-[#0e1513]/40 p-4 flex flex-col gap-3">
                  <div>
                    <h3 className="font-bold text-app-text mb-1">
                      Eliminar cuenta
                    </h3>

                    <p className="text-caption text-app-text-secondary leading-relaxed">
                      Una vez que elimines tu cuenta, no hay vuelta atrás. Se
                      borrarán todos tus datos de forma permanente.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setDeletePassword("");
                      setDeleteError(null);
                      setDeleteOpen(true);
                    }}
                    className="w-full px-5 py-2.5 rounded-lg border border-[#ffb4ab] text-[#ffb4ab] font-bold hover:bg-[#ffb4ab] hover:text-[#690005] transition-all active:scale-95"
                  >
                    Eliminar cuenta
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <Dialog
        open={deleteOpen}
        onClose={deleteBusy ? undefined : () => setDeleteOpen(false)}
        fullScreen={isMobile}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            backgroundColor: "#0A0A0B",
            color: "#F2F4F8",
            borderRadius: isMobile ? 0 : 4,
            border: "1px solid #2A2B31",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Montserrat",
            fontWeight: 700,
            color: "#F2F4F8",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #2A2B31",
          }}
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ef4444]">
              warning
            </span>
            Eliminar tu cuenta
          </span>

          <IconButton
            onClick={() => setDeleteOpen(false)}
            disabled={deleteBusy}
            sx={{ color: "#B6BCC8" }}
          >
            <span className="material-symbols-outlined">close</span>
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <p className="text-body-base text-app-text font-body">
            Vas a eliminar tu cuenta de Vecilend de forma permanente.
          </p>

          <p className="mt-3 text-label text-app-text-secondary font-body">
            Se borrarán tus objetos, solicitudes, mensajes, favoritos y
            valoraciones. Esta acción no se puede deshacer. Si tienes alguna
            transacción en curso, primero deberás resolverla.
          </p>

          <label className="block mt-5">
            <span className="text-label text-app-text-secondary font-body">
              Confirma tu contraseña
            </span>

            <div className="mt-2 relative">
              <input
                type={deleteShowPassword ? "text" : "password"}
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Tu contraseña"
                autoFocus
                disabled={deleteBusy}
                className="w-full bg-[#16181C] border border-app-border rounded-lg px-4 py-3 pr-11 text-app-text focus:ring-2 focus:ring-[#ef4444] outline-none"
              />

              <button
                type="button"
                onClick={() => setDeleteShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center text-app-text-secondary hover:text-app-text"
                aria-label={
                  deleteShowPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                <span className="material-symbols-outlined text-base">
                  {deleteShowPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </label>

          {deleteError && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-[#ef4444]/50 bg-[#ef4444]/10 px-3 py-2">
              <span className="material-symbols-outlined text-sm text-[#ef4444] mt-0.5">
                error
              </span>

              <p className="text-xs text-[#ef4444] font-body leading-relaxed">
                {deleteError}
              </p>
            </div>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            borderTop: "1px solid #2A2B31",
            px: 3,
            py: 2,
            gap: 1,
          }}
        >
          <button
            type="button"
            onClick={() => setDeleteOpen(false)}
            disabled={deleteBusy}
            className="rounded-full border border-[#2A2B31] px-5 py-2 text-label font-body text-app-text hover:bg-[#16181C] disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={deleteBusy || !deletePassword}
            className="rounded-full bg-[#ef4444] hover:bg-[#dc2626] px-5 py-2 text-label font-bold text-white active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteBusy ? "Eliminando…" : "Sí, eliminar mi cuenta"}
          </button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deactivateOpen}
        onClose={deactivateBusy ? undefined : () => setDeactivateOpen(false)}
        fullScreen={isMobile}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            backgroundColor: "#0A0A0B",
            color: "#F2F4F8",
            borderRadius: isMobile ? 0 : 4,
            border: "1px solid #2A2B31",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Montserrat",
            fontWeight: 700,
            color: "#F2F4F8",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #2A2B31",
          }}
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb59e]">
              warning
            </span>
            Desactivar tu cuenta
          </span>

          <IconButton
            onClick={() => setDeactivateOpen(false)}
            disabled={deactivateBusy}
            sx={{ color: "#B6BCC8" }}
          >
            <span className="material-symbols-outlined">close</span>
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <p className="text-body-base text-app-text font-body">
            Vas a desactivar tu cuenta de Vecilend.
          </p>

          <p className="mt-3 text-label text-app-text-secondary font-body">
            Tu perfil, tus objetos y tu actividad dejarán de aparecer para el
            resto de usuarios. Tus datos NO se borran. Si en el futuro quieres
            reactivar la cuenta, contacta con el equipo de soporte.
          </p>

          <p className="mt-3 text-label text-app-text-secondary font-body">
            Si tienes transacciones en curso, deberás resolverlas primero.
          </p>

          {deactivateError && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-[#ef4444]/50 bg-[#ef4444]/10 px-3 py-2">
              <span className="material-symbols-outlined text-sm text-[#ef4444] mt-0.5">
                error
              </span>

              <p className="text-xs text-[#ef4444] font-body leading-relaxed">
                {deactivateError}
              </p>
            </div>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            borderTop: "1px solid #2A2B31",
            px: 3,
            py: 2,
            gap: 1,
          }}
        >
          <button
            type="button"
            onClick={() => setDeactivateOpen(false)}
            disabled={deactivateBusy}
            className="rounded-full border border-[#2A2B31] px-5 py-2 text-label font-body text-app-text hover:bg-[#16181C] disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirmDeactivate}
            disabled={deactivateBusy}
            className="rounded-full bg-[#ffb59e] hover:bg-[#f38764] px-5 py-2 text-label font-bold text-[#003731] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deactivateBusy ? "Desactivando…" : "Sí, desactivar mi cuenta"}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SecuritySettingsPage;