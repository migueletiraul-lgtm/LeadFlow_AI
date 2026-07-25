import { DollarSign, Percent, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import MetricCard from "@/components/intelligence/MetricCard";
import SectionCard from "@/components/intelligence/SectionCard";

type PriorityLead = {
  id: number | null;
  name: string | null;
  opportunity_index: number;
  temperature: string;
  win_probability_score: number;
};

type ExecutiveDashboardCardProps = {
  summary: string;
  potentialRevenue: number | null;
  avgWinProbability: number;
  priorityLeads: PriorityLead[];
};

const TEMPERATURE_BADGE_STYLES: Record<string, string> = {
  "muito quente": "border-red-200 bg-red-50 text-red-700",
  "quente": "border-orange-200 bg-orange-50 text-orange-700",
  "morno": "border-amber-200 bg-amber-50 text-amber-700",
  "frio": "border-blue-200 bg-blue-50 text-blue-700",
};

function getWinProbabilityColor(score: number) {
  if (score >= 70) {
    return "text-emerald-600";
  }

  if (score >= 40) {
    return "text-amber-600";
  }

  return "text-red-600";
}

function formatRevenue(value: number | null) {
  if (value === null) {
    return "Não informado";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function ExecutiveDashboardCard({
  summary,
  potentialRevenue,
  avgWinProbability,
  priorityLeads,
}: ExecutiveDashboardCardProps) {
  return (
    <SectionCard
      title="Painel Executivo"
      description="Visão executiva do pipeline de oportunidades."
      icon={Trophy}
    >
      <p className="text-sm leading-6 text-slate-600">{summary}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <MetricCard
          title="Potencial de Receita"
          value={formatRevenue(potentialRevenue)}
          icon={DollarSign}
          color={
            potentialRevenue !== null
              ? "text-emerald-600"
              : "text-slate-500"
          }
        />

        <MetricCard
          title="Chance Média de Fechamento"
          value={`${avgWinProbability}%`}
          icon={Percent}
          color={getWinProbabilityColor(avgWinProbability)}
        />
      </div>

      {priorityLeads.length > 0 && (
        <div className="mt-4 space-y-3">
          <p className="text-xs font-medium text-slate-500">
            Leads prioritários
          </p>

          {priorityLeads.map((lead) => (
            <div
              key={lead.id ?? lead.name}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="font-semibold text-slate-900">
                {lead.name ?? "Empresa sem nome"}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    TEMPERATURE_BADGE_STYLES[lead.temperature] ??
                    "border-slate-200 bg-slate-100 text-slate-700"
                  }
                >
                  {lead.temperature}
                </Badge>

                <Badge variant="outline">
                  Fechamento: {lead.win_probability_score}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
