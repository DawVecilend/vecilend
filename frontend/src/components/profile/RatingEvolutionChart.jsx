import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const MAX_POINTS = 20;

/**
 * @param {Array} data    [{n, puntuacio, created_at}]
 * @param {string} title  Títol del gràfic
 * @param {string} color  Color de la línia (hex)
 */
function RatingEvolutionChart({ data = [], title, color = "#4fdbc8" }) {
  const totalCount = data.length;

  // Mostrem com a màxim les 20 últimes valoracions, renumerades per evitar gaps a l'eix
  const displayedData = useMemo(() => {
    const slice =
      totalCount > MAX_POINTS ? data.slice(totalCount - MAX_POINTS) : data;
    return slice.map((item, idx) => ({ ...item, n: idx + 1 }));
  }, [data, totalCount]);

  // Ticks a múltiples fixos: 1, 5, 10, 15, 20… i sempre afegim l'últim si no hi és
  const xTicks = useMemo(() => {
    if (displayedData.length === 0) return [];
    const len = displayedData.length;
    const STEP = 5;

    const ticks = [1];
    for (let i = STEP; i <= len; i += STEP) ticks.push(i);
    if (ticks[ticks.length - 1] !== len) ticks.push(len);

    return ticks;
  }, [displayedData]);

  if (!totalCount) {
    return (
      <div className="bg-[#161d1b] p-6 rounded-lg flex flex-col h-[320px]">
        <h3 className="text-app-text font-heading text-h3-desktop mb-4">
          {title}
        </h3>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-app-text-secondary italic">
            Aún no hay valoraciones.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#161d1b] p-6 rounded-lg h-[320px] flex flex-col">
      <h3 className="text-app-text font-heading text-h3-desktop mb-4">
        {title}{" "}
        <span className="text-app-text-secondary text-label font-body">
          ({totalCount} {totalCount === 1 ? "valoración" : "valoraciones"})
        </span>
      </h3>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={displayedData}
            margin={{ top: 10, right: 15, left: 0, bottom: 25 }}
          >
            <CartesianGrid stroke="#252b2a" strokeDasharray="3 3" />
            <XAxis
              dataKey="n"
              type="number"
              domain={[1, displayedData.length]}
              ticks={xTicks}
              allowDecimals={false}
              tick={{ fill: "#859490", fontSize: 12 }}
              label={{
                value: "Nº valoraciones",
                position: "insideBottom",
                offset: -15,
                fill: "#859490",
                fontSize: 12,
              }}
            />
            <YAxis
              domain={[0, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tickFormatter={(v) => `${v}★`}
              tick={{ fill: "#859490", fontSize: 12 }}
              width={45}
            />
            <Tooltip
              contentStyle={{
                background: "#0e1513",
                border: "1px solid #3c4947",
                borderRadius: 8,
                color: "#dde4e1",
              }}
              labelFormatter={(n) => `Valoración nº ${n}`}
              formatter={(v) => [`${v} ★`, "Puntuación"]}
            />
            <Line
              type="monotone"
              dataKey="puntuacio"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {totalCount > MAX_POINTS && (
        <p className="text-[10px] text-[#859490] italic text-center mt-2">
          Mostrando las últimas {MAX_POINTS} valoraciones de {totalCount} en
          total
        </p>
      )}
    </div>
  );
}

export default RatingEvolutionChart;
