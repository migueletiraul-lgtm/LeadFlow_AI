import { TrendingUp } from "lucide-react";

import MetricCard from "@/components/intelligence/MetricCard";

type BusinessStageCardProps = {
  stage: string;
  score: number;
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

export default function BusinessStageCard({
  stage,
  score,
}: BusinessStageCardProps) {
  return (
    <MetricCard
      title="Business Stage"
      value={`${score}/100`}
      icon={TrendingUp}
      color={getScoreColor(score)}
      subtitle={stage}
    />
  );
}
