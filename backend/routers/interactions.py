from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from backend.database import (
    create_lead_interaction,
    delete_lead_interaction,
    get_company_by_id,
    get_lead_interaction_by_id,
    get_lead_interactions,
    get_pending_follow_ups,
)


router = APIRouter(
    tags=["Interações"],
)


class LeadInteractionCreate(BaseModel):
    interaction_type: str = Field(
        min_length=2,
        max_length=50,
    )

    description: str = Field(
        min_length=2,
        max_length=2000,
    )

    follow_up_at: str | None = Field(
        default=None,
        max_length=40,
    )


@router.post(
    "/companies/{company_id}/interactions",
    status_code=status.HTTP_201_CREATED,
)
def create_interaction(
    company_id: int,
    payload: LeadInteractionCreate,
):
    company = get_company_by_id(
        company_id,
    )

    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Empresa não encontrada.",
        )

    try:
        interaction_id = create_lead_interaction(
            company_id=company_id,
            interaction_type=(
                payload.interaction_type.strip()
            ),
            description=(
                payload.description.strip()
            ),
            follow_up_at=payload.follow_up_at,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        ) from error

    interaction = get_lead_interaction_by_id(
        interaction_id,
    )

    if interaction is None:
        raise HTTPException(
            status_code=500,
            detail=(
                "Erro ao recuperar a interação criada."
            ),
        )

    return interaction


@router.get(
    "/companies/{company_id}/interactions",
)
def list_interactions(
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

    interactions = get_lead_interactions(
        company_id,
    )

    return {
        "company_id": company_id,
        "total": len(interactions),
        "results": interactions,
    }


@router.delete(
    "/interactions/{interaction_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_interaction(
    interaction_id: int,
):
    interaction = get_lead_interaction_by_id(
        interaction_id,
    )

    if interaction is None:
        raise HTTPException(
            status_code=404,
            detail="Interação não encontrada.",
        )

    deleted = delete_lead_interaction(
        interaction_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=500,
            detail="Não foi possível excluir a interação.",
        )

    return None


@router.get("/follow-ups")
def list_follow_ups():
    follow_ups = get_pending_follow_ups()

    return {
        "total": len(follow_ups),
        "results": follow_ups,
    }