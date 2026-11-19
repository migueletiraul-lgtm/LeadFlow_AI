"use client";

import { Activity, Flame, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type {
  DigitalHealthLevel,
  OpportunityIntelligenceResponse,
  OpportunityTemperature,
} from "@/lib/types";

type CompanyBadgesProps = {
  intelligence: OpportunityIntelligenceResponse;
};

const DIGITAL_HEALTH_STYLES: Record<
  DigitalHealthLevel,
  string
> = {
  "crítico": "border-red-200 bg-red-50 text-red-700",
  "baixo": "border-orange-200 bg-orange-50 text-orange-700",
  "médio": "border-amber-200 bg-amber-50 text-amber-700",
  "bom": "border-blue-200 bg-blue-50 text-blue-700",
  "excelente":
    "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const TEMPERATURE_STYLES: Record<
  OpportunityTemperature,
  string
> = {
  "frio": "border-slate-200 bg-slate-100 text-slate-700",
  "morno": "border-amber-200 bg-amber-50 text-amber-700",
  "quente": "border-orange-200 bg-orange-50 text-orange-700",
  "muito quente": "border-red-200 bg-red-50 text-red-700",
};

function getScoreStyle(score: number) {
  if (score >= 70) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (score >= 40) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-red-200 bg-red-50 text-red-700";
}

export default function CompanyBadges({
  intelligence,
}: CompanyBadgesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge
        variant="outline"
        className={`gap-1.5 font-semibold ${getScoreStyle(
          intelligence.opportunity.index,
        )}`}
      >
        <Target className="h-3.5 w-3.5" />
        Opportunity {intelligence.opportunity.index}
      </Badge>

      <Badge
        variant="outline"
        className={`gap-1.5 font-semibold ${
          DIGITAL_HEALTH_STYLES[
            intelligence.digital_health.level
          ]
        }`}
      >
        <Activity className="h-3.5 w-3.5" />
        Digital Health {intelligence.digital_health.score}
      </Badge>

      <Badge
        variant="outline"
        className={`gap-1.5 font-semibold capitalize ${
          TEMPERATURE_STYLES[
            intelligence.opportunity.temperature
          ]
        }`}
      >
        <Flame className="h-3.5 w-3.5" />
        {intelligence.opportunity.temperature}
      </Badge>
    </div>
  );
}
