import { useState, useEffect } from "react";
import backofficeApi from "../../services/backofficeApi";
import TrendsChart from "../../components/admin/TrendsChart";
import CategoriesChart from "../../components/admin/CategoriesChart";

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const fetchStats = () => {
      backofficeApi
        .get("/backoffice/stats")
        .then((res) => {
          if (alive) setStats(res.data);
        })
        .catch(() => {})
        .finally(() => {
          if (alive) setLoading(false);
        });
    };
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 rounded-full border-4 border-app-border border-t-app-primary animate-spin" />
      </div>
    );

  const cards = [
    { label: "Usuarios registrados", value: stats?.totals?.total_users },
    { label: "Usuarios activos", value: stats?.totals?.active_users },
    {
      label: "En línea (últimos 5 min)",
      value: stats?.totals?.online_users,
      highlight: true,
    },
    { label: "Objetos publicados", value: stats?.totals?.total_objects },
    { label: "Transacciones", value: stats?.totals?.total_transactions },
    { label: "Reportes pendientes", value: stats?.totals?.pending_reports },
  ];

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-app-text">
          Dashboard
        </h1>
        <p className="text-sm text-app-text-secondary mt-1">
          Vista general de la plataforma
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map(({ label, value, highlight }) => (
          <div
            key={label}
            className={`rounded-xl border p-5 ${highlight ? "border-app-secondary/40 bg-app-secondary/5" : "border-app-border bg-app-bg-card"}`}
          >
            <p className="text-sm text-app-text-secondary mb-1">{label}</p>
            <p
              className={`text-3xl font-bold font-heading ${highlight ? "text-app-secondary" : "text-app-text"}`}
            >
              {value ?? "—"}
            </p>
          </div>
        ))}
      </div>

      <TrendsChart trends={stats?.trends} />
      <CategoriesChart categories={stats?.popular_categories ?? []} />
    </div>
  );
}

export default AdminDashboardPage;
