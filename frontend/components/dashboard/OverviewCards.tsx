import {
  Building2,
  CheckCircle2,
  Flame,
  Globe2,
  MessageCircle,
  Percent,
  Target,
  UserCheck,
} from "lucide-react";

import type { Lead } from "@/lib/types";

type OverviewCardsProps = {
  leads: Lead[];
};

type MetricCard = {
  title: string;
  value: number;
  suffix?: string;
  description: string;
  badge: string;
  icon: typeof Building2;
  iconClasses: string;
  glowClasses: string;
  progress: number;
};

function normalizeStatus(
  status: string | null | undefined,
) {
  return status?.trim().toLocaleLowerCase("pt-BR") ?? "novo";
}

export default function OverviewCards({
  leads,
}: OverviewCardsProps) {
  const totalLeads = leads.length;

  // Leads com score 80+ seguem a mesma regra
  // usada pelo Drawer: "Muito quente".
  const veryHotLeads = leads.filter(
    (lead) => lead.lead_score >= 80,
  ).length;

  const withoutWebsite = leads.filter(
    (lead) => !lead.website?.trim(),
  ).length;

  const newLeads = leads.filter(
    (lead) =>
      normalizeStatus(lead.status) === "novo",
  ).length;

  const contactedLeads = leads.filter(
    (lead) =>
      normalizeStatus(lead.status) === "contatado",
  ).length;

  const respondedLeads = leads.filter(
    (lead) =>
      normalizeStatus(lead.status) === "respondeu",
  ).length;

  const clients = leads.filter(
    (lead) =>
      normalizeStatus(lead.status) === "cliente",
  ).length;

  const conversionRate =
    totalLeads > 0
      ? Math.round(
          (clients / totalLeads) * 100,
        )
      : 0;

  function getPercentage(
    value: number,
  ) {
    if (totalLeads === 0) {
      return 0;
    }

    return Math.round(
      (value / totalLeads) * 100,
    );
  }

  const cards: MetricCard[] = [
    {
      title: "Total de leads",
      value: totalLeads,
      description:
        "Empresas disponíveis para prospecção",
      badge: "Base atual",
      icon: Building2,
      iconClasses:
        "bg-blue-50 text-blue-600",
      glowClasses:
        "bg-blue-500/10",
      progress:
        totalLeads > 0 ? 100 : 0,
    },
    {
      title: "Muito quentes",
      value: veryHotLeads,
      description:
        "Leads prioritários com score 80+",
      badge: "Prioridade",
      icon: Flame,
      iconClasses:
        "bg-orange-50 text-orange-600",
      glowClasses:
        "bg-orange-500/10",
      progress:
        getPercentage(veryHotLeads),
    },
    {
      title: "Sem website",
      value: withoutWebsite,
      description:
        "Oportunidades para criação de site",
      badge: "Oportunidade",
      icon: Globe2,
      iconClasses:
        "bg-indigo-50 text-indigo-600",
      glowClasses:
        "bg-indigo-500/10",
      progress:
        getPercentage(withoutWebsite),
    },
    {
      title: "Novos",
      value: newLeads,
      description:
        "Leads que ainda não foram abordados",
      badge: "Entrada",
      icon: Target,
      iconClasses:
        "bg-slate-100 text-slate-600",
      glowClasses:
        "bg-slate-500/10",
      progress:
        getPercentage(newLeads),
    },
    {
      title: "Contatados",
      value: contactedLeads,
      description:
        "Leads que já receberam uma abordagem",
      badge: "Prospecção",
      icon: MessageCircle,
      iconClasses:
        "bg-cyan-50 text-cyan-600",
      glowClasses:
        "bg-cyan-500/10",
      progress:
        getPercentage(contactedLeads),
    },
    {
      title: "Responderam",
      value: respondedLeads,
      description:
        "Leads que responderam ao contato",
      badge: "Engajamento",
      icon: CheckCircle2,
      iconClasses:
        "bg-amber-50 text-amber-600",
      glowClasses:
        "bg-amber-500/10",
      progress:
        getPercentage(respondedLeads),
    },
    {
      title: "Clientes",
      value: clients,
      description:
        "Leads convertidos em clientes",
      badge: "Conversão",
      icon: UserCheck,
      iconClasses:
        "bg-emerald-50 text-emerald-600",
      glowClasses:
        "bg-emerald-500/10",
      progress:
        getPercentage(clients),
    },
    {
      title: "Taxa de conversão",
      value: conversionRate,
      suffix: "%",
      description:
        "Percentual da base convertida em clientes",
      badge: "Performance",
      icon: Percent,
      iconClasses:
        "bg-violet-50 text-violet-600",
      glowClasses:
        "bg-violet-500/10",
      progress: conversionRate,
    },
  ];

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.title}
            className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_60px_rgba(37,99,235,0.12)]"
          >
            <div
              className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-125 ${card.glowClasses}`}
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105 ${card.iconClasses}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                  {card.badge}
                </div>
              </div>

              <div className="mt-7">
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <p className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
                  {card.value}
                  {card.suffix}
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {card.description}
                </p>
              </div>

              <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-700"
                  style={{
                    width: `${Math.min(
                      Math.max(
                        card.progress,
                        card.progress > 0
                          ? 6
                          : 0,
                      ),
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}