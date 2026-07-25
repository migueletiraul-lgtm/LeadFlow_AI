import { Activity, Database } from "lucide-react";

type HeroProps = {
  totalLeads: number;
};

export default function Hero({ totalLeads }: HeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-blue-700">
            <Activity size={14} />
            <span>Inteligência Comercial</span>
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-slate-900">
            Visão geral da prospecção
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-500">
            Priorize oportunidades, monitore indicadores em tempo real e
            transforme dados em novas vendas.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <Database className="h-7 w-7 text-blue-600" />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Leads disponíveis
              </p>

              <h2 className="text-4xl font-bold text-slate-900">
                {totalLeads}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}