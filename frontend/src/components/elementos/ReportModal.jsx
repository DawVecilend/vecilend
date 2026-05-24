import { useState, useEffect } from "react";
import { createReport, REPORT_MOTIUS } from "../../services/reports";
import { useToast } from "../../contexts/ToastContext";

function ReportModal({
  open,
  onClose,
  usuariReportatId,
  usuariReportatNom,
  objecteId = null,
  objecteNom = null,
}) {
  const { showToast } = useToast();
  const [motiu, setMotiu] = useState("");
  const [descripcio, setDescripcio] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setMotiu(objecteId ? "objecte_inapropiat" : "");
      setDescripcio("");
      setError(null);
    }
  }, [open, objecteId]);

  if (!open) return null;

  const needsObjecte = motiu === "objecte_inapropiat";
  const canSubmit = motiu && (!needsObjecte || objecteId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      await createReport({
        usuari_reportat_id: usuariReportatId,
        objecte_id: needsObjecte ? objecteId : null,
        motiu,
        descripcio: descripcio.trim() || null,
      });
      showToast("Reporte enviado. Gracias por ayudarnos a mejorar la plataforma.");
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message
        || Object.values(err.response?.data?.errors ?? {}).flat()[0]
        || "No se ha podido enviar el reporte. Inténtalo de nuevo.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget && !submitting) onClose(); }}
    >
      <div className="w-full max-w-md rounded-2xl border border-app-border bg-app-bg-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold font-heading text-app-text">Reportar usuario</h2>
            <p className="text-xs text-app-text-secondary mt-0.5">
              {usuariReportatNom ? <>Estás reportando a <span className="font-medium text-app-text">{usuariReportatNom}</span></> : "Indica el motivo del reporte"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => !submitting && onClose()}
            className="text-app-text-secondary hover:text-app-text"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-app-text mb-1.5">Motivo *</label>
            <select aria-label="Motivo"
              value={motiu}
              onChange={(e) => setMotiu(e.target.value)}
              required
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none bg-app-neutral border border-app-border text-app-text"
            >
              <option value="">Selecciona un motivo…</option>
              {REPORT_MOTIUS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          {needsObjecte && objecteNom && (
            <div className="rounded-lg bg-app-neutral border border-app-border px-3 py-2 text-xs text-app-text-secondary">
              Se incluirá referencia al objeto: <span className="font-medium text-app-text">{objecteNom}</span>
            </div>
          )}

          {needsObjecte && !objecteId && (
            <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-300">
              Para reportar un objeto inapropiado debes abrir el reporte desde la página del objeto.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-app-text mb-1.5">
              Descripción <span className="text-app-text-secondary font-normal">(opcional)</span>
            </label>
            <textarea aria-label="Descripción (opcional)"
              value={descripcio}
              onChange={(e) => setDescripcio(e.target.value)}
              maxLength={2000}
              rows={4}
              placeholder="Explica brevemente qué ha ocurrido…"
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none bg-app-neutral border border-app-border text-app-text resize-none"
            />
            <p className="text-[10px] text-app-text-secondary mt-1 text-right">{descripcio.length} / 2000</p>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => !submitting && onClose()}
              className="flex-1 rounded-xl py-2.5 text-sm font-medium border border-app-border text-app-text-secondary hover:bg-app-neutral transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="flex-1 rounded-xl py-2.5 text-sm font-bold bg-red-500 hover:bg-red-600 text-white disabled:opacity-60 transition-colors"
            >
              {submitting ? "Enviando…" : "Enviar reporte"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportModal;
