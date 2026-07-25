from pydantic import BaseModel, Field


class SellerProfileUpdate(BaseModel):
    offered_services: list[str] | None = None

    target_niches: list[str] | None = None

    average_ticket_range: str | None = Field(
        default=None,
        max_length=80,
    )

    sales_channels: list[str] | None = None

    monthly_goal: int | None = Field(
        default=None,
        ge=0,
    )

    daily_prospecting_time: str | None = Field(
        default=None,
        max_length=80,
    )

    main_sales_challenge: str | None = Field(
        default=None,
        max_length=500,
    )

    communication_style: str | None = Field(
        default=None,
        max_length=80,
    )


class SellerProfile(BaseModel):
    offered_services: list[str] = Field(
        default_factory=list,
    )

    target_niches: list[str] = Field(
        default_factory=list,
    )

    average_ticket_range: str | None = None

    sales_channels: list[str] = Field(
        default_factory=list,
    )

    monthly_goal: int | None = None

    daily_prospecting_time: str | None = None

    main_sales_challenge: str | None = None

    communication_style: str | None = None

    updated_at: str | None = None
