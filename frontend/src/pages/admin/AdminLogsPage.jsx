import { useState, useEffect, useMemo } from "react";
import backofficeApi from "../../services/backofficeApi";
import { useToast } from "../../contexts/ToastContext";

function ActionBadge({ accio, tipus }) {
  let bg = "rgba(107,114,128,0.12)";
  let color = "#9ca3af";

  if (tipus === "admin") {
    if (accio?.endsWith("_block") || accio?.endsWith("_delete")) { bg = "rgba(239,68,68,0.12)"; color = "#f87171"; }
    else if (accio?.endsWith("_create")) { bg = "rgba(34,197,94,0.12)"; color = "#22C55E"; }
    else if (accio?.endsWith("_update") || accio?.endsWith("_unblock") || accio?.endsWith("_resolve")) { bg = "rgba(20,184,166,0.12)"; color = "#14B8A6"; }
  } else if (tipus === "auth") {
    bg = "rgba(168,85,247,0.12)"; color = "#a855f7";
  } else if (tipus === "usuari") {
    bg = "rgba(59,130,246,0.12)"; color = "#60a5fa";
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold" style={{ backgroundColor: bg, color }}>
      {accio}
    </span>
  );
}

function TipusBadge({ tipus }) {
  const map = {
    admin:  { label: "Admin",  color: "#14B8A6", bg: "rgba(20,184,166,0.12)" },
    auth:   { label: "Auth",   color: "#a855f7", bg: "rgba(168,85,247,0.12)" },
    usuari: { label: "Usuario", color: "#60a5fa", bg: "rgba(59,130,246,0.12)" },
  };
  const s = map[tipus] ?? { label: tipus, color: "#9ca3af", bg: "rgba(107,114,128,0.12)" };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider" style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function AdminLogsPage() {
  const { showToast } = useToast();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterTipus, setFilterTipus] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [filterActor, setFilterActor] = useState("");
  const [filterEntity, setFilterEntity] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 25;

  const [exporting, setExporting] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [cleanDays, setCleanDays] = useState(90);
  const [cleanConfirmOpen, setCleanConfirmOpen] = useState(false);

  const loadLogs = () => {
    setLoading(true);
    backofficeApi.get("/backoffice/logs")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data ?? [];
        setLogs(data);
      })
      .catch(() => setError("No se han podido cargar los logs."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const uniqueActions = useMemo(() => {
    const s = new Set(logs.map((l) => l.accio).filter(Boolean));
    return [...s].sort();
  }, [logs]);

  const uniqueEntities = useMemo(() => {
    const s = new Set(logs.map((l) => l.entitat_afectada).filter(Boolean));
    return [...s].sort();
  }, [logs]);

  const filtered = useMemo(() => {
    const q = filterActor.toLowerCase().trim();
    return logs.filter((l) => {
      const matchTipus  = filterTipus === "all" || l.tipus === filterTipus;
      const matchAction = filterAction === "all" || l.accio === filterAction;
      const matchEntity = filterEntity === "all" || l.entitat_afectada === filterEntity;
      const matchActor  = !q
        || l.actor?.username?.toLowerCase().includes(q)
        || l.actor?.email?.toLowerCase().includes(q);
      return matchTipus && matchAction && matchEntity && matchActor;
    });
  }, [logs, filterTipus, filterAction, filterEntity, filterActor]);

  useEffect(() => setCurrentPage(1), [filterTipus, filterAction, filterEntity, filterActor]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("es-ES", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

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
      loadLogs();
    } catch (err) {
      showToast(
        err.response?.data?.message || "No se han podido limpiar los logs.",
        "error",
      );
    } finally {
      setCleaning(false);
    }
  };

  const selectClass = "px-3 py-2 rounded-lg text-sm outline-none cursor-pointer bg-app-neutral border border-app-border text-app-text";

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-app-text">Log de acciones</h1>
          <p className="text-sm mt-1 text-app-text-secondary">
            Historial de acciones · {logs.length} registros totales
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleExportLogs}
            disabled={exporting || loading}
            className="inline-flex items-center justify-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-app-primary/15 text-app-primary hover:bg-app-primary/25 disabled:opacity-60 whitespace-nowrap w-full sm:w-auto"
          >
            <span className="material-symbols-outlined text-base">download</span>
            {exporting ? "Exportando…" : "Exportar CSV"}
          </button>
          <button
            type="button"
            onClick={() => setCleanConfirmOpen(true)}
            disabled={cleaning || loading}
            className="inline-flex items-center justify-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-60 whitespace-nowrap w-full sm:w-auto"
          >
            <span className="material-symbols-outlined text-base">delete_sweep</span>
            Limpiar historial
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-app-border bg-app-bg-card p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <input aria-label="Filtrar por usuario"
            type="text"
            placeholder="Filtrar por usuario..."
            value={filterActor}
            onChange={(e) => setFilterActor(e.target.value)}
            className="w-full px-4 py-2 rounded-lg text-sm outline-none bg-app-neutral border border-app-border text-app-text"
          />
        </div>

        <select aria-label="Filtrar por tipo" value={filterTipus} onChange={(e) => setFilterTipus(e.target.value)} className={selectClass}>
          <option value="all">Todos los tipos</option>
          <option value="admin">Admin</option>
          <option value="auth">Auth (login/logout)</option>
          <option value="usuari">Usuario</option>
        </select>

        <select aria-label="Filtrar por acción" value={filterAction} onChange={(e) => setFilterAction(e.target.value)} className={selectClass}>
          <option value="all">Todas las acciones</option>
          {uniqueActions.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>

        <select aria-label="Filtrar por entidad" value={filterEntity} onChange={(e) => setFilterEntity(e.target.value)} className={selectClass}>
          <option value="all">Todas las entidades</option>
          {uniqueEntities.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>

        {(filterTipus !== "all" || filterAction !== "all" || filterEntity !== "all" || filterActor) && (
          <button
            onClick={() => { setFilterTipus("all"); setFilterAction("all"); setFilterEntity("all"); setFilterActor(""); }}
            className="px-3 py-2 rounded-lg text-xs font-medium bg-red-500/10 text-red-400"
          >
            Limpiar filtros
          </button>
        )}

        <span className="text-sm ml-auto text-app-text-secondary">{filtered.length} resultados</span>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm mb-5">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-app-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="h-8 w-8 rounded-full border-4 border-app-border border-t-app-primary animate-spin" />
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-sm gap-2 text-app-text-secondary">
            No hay registros con estos filtros
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="bg-app-neutral border-b border-app-border">
                  {["#", "Tipo", "Actor", "Acción", "Entidad afectada", "IP", "Fecha"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-app-text-secondary">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((log, i) => (
                  <tr key={log.id} className={`border-b border-app-border ${i % 2 === 0 ? "bg-app-bg-card" : "bg-app-bg"}`}>
                    <td className="px-4 py-3 text-xs font-mono text-app-text-secondary">{log.id}</td>
                    <td className="px-4 py-3"><TipusBadge tipus={log.tipus} /></td>
                    <td className="px-4 py-3">
                      {log.actor ? (
                        <>
                          <p className="text-sm font-medium text-app-text">
                            @{log.actor.username ?? "—"}
                            {log.actor.rol && (
                              <span className="ml-1.5 text-[10px] text-app-text-secondary uppercase">({log.actor.rol})</span>
                            )}
                          </p>
                          {log.actor.email && (
                            <p className="text-xs text-app-text-secondary">{log.actor.email}</p>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-app-text-secondary">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ActionBadge accio={log.accio} tipus={log.tipus} />
                    </td>
                    <td className="px-4 py-3 text-xs text-app-text">
                      {log.entitat_afectada ? (
                        <>
                          <span className="capitalize">{log.entitat_afectada}</span>
                          {log.id_entitat_afectada && (
                            <span className="text-app-text-secondary"> #{log.id_entitat_afectada}</span>
                          )}
                        </>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-app-text-secondary">{log.ip ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-app-text-secondary">{formatDate(log.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-app-text-secondary">
            Página {currentPage} de {totalPages} · {PAGE_SIZE} por página
          </span>
          <div className="flex gap-1">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}
              className="px-2 py-1.5 rounded-lg text-xs font-medium border border-app-border bg-app-neutral text-app-text disabled:opacity-40">«</button>
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-app-border bg-app-neutral text-app-text disabled:opacity-40">← Anterior</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const start = Math.max(1, currentPage - 2);
              const page = start + i;
              if (page > totalPages) return null;
              const isActive = currentPage === page;
              return (
                <button key={page} onClick={() => setCurrentPage(page)}
                  className="w-8 py-1.5 rounded-lg text-xs font-medium border"
                  style={{
                    backgroundColor: isActive ? "rgba(20,184,166,0.15)" : "var(--color-app-neutral)",
                    borderColor: isActive ? "#14B8A6" : "var(--color-app-border)",
                    color: isActive ? "#14B8A6" : "var(--color-app-text)",
                  }}>
                  {page}
                </button>
              );
            })}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-app-border bg-app-neutral text-app-text disabled:opacity-40">Siguiente →</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}
              className="px-2 py-1.5 rounded-lg text-xs font-medium border border-app-border bg-app-neutral text-app-text disabled:opacity-40">»</button>
          </div>
        </div>
      )}

      {cleanConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={(e) => {
            if (e.target === e.currentTarget && !cleaning) {
              setCleanConfirmOpen(false);
            }
          }}
        >
          <div className="w-full max-w-md mx-auto rounded-2xl border border-app-border bg-app-bg-card p-6">
            <h3 className="text-lg font-bold text-app-text mb-2">
              ¿Eliminar logs antiguos?
            </h3>
            <p className="text-sm text-app-text-secondary mb-3">
              Se eliminarán permanentemente los registros anteriores al número de días indicado. Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <input aria-label="Días a conservar"
                type="number"
                min={1}
                max={3650}
                value={cleanDays}
                onChange={(e) => setCleanDays(e.target.value)}
                className="w-24 rounded-md px-3 py-2 text-sm bg-app-neutral border border-app-border text-app-text"
                aria-label="Días de antigüedad para limpiar"
              />
              <span className="text-sm text-app-text-secondary">días de antigüedad</span>
            </div>
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

export default AdminLogsPage;
