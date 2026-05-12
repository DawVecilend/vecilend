import { useState, useEffect, useMemo } from "react";
import api from "../../services/api";

// ─── Badge d'acció ──────────────────────────────────────────────────────────
function ActionBadge({ accio }) {
  const map = {
    user_block:       { bg: "rgba(251,146,60,0.12)", color: "#fb923c" },
    user_unblock:     { bg: "rgba(20,184,166,0.12)", color: "#14B8A6" },
    user_delete:      { bg: "rgba(239,68,68,0.12)",  color: "#f87171" },
    categoria_create: { bg: "rgba(34,197,94,0.12)",  color: "#22C55E" },
    categoria_update: { bg: "rgba(20,184,166,0.12)", color: "#14B8A6" },
    categoria_delete: { bg: "rgba(239,68,68,0.12)",  color: "#f87171" },
  };
  const s = map[accio] ?? { bg: "rgba(107,114,128,0.12)", color: "#6b7280" };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {accio}
    </span>
  );
}

// ─── Component principal ─────────────────────────────────────────────────────
function AdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterAction, setFilterAction] = useState("all");
  const [filterUser, setFilterUser] = useState("");
  const [filterEntity, setFilterEntity] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 25;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/admin/logs");
        const data = Array.isArray(res.data) ? res.data : res.data.data ?? [];
        setLogs(data);
      } catch {
        setError("No se han podido cargar los logs.");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Valors únics per als filtres
  const uniqueActions = useMemo(() => {
    const s = new Set(logs.map((l) => l.accio).filter(Boolean));
    return [...s].sort();
  }, [logs]);

  const uniqueEntities = useMemo(() => {
    const s = new Set(logs.map((l) => l.entitat_afectada).filter(Boolean));
    return [...s].sort();
  }, [logs]);

  const filtered = useMemo(() => {
    const q = filterUser.toLowerCase().trim();
    return logs.filter((l) => {
      const matchAction = filterAction === "all" || l.accio === filterAction;
      const matchEntity = filterEntity === "all" || l.entitat_afectada === filterEntity;
      const matchUser =
        !q ||
        l.user_username?.toLowerCase().includes(q) ||
        l.user_email?.toLowerCase().includes(q);
      return matchAction && matchEntity && matchUser;
    });
  }, [logs, filterAction, filterEntity, filterUser]);

  useEffect(() => setCurrentPage(1), [filterAction, filterEntity, filterUser]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Capçalera */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-app-text)",
          }}
        >
          Log de Acciones
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-app-text-secondary)" }}>
          Historial de acciones administrativas · {logs.length} registros totales
        </p>
      </div>

      {/* Filtres */}
      <div
        className="rounded-xl border p-4 mb-5 flex flex-wrap gap-3 items-center"
        style={{
          backgroundColor: "var(--color-app-bg-card)",
          borderColor: "var(--color-app-border)",
        }}
      >
        {/* Cerca per admin */}
        <div className="relative flex-1 min-w-[180px]">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: "var(--color-app-text-secondary)" }}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Filtrar por admin..."
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
            style={{
              backgroundColor: "var(--color-app-neutral)",
              border: "1px solid var(--color-app-border)",
              color: "var(--color-app-text)",
            }}
          />
        </div>

        {/* Acció */}
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm outline-none cursor-pointer"
          style={{
            backgroundColor: "var(--color-app-neutral)",
            border: "1px solid var(--color-app-border)",
            color: "var(--color-app-text)",
          }}
        >
          <option value="all">Todas las acciones</option>
          {uniqueActions.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        {/* Entitat */}
        <select
          value={filterEntity}
          onChange={(e) => setFilterEntity(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm outline-none cursor-pointer"
          style={{
            backgroundColor: "var(--color-app-neutral)",
            border: "1px solid var(--color-app-border)",
            color: "var(--color-app-text)",
          }}
        >
          <option value="all">Todas las entidades</option>
          {uniqueEntities.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        {/* Reset */}
        {(filterAction !== "all" || filterEntity !== "all" || filterUser) && (
          <button
            onClick={() => {
              setFilterAction("all");
              setFilterEntity("all");
              setFilterUser("");
            }}
            className="px-3 py-2 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: "rgba(239,68,68,0.1)",
              color: "#f87171",
            }}
          >
            Limpiar filtros
          </button>
        )}

        <span className="text-sm ml-auto" style={{ color: "var(--color-app-text-secondary)" }}>
          {filtered.length} resultados
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm mb-5">
          {error}
        </div>
      )}

      {/* Taula */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ borderColor: "var(--color-app-border)" }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="h-8 w-8 rounded-full border-4 border-[#2A2B31] border-t-[#14B8A6] animate-spin" />
          </div>
        ) : paginated.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-48 text-sm gap-2"
            style={{ color: "var(--color-app-text-secondary)" }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            No hay registros con estos filtros
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    backgroundColor: "var(--color-app-neutral)",
                    borderBottom: "1px solid var(--color-app-border)",
                  }}
                >
                  {["#", "Admin", "Acción", "Entidad afectada", "IP", "Fecha"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider"
                      style={{ color: "var(--color-app-text-secondary)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((log, i) => (
                  <tr
                    key={log.id}
                    style={{
                      backgroundColor:
                        i % 2 === 0
                          ? "var(--color-app-bg-card)"
                          : "var(--color-app-bg)",
                      borderBottom: "1px solid var(--color-app-border)",
                    }}
                  >
                    {/* ID */}
                    <td
                      className="px-4 py-3 text-xs font-mono"
                      style={{ color: "var(--color-app-text-secondary)" }}
                    >
                      {log.id}
                    </td>

                    {/* Admin */}
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium" style={{ color: "var(--color-app-text)" }}>
                        {log.user_username ?? "—"}
                      </p>
                      {log.user_email && (
                        <p className="text-xs" style={{ color: "var(--color-app-text-secondary)" }}>
                          {log.user_email}
                        </p>
                      )}
                    </td>

                    {/* Acció */}
                    <td className="px-4 py-3">
                      <ActionBadge accio={log.accio} />
                    </td>

                    {/* Entitat afectada */}
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--color-app-text)" }}>
                      {log.entitat_afectada ? (
                        <>
                          <span className="capitalize">{log.entitat_afectada}</span>
                          {log.id_entitat_afectada && (
                            <span style={{ color: "var(--color-app-text-secondary)" }}>
                              {" "}#{log.id_entitat_afectada}
                            </span>
                          )}
                        </>
                      ) : "—"}
                    </td>

                    {/* IP */}
                    <td
                      className="px-4 py-3 text-xs font-mono"
                      style={{ color: "var(--color-app-text-secondary)" }}
                    >
                      {log.ip ?? "—"}
                    </td>

                    {/* Data */}
                    <td
                      className="px-4 py-3 text-xs"
                      style={{ color: "var(--color-app-text-secondary)" }}
                    >
                      {formatDate(log.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginació */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs" style={{ color: "var(--color-app-text-secondary)" }}>
            Página {currentPage} de {totalPages} · {PAGE_SIZE} por página
          </span>
          <div className="flex gap-1">
            {/* Primera */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-40"
              style={{
                backgroundColor: "var(--color-app-neutral)",
                borderColor: "var(--color-app-border)",
                color: "var(--color-app-text)",
              }}
            >
              «
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-40"
              style={{
                backgroundColor: "var(--color-app-neutral)",
                borderColor: "var(--color-app-border)",
                color: "var(--color-app-text)",
              }}
            >
              ← Anterior
            </button>

            {/* Pàgines properes */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const start = Math.max(1, currentPage - 2);
              const page = start + i;
              if (page > totalPages) return null;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className="w-8 py-1.5 rounded-lg text-xs font-medium border"
                  style={{
                    backgroundColor:
                      currentPage === page
                        ? "rgba(20,184,166,0.15)"
                        : "var(--color-app-neutral)",
                    borderColor:
                      currentPage === page
                        ? "#14B8A6"
                        : "var(--color-app-border)",
                    color: currentPage === page ? "#14B8A6" : "var(--color-app-text)",
                  }}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-40"
              style={{
                backgroundColor: "var(--color-app-neutral)",
                borderColor: "var(--color-app-border)",
                color: "var(--color-app-text)",
              }}
            >
              Siguiente →
            </button>
            {/* Última */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-40"
              style={{
                backgroundColor: "var(--color-app-neutral)",
                borderColor: "var(--color-app-border)",
                color: "var(--color-app-text)",
              }}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLogsPage;
