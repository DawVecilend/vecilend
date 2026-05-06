import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/**
 * @param {Array} data    [{n, puntuacio, created_at}]
 * @param {string} title  Títol del gràfic
 * @param {string} color  Color de la línia (hex)
 */
function RatingEvolutionChart({ data = [], title, color = "#4fdbc8" }) {
  if (!data.length) {
    return (
      <div className="bg-[#161d1b] p-6 rounded-lg flex flex-col h-[300px]">
        <h3 className="text-app-text font-heading text-h3-desktop mb-4">
          {title}
        </h3>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-app-text-secondary italic">
            Encara no hi ha valoracions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#161d1b] p-6 rounded-lg h-[300px] flex flex-col">
      <h3 className="text-app-text font-heading text-h3-desktop mb-4">
        {title}{" "}
        <span className="text-app-text-secondary text-label font-body">
          ({data.length} valoraciones)
        </span>
      </h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid stroke="#252b2a" strokeDasharray="3 3" />
            <XAxis
              dataKey="n"
              type="number"
              domain={[1, "dataMax"]}
              allowDecimals={false}
              tick={{ fill: "#859490", fontSize: 12 }}
              label={{
                value: "Nº valoración",
                position: "insideBottom",
                offset: -2,
                fill: "#859490",
                fontSize: 11,
              }}
            />
            <YAxis
              domain={[0, 5]}
              ticks={[0, 1, 2, 3, 4, 5]}
              tick={{ fill: "#859490", fontSize: 12 }}
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
    </div>
  );
}

export default RatingEvolutionChart;
