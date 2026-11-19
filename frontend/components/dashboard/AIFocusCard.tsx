import {
  Building2,
  CheckCircle2,
  DollarSign,
  Target,
} from "lucide-react";

type AIFocusCardProps = {
  title: string;
  segment: string;
  leadCount: number;
  conversionRate: number;
  potentialRevenue: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function AIFocusCard({
  title,
  segment,
  leadCount,
  conversionRate,
  potentialRevenue,
}: AIFocusCardProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-[#071426] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
          <Target className="h-4 w-4" />
          Foco recomendado
        </div>

        <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-300 sm:text-base">
          Segmento-alvo:{" "}
          <span className="font-semibold text-white">
            {segment}
          </span>
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Building2 className="h-4 w-4" />
              <span className="text-xs">
                Leads no segmento
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold">
              {leadCount}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs">
                Taxa de conversão
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold">
              {conversionRate}%
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs">
                Potencial de receita
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(potentialRevenue)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
