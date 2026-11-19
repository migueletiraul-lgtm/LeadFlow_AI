import { Lightbulb } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PriorityLeadCardProps = {
  companyName: string;
  winProbability: number;
  recommendedService: string;
  potentialRevenue: number;
  actionLabel: string;
  onAction: () => void;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function getWinProbabilityBadgeClasses(score: number) {
  if (score >= 70) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (score >= 40) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-red-200 bg-red-50 text-red-700";
}

export default function PriorityLeadCard({
  companyName,
  winProbability,
  recommendedService,
  potentialRevenue,
  actionLabel,
  onAction,
}: PriorityLeadCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <CardTitle className="min-w-0 truncate text-base text-slate-950">
          {companyName}
        </CardTitle>

        <Badge
          variant="outline"
          className={`shrink-0 ${getWinProbabilityBadgeClasses(
            winProbability,
          )}`}
        >
          {winProbability}% de fechamento
        </Badge>
      </CardHeader>

      <CardContent>
        <div className="flex items-start gap-2 text-sm text-slate-600">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />

          <p>
            <span className="font-medium text-slate-900">
              Solução recomendada:
            </span>{" "}
            {recommendedService}
          </p>
        </div>

        <p className="mt-3 text-2xl font-bold text-slate-900">
          {formatCurrency(potentialRevenue)}
        </p>

        <p className="text-xs text-slate-500">
          Potencial de receita estimado
        </p>

        <Button
          type="button"
          onClick={onAction}
          className="mt-4 w-full"
        >
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
