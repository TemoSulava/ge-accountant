import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

interface ChartPoint {
  date: string;
  amount: number;
}

interface ReportChartProps {
  data: ChartPoint[];
  accent?: string;
}

export function ReportChart({ data, accent = "#4c6fff" }: ReportChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} dy={6} tick={{ fontSize: 10, fill: "#64748b" }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#64748b" }} width={48} />
          <Tooltip
            contentStyle={{
              borderRadius: 16,
              border: "1px solid rgba(148, 163, 184, 0.2)",
              backgroundColor: "rgba(255,255,255,0.9)"
            }}
            labelStyle={{ color: "#0f172a", fontWeight: 600 }}
          />
          <Line type="monotone" dataKey="amount" stroke={accent} strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
