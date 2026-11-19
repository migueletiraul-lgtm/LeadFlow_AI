import {
  AlertTriangle,
  ClipboardList,
  Lightbulb,
  ListChecks,
} from "lucide-react";

const PLACEHOLDER_SUMMARY = {
  title: "Resumo Executivo da Auditoria",
  analysis:
    "Sua presença digital tem uma base sólida, mas deixa oportunidades de conversão na mesa. Identificamos pontos de atenção prioritários que, se corrigidos, têm potencial real de gerar mais clientes nas próximas semanas.",
  totalFindings: 8,
  criticalFindings: 3,
  recommendation:
    "Priorize a correção dos pontos críticos de segurança e conversão antes de investir em novas campanhas de aquisição — eles estão limitando o retorno do tráfego que você já tem.",
};

type AuditExecutiveSummaryProps = {
  title?: string;
  analysis?: string;
  totalFindings?: number;
  criticalFindings?: number;
  recommendation?: string;
};

export default function AuditExecutiveSummary({
  title = PLACEHOLDER_SUMMARY.title,
  analysis = PLACEHOLDER_SUMMARY.analysis,
  totalFindings = PLACEHOLDER_SUMMARY.totalFindings,
  criticalFindings = PLACEHOLDER_SUMMARY.criticalFindings,
  recommendation = PLACEHOLDER_SUMMARY.recommendation,
}: AuditExecutiveSummaryProps = {}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-[#071426] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
          <ClipboardList className="h-4 w-4" />
          Resumo Executivo
        </div>

        <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
          {analysis}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2 text-slate-400">
              <ListChecks className="h-4 w-4 text-blue-300" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Total de pontos analisados
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              {totalFindings}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2 text-slate-400">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Pontos críticos
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              {criticalFindings}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-200">
            <Lightbulb className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Recomendação
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-300">
              {recommendation}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
