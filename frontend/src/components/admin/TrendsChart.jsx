import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function TrendsChart({ trends }) {
  const [view, setView] = useState("monthly");

  const data = (trends?.[view] ?? []).map((d) => ({
    label: d[view === "monthly" ? "month" : "week"],
    count: d.count,
  }));

  return (
    <div className="rounded-xl border border-app-border bg-app-bg-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h2 className="text-base font-bold font-heading text-app-text">Tendencia de transacciones</h2>
        <div className="flex flex-col sm:flex-row rounded-lg overflow-hidden border border-app-border self-start">
          <button
            onClick={() => setView("monthly")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === "monthly" ? "bg-app-primary/15 text-app-primary" : "text-app-text-secondary"}`}
          >
            Mensual
          </button>
          <button
            onClick={() => setView("weekly")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === "weekly" ? "bg-app-primary/15 text-app-primary" : "text-app-text-secondary"}`}
          >
            Semanal
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid stroke="var(--color-app-border)" strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fill: "var(--color-app-text-secondary)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--color-app-text-secondary)", fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
          <Tooltip contentStyle={{ background: "var(--color-app-bg-card)", border: "1px solid var(--color-app-border)", borderRadius: 8, color: "var(--color-app-text)", fontSize: 13 }} />
          <Line type="monotone" dataKey="count" stroke="var(--color-app-primary)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TrendsChart;