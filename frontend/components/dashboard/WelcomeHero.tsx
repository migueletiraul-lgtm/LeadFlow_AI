import { DollarSign, Flame, Sparkles } from "lucide-react";

type WelcomeHeroProps = {
  userName: string;
  potentialRevenue: number;
  hotLeads: number;
  message: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function WelcomeHero({
  userName,
  potentialRevenue,
  hotLeads,
  message,
}: WelcomeHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-[#071426] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
          <Sparkles className="h-4 w-4" />
          Bem-vindo de volta
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
          Olá, {userName}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
          {message}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2 text-slate-400">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Potencial de receita
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              {formatCurrency(potentialRevenue)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2 text-slate-400">
              <Flame className="h-4 w-4 text-orange-400" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Leads quentes
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              {hotLeads}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
