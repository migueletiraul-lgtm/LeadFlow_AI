"use client";

import type { ComponentType } from "react";
import {
  AtSign,
  Globe,
  MessageCircle,
  Star,
  Users,
} from "lucide-react";

import type { Lead } from "@/lib/types";

type LeadBusinessSummaryProps = {
  lead: Lead;
};

type SummaryItemProps = {
  icon: ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
  iconClassName: string;
};

function SummaryItem({
  icon: Icon,
  label,
  value,
  iconClassName,
}: SummaryItemProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Icon
          className={`h-4 w-4 ${iconClassName}`}
        />

        <span>{label}</span>
      </div>

      <p className="mt-2 text-sm font-bold text-slate-950">
        {value}
      </p>
    </div>
  );
}

function getAvailabilityLabel(
  value: string | null | undefined,
) {
  return value?.trim()
    ? "Disponível"
    : "Não identificado";
}

export default function LeadBusinessSummary({
  lead,
}: LeadBusinessSummaryProps) {
  const hasWebsite = Boolean(
    lead.website?.trim(),
  );

  const hasInstagram = Boolean(
    lead.instagram?.trim(),
  );

  const hasWhatsApp = Boolean(
    lead.whatsapp?.trim(),
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div>
        <h3 className="font-semibold text-slate-950">
          Resumo comercial
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Visão rápida da presença digital e reputação deste lead.
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <SummaryItem
          icon={Star}
          label="Nota Google"
          value={
            lead.google_rating !== null &&
            lead.google_rating !== undefined
              ? String(lead.google_rating)
              : "Sem nota"
          }
          iconClassName="fill-amber-400 text-amber-400"
        />

        <SummaryItem
          icon={Users}
          label="Avaliações"
          value={
            lead.google_reviews !== null &&
            lead.google_reviews !== undefined
              ? String(lead.google_reviews)
              : "Não informado"
          }
          iconClassName="text-blue-600"
        />

        <SummaryItem
          icon={Globe}
          label="Website"
          value={getAvailabilityLabel(
            lead.website,
          )}
          iconClassName={
            hasWebsite
              ? "text-emerald-600"
              : "text-red-500"
          }
        />

        <SummaryItem
          icon={AtSign}
          label="Instagram"
          value={getAvailabilityLabel(
            lead.instagram,
          )}
          iconClassName={
            hasInstagram
              ? "text-violet-600"
              : "text-red-500"
          }
        />

        <SummaryItem
          icon={MessageCircle}
          label="WhatsApp"
          value={getAvailabilityLabel(
            lead.whatsapp,
          )}
          iconClassName={
            hasWhatsApp
              ? "text-emerald-600"
              : "text-red-500"
          }
        />
      </div>
    </section>
  );
}