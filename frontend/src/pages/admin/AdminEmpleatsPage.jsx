import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backofficeApi from "../../services/backofficeApi";
import ConfirmDeleteModal from "../../components/elementos/ConfirmDeleteModal";
import { useToast } from "../../contexts/ToastContext";
import { useBackofficeAuth } from "../../contexts/BackofficeAuthContext";

function AdminEmpleatsPage() {
  const { showToast } = useToast();
  const { empleat: current } = useBackofficeAuth();
  const navigate = useNavigate();

  const [empleats, setEmpleats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRol, setFilterRol] = useState("all");
  const [confirm, setConfirm] = useState({ open: false, action: null, empleat: null });
  const [confirmBusy, setConfirmBusy] = useState(false);

  useEffect(() => {
    backofficeApi.get("/backoffice/empleats")
      .then((res) => setEmpleats(Array.isArray(res.data) ? res.data : res.data.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = empleats.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.nom?.toLowerCase().includes(q) || e.email?.toLowerCase().includes(q) || e.username?.toLowerCase().includes(q);
    const matchRol = filterRol === "all" || e.rol === filterRol;
    return matchSearch && matchRol;
  });

  const handleConfirm = async () => {
    setConfirmBusy(true);
    try {
      const { action, empleat } = confirm;
      if (action === "block") {
        await backofficeApi.put(`/backoffice/empleats/${empleat.id}`, { actiu: false });
        setEmpleats((p) => p.map((e) => e.id === empleat.id ? { ...e, actiu: false } : e));
        showToast(`${empleat.nom} desactivado.`);
      } else if (action === "unblock") {
        await backofficeApi.put(`/backoffice/empleats/${empleat.id}`, { actiu: true });
        setEmpleats((p) => p.map((e) => e.id === empleat.id ? { ...e, actiu: true } : e));
        showToast(`${empleat.nom} reactivado.`);
      } else if (action === "delete") {
        await backofficeApi.delete(`/backoffice/empleats/${empleat.id}`);
        setEmpleats((p) => p.filter((e) => e.id !== empleat.id));
        showToast("Empleado eliminado.");
      }
      setConfirm({ open: false, action: null, empleat: null });
    } catch (err) {
      showToast(err.response?.data?.message || "Error.", "error");
    } finally {
      setConfirmBusy(false);
    }
  };

  const selectClass = "rounded-lg px-3 py-2.5 text-sm outline-none bg-app-bg-card border border-app-border text-app-text cursor-pointer";

  return (
    <div className="p-4 lg:p-8 flex flex-col gap-6">
      <ConfirmDeleteModal
        open={confirm.open}
        onClose={() => setConfirm({ open: false, action: null, empleat: null })}
        onConfirm={handleConfirm}
        title={{ block: "Desactivar empleado", unblock: "Reactivar empleado", delete: "Eliminar empleado" }[confirm.action] ?? ""}
        message={{
          block: `¿Desactivar a ${confirm.empleat?.nom}? No podrá acceder al panel.`,
          unblock: `¿Reactivar el acceso de ${confirm.empleat?.nom}?`,
          delete: `¿Eliminar permanentemente a ${confirm.empleat?.nom}?`,
        }[confirm.action] ?? ""}
        confirmLabel={{ block: "Desactivar", unblock: "Reactivar", delete: "Eliminar" }[confirm.action] ?? ""}
        busy={confirmBusy}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold font-heading text-app-text">Empleados</h1>
        <button onClick={() => navigate("/backoffice/empleats/create")} className="px-4 py-2.5 rounded-xl text-sm font-bold bg-app-primary hover:bg-app-primary-hover text-white transition-colors">
          + Nuevo empleado
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg px-4 py-2.5 text-sm outline-none bg-app-bg-card border border-app-border text-app-text flex-1 min-w-[200px]" />
        <select value={filterRol} onChange={(e) => setFilterRol(e.target.value)} className={selectClass}>
          <option value="all">Todos los roles</option>
          <option value="admin">Administradores</option>
          <option value="suport">Soporte técnico</option>
        </select>
        <span className="self-center text-sm text-app-text-secondary">{filtered.length} resultados</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="h-8 w-8 rounded-full border-4 border-app-border border-t-app-primary animate-spin" />
        </div>
      ) : (
        <div className="rounded-xl border border-app-border overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="bg-app-neutral border-b border-app-border">
                {["Empleado", "Email", "Rol", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-app-text-secondary">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => {
                const isSelf = current && current.id === e.id;
                return (
                  <tr key={e.id} className={`border-b border-app-border ${i % 2 === 0 ? "bg-app-bg-card" : "bg-app-bg"}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-app-text">
                        {e.nom} {e.cognoms}
                        {isSelf && <span className="ml-2 text-xs text-app-text-secondary font-normal">(tú)</span>}
                      </p>
                      <p className="text-xs text-app-text-secondary">@{e.username}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-app-text-secondary">{e.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${e.rol === "admin" ? "bg-app-primary/10 text-app-primary" : "bg-app-secondary/10 text-app-secondary"}`}>
                        {e.rol === "admin" ? "Administrador" : "Soporte"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${e.actiu ? "bg-app-secondary/10 text-app-secondary" : "bg-red-500/10 text-red-400"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${e.actiu ? "bg-app-secondary" : "bg-red-400"}`} />
                        {e.actiu ? "Activo" : "Desactivado"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {!isSelf ? (
                        <div className="flex gap-2">
                          {e.actiu
                            ? <button onClick={() => setConfirm({ open: true, action: "block", empleat: e })} className="text-xs px-3 py-1 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20">Desactivar</button>
                            : <button onClick={() => setConfirm({ open: true, action: "unblock", empleat: e })} className="text-xs px-3 py-1 rounded-lg bg-app-primary/10 text-app-primary hover:bg-app-primary/20">Activar</button>
                          }
                          <button onClick={() => setConfirm({ open: true, action: "delete", empleat: e })} className="text-xs px-3 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">Eliminar</button>
                        </div>
                      ) : (
                        <span className="text-xs text-app-text-secondary">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminEmpleatsPage;
