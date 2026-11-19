import {
  Download,
  Search,
  Settings,
  Target,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AIFocusCard from "@/components/dashboard/AIFocusCard";
import AIRecommendationCard from "@/components/dashboard/AIRecommendationCard";
import {
  DashboardProvider,
  useDashboardModel,
} from "@/components/dashboard/DashboardProvider";
import KPIRow from "@/components/dashboard/KPIRow";
import LeadFlowCopilotCard from "@/components/dashboard/LeadFlowCopilotCard";
import PriorityLeadCard from "@/components/dashboard/PriorityLeadCard";
import WelcomeHero from "@/components/dashboard/WelcomeHero";
import type { QuickAction } from "@/lib/dashboard/dashboard-presenter";

const QUICK_ACTION_ICONS: Record<QuickAction["icon"], LucideIcon> = {
  search: Search,
  target: Target,
  download: Download,
  settings: Settings,
};

function QuickActions({
  actions,
}: {
  actions: QuickAction[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base text-slate-950">
          Ações rápidas
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {actions.map((action) => {
            const Icon = QUICK_ACTION_ICONS[action.icon];

            return (
              <Button
                key={action.label}
                type="button"
                variant="outline"
                className="h-auto w-full justify-start gap-2 py-3"
              >
                <Icon className="h-4 w-4" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardHomeContent() {
  const model = useDashboardModel();

  return (
    <div className="space-y-6">
      <WelcomeHero
        userName={model.welcome.userName}
        potentialRevenue={model.welcome.potentialRevenue}
        hotLeads={model.welcome.hotLeads}
        message={model.welcome.message}
      />

      <LeadFlowCopilotCard
        greeting={model.copilot.greeting}
        summary={model.copilot.summary}
        recommendations={model.copilot.recommendations}
        potentialRevenue={model.copilot.potentialRevenue}
      />

      <KPIRow
        totalLeads={model.kpis.totalLeads}
        hotLeads={model.kpis.hotLeads}
        potentialRevenue={model.kpis.potentialRevenue}
        averageProbability={model.kpis.averageProbability}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <PriorityLeadCard
          companyName={model.priorityLead.companyName}
          winProbability={model.priorityLead.winProbability}
          recommendedService={
            model.priorityLead.recommendedService
          }
          potentialRevenue={
            model.priorityLead.potentialRevenue
          }
          actionLabel={model.priorityLead.actionLabel}
          onAction={model.priorityLead.onAction}
        />

        <AIRecommendationCard
          title={model.recommendation.title}
          recommendation={model.recommendation.recommendation}
          reason={model.recommendation.reason}
          action={model.recommendation.action}
        />
      </div>

      <AIFocusCard
        title={model.focus.title}
        segment={model.focus.segment}
        leadCount={model.focus.leadCount}
        conversionRate={model.focus.conversionRate}
        potentialRevenue={model.focus.potentialRevenue}
      />

      <QuickActions actions={model.quickActions} />
    </div>
  );
}

export default function DashboardHome() {
  return (
    <DashboardProvider>
      <DashboardHomeContent />
    </DashboardProvider>
  );
}
