from fastapi import APIRouter, HTTPException

from backend.database import get_company_by_id, get_seller_profile
from backend.schemas.opportunity_intelligence import OpportunityIntelligence
from backend.services.opportunity_intelligence_service import (
    build_opportunity_intelligence,
)


router = APIRouter(
    tags=["Opportunity Intelligence"],
)


@router.get(
    "/companies/{company_id}/intelligence",
    response_model=OpportunityIntelligence,
)
def get_company_intelligence(
    company_id: int,
):
    company = get_company_by_id(
        company_id,
    )

    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Empresa não encontrada.",
        )

    seller_profile = get_seller_profile()

    return build_opportunity_intelligence(
        company,
        seller_profile,
    )
