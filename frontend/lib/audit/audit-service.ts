import type {
  DigitalHealthLevel,
  NextActionPriority,
  OpportunityIntelligenceResponse,
  OpportunityTemperature,
} from "@/lib/types";

export const AUDIT_ANALYSIS_STEPS = [
  "Encontrando presença digital",
  "Analisando website",
  "Avaliando SEO",
  "Verificando Google Business",
  "Analisando redes sociais",
  "Detectando oportunidades",
  "Gerando relatório",
] as const;

export type AuditFindingSeverity = "alta" | "média" | "baixa";

export type AuditFinding = {
  title: string;
  description: string;
  severity: AuditFindingSeverity;
};

export type AuditOpportunityImpact = "alto" | "médio" | "baixo";

export type AuditOpportunity = {
  title: string;
  description: string;
  impact: AuditOpportunityImpact;
  priorityScore: number;
};

export type AuditCompany = {
  name: string;
  website: string | null;
  instagram: string | null;
  city: string;
  state: string;
};

export type AuditOpportunityScore = {
  index: number;
  temperature: OpportunityTemperature;
  confidence: number;
};

export type AuditWinProbability = {
  score: number;
  confidence: number;
  reasons: string[];
  risks: string[];
};

export type AuditNextAction = {
  priority: NextActionPriority;
  action: string;
  reason: string;
};

export type AuditReportModel = {
  target: string;
  company: AuditCompany;
  score: number;
  level: DigitalHealthLevel;
  summary: string;
  opportunity: AuditOpportunityScore;
  winProbability: AuditWinProbability;
  findings: AuditFinding[];
  opportunities: AuditOpportunity[];
  nextAction: AuditNextAction;
};

function mapPriorityToImpact(
  priority: number,
): AuditOpportunityImpact {
  if (priority <= 2) {
    return "alto";
  }

  if (priority === 3) {
    return "médio";
  }

  return "baixo";
}

function mapPriorityToScore(priority: number): number {
  return Math.round(((6 - priority) / 5) * 100);
}

function formatAuditTarget(target: string): string {
  if (target.startsWith("@")) {
    return target;
  }

  try {
    const url = target.startsWith("http")
      ? new URL(target)
      : new URL(`https://${target}`);

    return url.hostname.replace(/^www\./, "");
  } catch {
    return target;
  }
}

function resolveAuditTitle(
  target: string,
  companyName: string | null | undefined,
): string {
  if (companyName && companyName.trim()) {
    return companyName.trim();
  }

  return formatAuditTarget(target);
}

export function buildAuditReportFromIntelligence(
  target: string,
  intelligence: OpportunityIntelligenceResponse,
): AuditReportModel {
  return {
    target: resolveAuditTitle(target, intelligence.company_name),
    company: {
      name: intelligence.company_name,
      website: intelligence.website,
      instagram: intelligence.instagram,
      city: intelligence.city,
      state: intelligence.state,
    },
    score: intelligence.digital_health.score,
    level: intelligence.digital_health.level,
    summary: intelligence.digital_health.summary,
    opportunity: {
      index: intelligence.opportunity.index,
      temperature: intelligence.opportunity.temperature,
      confidence: intelligence.opportunity.confidence,
    },
    winProbability: {
      score: intelligence.win_probability.score,
      confidence: intelligence.win_probability.confidence,
      reasons: intelligence.win_probability.reasons,
      risks: intelligence.win_probability.risks,
    },
    findings: intelligence.pain_points.map((painPoint) => ({
      title: painPoint.title,
      description: painPoint.description,
      severity: painPoint.severity,
    })),
    opportunities: intelligence.recommended_services.map(
      (service) => ({
        title: service.service,
        description: `${service.reason} Resultado esperado: ${service.expected_result}`,
        impact: mapPriorityToImpact(service.priority),
        priorityScore: mapPriorityToScore(service.priority),
      }),
    ),
    nextAction: {
      priority: intelligence.next_action.priority,
      action: intelligence.next_action.action,
      reason: intelligence.next_action.reason,
    },
  };
}
