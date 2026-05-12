import { useState, useEffect } from "react";
import api from "../../services/api";
import TrendsChart from "../../components/admin/TrendsChart";
import CategoriesChart from "../../components/admin/CategoriesChart";

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="h-8 w-8 rounded-full border-4 border-app-border border-t-app-primary animate-spin" />
    </div>
  );

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-app-text">Dashboard</h1>
        <p className="text-sm text-app-text-secondary mt-1">Vista general de la plataforma</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Usuarios registrados", value: stats?.totals?.total_users },
          { label: "Objetos publicados", value: stats?.totals?.total_objects },
          { label: "Transacciones", value: stats?.totals?.total_transactions },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-app-border bg-app-bg-card p-5">
            <p className="text-sm text-app-text-secondary mb-1">{label}</p>
            <p className="text-3xl font-bold text-app-text font-heading">{value ?? "—"}</p>
          </div>
        ))}
      </div>

      <TrendsChart trends={stats?.trends} />
      <CategoriesChart categories={stats?.popular_categories ?? []} />
    </div>
  );
}

export default AdminDashboardPage;