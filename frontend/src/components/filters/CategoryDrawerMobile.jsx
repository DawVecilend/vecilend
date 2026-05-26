import { useEffect } from "react";
import CategoryList from "./CategoryList";

function CategoryDrawerMobile({
  open,
  onClose,
  categories = [],
  filters,
  applyFilterPatch,
}) {
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-[360px] bg-app-bg border-r border-app-border shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-app-border">
          <h2 className="font-heading text-h3-mobile text-app-text">
            Categorías
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-app-bg-card transition-colors"
          >
            <span className="material-symbols-outlined text-app-text">
              close
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          <button
            type="button"
            onClick={() => {
              applyFilterPatch({ category: null, subcategory: null });
              onClose();
            }}
            className={`w-full text-left px-2 py-2 rounded-lg transition-colors mb-1 ${
              !filters?.category
                ? "bg-app-primary/10 text-app-primary font-bold"
                : "text-app-text hover:bg-app-bg-card"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">
                apps
              </span>
              <span className="text-label font-body">Todas las categorías</span>
            </span>
          </button>

          <CategoryList
            categories={categories}
            filters={filters}
            applyFilterPatch={applyFilterPatch}
            onSelect={onClose}
          />
        </div>
      </div>
    </div>
  );
}

export default CategoryDrawerMobile;
