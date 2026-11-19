import type {
  ExecutiveDashboardResponse,
  Lead,
} from "@/lib/types";

export type DashboardPresenterInput = {
  userName?: string;
  leads: Lead[];
  executiveDashboard: ExecutiveDashboardResponse | null;
};

export type WelcomeModel = {
  userName: string;
  potentialRevenue: number;
  hotLeads: number;
  message: string;
};

export type CopilotModel = {
  greeting: string;
  summary: string;
  recommendations: string[];
  potentialRevenue: number;
};

export type KpisModel = {
  totalLeads: number;
  hotLeads: number;
  potentialRevenue: number;
  averageProbability: number;
};

export type PriorityLeadModel = {
  companyName: string;
  winProbability: number;
  recommendedService: string;
  potentialRevenue: number;
  actionLabel: string;
  onAction: () => void;
};

export type RecommendationModel = {
  title: string;
  recommendation: string;
  reason: string;
  action: string;
};

export type FocusModel = {
  title: string;
  segment: string;
  leadCount: number;
  conversionRate: number;
  potentialRevenue: number;
};

export type QuickAction = {
  label: string;
  icon: "search" | "target" | "download" | "settings";
};

export type DashboardModel = {
  welcome: WelcomeModel;
  copilot: CopilotModel;
  kpis: KpisModel;
  priorityLead: PriorityLeadModel;
  recommendation: RecommendationModel;
  focus: FocusModel;
  quickActions: QuickAction[];
};

const HOT_LEAD_SCORE_THRESHOLD = 80;

function countHotLeads(input: DashboardPresenterInput): number {
  const hotPriorityLeads =
    input.executiveDashboard?.priority_leads.filter((lead) =>
      ["quente", "muito quente"].includes(
        lead.temperature.toLowerCase(),
      ),
    ).length ?? null;

  if (hotPriorityLeads !== null && hotPriorityLeads > 0) {
    return hotPriorityLeads;
  }

  return input.leads.filter(
    (lead) => lead.lead_score >= HOT_LEAD_SCORE_THRESHOLD,
  ).length;
}

function getPotentialRevenue(
  input: DashboardPresenterInput,
): number {
  return input.executiveDashboard?.potential_revenue ?? 0;
}

function getAverageProbability(
  input: DashboardPresenterInput,
): number {
  return input.executiveDashboard?.avg_win_probability ?? 0;
}

function getTopPriorityLead(input: DashboardPresenterInput) {
  return input.executiveDashboard?.priority_leads[0] ?? null;
}

function buildWelcome(
  input: DashboardPresenterInput,
  hotLeads: number,
  potentialRevenue: number,
): WelcomeModel {
  const topLead = getTopPriorityLead(input);

  const message =
    hotLeads > 0
      ? `Você tem ${hotLeads} lead(s) quente(s) esperando abordagem hoje.${
          topLead
            ? ` Comece por ${topLead.name ?? "o lead prioritário"} — ele tem a maior chance de fechamento.`
            : ""
        }`
      : "Nenhum lead quente identificado no momento. Continue alimentando sua base para novas oportunidades.";

  return {
    userName: input.userName?.trim() || "vendedor",
    potentialRevenue,
    hotLeads,
    message,
  };
}

function buildCopilot(
  input: DashboardPresenterInput,
  potentialRevenue: number,
): CopilotModel {
  const summary =
    input.executiveDashboard?.summary ||
    "Ainda não há dados suficientes para um resumo executivo completo.";

  const recommendations = (
    input.executiveDashboard?.priority_leads ?? []
  )
    .slice(0, 3)
    .map(
      (lead) =>
        `Priorize ${lead.name ?? "este lead"} — ${
          lead.win_probability_score
        }% de chance de fechamento.`,
    );

  return {
    greeting: "Aqui está o seu resumo do dia",
    summary,
    recommendations:
      recommendations.length > 0
        ? recommendations
        : [
            "Continue alimentando sua base e priorize os leads com maior score comercial.",
          ],
    potentialRevenue,
  };
}

function buildKpis(
  input: DashboardPresenterInput,
  hotLeads: number,
  potentialRevenue: number,
  averageProbability: number,
): KpisModel {
  return {
    totalLeads: input.leads.length,
    hotLeads,
    potentialRevenue,
    averageProbability,
  };
}

function buildPriorityLead(
  input: DashboardPresenterInput,
): PriorityLeadModel {
  const topLead = getTopPriorityLead(input);
  const priorityLeadsCount =
    input.executiveDashboard?.priority_leads.length ?? 0;

  const totalPotentialRevenue = getPotentialRevenue(input);

  const estimatedRevenue =
    priorityLeadsCount > 0
      ? Math.round(totalPotentialRevenue / priorityLeadsCount)
      : 0;

  return {
    companyName: topLead?.name ?? "Nenhum lead prioritário",
    winProbability: topLead?.win_probability_score ?? 0,
    recommendedService: "Ver diagnóstico completo do lead",
    potentialRevenue: estimatedRevenue,
    actionLabel: "Iniciar abordagem",
    onAction: () => {},
  };
}

function buildRecommendation(
  input: DashboardPresenterInput,
  averageProbability: number,
): RecommendationModel {
  const topLead = getTopPriorityLead(input);

  if (!topLead) {
    return {
      title: "Nenhuma oportunidade prioritária no momento",
      recommendation:
        "Busque novos leads para que o LeadFlow possa identificar oportunidades.",
      reason:
        "Ainda não há leads suficientes para gerar uma recomendação personalizada.",
      action: "Buscar novos leads na sua região de atuação.",
    };
  }

  return {
    title: `Foco em ${topLead.name ?? "seu lead prioritário"}`,
    recommendation: `Esse lead está classificado como "${topLead.temperature}", com ${topLead.win_probability_score}% de chance de fechamento.`,
    reason: `A chance média de fechamento da sua carteira é de ${averageProbability}%; este lead está acima da média.`,
    action: `Priorize o contato com ${topLead.name ?? "este lead"} ainda hoje.`,
  };
}

function buildFocus(input: DashboardPresenterInput): FocusModel {
  const nicheCounts = new Map<string, Lead[]>();

  input.leads.forEach((lead) => {
    const niche = lead.niche?.trim() || "Não informado";
    const currentLeads = nicheCounts.get(niche) ?? [];

    nicheCounts.set(niche, [...currentLeads, lead]);
  });

  let topNiche = "Não informado";
  let topNicheLeads: Lead[] = [];

  nicheCounts.forEach((leads, niche) => {
    if (leads.length > topNicheLeads.length) {
      topNiche = niche;
      topNicheLeads = leads;
    }
  });

  const leadCount = topNicheLeads.length;

  const convertedCount = topNicheLeads.filter(
    (lead) => lead.pipeline_stage === "Cliente",
  ).length;

  const conversionRate =
    leadCount > 0
      ? Math.round((convertedCount / leadCount) * 100)
      : 0;

  const totalPotentialRevenue = getPotentialRevenue(input);

  const potentialRevenue =
    input.leads.length > 0
      ? Math.round(
          (totalPotentialRevenue * leadCount) /
            input.leads.length,
        )
      : 0;

  return {
    title: `Priorize o segmento de ${topNiche.toLowerCase()}`,
    segment: topNiche,
    leadCount,
    conversionRate,
    potentialRevenue,
  };
}

function buildQuickActions(): QuickAction[] {
  return [
    { label: "Buscar novos leads", icon: "search" },
    { label: "Ver pipeline", icon: "target" },
    { label: "Exportar Excel", icon: "download" },
    { label: "Configurar DNA comercial", icon: "settings" },
  ];
}

export function buildDashboardModel(
  data: DashboardPresenterInput,
): DashboardModel {
  const hotLeads = countHotLeads(data);
  const potentialRevenue = getPotentialRevenue(data);
  const averageProbability = getAverageProbability(data);

  return {
    welcome: buildWelcome(data, hotLeads, potentialRevenue),
    copilot: buildCopilot(data, potentialRevenue),
    kpis: buildKpis(
      data,
      hotLeads,
      potentialRevenue,
      averageProbability,
    ),
    priorityLead: buildPriorityLead(data),
    recommendation: buildRecommendation(
      data,
      averageProbability,
    ),
    focus: buildFocus(data),
    quickActions: buildQuickActions(),
  };
}
