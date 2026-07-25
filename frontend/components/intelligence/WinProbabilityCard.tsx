import { Percent } from "lucide-react";

import MetricCard from "@/components/intelligence/MetricCard";

type WinProbabilityCardProps = {
  score: number;
  confidence: number;
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

export default function WinProbabilityCard({
  score,
  confidence,
}: WinProbabilityCardProps) {
  return (
    <MetricCard
      title="Chance de Fechamento"
      value={`${score}/100`}
      icon={Percent}
      color={getScoreColor(score)}
      subtitle={`Confiança: ${confidence}%`}
    />
  );
}
