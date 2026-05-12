import { useState, useEffect } from "react";

function CategorySidebar({
  categories = [],
  filters,
  onOpenLocation,
  onOpenDates,
  onOpenPrice,
  onOpenRating,
  applyFilterPatch,
}) {
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!filters.category) return;
    setExpandedId(Number(filters.category));
  }, [filters.category]);

  const hasLocation = !!(filters.lat && filters.lng);
  const hasDates = !!(filters.data_inici && filters.data_fi);
  const hasPrice = !!(filters.min_price || filters.max_price);
  const hasRating = !!filters.min_user_rating;

  const toggle = (catId) =>
    setExpandedId((current) => (current === catId ? null : catId));

  return (
    <aside className="hidden lg:block w-64 shrink-0 pr-4">
      <div className="py-2">
        <h3 className="text-app-text-secondary text-caption font-bold uppercase tracking-widest mb-3 px-2">
          Filtros
        </h3>
        <div className="flex flex-col gap-2">
          <SidebarFilterButton
            icon="location_on"
            label={
              hasLocation
                ? `${Math.round((filters.radius || 5000) / 1000)} km`
                : "Ubicación"
            }
            active={hasLocation}
            onClick={onOpenLocation}
          />
          <SidebarFilterButton
            icon="calendar_month"
            label={
              hasDates ? `${filters.data_inici} → ${filters.data_fi}` : "Fechas"
            }
            active={hasDates}
            onClick={onOpenDates}
          />
          <SidebarFilterButton
            icon="payments"
            label={
              hasPrice
                ? filters.min_price && filters.max_price
                  ? `${filters.min_price}–${filters.max_price}€`
                  : filters.min_price
                    ? `Desde ${filters.min_price}€`
                    : `Hasta ${filters.max_price}€`
                : "Precio"
            }
            active={hasPrice}
            onClick={onOpenPrice}
          />
          <SidebarFilterButton
            icon="star"
            label={
              hasRating ? `${filters.min_user_rating}+ estrellas` : "Valoración"
            }
            active={hasRating}
            onClick={onOpenRating}
          />
        </div>
      </div>

      <div className="py-4 mt-4 border-t border-app-border">
        <h3 className="text-app-text-secondary text-caption font-bold uppercase tracking-widest mb-3 px-2">
          Categorías
        </h3>
        <div className="flex flex-col">
          {categories.map((cat) => {
            const isExpanded = expandedId === cat.id;
            const isActive = Number(filters.category) === cat.id;
            return (
              <div key={cat.id} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => toggle(cat.id)}
                  className={`flex items-center justify-between px-2 py-2 rounded-lg transition-colors text-left ${
                    isActive
                      ? "bg-vecilend-dark-primary/10 text-vecilend-dark-primary"
                      : "hover:bg-app-bg-card text-app-text"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {cat.icon && (
                      <span className="material-symbols-outlined text-base">
                        {cat.icon}
                      </span>
                    )}
                    <span className="text-label font-body">{cat.name}</span>
                  </span>
                  <span
                    className={`material-symbols-outlined text-base transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {isExpanded && (
                  <div className="ml-6 flex flex-col mt-1 border-l border-app-border/40 pl-3">
                    <button
                      type="button"
                      onClick={() =>
                        applyFilterPatch({
                          category: cat.id,
                          subcategory: null,
                        })
                      }
                      className={`text-left px-2 py-1.5 rounded text-caption transition-colors ${
                        isActive && !filters.subcategory
                          ? "text-vecilend-dark-primary font-bold"
                          : "text-app-text-secondary hover:text-app-text"
                      }`}
                    >
                      Toda la categoría
                    </button>
                    {cat.subcategories.map((sub) => {
                      const isSubActive =
                        Number(filters.subcategory) === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() =>
                            applyFilterPatch({
                              category: cat.id,
                              subcategory: sub.id,
                            })
                          }
                          className={`text-left px-2 py-1.5 rounded text-caption transition-colors ${
                            isSubActive
                              ? "text-vecilend-dark-primary font-bold"
                              : "text-app-text-secondary hover:text-app-text"
                          }`}
                        >
                          {sub.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function SidebarFilterButton({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-left ${
        active
          ? "border-vecilend-dark-primary bg-vecilend-dark-primary/10 text-vecilend-dark-primary"
          : "border-app-border bg-app-bg-card text-app-text hover:border-vecilend-dark-primary/50"
      }`}
    >
      <span className="material-symbols-outlined text-base">{icon}</span>
      <span className="text-label truncate flex-1">{label}</span>
    </button>
  );
}

export default CategorySidebar;
