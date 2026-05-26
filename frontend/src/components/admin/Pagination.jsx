function Pagination({ currentPage, lastPage, perPage, total, onPageChange }) {
  if (!lastPage || lastPage <= 1) return null;

  const start = Math.max(1, Math.min(currentPage - 2, lastPage - 4));
  const end = Math.min(lastPage, start + 4);
  const pages = [];
  for (let p = start; p <= end; p++) pages.push(p);

  const baseBtn = "px-3 py-1.5 rounded-lg text-xs font-medium border border-app-border bg-app-neutral text-app-text disabled:opacity-40";
  const numBtn = "w-8 py-1.5 rounded-lg text-xs font-medium border";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
      <span className="text-xs text-app-text-secondary">
        Página {currentPage} de {lastPage} · {perPage} por página · {total} en total
      </span>
      <div className="flex gap-1 flex-wrap">
        <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className={baseBtn}>«</button>
        <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className={baseBtn}>← Anterior</button>
        {pages.map((p) => {
          const active = p === currentPage;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={numBtn}
              style={{
                backgroundColor: active ? "rgba(20,184,166,0.15)" : "var(--color-app-neutral)",
                borderColor: active ? "#14B8A6" : "var(--color-app-border)",
                color: active ? "#14B8A6" : "var(--color-app-text)",
              }}
            >
              {p}
            </button>
          );
        })}
        <button onClick={() => onPageChange(Math.min(lastPage, currentPage + 1))} disabled={currentPage === lastPage} className={baseBtn}>Siguiente →</button>
        <button onClick={() => onPageChange(lastPage)} disabled={currentPage === lastPage} className={baseBtn}>»</button>
      </div>
    </div>
  );
}

export default Pagination;
