export type PipelineStage =
  | "Novo Lead"
  | "Contato iniciado"
  | "Resposta recebida"
  | "Reunião"
  | "Proposta enviada"
  | "Negociação"
  | "Cliente"
  | "Perdido";

export type Lead = {
  id: number;
  name: string;
  niche: string;
  city: string;
  state: string;
  instagram: string | null;
  website: string | null;
  whatsapp: string | null;
  followers: number | null;
  google_rating: number | null;
  google_reviews: number;
  has_site: number;
  lead_score: number;
  status: string;
  pipeline_stage: PipelineStage;
  created_at: string;
};

export type BestLeadsResponse = {
  total: number;
  filters: {
    limit: number;
    city: string | null;
    niche: string | null;
    min_score: number;
    without_site: boolean;
    without_instagram: boolean;
    status: string | null;
    pipeline_stage: string | null;
  };
  results: Lead[];
};

// ===========================
// OPPORTUNITY INTELLIGENCE
// ===========================

export type DigitalHealthLevel =
  | "crítico"
  | "baixo"
  | "médio"
  | "bom"
  | "excelente";

export type OpportunityTemperature =
  | "frio"
  | "morno"
  | "quente"
  | "muito quente";

export type PainPointSeverity =
  | "baixa"
  | "média"
  | "alta";

export type NextActionPriority =
  | "baixa"
  | "média"
  | "alta";

export type DigitalHealth = {
  score: number;
  level: DigitalHealthLevel;
  summary: string;
};

export type Opportunity = {
  index: number;
  temperature: OpportunityTemperature;
  confidence: number;
};

export type PainPoint = {
  code: string;
  title: string;
  description: string;
  severity: PainPointSeverity;
  impact: string;
  evidence: string;
};

export type RecommendedService = {
  service: string;
  priority: number;
  reason: string;
  expected_result: string;
};

export type SalesObjection = {
  objection: string;
  answer: string;
};

export type SalesStrategy = {
  best_channel: string;
  sales_angle: string;
  opening_message: string;
  probable_objections: SalesObjection[];
};

export type NextAction = {
  priority: NextActionPriority;
  action: string;
  reason: string;
};

export type RoadmapStep = {
  step: number;
  service: string;
  reason: string;
};

export type BusinessEvolution = {
  stage: string;
  score: number;
  summary: string;
  roadmap: RoadmapStep[];
};

export type WinProbability = {
  score: number;
  confidence: number;
  reasons: string[];
  risks: string[];
};

export type OpportunityIntelligenceResponse = {
  company_id: number;
  digital_health: DigitalHealth;
  opportunity: Opportunity;
  pain_points: PainPoint[];
  recommended_services: RecommendedService[];
  sales_strategy: SalesStrategy;
  next_action: NextAction;
  business_evolution: BusinessEvolution;
  win_probability: WinProbability;
};

// ===========================
// EXECUTIVE DASHBOARD
// ===========================

export type ExecutiveDashboardPriorityLead = {
  id: number | null;
  name: string | null;
  opportunity_index: number;
  temperature: string;
  win_probability_score: number;
};

export type ExecutiveDashboardResponse = {
  summary: string;
  priority_leads: ExecutiveDashboardPriorityLead[];
  potential_revenue: number | null;
  avg_win_probability: number;
};