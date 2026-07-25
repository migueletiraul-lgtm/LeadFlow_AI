"use client";

import {
  Flame,
  Gauge,
  Star,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Lead } from "@/lib/types";
import {
  getScoreAccentClasses,
  getScoreLabel,
} from "@/lib/lead-utils";

type LeadScoreCardProps = {
  lead: Lead;
};

export default function LeadScoreCard({
  lead,
}: LeadScoreCardProps) {
  const accent = getScoreAccentClasses(
    lead.lead_score,
  );

  const scoreWidth = Math.min(
    100,
    Math.max(0, lead.lead_score),
  );

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br ${accent.glow}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Gauge
                className={`h-4 w-4 ${accent.icon}`}
              />

              Lead Score
            </div>

            <div className="mt-2 flex items-end gap-2">
              <span
                className={`text-4xl font-black tracking-tight ${accent.text}`}
              >
                {lead.lead_score}
              </span>

              <span className="pb-1 text-sm text-slate-500">
                /100
              </span>
            </div>
          </div>

          <Badge
            variant="outline"
            className={`gap-1.5 px-3 py-1 ${accent.badge}`}
          >
            <Flame className="h-3.5 w-3.5" />

            {getScoreLabel(
              lead.lead_score,
            )}
          </Badge>
        </div>

        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-white/80 ring-1 ring-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${accent.bar}`}
              style={{
                width: `${scoreWidth}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Prioridade comercial
          </span>

          <span className="flex items-center gap-1 font-semibold text-slate-700">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />

            {lead.google_rating ??
              "Sem nota"}
          </span>
        </div>
      </div>
    </section>
  );
}