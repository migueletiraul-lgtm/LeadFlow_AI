"use client";

import { RefreshCw } from "lucide-react";

import type {
  Lead,
  OpportunityIntelligenceResponse,
} from "@/lib/types";

import CompanyActions from "./company-header/CompanyActions";
import CompanyBadges from "./company-header/CompanyBadges";
import CompanyIdentity from "./company-header/CompanyIdentity";
import CompanyLinks from "./company-header/CompanyLinks";

type CompanyHeaderProps = {
  lead: Lead;
  intelligence: OpportunityIntelligenceResponse | null;
  isLoading: boolean;
  error: string;
};

export default function CompanyHeader({
  lead,
  intelligence,
  isLoading,
  error,
}: CompanyHeaderProps) {
  const isEmpty =
    intelligence !== null &&
    intelligence.pain_points.length === 0 &&
    intelligence.recommended_services.length === 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <CompanyIdentity lead={lead} />

        <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
          {isLoading && (
            <span className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Calculando indicadores...
            </span>
          )}

          {!isLoading && error && (
            <span className="text-xs font-medium text-red-600">
              Indicadores indisponíveis.
            </span>
          )}

          {!isLoading && !error && isEmpty && (
            <span className="text-xs font-medium text-slate-400">
              Diagnóstico ainda não disponível.
            </span>
          )}

          {!isLoading &&
            !error &&
            intelligence &&
            !isEmpty && (
              <CompanyBadges intelligence={intelligence} />
            )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <CompanyLinks lead={lead} />

        <CompanyActions />
      </div>
    </section>
  );
}
