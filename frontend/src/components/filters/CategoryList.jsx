import { useState, useEffect } from "react";

function CategoryList({ categories = [], filters, applyFilterPatch, onSelect }) {
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!filters?.category) return;
    setExpandedId(Number(filters.category));
  }, [filters?.category]);

  const toggle = (catId) =>
    setExpandedId((current) => (current === catId ? null : catId));

  return (
    <div className="flex flex-col">
      {categories.map((cat) => {
        const isExpanded = expandedId === cat.id;
        const isActive = Number(filters?.category) === cat.id;
        return (
          <div key={cat.id} className="flex flex-col">
            <button
              type="button"
              onClick={() => toggle(cat.id)}
              className={`flex items-center justify-between px-2 py-2 rounded-lg transition-colors text-left ${
                isActive
                  ? "bg-app-primary/10 text-app-primary"
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
                  onClick={() => {
                    applyFilterPatch({
                      category: cat.id,
                      subcategory: null,
                    });
                    if (onSelect) onSelect();
                  }}
                  className={`text-left px-2 py-1.5 rounded text-caption transition-colors ${
                    isActive && !filters?.subcategory
                      ? "text-app-primary font-bold"
                      : "text-app-text-secondary hover:text-app-text"
                  }`}
                >
                  Toda la categoría
                </button>
                {cat.subcategories.map((sub) => {
                  const isSubActive = Number(filters?.subcategory) === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        applyFilterPatch({
                          category: cat.id,
                          subcategory: sub.id,
                        });
                        if (onSelect) onSelect();
                      }}
                      className={`text-left px-2 py-1.5 rounded text-caption transition-colors ${
                        isSubActive
                          ? "text-app-primary font-bold"
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
  );
}

export default CategoryList;
