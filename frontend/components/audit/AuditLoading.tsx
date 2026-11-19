"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Loader2,
  Sparkles,
} from "lucide-react";

import { AUDIT_ANALYSIS_STEPS } from "@/lib/audit/audit-service";

type AuditLoadingProps = {
  progress: number;
  currentStep: number;
};

function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}

export default function AuditLoading({
  progress,
  currentStep,
}: AuditLoadingProps) {
  const totalSteps = AUDIT_ANALYSIS_STEPS.length;
  const safeProgress = clamp(Math.round(progress), 0, 100);
  const safeStep = clamp(currentStep, 0, totalSteps - 1);
  const activeStepLabel = AUDIT_ANALYSIS_STEPS[safeStep];

  return (
    <section
      role="status"
      aria-live="polite"
      className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-[#071426] px-6 py-16 text-center text-white shadow-[0_32px_90px_rgba(15,23,42,0.28)] sm:px-10 sm:py-20"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500/30" />

          <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <Sparkles className="h-7 w-7 text-blue-300" />
          </span>
        </div>

        <h2 className="mt-6 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          Analisando sua presença digital
        </h2>

        <div className="mt-2 flex h-6 items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeStepLabel}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="text-sm font-medium text-slate-300"
            >
              {activeStepLabel}...
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-8 w-full">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
            <span>
              Etapa {safeStep + 1} de {totalSteps}
            </span>

            <span className="text-blue-200">
              {safeProgress}% concluído
            </span>
          </div>

          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-400"
              initial={false}
              animate={{ width: `${safeProgress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        <ul className="mt-10 flex w-full flex-col gap-2.5 text-left">
          {AUDIT_ANALYSIS_STEPS.map((step, index) => {
            const isComplete = index < safeStep;
            const isActive = index === safeStep;

            return (
              <li
                key={step}
                className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 transition-colors duration-300 ${
                  isActive
                    ? "border-blue-400/40 bg-blue-500/10"
                    : isComplete
                      ? "border-white/5 bg-transparent"
                      : "border-white/5 bg-transparent opacity-50"
                }`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                  {isComplete ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : isActive ? (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-300" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-500" />
                  )}
                </span>

                <span
                  className={`text-sm ${
                    isActive
                      ? "font-semibold text-white"
                      : isComplete
                        ? "text-slate-300"
                        : "text-slate-400"
                  }`}
                >
                  {step}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
