import { ArrowRight } from "lucide-react";

import type { Lead } from "@/lib/types";

type CommercialPerformanceProps = {
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

export default function CommercialPerformance({
  leads,
}: CommercialPerformanceProps) {
  const totalLeads = leads.length;

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

  const clients = leads.filter(
    (lead) =>
      normalizeStatus(lead.status) ===
      "cliente",
  ).length;

  const conversionRate =
    totalLeads > 0
      ? Math.round(
          (clients / totalLeads) * 100,
        )
      : 0;

  const steps = [
    { label: "Total de leads", value: totalLeads },
    { label: "Contatados", value: contactedLeads },
    { label: "Responderam", value: respondedLeads },
    { label: "Clientes", value: clients },
  ];

  const hasProgression =
    contactedLeads > 0 ||
    respondedLeads > 0 ||
    clients > 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {steps.map((step, index) => (
            <div
              key={step.label}
              className="flex items-center gap-3"
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-950">
                  {step.value}
                </p>

                <p className="text-xs text-slate-500">
                  {step.label}
                </p>
              </div>

              {index < steps.length - 1 && (
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700">
          {conversionRate}% de conversão
        </div>
      </div>

      {!hasProgression && (
        <p className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
          Nenhum lead avançou no funil ainda. Comece pelos leads
          priorizados em &ldquo;Melhores oportunidades&rdquo;.
        </p>
      )}
    </div>
  );
}
