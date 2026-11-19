"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Flame,
  Gauge,
  Globe,
  Lightbulb,
  MapPin,
  MessageCircle,
  Minus,
  RotateCcw,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuditCompanyCard from "@/components/audit/AuditCompanyCard";
import AuditExecutiveSummary from "@/components/audit/AuditExecutiveSummary";
import AuditNextActionCard from "@/components/audit/AuditNextActionCard";
import AuditPainPointsTimeline from "@/components/audit/AuditPainPointsTimeline";
import AuditScoreCard from "@/components/audit/AuditScoreCard";
import AuditScoreGrid from "@/components/audit/AuditScoreGrid";
import type {
  AuditOpportunityImpact,
  AuditReportModel,
} from "@/lib/audit/audit-service";

type AuditReportProps = {
  report: AuditReportModel;
  onRestart?: () => void;
  onRequestDiagnosis?: () => void;
};

const IMPACT_STYLES: Record<AuditOpportunityImpact, string> = {
  "alto": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "médio": "border-blue-200 bg-blue-50 text-blue-700",
  "baixo": "border-slate-200 bg-slate-100 text-slate-700",
};

const IMPACT_BAR_STYLES: Record<AuditOpportunityImpact, string> = {
  "alto": "bg-emerald-500",
  "médio": "bg-blue-500",
  "baixo": "bg-slate-400",
};

const IMPACT_ICONS: Record<AuditOpportunityImpact, LucideIcon> = {
  "alto": Flame,
  "médio": TrendingUp,
  "baixo": Minus,
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
} as const;

const cardStaggerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
} as const;

export default function AuditReport({
  report,
  onRestart,
  onRequestDiagnosis,
}: AuditReportProps) {
  const criticalFindings = report.findings.filter(
    (finding) => finding.severity === "alta",
  ).length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex w-full flex-col gap-8"
    >
      <motion.section
        variants={sectionVariants}
        className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-[#071426] px-6 py-12 text-white shadow-[0_32px_90px_rgba(15,23,42,0.28)] sm:px-10 sm:py-14"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
                <Gauge className="h-4 w-4" />
                Relatório de Auditoria
              </div>

              <Badge
                variant="outline"
                className="border-white/20 bg-white/10 text-white"
              >
                Saúde Digital: {report.level}
              </Badge>
            </div>

            <h2 className="mt-5 max-w-md text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              {report.target}
            </h2>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs font-medium text-slate-400 sm:justify-start">
              {report.company.website && (
                <span className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 shrink-0" />
                  {report.company.website}
                </span>
              )}

              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {report.company.city}, {report.company.state}
              </span>
            </div>

            <p className="mt-3 max-w-md text-sm leading-6 text-slate-300 sm:text-base">
              {report.summary}
            </p>
          </div>

          <AuditScoreCard score={report.score} level={report.level} />
        </div>
      </motion.section>

      <motion.div variants={sectionVariants}>
        <AuditCompanyCard
          name={report.company.name}
          website={report.company.website}
          instagram={report.company.instagram}
          city={report.company.city}
          state={report.company.state}
        />
      </motion.div>

      <motion.div variants={sectionVariants}>
        <AuditExecutiveSummary
          title={`Resumo Executivo — ${report.target}`}
          analysis={report.summary}
          totalFindings={report.findings.length}
          criticalFindings={criticalFindings}
          recommendation={report.nextAction.action}
        />
      </motion.div>

      <motion.section variants={sectionVariants}>
        <AuditScoreGrid
          digitalHealthScore={report.score}
          digitalHealthLevel={report.level}
          opportunityScore={report.opportunity.index}
          opportunityTemperature={report.opportunity.temperature}
          winProbabilityScore={report.winProbability.score}
          winProbabilityConfidence={report.winProbability.confidence}
        />
      </motion.section>

      <motion.section variants={sectionVariants}>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />

          <h3 className="text-lg font-semibold text-slate-950">
            Serviços recomendados
          </h3>
        </div>

        <motion.div
          variants={cardStaggerVariants}
          initial="hidden"
          animate="show"
          className="mt-5 grid gap-5 sm:grid-cols-3"
        >
          {report.opportunities.map((opportunity, index) => {
            const ImpactIcon = IMPACT_ICONS[opportunity.impact];

            return (
              <motion.div
                key={opportunity.title}
                variants={cardItemVariants}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                          {index + 1}
                        </div>

                        <CardTitle className="text-base text-slate-950">
                          {opportunity.title}
                        </CardTitle>
                      </div>

                      <Badge
                        variant="outline"
                        className={`shrink-0 gap-1 ${IMPACT_STYLES[opportunity.impact]}`}
                      >
                        <ImpactIcon className="h-3 w-3" />
                        {opportunity.impact}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm leading-6 text-slate-600">
                      {opportunity.description}
                    </p>

                    <div className="mt-5">
                      <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                        <span>Prioridade</span>
                        <span>{opportunity.priorityScore}%</span>
                      </div>

                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <motion.div
                          className={`h-full rounded-full ${IMPACT_BAR_STYLES[opportunity.impact]}`}
                          initial={{ width: 0 }}
                          animate={{
                            width: `${opportunity.priorityScore}%`,
                          }}
                          transition={{
                            duration: 0.7,
                            ease: "easeOut",
                            delay: 0.15,
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      <motion.section variants={sectionVariants}>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />

          <h3 className="text-lg font-semibold text-slate-950">
            Pontos de atenção
          </h3>
        </div>

        <div className="mt-4">
          <AuditPainPointsTimeline findings={report.findings} />
        </div>
      </motion.section>

      <motion.div variants={sectionVariants}>
        <AuditNextActionCard
          priority={report.nextAction.priority}
          action={report.nextAction.action}
          reason={report.nextAction.reason}
        />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
      >
        <Button
          type="button"
          size="lg"
          onClick={onRequestDiagnosis}
          className="w-full gap-2 sm:w-auto"
        >
          <MessageCircle className="h-4 w-4" />
          Solicitar Diagnóstico
        </Button>

        {onRestart && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onRestart}
            className="w-full gap-2 sm:w-auto"
          >
            <RotateCcw className="h-4 w-4" />
            Nova Auditoria
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}
