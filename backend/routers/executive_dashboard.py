from fastapi import APIRouter, Query

from backend.database import get_best_leads, get_seller_profile
from backend.schemas.executive_dashboard import ExecutiveDashboard
from backend.services.executive_dashboard import build_executive_dashboard


router = APIRouter(
    tags=["Executive Dashboard"],
)


@router.get(
    "/executive-dashboard",
    response_model=ExecutiveDashboard,
)
def get_executive_dashboard(
    limit: int = Query(
        default=100,
        ge=1,
        le=1000,
    ),
):
    companies = get_best_leads(
        limit=limit,
    )

    seller_profile = get_seller_profile()

    return build_executive_dashboard(
        companies,
        seller_profile,
    )
