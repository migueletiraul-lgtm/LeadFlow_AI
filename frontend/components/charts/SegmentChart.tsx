"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Lead } from "@/lib/types";

type SegmentChartProps = {
  leads: Lead[];
};

export default function SegmentChart({
  leads,
}: SegmentChartProps) {
  const nicheMap = new Map<string, number>();

  leads.forEach((lead) => {
    const niche = lead.niche?.trim() || "Não informado";

    nicheMap.set(
      niche,
      (nicheMap.get(niche) ?? 0) + 1,
    );
  });

  const data = Array.from(nicheMap.entries())
    .map(([name, total]) => ({
      name,
      total,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Leads por nicho</CardTitle>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-80 items-center justify-center text-sm text-slate-500">
            Nenhum dado disponível.
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{
                  top: 8,
                  right: 24,
                  bottom: 8,
                  left: 8,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#e2e8f0"
                />

                <XAxis
                  type="number"
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  cursor={{
                    fill: "rgba(37, 99, 235, 0.05)",
                  }}
                  formatter={(value) => [
                    Number(value ?? 0),
                    "Leads",
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow:
                      "0 12px 30px rgba(15, 23, 42, 0.08)",
                  }}
                />

                <Bar
                  dataKey="total"
                  fill="#4f46e5"
                  radius={[0, 8, 8, 0]}
                  maxBarSize={34}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}