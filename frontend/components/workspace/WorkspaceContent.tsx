"use client";

import { TabsContent } from "@/components/ui/tabs";
import BusinessStageCard from "@/components/intelligence/BusinessStageCard";
import ClientConversionAction from "@/components/dashboard/drawer/ClientConversionAction";
import FirstContactAction from "@/components/dashboard/drawer/FirstContactAction";
import LeadBusinessSummary from "@/components/dashboard/drawer/LeadBusinessSummary";
import LeadIntelligencePanel from "@/components/dashboard/drawer/LeadIntelligencePanel";
import LeadInteractionForm from "@/components/dashboard/drawer/LeadInteractionForm";
import LeadPipelineStage from "@/components/dashboard/drawer/LeadPipelineStage";
import LeadResponseAction from "@/components/dashboard/drawer/LeadResponseAction";
import LeadScoreCard from "@/components/dashboard/drawer/LeadScoreCard";
import LeadTimeline from "@/components/dashboard/drawer/LeadTimeline";
import MeetingAction from "@/components/dashboard/drawer/MeetingAction";
import ProposalAction from "@/components/dashboard/drawer/ProposalAction";
import type {
  Lead,
  OpportunityIntelligenceResponse,
} from "@/lib/types";

type WorkspaceContentProps = {
  lead: Lead;
  intelligence: OpportunityIntelligenceResponse;
  onLeadUpdated?: (lead: Lead) => void;
};

export default function WorkspaceContent({
  lead,
  intelligence,
  onLeadUpdated,
}: WorkspaceContentProps) {
  return (
    <>
      <TabsContent value="resumo" className="space-y-4 pt-4">
        <LeadScoreCard lead={lead} />

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Detalhes
          </p>

          <BusinessStageCard
            stage={intelligence.business_evolution.stage}
            score={intelligence.business_evolution.score}
          />
        </div>

        <LeadBusinessSummary lead={lead} />
      </TabsContent>

      <TabsContent value="estrategia" className="space-y-4 pt-4">
        <LeadIntelligencePanel lead={lead} />
      </TabsContent>

      <TabsContent value="execucao" className="space-y-4 pt-4">
        <FirstContactAction
          lead={lead}
          onLeadUpdated={onLeadUpdated}
        />
        <LeadResponseAction
          lead={lead}
          onLeadUpdated={onLeadUpdated}
        />
        <MeetingAction
          lead={lead}
          onLeadUpdated={onLeadUpdated}
        />
        <ProposalAction
          lead={lead}
          onLeadUpdated={onLeadUpdated}
        />
        <ClientConversionAction
          lead={lead}
          onLeadUpdated={onLeadUpdated}
        />
        <LeadPipelineStage
          lead={lead}
          onLeadUpdated={onLeadUpdated}
        />
        <LeadInteractionForm companyId={lead.id} />
      </TabsContent>

      <TabsContent value="historico" className="space-y-4 pt-4">
        <LeadTimeline companyId={lead.id} />
      </TabsContent>
    </>
  );
}
