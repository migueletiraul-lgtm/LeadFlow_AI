import BusinessStageCard from "@/components/intelligence/BusinessStageCard";
import DigitalHealthCard from "@/components/intelligence/DigitalHealthCard";
import OpportunityScoreCard from "@/components/intelligence/OpportunityScoreCard";
import WinProbabilityCard from "@/components/intelligence/WinProbabilityCard";

type IntelligenceOverviewProps = {
  opportunityScore: number;
  temperature: string;
  digitalHealth: number;
  digitalHealthLevel: string;
  businessStage: string;
  businessStageScore: number;
  winProbabilityScore: number;
  winProbabilityConfidence: number;
};

export default function IntelligenceOverview({
  opportunityScore,
  temperature,
  digitalHealth,
  digitalHealthLevel,
  businessStage,
  businessStageScore,
  winProbabilityScore,
  winProbabilityConfidence,
}: IntelligenceOverviewProps) {
  return (
    <section>
      <h3 className="font-semibold text-slate-950">
        LeadFlow Intelligence
      </h3>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <OpportunityScoreCard
          score={opportunityScore}
          temperature={temperature}
        />

        <DigitalHealthCard
          score={digitalHealth}
          level={digitalHealthLevel}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <BusinessStageCard
          stage={businessStage}
          score={businessStageScore}
        />

        <WinProbabilityCard
          score={winProbabilityScore}
          confidence={winProbabilityConfidence}
        />
      </div>
    </section>
  );
}
