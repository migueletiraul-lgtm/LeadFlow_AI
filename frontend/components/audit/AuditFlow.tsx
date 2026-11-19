"use client";

import { useCallback, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";

import AuditBenefits from "@/components/audit/AuditBenefits";
import AuditHero from "@/components/audit/AuditHero";
import AuditLoading from "@/components/audit/AuditLoading";
import AuditReport from "@/components/audit/AuditReport";
import {
  AUDIT_ANALYSIS_STEPS,
  buildAuditReportFromIntelligence,
  type AuditReportModel,
} from "@/lib/audit/audit-service";
import { runAudit } from "@/services/api";

const EXAMPLE_TARGET = "@exemplo.negocios";
const STEP_INTERVAL_MS = 500;
const LAST_STEP_INDEX = AUDIT_ANALYSIS_STEPS.length - 1;

type AuditStage = "idle" | "loading" | "report";

function buildAuditPayload(target: string) {
  return target.startsWith("@")
    ? { instagram: target }
    : { website: target };
}

export default function AuditFlow() {
  const [stage, setStage] = useState<AuditStage>("idle");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [report, setReport] = useState<AuditReportModel | null>(
    null,
  );
  const [error, setError] = useState("");

  const stepTimerRef = useRef<ReturnType<
    typeof setInterval
  > | null>(null);

  const stopStepAnimation = useCallback(() => {
    if (stepTimerRef.current) {
      clearInterval(stepTimerRef.current);
      stepTimerRef.current = null;
    }
  }, []);

  const startAudit = useCallback(async (target: string) => {
    setError("");
    setStage("loading");
    setProgress(0);
    setCurrentStep(0);

    let stepIndex = 0;

    stopStepAnimation();

    stepTimerRef.current = setInterval(() => {
      stepIndex = Math.min(stepIndex + 1, LAST_STEP_INDEX - 1);

      setCurrentStep(stepIndex);
      setProgress(
        Math.round((stepIndex / LAST_STEP_INDEX) * 90),
      );
    }, STEP_INTERVAL_MS);

    try {
      const intelligence = await runAudit(
        buildAuditPayload(target),
      );

      stopStepAnimation();
      setCurrentStep(LAST_STEP_INDEX);
      setProgress(100);

      setReport(
        buildAuditReportFromIntelligence(target, intelligence),
      );

      setStage("report");
    } catch (auditError) {
      stopStepAnimation();

      setError(
        auditError instanceof Error
          ? auditError.message
          : "Não foi possível concluir a auditoria. Tente novamente.",
      );

      setStage("idle");
    }
  }, [stopStepAnimation]);

  const restartAudit = useCallback(() => {
    stopStepAnimation();
    setStage("idle");
    setReport(null);
    setProgress(0);
    setCurrentStep(0);
    setError("");
  }, [stopStepAnimation]);

  if (stage === "loading") {
    return (
      <AuditLoading progress={progress} currentStep={currentStep} />
    );
  }

  if (stage === "report" && report) {
    return <AuditReport report={report} onRestart={restartAudit} />;
  }

  return (
    <div className="flex w-full flex-col gap-10 sm:gap-14">
      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <AuditHero
        onStartAudit={startAudit}
        onViewExample={() => startAudit(EXAMPLE_TARGET)}
      />

      <AuditBenefits />
    </div>
  );
}
