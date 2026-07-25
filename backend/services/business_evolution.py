from backend.schemas.opportunity_intelligence import PainPoint
from backend.services.opportunity_intelligence_service import (
    _niche_bucket as _get_niche_bucket,
)
from backend.services.solution_engine import (
    CATALOG_NICHE_RESTRICTIONS,
    SEVERITY_RANK,
    is_service_offered_by_user,
    load_solution_catalog,
)


MAX_ROADMAP_STEPS = 5

STAGE_WEIGHTS = {
    "alta": 25,
    "média": 12,
    "baixa": 5,
}

# Ordem da jornada de evolução comercial: presença digital vem antes de
# visibilidade, que vem antes de reputação, gestão e automação.
CATEGORY_ORDER = {
    "Presença Digital": 1,
    "Visibilidade": 2,
    "Reputação": 3,
    "Gestão Comercial": 4,
    "Automação": 5,
}

DEFAULT_CATEGORY_RANK = 6

# Landing Page e Site Institucional nunca aparecem juntos no roadmap:
# são duas formas concorrentes de resolver a mesma dor (ausência de site).
PRESENCE_SERVICE_IDS = {"landing-page", "site-institucional"}


def _classify_stage(pain_points: list[PainPoint]) -> str:
    if not pain_points:
        return "Consolidado"

    severities = [point.severity for point in pain_points]

    if severities.count("alta") >= 2:
        return "Fundação Digital"

    if severities.count("alta") == 1:
        return "Estruturação"

    if "média" in severities:
        return "Crescimento"

    return "Otimização"


def _calculate_score(pain_points: list[PainPoint]) -> int:
    penalty = sum(
        STAGE_WEIGHTS[point.severity] for point in pain_points
    )

    return max(0, min(100, 100 - penalty))


def _category_rank(category: str) -> int:
    return CATEGORY_ORDER.get(category, DEFAULT_CATEGORY_RANK)


def _choose_presence_solution(
    catalog_by_id: dict[str, dict],
    pain_points: list[PainPoint],
    offered_services: list[str],
) -> dict | None:
    landing = catalog_by_id.get("landing-page")
    site = catalog_by_id.get("site-institucional")

    pain_codes = {point.code for point in pain_points}

    eligible = [
        item
        for item in (landing, site)
        if item is not None
        and any(
            code in pain_codes for code in item.get("solves", [])
        )
    ]

    if not eligible:
        return None

    if len(eligible) == 1:
        return eligible[0]

    landing_offered = is_service_offered_by_user(
        landing["name"],
        offered_services,
    )
    site_offered = is_service_offered_by_user(
        site["name"],
        offered_services,
    )

    if landing_offered and not site_offered:
        return landing

    if site_offered and not landing_offered:
        return site

    # Empate: poucas dores pedem uma solução simples e focada em
    # conversão; várias dores pedem uma presença digital mais completa.
    if len(pain_points) >= 3:
        return site

    return landing


def build_solution_candidates(
    pain_points: list[PainPoint],
    niche_bucket: str | None,
    offered_services: list[str],
) -> list[dict] | None:
    """Fonte única de soluções: usada tanto pelo roadmap do Business
    Evolution quanto pelo recommended_services do Solution Engine, para
    que os dois nunca divirjam. Retorna None se o catálogo falhar."""

    catalog = load_solution_catalog()

    if catalog is None:
        return None

    pain_by_code = {point.code: point for point in pain_points}
    catalog_by_id = {
        item["id"]: item
        for item in catalog
        if isinstance(item, dict) and "id" in item
    }

    candidates: list[dict] = []
    seen_services: set[str] = set()

    def _register(
        item: dict,
        matching_pains: list[PainPoint],
    ) -> None:
        service_name = item.get("name")

        if not service_name or service_name in seen_services:
            return

        primary_pain = max(
            matching_pains,
            key=lambda pain: SEVERITY_RANK[pain.severity],
        )

        candidates.append(
            {
                "service": service_name,
                "description": item.get("description", ""),
                "expected_result": item.get(
                    "expected_result",
                    "",
                ),
                "pain_code": primary_pain.code,
                "offered_by_user": is_service_offered_by_user(
                    service_name,
                    offered_services,
                ),
                "severity_rank": SEVERITY_RANK[
                    primary_pain.severity
                ],
                "catalog_priority": item.get(
                    "priority",
                    999,
                ),
                "category_rank": _category_rank(
                    item.get("category", ""),
                ),
            }
        )

        seen_services.add(service_name)

    # Presença digital: nunca Landing Page e Site Institucional juntos.
    presence_solution = _choose_presence_solution(
        catalog_by_id,
        pain_points,
        offered_services,
    )

    if presence_solution is not None:
        presence_pains = [
            pain_by_code[code]
            for code in presence_solution.get("solves", [])
            if code in pain_by_code
        ]

        if presence_pains:
            _register(presence_solution, presence_pains)

    for item in catalog:
        try:
            catalog_id = item["id"]

            if catalog_id in PRESENCE_SERVICE_IDS:
                continue

            solves = item.get("solves", [])

            restricted_niches = CATALOG_NICHE_RESTRICTIONS.get(
                catalog_id,
            )

            if (
                restricted_niches is not None
                and niche_bucket not in restricted_niches
            ):
                continue

            matching_pains = [
                pain_by_code[code]
                for code in solves
                if code in pain_by_code
            ]

            if not matching_pains:
                continue

            _register(item, matching_pains)

        except (KeyError, TypeError):
            continue

    candidates.sort(
        key=lambda candidate: (
            candidate["category_rank"],
            0 if candidate["offered_by_user"] else 1,
            -candidate["severity_rank"],
            candidate["catalog_priority"],
        )
    )

    return candidates[:MAX_ROADMAP_STEPS]


def _build_roadmap(
    pain_points: list[PainPoint],
    niche_bucket: str | None,
    offered_services: list[str],
) -> list[dict]:
    candidates = build_solution_candidates(
        pain_points,
        niche_bucket,
        offered_services,
    )

    if not candidates:
        return []

    return [
        {
            "step": index + 1,
            "service": candidate["service"],
            "reason": candidate["expected_result"],
        }
        for index, candidate in enumerate(candidates)
    ]


def build_business_evolution(
    company: dict,
    seller_profile: dict | None,
    pain_points: list[PainPoint],
) -> dict:
    offered_services = (
        (seller_profile or {}).get("offered_services") or []
    )

    niche_bucket = _get_niche_bucket(company.get("niche"))

    stage = _classify_stage(pain_points)
    score = _calculate_score(pain_points)
    roadmap = _build_roadmap(
        pain_points,
        niche_bucket,
        offered_services,
    )

    if roadmap:
        summary = (
            f"A empresa está na fase \"{stage}\" da evolução digital, "
            f"com {len(roadmap)} passo(s) recomendado(s) no roadmap "
            "para avançar de forma consistente."
        )
    else:
        summary = (
            f"A empresa está na fase \"{stage}\" da evolução digital, "
            "sem dores compatíveis com o catálogo no momento; "
            "recomenda-se validar novas oportunidades periodicamente."
        )

    return {
        "stage": stage,
        "score": score,
        "summary": summary,
        "roadmap": roadmap,
    }
