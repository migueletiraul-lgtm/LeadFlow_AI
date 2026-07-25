"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Lead } from "@/lib/types";

type CityChartProps = {
  leads: Lead[];
};

const COLORS = [
  "#2563eb",
  "#4f46e5",
  "#0ea5e9",
  "#14b8a6",
  "#8b5cf6",
  "#f59e0b",
];

export default function CityChart({
  leads,
}: CityChartProps) {
  const cityMap = new Map<string, number>();

  leads.forEach((lead) => {
    const city = lead.city?.trim() || "Não informada";

    cityMap.set(
      city,
      (cityMap.get(city) ?? 0) + 1,
    );
  });

  const data = Array.from(cityMap.entries())
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Leads por cidade</CardTitle>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-80 items-center justify-center text-sm text-slate-500">
            Nenhum dado disponível.
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                  stroke="transparent"
                >
                  {data.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
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

                <Legend
                  verticalAlign="bottom"
                  height={40}
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}