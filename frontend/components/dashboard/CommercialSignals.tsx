import {
  Globe2,
  MessageCircle,
  Send,
  Target,
} from "lucide-react";

import type { Lead } from "@/lib/types";

type CommercialSignalsProps = {
  leads: Lead[];
};

function normalizeStatus(
  status: string | null | undefined,
) {
  return (
    status?.trim().toLocaleLowerCase("pt-BR") ??
    "novo"
  );
}

export default function CommercialSignals({
  leads,
}: CommercialSignalsProps) {
  const withoutWebsite = leads.filter(
    (lead) => !lead.website?.trim(),
  ).length;

  const newLeads = leads.filter(
    (lead) =>
      normalizeStatus(lead.status) === "novo",
  ).length;

  const contactedLeads = leads.filter(
    (lead) =>
      normalizeStatus(lead.status) ===
      "contatado",
  ).length;

  const respondedLeads = leads.filter(
    (lead) =>
      normalizeStatus(lead.status) ===
      "respondeu",
  ).length;

  const signals = [
    {
      label: "Sem website",
      count: withoutWebsite,
      meaning:
        "Oportunidade de propor criação de site.",
      icon: Globe2,
      iconClasses:
        "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Novos",
      count: newLeads,
      meaning:
        "Ainda não receberam nenhuma abordagem.",
      icon: Target,
      iconClasses:
        "bg-slate-100 text-slate-600",
    },
    {
      label: "Contatados",
      count: contactedLeads,
      meaning:
        contactedLeads === 0
          ? "Nenhum contato realizado ainda."
          : "Aguardando resposta ao primeiro contato.",
      icon: Send,
      iconClasses:
        "bg-blue-50 text-blue-600",
    },
    {
      label: "Responderam",
      count: respondedLeads,
      meaning:
        "Prontos para avançar para reunião.",
      icon: MessageCircle,
      iconClasses:
        "bg-cyan-50 text-cyan-600",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {signals.map((signal) => {
        const Icon = signal.icon;

        return (
          <div
            key={signal.label}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${signal.iconClasses}`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <span className="text-xs font-medium text-slate-500">
                {signal.label}
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold text-slate-950">
              {signal.count}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {signal.meaning}
            </p>
          </div>
        );
      })}
    </div>
  );
}
