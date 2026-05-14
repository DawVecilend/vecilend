import { useState } from "react";
import { useNavigate } from "react-router-dom";
import backofficeApi from "../../services/backofficeApi";
import { useToast } from "../../contexts/ToastContext";

function AdminCreateEmpleatPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: "",
    cognoms: "",
    email: "",
    username: "",
    password: "",
    password_confirmation: "",
    rol: "suport",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.password_confirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await backofficeApi.post("/backoffice/empleats", form);
      showToast("Empleado creado correctamente.");
      navigate("/backoffice/empleats");
    } catch (err) {
      setError(err.response?.data?.message || Object.values(err.response?.data?.errors ?? {}).flat()[0] || "Error al crear el empleado.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-lg px-4 py-3 text-sm outline-none bg-app-neutral border border-app-border text-app-text";

  return (
    <div className="p-8 max-w-2xl">
      <button onClick={() => navigate("/backoffice/empleats")} className="text-sm text-app-text-secondary hover:text-app-text mb-6 flex items-center gap-1">
        ← Volver
      </button>
      <h1 className="text-2xl font-bold font-heading text-app-text mb-1">Nuevo empleado</h1>
      <p className="text-sm text-app-text-secondary mb-8">Crea una cuenta de acceso al panel para administradores o personal de soporte</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="rounded-xl border border-app-border bg-app-bg-card p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-app-text mb-1.5">Nombre *</label>
              <input type="text" value={form.nom} onChange={(e) => update("nom", e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-app-text mb-1.5">Apellidos *</label>
              <input type="text" value={form.cognoms} onChange={(e) => update("cognoms", e.target.value)} required className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-app-text mb-1.5">Email *</label>
            <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-app-text mb-1.5">Nombre de usuario *</label>
            <input type="text" value={form.username} onChange={(e) => update("username", e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-app-text mb-1.5">Rol *</label>
            <select value={form.rol} onChange={(e) => update("rol", e.target.value)} required className={inputClass + " cursor-pointer"}>
              <option value="suport">Soporte técnico</option>
              <option value="admin">Administrador</option>
            </select>
            <p className="text-xs text-app-text-secondary mt-1.5">
              {form.rol === "admin"
                ? "Acceso total al panel: usuarios, categorías, empleados y logs."
                : "Acceso limitado: solo dashboard, usuarios (lectura) y gestión de reportes."}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-app-text mb-1.5">Contraseña *</label>
            <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required className={inputClass} />
            <p className="text-xs text-app-text-secondary mt-1.5">Mínimo 8 caracteres, mayúsculas, minúsculas, números y símbolos.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-app-text mb-1.5">Confirmar contraseña *</label>
            <input type="password" value={form.password_confirmation} onChange={(e) => update("password_confirmation", e.target.value)} required className={inputClass} />
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate("/backoffice/empleats")} className="flex-1 rounded-xl py-3 text-sm font-medium border border-app-border text-app-text-secondary hover:bg-app-neutral transition-colors">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="flex-1 rounded-xl py-3 text-sm font-bold bg-app-primary hover:bg-app-primary-hover text-white disabled:opacity-60 transition-colors">
            {loading ? "Creando..." : "Crear empleado"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminCreateEmpleatPage;
