import { useState } from "react";
import { useNavigate } from "react-router-dom";
import backofficeApi from "../../services/backofficeApi";
import { useToast } from "../../contexts/ToastContext";

function AdminCreateCategoryPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [descripcio, setDescripcio] = useState("");
  const [subcategories, setSubcategories] = useState(["", "", ""]);
  const [subDescriptions, setSubDescriptions] = useState(["", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const catRes = await backofficeApi.post("/backoffice/categories", {
        nom,
        descripcio,
      });

      const catId = catRes.data.data?.id ?? catRes.data.id;

      const subsToCreate = subcategories
        .map((sub, i) => ({
          nom: sub,
          descripcio: subDescriptions[i],
        }))
        .filter((s) => s.nom.trim() !== "");

      await Promise.all(
        subsToCreate.map((s) =>
          backofficeApi.post("/backoffice/subcategories", {
            nom: s.nom,
            descripcio: s.descripcio,
            categoria_id: catId,
          })
        )
      );

      showToast("Categoría creada correctamente.");
      navigate("/backoffice/categories");
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear la categoría.");
    } finally {
      setLoading(false);
    }
  };

  const updateSub = (i, value) => {
    const updated = [...subcategories];
    updated[i] = value;
    setSubcategories(updated);
  };

  const updateSubDescription = (i, value) => {
    const updated = [...subDescriptions];
    updated[i] = value;
    setSubDescriptions(updated);
  };

  const inputClass = "w-full rounded-lg px-4 py-3 text-sm outline-none bg-app-neutral border border-app-border text-app-text";

  return (
    <div className="p-4 lg:p-8 max-w-2xl">
      <button
        onClick={() => navigate("/backoffice/categories")}
        className="text-sm text-app-text-secondary hover:text-app-text mb-6 flex items-center gap-1"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold font-heading text-app-text mb-1">
        Nueva categoría
      </h1>

      <p className="text-sm text-app-text-secondary mb-8">
        Crea una categoría padre y hasta 3 subcategorías a la vez
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="rounded-xl border border-app-border bg-app-bg-card p-6 flex flex-col gap-4">
          <h2 className="text-base font-bold font-heading text-app-text">
            Categoría padre
          </h2>

          <div>
            <label className="block text-sm font-medium text-app-text mb-1.5">
              Nombre *
            </label>

            <input aria-label="Nombre"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              placeholder="Ej: Herramientas"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-app-text mb-1.5">
              Descripción
            </label>

            <textarea aria-label="Descripción"
              value={descripcio}
              onChange={(e) => setDescripcio(e.target.value)}
              rows={3}
              placeholder="Ej: Herramientas para reformas, bricolaje y mantenimiento."
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        <div className="rounded-xl border border-app-border bg-app-bg-card p-6 flex flex-col gap-4">
          <div>
            <h2 className="text-base font-bold font-heading text-app-text">
              Subcategorías
            </h2>

            <p className="text-xs text-app-text-secondary mt-1">
              Opcional. Deja en blanco las que no necesites.
            </p>
          </div>

          {subcategories.map((sub, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div>
                <label className="block text-sm font-medium text-app-text mb-1.5">
                  Subcategoría {i + 1}
                </label>

                <input aria-label="Subcategoría"
                  type="text"
                  value={sub}
                  onChange={(e) => updateSub(i, e.target.value)}
                  placeholder={["Ej: Taladros", "Ej: Sierras", "Ej: Lijadoras"][i]}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-app-text mb-1.5">
                  Descripción
                </label>

                <textarea aria-label="Descripción"
                  value={subDescriptions[i]}
                  onChange={(e) => updateSubDescription(i, e.target.value)}
                  rows={2}
                  placeholder="Descripción opcional"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/backoffice/categories")}
            className="flex-1 rounded-xl py-3 text-sm font-medium border border-app-border text-app-text-secondary hover:bg-app-neutral transition-colors"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-xl py-3 text-sm font-bold bg-app-primary hover:bg-app-primary-hover text-white disabled:opacity-60 transition-colors"
          >
            {loading ? "Creando..." : "Crear categoría"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminCreateCategoryPage;