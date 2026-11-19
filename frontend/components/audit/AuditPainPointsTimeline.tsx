"use client";

import { motion } from "framer-motion";
import {
  AlertOctagon,
  AlertTriangle,
  Info,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type {
  AuditFinding,
  AuditFindingSeverity,
} from "@/lib/audit/audit-service";

const SEVERITY_ICONS: Record<AuditFindingSeverity, LucideIcon> = {
  "alta": AlertOctagon,
  "média": AlertTriangle,
  "baixa": Info,
};

const SEVERITY_DOT_STYLES: Record<AuditFindingSeverity, string> = {
  "alta": "border-red-200 bg-red-50 text-red-600",
  "média": "border-amber-200 bg-amber-50 text-amber-600",
  "baixa": "border-slate-200 bg-slate-100 text-slate-600",
};

const SEVERITY_ACCENT_STYLES: Record<AuditFindingSeverity, string> = {
  "alta": "border-l-4 border-l-red-400",
  "média": "border-l-4 border-l-amber-400",
  "baixa": "border-l-4 border-l-slate-300",
};

const SEVERITY_BADGE_STYLES: Record<AuditFindingSeverity, string> = {
  "alta": "border-red-200 bg-red-50 text-red-700",
  "média": "border-amber-200 bg-amber-50 text-amber-700",
  "baixa": "border-slate-200 bg-slate-100 text-slate-700",
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
} as const;

type AuditPainPointsTimelineProps = {
  findings: AuditFinding[];
};

export default function AuditPainPointsTimeline({
  findings,
}: AuditPainPointsTimelineProps) {
  if (findings.length === 0) {
    return null;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="relative space-y-5"
    >
      <div className="absolute bottom-4 left-5 top-4 w-px bg-slate-200" />

      {findings.map((finding) => {
        const Icon = SEVERITY_ICONS[finding.severity];

        return (
          <motion.div
            key={finding.title}
            variants={itemVariants}
            className="relative flex gap-5"
          >
            <div
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${SEVERITY_DOT_STYLES[finding.severity]}`}
            >
              <Icon className="h-4 w-4" />
            </div>

            <div
              className={`min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-5 transition-shadow duration-300 hover:shadow-md ${SEVERITY_ACCENT_STYLES[finding.severity]}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold text-slate-900">
                  {finding.title}
                </p>

                <Badge
                  variant="outline"
                  className={SEVERITY_BADGE_STYLES[finding.severity]}
                >
                  {finding.severity}
                </Badge>
              </div>

              <p className="mt-2.5 text-sm leading-6 text-slate-600">
                {finding.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
