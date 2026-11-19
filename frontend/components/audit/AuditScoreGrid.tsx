"use client";

import { motion } from "framer-motion";
import { Activity, Percent, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import type {
  DigitalHealthLevel,
  OpportunityTemperature,
} from "@/lib/types";

type AuditScoreGridProps = {
  digitalHealthScore: number;
  digitalHealthLevel: DigitalHealthLevel;
  opportunityScore: number;
  opportunityTemperature: OpportunityTemperature;
  winProbabilityScore: number;
  winProbabilityConfidence: number;
};

function getTone(score: number) {
  if (score >= 70) {
    return {
      bar: "bg-emerald-500",
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
      text: "text-emerald-600",
    };
  }

  if (score >= 40) {
    return {
      bar: "bg-amber-500",
      badge: "border-amber-200 bg-amber-50 text-amber-700",
      text: "text-amber-600",
    };
  }

  return {
    bar: "bg-red-500",
    badge: "border-red-200 bg-red-50 text-red-700",
    text: "text-red-600",
  };
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
} as const;

type ScoreCardProps = {
  icon: LucideIcon;
  title: string;
  score: number;
  badgeLabel: string;
};

function ScoreCard({
  icon: Icon,
  title,
  score,
  badgeLabel,
}: ScoreCardProps) {
  const tone = getTone(score);

  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Icon className={`h-4 w-4 ${tone.text}`} />
              {title}
            </div>

            <Badge variant="outline" className={tone.badge}>
              {badgeLabel}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <p className={`text-3xl font-black tracking-tight ${tone.text}`}>
            {score}
            <span className="text-base font-medium text-slate-400">
              /100
            </span>
          </p>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className={`h-full rounded-full ${tone.bar}`}
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: 0.2,
              }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AuditScoreGrid({
  digitalHealthScore,
  digitalHealthLevel,
  opportunityScore,
  opportunityTemperature,
  winProbabilityScore,
  winProbabilityConfidence,
}: AuditScoreGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid gap-4 sm:grid-cols-3"
    >
      <ScoreCard
        icon={Activity}
        title="Saúde Digital"
        score={digitalHealthScore}
        badgeLabel={digitalHealthLevel}
      />

      <ScoreCard
        icon={Target}
        title="Oportunidade"
        score={opportunityScore}
        badgeLabel={opportunityTemperature}
      />

      <ScoreCard
        icon={Percent}
        title="Chance de Fechamento"
        score={winProbabilityScore}
        badgeLabel={`Confiança ${winProbabilityConfidence}%`}
      />
    </motion.div>
  );
}
