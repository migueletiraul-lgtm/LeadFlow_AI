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

type ScoreChartProps = {
  leads: Lead[];
};

export default function ScoreChart({
  leads,
}: ScoreChartProps) {
  const data = [
    {
      faixa: "0–30",
      total: leads.filter(
        (lead) => lead.lead_score >= 0 && lead.lead_score <= 30,
      ).length,
    },
    {
      faixa: "31–60",
      total: leads.filter(
        (lead) => lead.lead_score >= 31 && lead.lead_score <= 60,
      ).length,
    },
    {
      faixa: "61–80",
      total: leads.filter(
        (lead) => lead.lead_score >= 61 && lead.lead_score <= 80,
      ).length,
    },
    {
      faixa: "81–100",
      total: leads.filter(
        (lead) => lead.lead_score >= 81 && lead.lead_score <= 100,
      ).length,
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Distribuição por score</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="faixa"
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "#64748b",
                  fontSize: 12,
                }}
              />

              <YAxis
                allowDecimals={false}
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
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
                }}
              />

              <Bar
                dataKey="total"
                fill="#2563eb"
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}