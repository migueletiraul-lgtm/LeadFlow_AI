from fastapi import APIRouter

from backend.database import (
    get_seller_profile,
    upsert_seller_profile,
)
from backend.schemas.seller_profile import (
    SellerProfile,
    SellerProfileUpdate,
)


router = APIRouter(
    tags=["DNA Comercial"],
)


@router.get(
    "/seller-profile",
    response_model=SellerProfile,
)
def read_seller_profile():
    profile = get_seller_profile()

    if profile is None:
        return SellerProfile()

    return SellerProfile(**profile)


@router.put(
    "/seller-profile",
    response_model=SellerProfile,
)
def write_seller_profile(
    payload: SellerProfileUpdate,
):
    existing = get_seller_profile() or {}

    updated = upsert_seller_profile(
        offered_services=(
            payload.offered_services
            if payload.offered_services is not None
            else existing.get("offered_services")
        ),
        target_niches=(
            payload.target_niches
            if payload.target_niches is not None
            else existing.get("target_niches")
        ),
        average_ticket_range=(
            payload.average_ticket_range
            if payload.average_ticket_range is not None
            else existing.get("average_ticket_range")
        ),
        sales_channels=(
            payload.sales_channels
            if payload.sales_channels is not None
            else existing.get("sales_channels")
        ),
        monthly_goal=(
            payload.monthly_goal
            if payload.monthly_goal is not None
            else existing.get("monthly_goal")
        ),
        daily_prospecting_time=(
            payload.daily_prospecting_time
            if payload.daily_prospecting_time is not None
            else existing.get("daily_prospecting_time")
        ),
        main_sales_challenge=(
            payload.main_sales_challenge
            if payload.main_sales_challenge is not None
            else existing.get("main_sales_challenge")
        ),
        communication_style=(
            payload.communication_style
            if payload.communication_style is not None
            else existing.get("communication_style")
        ),
    )

    return SellerProfile(**updated)
