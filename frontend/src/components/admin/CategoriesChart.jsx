import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const COLORS = ["var(--color-app-primary)", "var(--color-app-secondary)", "var(--color-app-primary-hover)"];

function CategoriesChart({ categories }) {
  const data = categories.map((c) => ({ name: c.nom, count: c.count }));

  return (
    <div className="rounded-xl border border-app-border bg-app-bg-card p-6">
      <h2 className="text-base font-bold font-heading text-app-text mb-5">
        Categorías más activas
      </h2>

      {!data.length ? (
        <p className="text-sm text-app-text-secondary">Sin datos disponibles</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="w-full lg:w-1/2 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid
                  stroke="var(--color-app-border)"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  tick={{ fill: "var(--color-app-text-secondary)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fill: "var(--color-app-text-secondary)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />

                <Tooltip
                  contentStyle={{
                    background: "var(--color-app-bg-card)",
                    border: "1px solid var(--color-app-border)",
                    borderRadius: 8,
                    color: "var(--color-app-text)",
                    fontSize: 13,
                  }}
                  labelStyle={{
                    color: "var(--color-app-text)",
                  }}
                  itemStyle={{
                    color: "var(--color-app-text)",
                  }}
                  formatter={(v) => [v, "Transacciones"]}
                  cursor={{ fill: "transparent" }}
                />

                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <ul className="w-full lg:w-1/2 flex flex-col gap-3">
            {data.map((cat) => {
              const pct = Math.round((cat.count / data[0].count) * 100);

              return (
                <li key={cat.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-app-text">{cat.name}</span>
                    <span className="text-app-text-secondary">{cat.count}</span>
                  </div>

                  <div className="h-1.5 rounded-full bg-app-neutral overflow-hidden">
                    <div
                      className="h-full rounded-full bg-app-primary"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CategoriesChart;