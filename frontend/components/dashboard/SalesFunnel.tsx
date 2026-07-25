import {
  CheckCircle2,
  MessageCircle,
  Send,
  Target,
  Trophy,
  UserRoundCheck,
} from "lucide-react";

import type { Lead } from "@/lib/types";

type SalesFunnelProps = {
  leads: Lead[];
};

type FunnelStage = {
  label: string;
  value: string;
  icon: typeof Target;
  iconClasses: string;
  barClasses: string;
};

function normalizeStatus(
  status: string | null | undefined,
) {
  return status?.trim().toLocaleLowerCase("pt-BR") ?? "novo";
}

export default function SalesFunnel({
  leads,
}: SalesFunnelProps) {
  const totalLeads = leads.length;

  const stages: FunnelStage[] = [
    {
      label: "Novo",
      value: "novo",
      icon: Target,
      iconClasses:
        "bg-slate-100 text-slate-600",
      barClasses:
        "bg-slate-500",
    },
    {
      label: "Contatado",
      value: "contatado",
      icon: Send,
      iconClasses:
        "bg-blue-50 text-blue-600",
      barClasses:
        "bg-blue-500",
    },
    {
      label: "Respondeu",
      value: "respondeu",
      icon: MessageCircle,
      iconClasses:
        "bg-cyan-50 text-cyan-600",
      barClasses:
        "bg-cyan-500",
    },
    {
      label: "Reunião",
      value: "reunião",
      icon: UserRoundCheck,
      iconClasses:
        "bg-violet-50 text-violet-600",
      barClasses:
        "bg-violet-500",
    },
    {
      label: "Proposta",
      value: "proposta",
      icon: CheckCircle2,
      iconClasses:
        "bg-amber-50 text-amber-600",
      barClasses:
        "bg-amber-500",
    },
    {
      label: "Cliente",
      value: "cliente",
      icon: Trophy,
      iconClasses:
        "bg-emerald-50 text-emerald-600",
      barClasses:
        "bg-emerald-500",
    },
  ];

  const funnelData = stages.map((stage) => {
    const count = leads.filter(
      (lead) =>
        normalizeStatus(lead.status) ===
        stage.value,
    ).length;

    const percentage =
      totalLeads > 0
        ? Math.round(
            (count / totalLeads) * 100,
          )
        : 0;

    return {
      ...stage,
      count,
      percentage,
    };
  });

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.05)] sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
          Pipeline comercial
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          Funil de prospecção
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Acompanhe a evolução dos leads em cada etapa do processo comercial.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {funnelData.map((stage) => {
          const Icon = stage.icon;

          return (
            <div
              key={stage.value}
              className="rounded-2xl border border-slate-200 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${stage.iconClasses}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      {stage.label}
                    </p>

                    <p className="text-xs text-slate-500">
                      {stage.count} lead
                      {stage.count === 1
                        ? ""
                        : "s"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-slate-950">
                    {stage.percentage}%
                  </p>

                  <p className="text-xs text-slate-500">
                    da base
                  </p>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${stage.barClasses}`}
                  style={{
                    width: `${stage.percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}