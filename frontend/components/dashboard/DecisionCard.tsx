import {
  ArrowRight,
  Clock3,
  DollarSign,
  MessageCircle,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type DecisionCardProps = {
  company: string;
  channel: string;
  offer: string;
  reason: string;
  probability: number;
  potentialRevenue: number;
  estimatedTime: string;
  onAction: () => void;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function getProbabilityAccent(score: number) {
  if (score >= 70) {
    return "text-emerald-300";
  }

  if (score >= 40) {
    return "text-amber-300";
  }

  return "text-red-300";
}

export default function DecisionCard({
  company,
  channel,
  offer,
  reason,
  probability,
  potentialRevenue,
  estimatedTime,
  onAction,
}: DecisionCardProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-[#071426] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
          <MessageCircle className="h-4 w-4" />
          Decisão recomendada
        </div>

        <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
          {company}
        </h2>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm leading-6 text-slate-200">
            Abordar via{" "}
            <span className="font-semibold text-white">
              {channel}
            </span>{" "}
            oferecendo{" "}
            <span className="font-semibold text-white">
              {offer}
            </span>
            .
          </p>

          <p className="mt-2 text-xs leading-6 text-slate-400">
            {reason}
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Chance de fechamento
              </span>
            </div>

            <p
              className={`mt-2 text-2xl font-bold ${getProbabilityAccent(
                probability,
              )}`}
            >
              {probability}%
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <DollarSign className="h-4 w-4 text-emerald-300" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Receita potencial
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold text-white">
              {formatCurrency(potentialRevenue)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Clock3 className="h-4 w-4 text-blue-300" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Tempo estimado
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold text-white">
              {estimatedTime}
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={onAction}
          className="mt-7 w-full gap-2 bg-emerald-500 text-white hover:bg-emerald-400 sm:w-auto"
        >
          Executar decisão
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
