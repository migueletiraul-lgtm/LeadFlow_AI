import DigitalHealthCard from "@/components/intelligence/DigitalHealthCard";
import OpportunityScoreCard from "@/components/intelligence/OpportunityScoreCard";
import WinProbabilityCard from "@/components/intelligence/WinProbabilityCard";
import type { OpportunityIntelligenceResponse } from "@/lib/types";

type WorkspaceSummaryProps = {
  intelligence: OpportunityIntelligenceResponse;
};

export default function WorkspaceSummary({
  intelligence,
}: WorkspaceSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <OpportunityScoreCard
        score={intelligence.opportunity.index}
        temperature={intelligence.opportunity.temperature}
      />

      <DigitalHealthCard
        score={intelligence.digital_health.score}
        level={intelligence.digital_health.level}
      />

      <WinProbabilityCard
        score={intelligence.win_probability.score}
        confidence={intelligence.win_probability.confidence}
      />
    </div>
  );
}
