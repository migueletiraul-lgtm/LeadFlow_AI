"use client";

import {
  Building2,
  MapPin,
  Star,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Lead } from "@/lib/types";
import { getCompanyInitial } from "@/lib/lead-utils";

type LeadHeaderProps = {
  lead: Lead;
};

export default function LeadHeader({
  lead,
}: LeadHeaderProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-xl font-black text-blue-700 ring-1 ring-blue-100">
          {getCompanyInitial(lead.name)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                Empresa
              </p>

              <h2 className="mt-1 text-xl font-bold leading-tight text-slate-950">
                {lead.name}
              </h2>
            </div>

            <Badge
              variant="outline"
              className="shrink-0 border-blue-200 bg-blue-50 text-blue-700"
            >
              {lead.pipeline_stage ||
                "Novo Lead"}
            </Badge>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
              <Building2 className="h-4 w-4 shrink-0 text-slate-400" />

              <span className="truncate capitalize">
                {lead.niche ||
                  "Nicho não informado"}
              </span>
            </div>

            <div className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
              <MapPin className="h-4 w-4 shrink-0 text-slate-400" />

              <span className="truncate">
                {lead.city ||
                  "Cidade não informada"}
                {lead.state
                  ? `/${lead.state}`
                  : ""}
              </span>
            </div>

            <div className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
              <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400" />

              <span className="truncate">
                {lead.google_rating ??
                  "Sem nota"}

                {lead.google_reviews !== null &&
                  lead.google_reviews !==
                    undefined &&
                  ` (${lead.google_reviews} avaliações)`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}