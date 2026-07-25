from pydantic import BaseModel, Field


class PriorityLead(BaseModel):
    id: int | None = None
    name: str | None = None
    opportunity_index: int = Field(ge=0, le=100)
    temperature: str
    win_probability_score: int = Field(ge=0, le=100)


class ExecutiveDashboard(BaseModel):
    summary: str
    priority_leads: list[PriorityLead]
    potential_revenue: float | None = None
    avg_win_probability: int = Field(ge=0, le=100)
