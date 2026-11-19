import { Building2, DollarSign, Flame, Percent } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type KPIRowProps = {
  totalLeads: number;
  hotLeads: number;
  potentialRevenue: number;
  averageProbability: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatPercentage(value: number) {
  return `${Math.round(value)}%`;
}

export default function KPIRow({
  totalLeads,
  hotLeads,
  potentialRevenue,
  averageProbability,
}: KPIRowProps) {
  const cards = [
    {
      title: "Total de leads",
      value: totalLeads,
      description: "Empresas na base atual",
      icon: Building2,
      iconClasses: "bg-blue-50 text-blue-600",
    },
    {
      title: "Leads quentes",
      value: hotLeads,
      description: "Oportunidades de alta prioridade",
      icon: Flame,
      iconClasses: "bg-orange-50 text-orange-600",
    },
    {
      title: "Potencial de receita",
      value: formatCurrency(potentialRevenue),
      description: "Estimativa com base no ticket médio",
      icon: DollarSign,
      iconClasses: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Probabilidade média",
      value: formatPercentage(averageProbability),
      description: "Chance média de fechamento",
      icon: Percent,
      iconClasses: "bg-violet-50 text-violet-600",
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

              <div
                className={`flex size-10 items-center justify-center rounded-xl ${card.iconClasses}`}
              >
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
