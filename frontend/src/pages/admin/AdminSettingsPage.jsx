import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useBackofficeAuth } from "../../contexts/BackofficeAuthContext";
import { useToast } from "../../contexts/ToastContext";
import backofficeApi from "../../services/backofficeApi";

function AdminSettingsPage() {
  const { theme, setTheme } = useTheme();
  const { empleat, isAdmin } = useBackofficeAuth();
  const { showToast } = useToast();

  const [exporting, setExporting] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [cleanDays, setCleanDays] = useState(90);
  const [cleanConfirmOpen, setCleanConfirmOpen] = useState(false);

  const rolLabel = empleat?.rol === "admin" ? "Administrador" : "Soporte técnico";

  const handleExportLogs = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const res = await backofficeApi.get("/backoffice/logs/export", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      const now = new Date();
      const ts = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
      link.setAttribute("download", `vecilend_logs_${ts}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast("Logs exportados correctamente.");
    } catch (err) {
      showToast(
        err.response?.data?.message || "No se ha podido exportar los logs.",
        "error",
      );
    } finally {
      setExporting(false);
    }
  };

  const handleCleanLogs = async () => {
    if (cleaning) return;
    setCleaning(true);
    try {
      const res = await backofficeApi.delete("/backoffice/logs", {
        data: { days: Number(cleanDays) || 90 },
      });
      showToast(res.data?.message || "Logs limpiados.");
      setCleanConfirmOpen(false);
    } catch (err) {
      showToast(
        err.response?.data?.message || "No se han podido limpiar los logs.",
        "error",
      );
    } finally {
      setCleaning(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 flex flex-col gap-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold font-heading text-app-text">Ajustes</h1>
        <p className="text-sm text-app-text-secondary mt-1">
          Configura tu experiencia en el panel de administración.
        </p>
      </div>

      <section className="rounded-xl border border-app-border bg-app-bg-card p-6">
        <h2 className="text-lg font-bold text-app-text mb-1">Tu cuenta</h2>
        <p className="text-sm text-app-text-secondary mb-4">
          Información de la sesión activa.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="bg-app-neutral rounded-lg p-3 border border-app-border">
            <p className="text-xs text-app-text-secondary mb-0.5">Nombre</p>
            <p className="font-medium text-app-text">
              {empleat?.nom} {empleat?.cognoms}
            </p>
          </div>
          <div className="bg-app-neutral rounded-lg p-3 border border-app-border">
            <p className="text-xs text-app-text-secondary mb-0.5">Email</p>
            <p className="font-medium text-app-text break-all">{empleat?.email}</p>
          </div>
          <div className="bg-app-neutral rounded-lg p-3 border border-app-border">
            <p className="text-xs text-app-text-secondary mb-0.5">Usuario</p>
            <p className="font-medium text-app-text">@{empleat?.username}</p>
          </div>
          <div className="bg-app-neutral rounded-lg p-3 border border-app-border">
            <p className="text-xs text-app-text-secondary mb-0.5">Rol</p>
            <p className="font-medium text-app-text">{rolLabel}</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-app-border bg-app-bg-card p-6">
        <h2 className="text-lg font-bold text-app-text mb-1">Apariencia</h2>
        <p className="text-sm text-app-text-secondary mb-4">
          Cambia el tema del panel.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
              theme === "light"
                ? "border-app-primary bg-app-primary/10 text-app-primary"
                : "border-app-border bg-app-neutral text-app-text hover:border-app-primary/40"
            }`}
          >
            <span className="material-symbols-outlined">light_mode</span>
            <span className="font-medium">Modo claro</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
              theme === "dark"
                ? "border-app-primary bg-app-primary/10 text-app-primary"
                : "border-app-border bg-app-neutral text-app-text hover:border-app-primary/40"
            }`}
          >
            <span className="material-symbols-outlined">dark_mode</span>
            <span className="font-medium">Modo oscuro</span>
          </button>
        </div>
      </section>

      {isAdmin && (
        <section className="rounded-xl border border-app-border bg-app-bg-card p-6">
          <h2 className="text-lg font-bold text-app-text mb-1">
            Mantenimiento de logs
          </h2>
          <p className="text-sm text-app-text-secondary mb-4">
            Exporta o limpia los registros de auditoría manualmente.
          </p>

          <div className="rounded-lg border border-app-border bg-app-neutral/50 p-3 mb-4 flex items-start gap-2">
            <span className="material-symbols-outlined text-app-text-secondary text-base mt-0.5">info</span>
            <p className="text-xs text-app-text-secondary leading-relaxed">
              Una tarea programada elimina automáticamente los logs de más de{" "}
              <strong className="text-app-text">90 días</strong> cada noche a las
              04:00. Este valor es fijo y se gestiona desde el servidor.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4 rounded-lg border border-app-border bg-app-neutral p-3">
              <div>
                <p className="text-sm font-medium text-app-text">
                  Exportar a archivo CSV
                </p>
                <p className="text-xs text-app-text-secondary">
                  Descarga todos los logs actuales en formato CSV.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportLogs}
                disabled={exporting}
                className="text-sm px-4 py-2 rounded-lg bg-app-primary/15 text-app-primary hover:bg-app-primary/25 disabled:opacity-60 whitespace-nowrap"
              >
                {exporting ? "Exportando…" : "Exportar"}
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border border-app-border bg-app-neutral p-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-app-text">
                  Limpiar logs antiguos manualmente
                </p>
                <p className="text-xs text-app-text-secondary">
                  Elimina ahora todos los registros anteriores al número de días que indiques.
                  No modifica la tarea programada nocturna.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <input aria-label="Días a conservar"
                    type="number"
                    min={1}
                    max={3650}
                    value={cleanDays}
                    onChange={(e) => setCleanDays(e.target.value)}
                    className="w-20 rounded-md px-2 py-1 text-sm bg-app-bg-card border border-app-border text-app-text"
                    aria-label="Días de antigüedad para limpiar"
                  />
                  <span className="text-xs text-app-text-secondary">días de antigüedad</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCleanConfirmOpen(true)}
                disabled={cleaning}
                className="text-sm px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-60 whitespace-nowrap"
              >
                Limpiar ahora
              </button>
            </div>
          </div>
        </section>
      )}

      {cleanConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60"
          onClick={(e) => {
            if (e.target === e.currentTarget && !cleaning) {
              setCleanConfirmOpen(false);
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-app-border bg-app-bg-card p-6">
            <h3 className="text-lg font-bold text-app-text mb-2">
              ¿Limpiar logs antiguos?
            </h3>
            <p className="text-sm text-app-text-secondary mb-4">
              Se eliminarán de forma permanente los registros anteriores a hace{" "}
              <strong className="text-app-text">{cleanDays} días</strong>. Esta
              acción no se puede deshacer.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => !cleaning && setCleanConfirmOpen(false)}
                className="flex-1 rounded-xl py-2.5 text-sm font-medium border border-app-border text-app-text-secondary hover:bg-app-neutral"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCleanLogs}
                disabled={cleaning}
                className="flex-1 rounded-xl py-2.5 text-sm font-bold bg-red-500 hover:bg-red-600 text-white disabled:opacity-60"
              >
                {cleaning ? "Limpiando…" : "Sí, limpiar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSettingsPage;
