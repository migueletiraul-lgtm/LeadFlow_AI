"use client";

import {
  Activity,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

type AIReportCardProps = {
  opportunityScore: number;
  digitalHealth: number;
  businessStage: string;
};

function clampScore(value: number) {
  return Math.min(100, Math.max(0, value));
}

function getOpportunityAccent(score: number) {
  if (score >= 75) {
    return {
      text: "text-red-700",
      bar: "bg-red-500",
      glow: "from-red-50 to-orange-50",
      icon: "text-red-600",
    };
  }

  if (score >= 50) {
    return {
      text: "text-amber-700",
      bar: "bg-amber-500",
      glow: "from-amber-50 to-yellow-50",
      icon: "text-amber-600",
    };
  }

  if (score >= 25) {
    return {
      text: "text-blue-700",
      bar: "bg-blue-500",
      glow: "from-blue-50 to-sky-50",
      icon: "text-blue-600",
    };
  }

  return {
    text: "text-slate-700",
    bar: "bg-slate-400",
    glow: "from-slate-50 to-slate-100",
    icon: "text-slate-600",
  };
}

function getHealthAccent(score: number) {
  if (score >= 80) {
    return {
      text: "text-emerald-700",
      bar: "bg-emerald-500",
      glow: "from-emerald-50 to-teal-50",
      icon: "text-emerald-600",
    };
  }

  if (score >= 60) {
    return {
      text: "text-blue-700",
      bar: "bg-blue-500",
      glow: "from-blue-50 to-sky-50",
      icon: "text-blue-600",
    };
  }

  if (score >= 40) {
    return {
      text: "text-amber-700",
      bar: "bg-amber-500",
      glow: "from-amber-50 to-yellow-50",
      icon: "text-amber-600",
    };
  }

  if (score >= 20) {
    return {
      text: "text-orange-700",
      bar: "bg-orange-500",
      glow: "from-orange-50 to-amber-50",
      icon: "text-orange-600",
    };
  }

  return {
    text: "text-red-700",
    bar: "bg-red-500",
    glow: "from-red-50 to-orange-50",
    icon: "text-red-600",
  };
}

function ScoreTile({
  icon,
  label,
  score,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  score: number;
  accent: ReturnType<typeof getOpportunityAccent>;
}) {
  const width = clampScore(score);

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br p-5 ${accent.glow}`}
    >
      <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
        <span className={accent.icon}>{icon}</span>
        {label}
      </div>

      <div className="mt-2 flex items-end gap-2">
        <span
          className={`text-4xl font-black tracking-tight ${accent.text}`}
        >
          {width}
        </span>

        <span className="pb-1 text-sm text-slate-500">/100</span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/80 ring-1 ring-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${accent.bar}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default function AIReportCard({
  opportunityScore,
  digitalHealth,
  businessStage,
}: AIReportCardProps) {
  const opportunityAccent = getOpportunityAccent(opportunityScore);
  const healthAccent = getHealthAccent(digitalHealth);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-blue-600" />

        <div>
          <h3 className="font-semibold text-slate-950">
            LeadFlow AI Report
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Diagnóstico automático de oportunidade e presença digital.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <ScoreTile
          icon={<Target className="h-4 w-4" />}
          label="Opportunity Score"
          score={opportunityScore}
          accent={opportunityAccent}
        />

        <ScoreTile
          icon={<Activity className="h-4 w-4" />}
          label="Digital Health"
          score={digitalHealth}
          accent={healthAccent}
        />

        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-gradient-to-br from-violet-50 to-indigo-50 p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <TrendingUp className="h-4 w-4 text-violet-600" />
            Business Stage
          </div>

          <div className="mt-4">
            <span className="inline-flex w-fit items-center rounded-full border border-violet-200 bg-white/80 px-3 py-1.5 text-sm font-bold text-violet-700">
              {businessStage}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
