import { ListChecks, Stethoscope, Target } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BENEFITS = [
  {
    title: "Diagnóstico Inteligente",
    text: "Identifique rapidamente os principais pontos que limitam sua presença digital.",
    icon: Stethoscope,
    iconClasses: "bg-blue-50 text-blue-600",
  },
  {
    title: "Oportunidades Prioritárias",
    text: "Descubra quais melhorias têm maior potencial de gerar novos clientes.",
    icon: Target,
    iconClasses: "bg-orange-50 text-orange-600",
  },
  {
    title: "Plano de Ação",
    text: "Receba recomendações claras para saber exatamente qual deve ser o próximo passo.",
    icon: ListChecks,
    iconClasses: "bg-emerald-50 text-emerald-600",
  },
];

export default function AuditBenefits() {
  return (
    <section className="grid gap-6 sm:grid-cols-3">
      {BENEFITS.map((benefit) => {
        const Icon = benefit.icon;

        return (
          <Card key={benefit.title}>
            <CardHeader>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${benefit.iconClasses}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <CardTitle className="mt-4 text-lg text-slate-950">
                {benefit.title}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm leading-6 text-slate-600">
                {benefit.text}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
