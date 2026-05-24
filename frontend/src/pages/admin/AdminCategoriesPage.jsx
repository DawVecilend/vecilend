import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backofficeApi from "../../services/backofficeApi";
import ConfirmDeleteModal from "../../components/elementos/ConfirmDeleteModal";
import { useToast } from "../../contexts/ToastContext";

function AdminCategoriesPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    backofficeApi.get("/backoffice/categories")
      .then((res) => setCategories(Array.isArray(res.data) ? res.data : res.data.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const startEdit = (id, nom, descripcio = "") => {
    setEditingId(id);
    setEditingName(nom);
    setEditingDescription(descripcio ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
    setEditingDescription("");
  };

  const saveEdit = async (type, id, parentId = null) => {
    try {
      if (type === "category") {
        await backofficeApi.put(`/backoffice/categories/${id}`, {
          nom: editingName,
          descripcio: editingDescription,
        });

        setCategories((p) => p.map((c) => c.id === id
          ? { ...c, nom: editingName, descripcio: editingDescription }
          : c
        ));
      } else {
        await backofficeApi.put(`/backoffice/subcategories/${id}`, {
          nom: editingName,
          descripcio: editingDescription,
          categoria_id: parentId,
        });

        setCategories((p) => p.map((c) => c.id === parentId
          ? {
              ...c,
              subcategories: c.subcategories.map((s) => s.id === id
                ? { ...s, nom: editingName, descripcio: editingDescription }
                : s
              ),
            }
          : c
        ));
      }

      showToast("Guardado.");
      cancelEdit();
    } catch {
      showToast("Error al guardar.", "error");
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);

    try {
      if (deleteTarget.type === "subcategory") {
        await backofficeApi.delete(`/backoffice/subcategories/${deleteTarget.id}`);

        setCategories((p) => p.map((c) => c.id === deleteTarget.parentId
          ? { ...c, subcategories: c.subcategories.filter((s) => s.id !== deleteTarget.id) }
          : c
        ));
      } else {
        await backofficeApi.delete(`/backoffice/categories/${deleteTarget.id}`);

        setCategories((p) => p.filter((c) => c.id !== deleteTarget.id));
      }

      showToast("Eliminado.");
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.response?.data?.message || "Error al eliminar.", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 flex flex-col gap-6">
      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Eliminar ${deleteTarget?.type === "subcategory" ? "subcategoría" : "categoría"}`}
        message={`¿Eliminar "${deleteTarget?.nom}"? Esta acción no se puede deshacer.`}
        busy={deleteLoading}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold font-heading text-app-text">Categorías</h1>

        <button
          onClick={() => navigate("/backoffice/categories/create")}
          className="px-4 py-2.5 rounded-xl text-sm font-bold bg-app-primary hover:bg-app-primary-hover text-white transition-colors"
        >
          + Nueva categoría
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="h-8 w-8 rounded-full border-4 border-app-border border-t-app-primary animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <div key={cat.id} className="rounded-xl border border-app-border overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 sm:px-5 py-4 bg-app-bg-card">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => setExpanded((p) => ({ ...p, [cat.id]: !p[cat.id] }))}
                    className="text-app-text-secondary w-4 shrink-0 pt-1"
                  >
                    {expanded[cat.id] ? "▾" : "▸"}
                  </button>

                  {editingId === cat.id ? (
                    <div className="flex-1 flex flex-col gap-2 min-w-0">
                      <input aria-label="Nombre"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        autoFocus
                        className="rounded-lg px-3 py-1.5 text-sm bg-app-neutral border border-app-border text-app-text outline-none"
                      />

                      <textarea aria-label="Descripción"
                        value={editingDescription}
                        onChange={(e) => setEditingDescription(e.target.value)}
                        placeholder="Descripción"
                        rows={2}
                        className="rounded-lg px-3 py-1.5 text-sm bg-app-neutral border border-app-border text-app-text outline-none resize-none"
                      />
                    </div>
                  ) : (
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold text-app-text break-words">
                        {cat.nom}
                      </span>

                      <span className="block text-xs text-app-text-secondary break-words">
                        {cat.descripcio || "Sin descripción"}
                      </span>

                      <span className="block text-xs text-app-text-secondary mt-1 sm:hidden">
                        {cat.subcategories_count ?? cat.subcategories?.length ?? 0} subcategorías
                      </span>
                    </div>
                  )}

                  <span className="text-xs text-app-text-secondary hidden sm:block shrink-0">
                    {cat.subcategories_count ?? cat.subcategories?.length ?? 0} subcategorías
                  </span>
                </div>

                <div className="flex gap-2 sm:shrink-0 self-end sm:self-auto">
                  {editingId === cat.id ? (
                    <>
                      <button
                        onClick={() => saveEdit("category", cat.id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-app-primary/10 text-app-primary hover:bg-app-primary/20"
                      >
                        Guardar
                      </button>

                      <button
                        onClick={cancelEdit}
                        className="text-xs px-3 py-1.5 rounded-lg bg-app-neutral text-app-text-secondary"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(cat.id, cat.nom, cat.descripcio)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-app-primary/10 text-app-primary hover:bg-app-primary/20"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => setDeleteTarget({ ...cat, type: "category" })}
                        className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>

              {expanded[cat.id] && (
                <div className="border-t border-app-border bg-app-bg">
                  {cat.subcategories?.length > 0 ? cat.subcategories.map((sub) => (
                    <div key={sub.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 sm:px-5 py-3 sm:pl-12 border-b border-app-border">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-app-primary flex-shrink-0 mt-2" />

                        {editingId === `sub-${sub.id}` ? (
                          <div className="flex-1 flex flex-col gap-2 min-w-0">
                            <input aria-label="Nombre"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              autoFocus
                              className="rounded-lg px-3 py-1.5 text-sm bg-app-neutral border border-app-border text-app-text outline-none"
                            />

                            <textarea aria-label="Descripción"
                              value={editingDescription}
                              onChange={(e) => setEditingDescription(e.target.value)}
                              placeholder="Descripción"
                              rows={2}
                              className="rounded-lg px-3 py-1.5 text-sm bg-app-neutral border border-app-border text-app-text outline-none resize-none"
                            />
                          </div>
                        ) : (
                          <div className="flex-1 min-w-0">
                            <span className="block text-sm text-app-text break-words">
                              {sub.nom}
                            </span>

                            <span className="block text-xs text-app-text-secondary break-words">
                              {sub.descripcio || "Sin descripción"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 sm:shrink-0 self-end sm:self-auto">
                        {editingId === `sub-${sub.id}` ? (
                          <>
                            <button
                              onClick={() => saveEdit("subcategory", sub.id, cat.id)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-app-primary/10 text-app-primary hover:bg-app-primary/20"
                            >
                              Guardar
                            </button>

                            <button
                              onClick={cancelEdit}
                              className="text-xs px-3 py-1.5 rounded-lg bg-app-neutral text-app-text-secondary"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(`sub-${sub.id}`, sub.nom, sub.descripcio)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-app-primary/10 text-app-primary hover:bg-app-primary/20"
                            >
                              Editar
                            </button>

                            <button
                              onClick={() => setDeleteTarget({ ...sub, type: "subcategory", parentId: cat.id })}
                              className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )) : (
                    <p className="px-12 py-3 text-xs text-app-text-secondary">
                      Sin subcategorías
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminCategoriesPage;