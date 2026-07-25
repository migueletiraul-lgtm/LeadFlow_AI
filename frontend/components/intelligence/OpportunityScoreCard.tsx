import { Target } from "lucide-react";

import MetricCard from "@/components/intelligence/MetricCard";

type OpportunityScoreCardProps = {
  score: number;
  temperature: string;
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

export default function OpportunityScoreCard({
  score,
  temperature,
}: OpportunityScoreCardProps) {
  return (
    <MetricCard
      title="Opportunity Score"
      value={`${score}/100`}
      icon={Target}
      color={getScoreColor(score)}
      subtitle={temperature}
    />
  );
}
