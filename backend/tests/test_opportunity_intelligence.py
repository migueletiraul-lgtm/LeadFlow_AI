from fastapi import FastAPI
from fastapi.testclient import TestClient

from backend.main import app as main_app
from backend.routers.intelligence import router as intelligence_router
import backend.services.opportunity_intelligence_service as opportunity_intelligence_service
from backend.services.opportunity_intelligence_service import (
    build_opportunity_intelligence,
)


def make_company(**overrides) -> dict:
    base = {
        "id": 1,
        "name": "Empresa Teste",
        "niche": "Restaurante",
        "city": "Franca",
        "state": "SP",
        "instagram": "@empresa",
        "website": "https://empresa.com.br",
        "whatsapp": "5511999999999",
        "followers": 1200,
        "google_rating": 4.6,
        "google_reviews": 45,
        "has_site": 1,
        "lead_score": 20,
        "status": "Novo",
        "pipeline_stage": "Novo Lead",
        "created_at": "2026-01-01 00:00:00",
    }
    base.update(overrides)
    return base


def build_test_client() -> TestClient:
    test_app = FastAPI()
    test_app.include_router(intelligence_router)
    return TestClient(test_app)


# ===========================
# EMPRESA SEM SITE
# ===========================

def test_company_without_website_has_high_severity_pain_and_top_recommendation():
    company = make_company(website=None, has_site=0)

    result = build_opportunity_intelligence(company)

    pain_codes = {point.code: point for point in result.pain_points}
    assert "NO_WEBSITE" in pain_codes
    assert pain_codes["NO_WEBSITE"].severity == "alta"

    service_names = {service.service for service in result.recommended_services}
    assert "Landing Page" in service_names
    assert any("SEO Local" in name for name in service_names)

    top_service = result.recommended_services[0]
    assert top_service.priority == 1
    assert top_service.service == "Landing Page"
    assert top_service.pain_code == "NO_WEBSITE"
    assert top_service.offered_by_user is False


# ===========================
# BOA NOTA COM POUCAS AVALIAÇÕES
# ===========================

def test_good_rating_with_few_reviews_is_strength_not_pain_but_lacks_social_proof():
    company = make_company(google_rating=4.8, google_reviews=5)

    result = build_opportunity_intelligence(company)

    pain_codes = {point.code for point in result.pain_points}
    assert "LOW_RATING" not in pain_codes
    assert "LOW_SOCIAL_PROOF" in pain_codes
    assert "força comercial" in result.digital_health.summary


# ===========================
# PRESENÇA DIGITAL COMPLETA
# ===========================

def test_full_digital_presence_has_minimal_pain_and_high_health_score():
    company = make_company(
        website="https://empresa.com.br",
        instagram="@empresa",
        whatsapp="5511999999999",
        google_rating=4.8,
        google_reviews=50,
        followers=5000,
    )

    result = build_opportunity_intelligence(company)

    assert result.digital_health.score >= 80
    assert result.digital_health.level == "excelente"

    pain_codes = {point.code for point in result.pain_points}
    assert pain_codes.isdisjoint(
        {
            "NO_WEBSITE",
            "NO_INSTAGRAM",
            "NO_WHATSAPP",
            "LOW_SOCIAL_PROOF",
            "LOW_RATING",
            "NO_GOOGLE_PRESENCE",
        }
    )

    # Sem dor detectada, o Solution Engine não deve inventar recomendação.
    assert result.recommended_services == []


# ===========================
# EMPRESA INEXISTENTE
# ===========================

def test_intelligence_route_returns_404_for_missing_company(monkeypatch):
    monkeypatch.setattr(
        "backend.routers.intelligence.get_company_by_id",
        lambda company_id: None,
    )

    client = build_test_client()
    response = client.get("/companies/999999/intelligence")

    assert response.status_code == 404


def test_intelligence_route_returns_valid_payload_for_existing_company(
    monkeypatch,
):
    company = make_company(website=None)

    monkeypatch.setattr(
        "backend.routers.intelligence.get_company_by_id",
        lambda company_id: company,
    )

    client = build_test_client()
    response = client.get("/companies/1/intelligence")

    assert response.status_code == 200

    payload = response.json()
    assert payload["company_id"] == 1
    assert "digital_health" in payload
    assert "opportunity" in payload
    assert "pain_points" in payload
    assert "recommended_services" in payload
    assert "sales_strategy" in payload
    assert "next_action" in payload


def test_intelligence_route_registered_in_main_app():
    paths = set()

    for route in main_app.routes:
        included_router = getattr(route, "original_router", None)

        if included_router is not None:
            paths.update(
                sub_route.path
                for sub_route in included_router.routes
            )
        else:
            paths.add(route.path)

    assert "/companies/{company_id}/intelligence" in paths


# ===========================
# SCORES ENTRE 0 E 100
# ===========================

SCORE_TEST_COMPANIES = [
    make_company(),
    make_company(
        website=None,
        instagram=None,
        whatsapp=None,
        followers=None,
        google_rating=None,
        google_reviews=0,
        lead_score=100,
    ),
    make_company(
        google_rating=1.0,
        google_reviews=0,
        followers=0,
        lead_score=0,
    ),
    make_company(
        google_rating=5.0,
        google_reviews=1000,
        followers=100000,
        lead_score=100,
    ),
    make_company(
        niche="Barbearia",
        website=None,
        instagram=None,
        whatsapp="5511999999999",
        google_rating=3.9,
        google_reviews=19,
        followers=300,
        lead_score=57,
    ),
]


def test_scores_are_always_within_zero_and_hundred():
    for company in SCORE_TEST_COMPANIES:
        result = build_opportunity_intelligence(company)

        assert 0 <= result.digital_health.score <= 100
        assert 0 <= result.opportunity.index <= 100
        assert 0 <= result.opportunity.confidence <= 100


# ===========================
# MÁXIMO 5 SOLUÇÕES ORDENADAS
# ===========================

def test_recommended_services_capped_at_five_and_ordered_by_priority():
    company = make_company(
        niche="Academia",
        website=None,
        instagram=None,
        whatsapp=None,
        followers=50,
        google_rating=3.2,
        google_reviews=2,
    )

    result = build_opportunity_intelligence(company)

    assert len(result.recommended_services) <= 5

    priorities = [service.priority for service in result.recommended_services]
    assert priorities == sorted(priorities)
    assert priorities == list(range(1, len(priorities) + 1))

    service_names = [service.service for service in result.recommended_services]
    assert len(service_names) == len(set(service_names))

    # 5 dores presentes (>=3): mutuamente exclusivo escolhe a solução de
    # presença digital mais completa (Site Institucional), não Landing Page.
    assert result.recommended_services[0].service == "Site Institucional"


# ===========================
# SOLUTION ENGINE
# ===========================

def test_offered_services_are_prioritized_over_catalog_priority():
    company = make_company(website=None)

    seller_profile = {
        "offered_services": ["Landing Pages", "SEO"],
    }

    result = build_opportunity_intelligence(
        company,
        seller_profile,
    )

    services = result.recommended_services
    assert len(services) >= 2

    offered_names = {
        service.service
        for service in services
        if service.offered_by_user
    }
    assert "Landing Page" in offered_names
    assert "SEO Local" in offered_names

    # Serviços oferecidos pelo usuário vêm antes dos complementares.
    first_non_offered_index = next(
        (
            index
            for index, service in enumerate(services)
            if not service.offered_by_user
        ),
        len(services),
    )
    offered_prefix = services[:first_non_offered_index]
    assert all(
        service.offered_by_user for service in offered_prefix
    )
    assert len(offered_prefix) >= 2


def test_food_niche_company_without_website_gets_cardapio_digital():
    company = make_company(
        niche="Restaurante",
        website=None,
    )

    result = build_opportunity_intelligence(company)

    service_names = {
        service.service for service in result.recommended_services
    }
    assert "Cardápio Digital" in service_names

    cardapio = next(
        service
        for service in result.recommended_services
        if service.service == "Cardápio Digital"
    )
    assert cardapio.pain_code == "NO_WEBSITE"


def test_non_food_niche_company_does_not_get_cardapio_digital():
    company = make_company(
        niche="Academia",
        website=None,
    )

    result = build_opportunity_intelligence(company)

    service_names = {
        service.service for service in result.recommended_services
    }
    assert "Cardápio Digital" not in service_names


def test_service_not_offered_by_user_appears_as_complementary():
    company = make_company(
        google_rating=3.0,
        google_reviews=45,
    )

    seller_profile = {
        "offered_services": ["Landing Page"],
    }

    result = build_opportunity_intelligence(
        company,
        seller_profile,
    )

    google_business = next(
        (
            service
            for service in result.recommended_services
            if service.service == "Google Business"
        ),
        None,
    )

    assert google_business is not None
    assert google_business.offered_by_user is False
    assert google_business.pain_code == "LOW_RATING"


def test_no_service_recommended_without_compatible_pain():
    company = make_company(
        website="https://empresa.com.br",
        instagram="@empresa",
        whatsapp="5511999999999",
        google_rating=4.8,
        google_reviews=50,
        followers=5000,
    )

    result = build_opportunity_intelligence(company)

    assert result.recommended_services == []


def test_falls_back_to_legacy_engine_when_catalog_fails(monkeypatch):
    import backend.services.business_evolution as business_evolution

    monkeypatch.setattr(
        business_evolution,
        "build_solution_candidates",
        lambda pain_points, niche_bucket, offered_services: None,
    )

    company = make_company(website=None)

    result = build_opportunity_intelligence(company)

    assert len(result.recommended_services) >= 1

    top_service = result.recommended_services[0]
    assert top_service.service == "Landing Page ou Site Institucional"
    assert top_service.pain_code == "NO_WEBSITE"
    assert top_service.offered_by_user is False
