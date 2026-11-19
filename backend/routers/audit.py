from fastapi import APIRouter, HTTPException

from backend.database import (
    find_company_by_website_or_instagram,
    get_seller_profile,
)
from backend.schemas.audit import AuditRequest
from backend.schemas.opportunity_intelligence import OpportunityIntelligence
from backend.services.opportunity_intelligence_service import (
    build_opportunity_intelligence,
)


router = APIRouter(
    tags=["Audit"],
)


@router.post(
    "/audit",
    response_model=OpportunityIntelligence,
)
def run_audit(
    payload: AuditRequest,
):
    company = find_company_by_website_or_instagram(
        website=payload.website,
        instagram=payload.instagram,
    )

    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Nenhuma empresa encontrada para o website ou Instagram informado.",
        )

    seller_profile = get_seller_profile()

    return build_opportunity_intelligence(
        company,
        seller_profile,
    )
