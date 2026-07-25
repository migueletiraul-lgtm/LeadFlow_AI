from typing import Literal

from pydantic import BaseModel, Field


DigitalHealthLevel = Literal[
    "crítico",
    "baixo",
    "médio",
    "bom",
    "excelente",
]

OpportunityTemperature = Literal[
    "frio",
    "morno",
    "quente",
    "muito quente",
]

Severity = Literal[
    "baixa",
    "média",
    "alta",
]

ActionPriority = Literal[
    "baixa",
    "média",
    "alta",
]


class DigitalHealth(BaseModel):
    score: int = Field(ge=0, le=100)
    level: DigitalHealthLevel
    summary: str


class Opportunity(BaseModel):
    index: int = Field(ge=0, le=100)
    temperature: OpportunityTemperature
    confidence: int = Field(ge=0, le=100)


class PainPoint(BaseModel):
    code: str
    title: str
    description: str
    severity: Severity
    impact: str
    evidence: str


class RecommendedService(BaseModel):
    service: str
    priority: int = Field(ge=1, le=5)
    reason: str
    expected_result: str
    pain_code: str
    offered_by_user: bool


class Objection(BaseModel):
    objection: str
    answer: str


class SalesStrategy(BaseModel):
    best_channel: str
    sales_angle: str
    opening_message: str
    probable_objections: list[Objection]


class NextAction(BaseModel):
    priority: ActionPriority
    action: str
    reason: str


class RoadmapStep(BaseModel):
    step: int = Field(ge=1, le=5)
    service: str
    reason: str


class BusinessEvolution(BaseModel):
    stage: str
    score: int = Field(ge=0, le=100)
    summary: str
    roadmap: list[RoadmapStep] = Field(
        max_length=5,
    )


class WinProbability(BaseModel):
    score: int = Field(ge=0, le=100)
    confidence: int = Field(ge=0, le=100)
    reasons: list[str] = Field(max_length=4)
    risks: list[str] = Field(max_length=3)


class OpportunityIntelligence(BaseModel):
    company_id: int
    digital_health: DigitalHealth
    opportunity: Opportunity
    pain_points: list[PainPoint]
    recommended_services: list[RecommendedService] = Field(
        max_length=5,
    )
    sales_strategy: SalesStrategy
    next_action: NextAction
    business_evolution: BusinessEvolution
    win_probability: WinProbability
