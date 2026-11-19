"use client";

import { Bot, Sparkles, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import AuditInput from "@/components/audit/AuditInput";

type AuditHeroProps = {
  onStartAudit?: (target: string) => void | Promise<void>;
  onViewExample?: () => void;
};

export default function AuditHero({
  onStartAudit,
  onViewExample,
}: AuditHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-[#071426] px-6 py-16 text-center text-white shadow-[0_32px_90px_rgba(15,23,42,0.28)] sm:px-10 sm:py-20">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
          <Sparkles className="h-4 w-4" />
          LeadFlow Audit
        </div>

        <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          Descubra em 60 segundos onde sua empresa está perdendo
          clientes.
        </h1>

        <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
          Receba uma análise inteligente da sua presença digital e
          descubra as oportunidades com maior potencial de
          crescimento.
        </p>

        <div className="mt-8 w-full">
          <AuditInput onSubmit={(target) => onStartAudit?.(target)} />
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={() => onViewExample?.()}
          className="mt-3 gap-2 text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <Zap className="h-4 w-4" />
          Ver exemplo
        </Button>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-medium uppercase tracking-wide text-slate-400">
          <span className="flex items-center gap-1.5">
            <Bot className="h-3.5 w-3.5" />
            IA
          </span>
          <span aria-hidden="true">•</span>
          <span>Análise automática</span>
          <span aria-hidden="true">•</span>
          <span>Gratuito</span>
        </div>
      </div>
    </section>
  );
}
