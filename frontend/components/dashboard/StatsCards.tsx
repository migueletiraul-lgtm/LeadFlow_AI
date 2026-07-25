import {
  Building2,
  Flame,
  Globe2,
  Star,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Lead } from "@/lib/types";

type StatsCardsProps = {
  leads: Lead[];
};

export function StatsCards({ leads }: StatsCardsProps) {
  const totalLeads = leads.length;

  const hotLeads = leads.filter(
    (lead) => lead.lead_score >= 70,
  ).length;

  const averageScore =
    totalLeads > 0
      ? Math.round(
          leads.reduce(
            (total, lead) => total + lead.lead_score,
            0,
          ) / totalLeads,
        )
      : 0;

  const withoutSite = leads.filter(
    (lead) => !lead.website,
  ).length;

  const cards = [
    {
      title: "Leads carregados",
      value: totalLeads,
      description: "Empresas no ranking atual",
      icon: Building2,
    },
    {
      title: "Leads quentes",
      value: hotLeads,
      description: "Score igual ou superior a 70",
      icon: Flame,
    },
    {
      title: "Score médio",
      value: averageScore,
      description: "Média das oportunidades",
      icon: Star,
    },
    {
      title: "Sem website",
      value: withoutSite,
      description: "Oportunidades para criação de site",
      icon: Globe2,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {card.title}
              </CardTitle>

              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon className="size-5" />
              </div>
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {card.value}
              </div>

              <p className="mt-1 text-xs text-slate-500">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}