import type { ReactNode } from "react";
import {
  Compass,
  Lightbulb,
  ListChecks,
  Target,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { NEXT_ACTION_PRIORITY_STYLES } from "@/lib/lead-utils";
import type { OpportunityIntelligenceResponse } from "@/lib/types";

type DecisionCardProps = {
  intelligence: OpportunityIntelligenceResponse;
};

function DecisionRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <div className="mt-1 text-sm leading-6 text-slate-700">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function DecisionCard({
  intelligence,
}: DecisionCardProps) {
  const topPainPoint = intelligence.pain_points[0];
  const topRecommendation =
    intelligence.recommended_services[0];

  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm ring-1 ring-blue-50">
      <div className="flex items-center gap-2">
        <Compass className="h-5 w-5 text-blue-600" />

        <div>
          <h3 className="font-semibold text-slate-950">
            Decisão recomendada
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Leitura rápida da situação desta empresa.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <DecisionRow
          icon={
            <TrendingUp className="h-4 w-4 text-slate-500" />
          }
          label="Situação"
        >
          {intelligence.digital_health.summary}
        </DecisionRow>

        <DecisionRow
          icon={
            <Lightbulb className="h-4 w-4 text-amber-500" />
          }
          label="Interpretação"
        >
          {topPainPoint
            ? topPainPoint.description
            : "Nenhum ponto de atenção crítico identificado até o momento."}
        </DecisionRow>

        <DecisionRow
          icon={<Target className="h-4 w-4 text-red-500" />}
          label="Oportunidade"
        >
          Índice {intelligence.opportunity.index}/100 ·
          Temperatura{" "}
          <span className="capitalize">
            {intelligence.opportunity.temperature}
          </span>
        </DecisionRow>

        <DecisionRow
          icon={
            <ListChecks className="h-4 w-4 text-emerald-600" />
          }
          label="Recomendação"
        >
          {topRecommendation
            ? `${topRecommendation.service} — ${topRecommendation.reason}`
            : "Nenhuma recomendação disponível até o momento."}
        </DecisionRow>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            Ação principal
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            {intelligence.next_action.action}
          </p>
        </div>

        <Badge
          variant="outline"
          className={
            NEXT_ACTION_PRIORITY_STYLES[
              intelligence.next_action.priority
            ]
          }
        >
          Prioridade {intelligence.next_action.priority}
        </Badge>
      </div>
    </section>
  );
}
