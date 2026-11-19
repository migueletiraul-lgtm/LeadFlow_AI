"use client";

import { motion } from "framer-motion";

import type { DigitalHealthLevel } from "@/lib/types";

type AuditScoreCardProps = {
  score: number;
  level: DigitalHealthLevel;
};

const SIZE = 144;
const STROKE_WIDTH = 10;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getTone(score: number) {
  if (score >= 70) {
    return {
      stroke: "#34d399",
      text: "text-emerald-300",
      label: "Boa base digital",
    };
  }

  if (score >= 40) {
    return {
      stroke: "#fbbf24",
      text: "text-amber-300",
      label: "Oportunidades moderadas",
    };
  }

  return {
    stroke: "#f87171",
    text: "text-red-300",
    label: "Oportunidades críticas",
  };
}

export default function AuditScoreCard({
  score,
  level,
}: AuditScoreCardProps) {
  const clampedScore = Math.min(100, Math.max(0, score));
  const tone = getTone(clampedScore);
  const targetOffset =
    CIRCUMFERENCE * (1 - clampedScore / 100);

  return (
    <div className="flex shrink-0 flex-col items-center gap-3">
      <div
        className="relative flex items-center justify-center"
        style={{ width: SIZE, height: SIZE }}
      >
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="-rotate-90"
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={STROKE_WIDTH}
          />

          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={tone.stroke}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: targetOffset }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">
            {clampedScore}
          </span>

          <span className="text-xs font-medium text-slate-400">
            / 100
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <span
          className={`text-xs font-semibold uppercase tracking-wide ${tone.text}`}
        >
          {level}
        </span>

        <span
          className={`text-[11px] font-medium uppercase tracking-wide ${tone.text}`}
        >
          {tone.label}
        </span>
      </div>
    </div>
  );
}
