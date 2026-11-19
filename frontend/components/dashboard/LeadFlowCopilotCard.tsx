import {
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type LeadFlowCopilotCardProps = {
  greeting: string;
  summary: string;
  recommendations: string[];
  potentialRevenue: number;
  ctaLabel?: string;
  onCtaClick?: () => void;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function LeadFlowCopilotCard({
  greeting,
  summary,
  recommendations,
  potentialRevenue,
  ctaLabel = "Ver oportunidades prioritárias",
  onCtaClick,
}: LeadFlowCopilotCardProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-blue-400/20 bg-[#071426] p-6 text-white shadow-[0_32px_90px_rgba(15,23,42,0.28)] sm:p-10">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
          <Sparkles className="h-4 w-4" />
          LeadFlow Copilot
        </div>

        <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
          {greeting}
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
          {summary}
        </p>

        {recommendations.length > 0 && (
          <div className="mt-7">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Recomendações
            </p>

            <div className="mt-3 space-y-2">
              {recommendations.map((recommendation, index) => (
                <div
                  key={`${index}-${recommendation}`}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

                  <p className="text-sm leading-6 text-slate-200">
                    {recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-7 flex flex-col gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
              <DollarSign className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-300">
                Potencial de receita
              </p>

              <p className="text-2xl font-bold text-white sm:text-3xl">
                {formatCurrency(potentialRevenue)}
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => onCtaClick?.()}
            className="w-full gap-2 bg-emerald-500 text-white hover:bg-emerald-400 sm:w-auto"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
