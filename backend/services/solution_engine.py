import json
import unicodedata
from pathlib import Path

from backend.schemas.opportunity_intelligence import (
    PainPoint,
    RecommendedService,
)


CATALOG_PATH = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "solution_catalog.json"
)

SEVERITY_RANK = {
    "alta": 3,
    "média": 2,
    "baixa": 1,
}

MAX_RECOMMENDED_SERVICES = 5

# Restrições de nicho: soluções que só fazem sentido para
# determinados nichos, independentemente da dor detectada.
CATALOG_NICHE_RESTRICTIONS: dict[str, set[str]] = {
    "cardapio-digital": {"alimentacao"},
}


# ===========================
# CATÁLOGO
# ===========================

def load_solution_catalog() -> list[dict] | None:
    try:
        with open(CATALOG_PATH, encoding="utf-8") as catalog_file:
            data = json.load(catalog_file)

    except (OSError, json.JSONDecodeError):
        return None

    if not isinstance(data, list):
        return None

    return data


# ===========================
# HELPERS
# ===========================

def normalize_text(value: str) -> str:
    decomposed = unicodedata.normalize("NFKD", value)

    without_accents = "".join(
        character
        for character in decomposed
        if not unicodedata.combining(character)
    )

    return without_accents.strip().lower()


def is_service_offered_by_user(
    service_name: str,
    offered_services: list[str],
) -> bool:
    if not offered_services:
        return False

    normalized_service = normalize_text(service_name)

    for offered in offered_services:
        normalized_offered = normalize_text(offered)

        if not normalized_offered:
            continue

        if (
            normalized_offered in normalized_service
            or normalized_service in normalized_offered
        ):
            return True

    return False


def _is_offered_by_user(
    catalog_item: dict,
    offered_services: list[str],
) -> bool:
    if is_service_offered_by_user(
        catalog_item.get("name", ""),
        offered_services,
    ):
        return True

    catalog_id = str(
        catalog_item.get("id", ""),
    ).replace("-", " ")

    return is_service_offered_by_user(
        catalog_id,
        offered_services,
    )


# ===========================
# MOTOR DE SOLUÇÕES
# ===========================

def build_catalog_recommendations(
    pain_points: list[PainPoint],
    niche_bucket: str | None,
    offered_services: list[str],
) -> list[RecommendedService] | None:
    catalog = load_solution_catalog()

    if catalog is None:
        return None

    pain_by_code = {
        point.code: point
        for point in pain_points
    }

    candidates: list[dict] = []

    for item in catalog:
        try:
            catalog_id = item["id"]
            service_name = item["name"]
            solves = item.get("solves", [])

            restricted_niches = (
                CATALOG_NICHE_RESTRICTIONS.get(
                    catalog_id,
                )
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

            primary_pain = max(
                matching_pains,
                key=lambda pain: SEVERITY_RANK[
                    pain.severity
                ],
            )

            candidates.append(
                {
                    "service": service_name,
                    "reason": item["description"],
                    "expected_result": item[
                        "expected_result"
                    ],
                    "pain_code": primary_pain.code,
                    "offered_by_user": _is_offered_by_user(
                        item,
                        offered_services,
                    ),
                    "severity_rank": SEVERITY_RANK[
                        primary_pain.severity
                    ],
                    "catalog_priority": item.get(
                        "priority",
                        999,
                    ),
                }
            )

        except (KeyError, TypeError):
            continue

    candidates.sort(
        key=lambda candidate: (
            0 if candidate["offered_by_user"] else 1,
            -candidate["severity_rank"],
            candidate["catalog_priority"],
        )
    )

    top_candidates = candidates[
        :MAX_RECOMMENDED_SERVICES
    ]

    return [
        RecommendedService(
            service=candidate["service"],
            priority=index + 1,
            reason=candidate["reason"],
            expected_result=candidate[
                "expected_result"
            ],
            pain_code=candidate["pain_code"],
            offered_by_user=candidate[
                "offered_by_user"
            ],
        )
        for index, candidate in enumerate(
            top_candidates,
        )
    ]
