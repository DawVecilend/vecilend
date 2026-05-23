import { useState, useEffect } from "react";
import backofficeApi from "../../services/backofficeApi";
import ConfirmDeleteModal from "../../components/elementos/ConfirmDeleteModal";
import { useToast } from "../../contexts/ToastContext";
import { useBackofficeAuth } from "../../contexts/BackofficeAuthContext";

function AdminUsersPage() {
  const { showToast } = useToast();
  const { isAdmin } = useBackofficeAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [confirm, setConfirm] = useState({ open: false, action: null, user: null });
  const [confirmBusy, setConfirmBusy] = useState(false);

  useEffect(() => {
    backofficeApi.get("/backoffice/users")
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : res.data.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.nom?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || (filterStatus === "active" ? u.actiu : !u.actiu);
    return matchSearch && matchStatus;
  });

  const handleConfirm = async () => {
    setConfirmBusy(true);
    try {
      const { action, user } = confirm;
      if (action === "block") {
        await backofficeApi.put(`/backoffice/users/${user.id}/block`);
        setUsers((p) => p.map((u) => u.id === user.id ? { ...u, actiu: false } : u));
        showToast(`${user.nom} bloqueado.`);
      } else if (action === "unblock") {
        await backofficeApi.put(`/backoffice/users/${user.id}/unblock`);
        setUsers((p) => p.map((u) => u.id === user.id ? { ...u, actiu: true } : u));
        showToast(`${user.nom} desbloqueado.`);
      } else if (action === "delete") {
        await backofficeApi.delete(`/backoffice/users/${user.id}`);
        setUsers((p) => p.filter((u) => u.id !== user.id));
        showToast("Usuario eliminado.");
      }
      setConfirm({ open: false, action: null, user: null });
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
        onClose={() => setConfirm({ open: false, action: null, user: null })}
        onConfirm={handleConfirm}
        title={{ block: "Bloquear usuario", unblock: "Desbloquear usuario", delete: "Eliminar usuario" }[confirm.action] ?? ""}
        message={{
          block: `¿Bloquear a ${confirm.user?.nom}? No podrá acceder a la plataforma.`,
          unblock: `¿Restaurar el acceso de ${confirm.user?.nom}?`,
          delete: `¿Eliminar permanentemente a ${confirm.user?.nom}?`,
        }[confirm.action] ?? ""}
        confirmLabel={{ block: "Bloquear", unblock: "Desbloquear", delete: "Eliminar" }[confirm.action] ?? ""}
        busy={confirmBusy}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold font-heading text-app-text">Usuarios</h1>
      </div>

      <div className="flex flex-wrap gap-3">
        <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg px-4 py-2.5 text-sm outline-none bg-app-bg-card border border-app-border text-app-text flex-1 min-w-[200px]" />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={selectClass}>
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="blocked">Bloqueados</option>
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
                {["Usuario", "Email", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-app-text-secondary">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} className={`border-b border-app-border ${i % 2 === 0 ? "bg-app-bg-card" : "bg-app-bg"}`}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-app-text">{u.nom} {u.cognoms}</p>
                    <p className="text-xs text-app-text-secondary">@{u.username}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-app-text-secondary">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${u.actiu ? "bg-app-secondary/10 text-app-secondary" : "bg-red-500/10 text-red-400"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.actiu ? "bg-app-secondary" : "bg-red-400"}`} />
                      {u.actiu ? "Activo" : "Bloqueado"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {u.actiu
                        ? <button onClick={() => setConfirm({ open: true, action: "block", user: u })} className="text-xs px-3 py-1 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20">Bloquear</button>
                        : <button onClick={() => setConfirm({ open: true, action: "unblock", user: u })} className="text-xs px-3 py-1 rounded-lg bg-app-primary/10 text-app-primary hover:bg-app-primary/20">Activar</button>
                      }
                      {isAdmin && (
                        <button onClick={() => setConfirm({ open: true, action: "delete", user: u })} className="text-xs px-3 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">Eliminar</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsersPage;
