"use client";

import { Building2, MapPin } from "lucide-react";

import type { Lead } from "@/lib/types";
import { getCompanyInitial } from "@/lib/lead-utils";

type CompanyIdentityProps = {
  lead: Lead;
};

export default function CompanyIdentity({
  lead,
}: CompanyIdentityProps) {
  return (
    <div className="flex min-w-0 items-start gap-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-xl font-black text-blue-700 ring-1 ring-blue-100">
        {getCompanyInitial(lead.name)}
      </div>

      <div className="min-w-0">
        <h2 className="truncate text-xl font-bold leading-tight text-slate-950">
          {lead.name}
        </h2>

        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
          <span className="flex min-w-0 items-center gap-1.5">
            <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="truncate capitalize">
              {lead.niche || "Nicho não informado"}
            </span>
          </span>

          <span className="flex min-w-0 items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="truncate">
              {lead.city || "Cidade não informada"}
              {lead.state ? `/${lead.state}` : ""}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
