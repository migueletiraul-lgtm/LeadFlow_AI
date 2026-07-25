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

type LeadChartProps = {
  leads: Lead[];
};

export function LeadChart({ leads }: LeadChartProps) {
  const data = [
    {
      faixa: "0–39",
      quantidade: leads.filter(
        (lead) => lead.lead_score < 40,
      ).length,
    },
    {
      faixa: "40–59",
      quantidade: leads.filter(
        (lead) =>
          lead.lead_score >= 40 &&
          lead.lead_score < 60,
      ).length,
    },
    {
      faixa: "60–79",
      quantidade: leads.filter(
        (lead) =>
          lead.lead_score >= 60 &&
          lead.lead_score < 80,
      ).length,
    },
    {
      faixa: "80–100",
      quantidade: leads.filter(
        (lead) => lead.lead_score >= 80,
      ).length,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Lead Score</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="faixa" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="quantidade"
                fill="currentColor"
                radius={[8, 8, 0, 0]}
                className="fill-blue-600"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}