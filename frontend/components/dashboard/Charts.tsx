"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { Lead } from "@/lib/types";

type Props = {
  leads: Lead[];
};

const COLORS = [
  "#2563EB",
  "#3B82F6",
  "#60A5FA",
  "#93C5FD",
];

export default function Charts({ leads }: Props) {
  const average =
    leads.length > 0
      ? Math.round(
          leads.reduce((a, b) => a + b.lead_score, 0) /
            leads.length
        )
      : 0;

  const scoreData = [
    {
      name: "Score",
      value: average,
    },
    {
      name: "Restante",
      value: 100 - average,
    },
  ];

  const niches = new Map<string, number>();

  leads.forEach((lead) => {
    niches.set(
      lead.niche,
      (niches.get(lead.niche) ?? 0) + 1
    );
  });

  const nicheData = [...niches.entries()].map(
    ([name, total]) => ({
      name,
      total,
    })
  );

  return (
    <div className="grid gap-6 xl:grid-cols-2">

      {/* SCORE */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-lg font-bold text-slate-900">
          Score Médio
        </h2>

        <div className="mt-8 flex justify-center">

          <div className="relative h-72 w-72">

            <ResponsiveContainer>

              <PieChart>

                <Pie
                  data={scoreData}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                >

                  {scoreData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        index === 0
                          ? "#2563EB"
                          : "#E2E8F0"
                      }
                    />
                  ))}

                </Pie>

              </PieChart>

            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center">

              <span className="text-5xl font-bold">
                {average}
              </span>

              <span className="text-sm text-slate-500">
                Score
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* NICHOS */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-lg font-bold text-slate-900">
          Leads por Nicho
        </h2>

        <div className="mt-8 h-72">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart data={nicheData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="total"
                radius={[8, 8, 0, 0]}
              >

                {nicheData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[index % COLORS.length]
                    }
                  />
                ))}

              </Bar>

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}