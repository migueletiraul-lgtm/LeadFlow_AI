import { BrainCircuit, Lightbulb } from "lucide-react";

type AIRecommendationCardProps = {
  title: string;
  recommendation: string;
  reason: string;
  action: string;
};

export default function AIRecommendationCard({
  title,
  recommendation,
  reason,
  action,
}: AIRecommendationCardProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-[#071426] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
          <BrainCircuit className="h-4 w-4" />
          Inteligência comercial
        </div>

        <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
          {recommendation}
        </p>

        <p className="mt-3 max-w-2xl text-xs leading-6 text-slate-400 sm:text-sm">
          {reason}
        </p>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-200">
            <Lightbulb className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Ação recomendada
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-300">
              {action}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
