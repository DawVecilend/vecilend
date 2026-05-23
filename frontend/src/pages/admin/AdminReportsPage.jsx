import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import backofficeApi from "../../services/backofficeApi";
import { useToast } from "../../contexts/ToastContext";
import { useBackofficeAuth } from "../../contexts/BackofficeAuthContext";
import { REPORT_MOTIUS } from "../../services/reports";

const MOTIU_LABEL = Object.fromEntries(REPORT_MOTIUS.map((m) => [m.value, m.label]));

function ResolveModal({ open, report, onClose, onResolved }) {
  const { showToast } = useToast();
  const { isAdmin } = useBackofficeAuth();
  const [estat, setEstat] = useState("resolt");
  const [nota, setNota] = useState("");
  const [bloquearUsuari, setBloquearUsuari] = useState(false);
  const [eliminarObjecte, setEliminarObjecte] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setEstat("resolt");
      setNota("");
      setBloquearUsuari(false);
      setEliminarObjecte(false);
      setError(null);
    }
  }, [open]);

  if (!open || !report) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = { estat, resolucio_nota: nota || null };
      if (estat === "resolt") {
        payload.bloquear_usuari = bloquearUsuari;
        payload.eliminar_objecte = eliminarObjecte;
      }
      const res = await backofficeApi.put(`/backoffice/reports/${report.id}/resolve`, payload);
      const updated = res.data?.data ?? res.data;
      showToast(estat === "resolt" ? "Reporte resuelto." : "Reporte descartado.");
      onResolved(updated);
    } catch (err) {
      setError(err.response?.data?.message || "Error al procesar el reporte.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60"
      onClick={(e) => { if (e.target === e.currentTarget && !submitting) onClose(); }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-app-border bg-app-bg-card p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold font-heading text-app-text">Gestionar reporte #{report.id}</h2>
            <p className="text-xs text-app-text-secondary mt-0.5">{MOTIU_LABEL[report.motiu] ?? report.motiu}</p>
          </div>
          <button type="button" onClick={() => !submitting && onClose()} className="text-app-text-secondary hover:text-app-text">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mb-4 rounded-lg bg-app-neutral border border-app-border p-3 text-xs space-y-1.5">
          <p><span className="text-app-text-secondary">Reportador:</span> <span className="text-app-text">@{report.reportador?.username ?? "—"}</span></p>
          <p><span className="text-app-text-secondary">Usuario reportado:</span> <span className="text-app-text">@{report.usuari_reportat?.username ?? "—"}</span></p>
          {report.objecte && (
            <p><span className="text-app-text-secondary">Objeto:</span> <span className="text-app-text">{report.objecte.nom} (#{report.objecte.id})</span></p>
          )}
          {report.descripcio && (
            <div>
              <p className="text-app-text-secondary mb-1">Descripción del reportador:</p>
              <p className="text-app-text whitespace-pre-wrap">{report.descripcio}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-app-text mb-1.5">Decisión</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setEstat("resolt")} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${estat === "resolt" ? "border-app-secondary bg-app-secondary/10 text-app-secondary" : "border-app-border text-app-text-secondary hover:border-app-secondary/40"}`}>
                Tomar acción
              </button>
              <button type="button" onClick={() => setEstat("descartat")} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${estat === "descartat" ? "border-app-secondary bg-app-secondary/10 text-app-secondary" : "border-app-border text-app-text-secondary hover:border-app-secondary/40"}`}>
                Descartar
              </button>
            </div>
          </div>

          {estat === "resolt" && (
            <div className="rounded-lg border border-app-border bg-app-neutral p-3 flex flex-col gap-2">
              <p className="text-xs text-app-text-secondary mb-1">Acciones a aplicar:</p>
              {report.usuari_reportat?.actiu !== false && (
                <label className="flex items-center gap-2 text-sm text-app-text cursor-pointer">
                  <input type="checkbox" checked={bloquearUsuari} onChange={(e) => setBloquearUsuari(e.target.checked)} className="cursor-pointer" />
                  Bloquear al usuario reportado
                </label>
              )}
              {report.objecte && (isAdmin || report.motiu === "objecte_inapropiat") && (
                <label className="flex items-center gap-2 text-sm text-app-text cursor-pointer">
                  <input type="checkbox" checked={eliminarObjecte} onChange={(e) => setEliminarObjecte(e.target.checked)} className="cursor-pointer" />
                  Eliminar el objeto referenciado
                </label>
              )}
              {!isAdmin && report.objecte && report.motiu !== "objecte_inapropiat" && (
                <p className="text-xs text-app-text-secondary italic">La eliminación del objeto en reportes que no son por objeto inapropiado debe realizarla un administrador.</p>
              )}
              {!report.objecte && report.usuari_reportat?.actiu === false && (
                <p className="text-xs text-app-text-secondary">No hay acciones adicionales disponibles.</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-app-text mb-1.5">
              Nota interna <span className="text-app-text-secondary font-normal">(opcional)</span>
            </label>
            <textarea
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="Detalle de la resolución para el historial…"
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none bg-app-neutral border border-app-border text-app-text resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-2">
            <button type="button" onClick={() => !submitting && onClose()} className="flex-1 rounded-xl py-2.5 text-sm font-medium border border-app-border text-app-text-secondary hover:bg-app-neutral">
              Cancelar
            </button>
            <button type="submit" disabled={submitting} className="flex-1 rounded-xl py-2.5 text-sm font-bold bg-app-primary hover:bg-app-primary-hover text-white disabled:opacity-60">
              {submitting ? "Guardando…" : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EstatBadge({ estat }) {
  const map = {
    pendent:   { bg: "rgba(251,146,60,0.12)", color: "#fb923c", label: "Pendiente" },
    resolt:    { bg: "rgba(34,197,94,0.12)",  color: "#22C55E", label: "Resuelto" },
    descartat: { bg: "rgba(107,114,128,0.15)", color: "#9ca3af", label: "Descartado" },
  };
  const s = map[estat] ?? map.pendent;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterEstat, setFilterEstat] = useState("pendent");
  const [filterMotiu, setFilterMotiu] = useState("all");
  const [resolveTarget, setResolveTarget] = useState(null);

  useEffect(() => {
    backofficeApi.get("/backoffice/reports")
      .then((res) => setReports(Array.isArray(res.data) ? res.data : res.data.data ?? []))
      .catch(() => setError("No se han podido cargar los reportes."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const matchEstat = filterEstat === "all" || r.estat === filterEstat;
      const matchMotiu = filterMotiu === "all" || r.motiu === filterMotiu;
      return matchEstat && matchMotiu;
    });
  }, [reports, filterEstat, filterMotiu]);

  const handleResolved = (updated) => {
    setReports((p) => p.map((r) => r.id === updated.id ? updated : r));
    setResolveTarget(null);
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("es-ES", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const selectClass = "rounded-lg px-3 py-2 text-sm outline-none bg-app-neutral border border-app-border text-app-text cursor-pointer";

  return (
    <div className="p-4 lg:p-8 flex flex-col gap-6">
      <ResolveModal
        open={!!resolveTarget}
        report={resolveTarget}
        onClose={() => setResolveTarget(null)}
        onResolved={handleResolved}
      />

      <div>
        <h1 className="text-2xl font-bold font-heading text-app-text">Reportes</h1>
        <p className="text-sm text-app-text-secondary mt-1">Gestión de reportes de usuarios</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <select value={filterEstat} onChange={(e) => setFilterEstat(e.target.value)} className={selectClass}>
          <option value="all">Todos los estados</option>
          <option value="pendent">Pendientes</option>
          <option value="resolt">Resueltos</option>
          <option value="descartat">Descartados</option>
        </select>
        <select value={filterMotiu} onChange={(e) => setFilterMotiu(e.target.value)} className={selectClass}>
          <option value="all">Todos los motivos</option>
          {REPORT_MOTIUS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <span className="self-center text-sm text-app-text-secondary ml-auto">{filtered.length} resultados</span>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="h-8 w-8 rounded-full border-4 border-app-border border-t-app-primary animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-app-border bg-app-bg-card p-10 text-center text-app-text-secondary text-sm">
          No hay reportes con estos filtros.
        </div>
      ) : (
        <div className="rounded-xl border border-app-border overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="bg-app-neutral border-b border-app-border">
                {["#", "Motivo", "Reportador", "Reportado", "Objeto", "Estado", "Fecha", "Acciones"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-app-text-secondary">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} className={`border-b border-app-border ${i % 2 === 0 ? "bg-app-bg-card" : "bg-app-bg"}`}>
                  <td className="px-4 py-3 text-xs font-mono text-app-text-secondary">{r.id}</td>
                  <td className="px-4 py-3 text-xs text-app-text">{MOTIU_LABEL[r.motiu] ?? r.motiu}</td>
                  <td className="px-4 py-3 text-xs">
                    {r.reportador ? (
                      <Link to={`/profile/${r.reportador.username}`} className="text-app-primary hover:underline">
                        @{r.reportador.username}
                      </Link>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {r.usuari_reportat ? (
                      <Link to={`/profile/${r.usuari_reportat.username}`} className="text-app-primary hover:underline">
                        @{r.usuari_reportat.username}
                      </Link>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {r.objecte ? (
                      <Link to={r.objecte.slug ? `/objects/${r.objecte.id}/${r.objecte.slug}` : `/objects/${r.objecte.id}`} className="text-app-primary hover:underline">
                        {r.objecte.nom}
                      </Link>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <EstatBadge estat={r.estat} />
                  </td>
                  <td className="px-4 py-3 text-xs text-app-text-secondary">{formatDate(r.created_at)}</td>
                  <td className="px-4 py-3">
                    {r.estat === "pendent" ? (
                      <button onClick={() => setResolveTarget(r)} className="text-xs px-3 py-1 rounded-lg bg-app-primary/10 text-app-primary hover:bg-app-primary/20">
                        Gestionar
                      </button>
                    ) : (
                      <span className="text-xs text-app-text-secondary">
                        {r.revisor ? `por @${r.revisor.username}` : "—"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminReportsPage;
