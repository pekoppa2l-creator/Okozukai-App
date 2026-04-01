"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyMetricRow } from "@/lib/roi";

type Props = {
  data: DailyMetricRow[];
};

export function RoiMixedChart({ data }: Props) {
  const chartData = data.map((row) => ({
    date: row.metric_date,
    launches: row.launch_count ?? 0,
    workHours: Number((row.work_hours ?? 0).toFixed(2)),
  }));

  return (
    <div className="h-[520px] w-full rounded-2xl border border-slate-200 bg-white p-4">
      <ResponsiveContainer>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
          <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis yAxisId="left" tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: "#64748b", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              background: "#ffffff",
            }}
          />
          <Legend />
          <Bar yAxisId="right" dataKey="workHours" name="作業時間(h)" fill="#14b8a6" radius={[6, 6, 0, 0]} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="launches"
            name="利用回数"
            stroke="#f97316"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
