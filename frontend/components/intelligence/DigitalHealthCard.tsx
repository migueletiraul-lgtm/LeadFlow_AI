import { Activity } from "lucide-react";

import MetricCard from "@/components/intelligence/MetricCard";

type DigitalHealthCardProps = {
  score: number;
  level: string;
};

function getScoreColor(score: number) {
  if (score >= 70) {
    return "text-emerald-600";
  }

  if (score >= 40) {
    return "text-amber-600";
  }

  return "text-red-600";
}

export default function DigitalHealthCard({
  score,
  level,
}: DigitalHealthCardProps) {
  return (
    <MetricCard
      title="Digital Health"
      value={`${score}/100`}
      icon={Activity}
      color={getScoreColor(score)}
      subtitle={level}
    />
  );
}
