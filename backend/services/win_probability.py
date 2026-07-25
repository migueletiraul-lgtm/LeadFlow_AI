from backend.services.opportunity_intelligence_service import (
    _pipeline_category,
)


SEVERITY_WEIGHTS = {
    "alta": 25,
    "média": 12,
    "baixa": 5,
}

MAX_REASONS = 4
MAX_RISKS = 3


# ===========================
# HELPERS
# ===========================

def _field(source, key: str, default=None):
    if source is None:
        return default

    if isinstance(source, dict):
        return source.get(key, default)

    return getattr(source, key, default)


def _clamp(value: float, low: int = 0, high: int = 100) -> int:
    return max(low, min(high, round(value)))


def _niche_matches_target(
    niche: str | None,
    target_niches: list[str],
) -> bool:
    if not niche or not target_niches:
        return False

    normalized_niche = niche.strip().lower()

    for target in target_niches:
        normalized_target = (target or "").strip().lower()

        if not normalized_target:
            continue

        if (
            normalized_target in normalized_niche
            or normalized_niche in normalized_target
        ):
            return True

    return False


# ===========================
# SCORE
# ===========================

def _pain_pressure(pain_points: list) -> int:
    total = sum(
        SEVERITY_WEIGHTS.get(_field(pain, "severity"), 0)
        for pain in pain_points
    )

    return _clamp(total)


def _service_fit(recommended_services: list) -> int:
    if not recommended_services:
        return 50

    offered_count = sum(
        1
        for service in recommended_services
        if _field(service, "offered_by_user", False)
    )

    return _clamp(offered_count / len(recommended_services) * 100)


def _pipeline_adjustment(pipeline_category: str) -> int:
    if pipeline_category == "em_andamento":
        return 10

    if pipeline_category == "cliente":
        return 10

    if pipeline_category == "perdido":
        return -20

    return 0


def _calculate_score(
    company: dict,
    seller_profile: dict | None,
    digital_health_score: int,
    opportunity_index: int,
    pain_points: list,
    recommended_services: list,
    pipeline_category: str,
) -> int:
    lead_score = _clamp(company.get("lead_score") or 0)
    digital_health_gap = _clamp(100 - digital_health_score)
    pain_pressure = _pain_pressure(pain_points)
    service_fit = _service_fit(recommended_services)

    base = (
        0.25 * lead_score
        + 0.25 * opportunity_index
        + 0.15 * digital_health_gap
        + 0.15 * pain_pressure
        + 0.15 * service_fit
    )

    target_niches = (seller_profile or {}).get("target_niches") or []
    niche_bonus = (
        5
        if _niche_matches_target(company.get("niche"), target_niches)
        else 0
    )

    return _clamp(
        base + niche_bonus + _pipeline_adjustment(pipeline_category)
    )


# ===========================
# CONFIANÇA
# ===========================

def _calculate_confidence(
    company: dict,
    seller_profile: dict | None,
) -> int:
    signals = [
        bool(company.get("website")),
        bool(company.get("instagram")),
        bool(company.get("whatsapp")),
        company.get("google_rating") is not None,
        (company.get("google_reviews") or 0) > 0,
        company.get("followers") is not None,
        bool((seller_profile or {}).get("offered_services")),
        bool((seller_profile or {}).get("target_niches")),
    ]

    known = sum(1 for signal in signals if signal)

    return _clamp(known / len(signals) * 100)


# ===========================
# MOTIVOS E RISCOS
# ===========================

def _build_reasons(
    company: dict,
    seller_profile: dict | None,
    lead_score: int,
    opportunity_index: int,
    opportunity_temperature: str,
    pain_points: list,
    recommended_services: list,
    pipeline_category: str,
) -> list[str]:
    candidates: list[tuple[int, str]] = []

    if lead_score >= 60:
        candidates.append(
            (
                lead_score,
                f"Lead score alto ({lead_score}/100) indica forte "
                "potencial comercial.",
            )
        )

    if opportunity_index >= 50:
        candidates.append(
            (
                opportunity_index,
                f"Oportunidade classificada como \"{opportunity_temperature}\" "
                f"({opportunity_index}/100).",
            )
        )

    high_severity_count = sum(
        1
        for pain in pain_points
        if _field(pain, "severity") == "alta"
    )

    if high_severity_count > 0:
        candidates.append(
            (
                high_severity_count * 20,
                f"{high_severity_count} dor(es) de alta gravidade "
                "identificada(s), motivo real para agir agora.",
            )
        )

    offered_count = sum(
        1
        for service in recommended_services
        if _field(service, "offered_by_user", False)
    )

    if offered_count > 0 and recommended_services:
        candidates.append(
            (
                offered_count * 15,
                f"{offered_count} de {len(recommended_services)} "
                "soluções recomendadas já fazem parte do seu "
                "portfólio.",
            )
        )

    target_niches = (seller_profile or {}).get("target_niches") or []

    if _niche_matches_target(company.get("niche"), target_niches):
        candidates.append(
            (
                15,
                "O nicho da empresa está entre os nichos-alvo do seu "
                "DNA comercial.",
            )
        )

    if pipeline_category in {"em_andamento", "cliente"}:
        candidates.append(
            (
                15,
                "O relacionamento já está em andamento, o que reduz "
                "a fricção de um primeiro contato frio.",
            )
        )

    candidates.sort(key=lambda item: item[0], reverse=True)

    return [reason for _, reason in candidates[:MAX_REASONS]]


def _build_risks(
    seller_profile: dict | None,
    digital_health_score: int,
    pain_points: list,
    recommended_services: list,
    pipeline_category: str,
    company: dict,
) -> list[str]:
    candidates: list[tuple[int, str]] = []

    if pipeline_category == "perdido":
        candidates.append(
            (
                100,
                "O lead já foi marcado como perdido anteriormente; "
                "recomenda-se validar interesse antes de reengajar.",
            )
        )

    if recommended_services and not any(
        _field(service, "offered_by_user", False)
        for service in recommended_services
    ):
        candidates.append(
            (
                80,
                "Nenhuma das soluções recomendadas faz parte do seu "
                "portfólio atual; pode exigir parceria ou indicação.",
            )
        )

    if not pain_points:
        candidates.append(
            (
                60,
                "Poucas dores foram identificadas; pode ser mais "
                "difícil criar senso de urgência.",
            )
        )

    if digital_health_score >= 80:
        candidates.append(
            (
                50,
                "A presença digital já é excelente, reduzindo a "
                "urgência percebida para uma nova solução.",
            )
        )

    target_niches = (seller_profile or {}).get("target_niches") or []

    if target_niches and not _niche_matches_target(
        company.get("niche"), target_niches
    ):
        candidates.append(
            (
                40,
                "O nicho da empresa não está entre os nichos-alvo do "
                "seu DNA comercial.",
            )
        )

    candidates.sort(key=lambda item: item[0], reverse=True)

    return [risk for _, risk in candidates[:MAX_RISKS]]


# ===========================
# MONTAGEM FINAL
# ===========================

def build_win_probability(
    company: dict,
    seller_profile: dict | None,
    intelligence,
) -> dict:
    digital_health = _field(intelligence, "digital_health")
    opportunity = _field(intelligence, "opportunity")
    pain_points = _field(intelligence, "pain_points") or []
    recommended_services = (
        _field(intelligence, "recommended_services") or []
    )

    digital_health_score = _clamp(_field(digital_health, "score", 0))
    opportunity_index = _clamp(_field(opportunity, "index", 0))
    opportunity_temperature = _field(opportunity, "temperature", "frio")

    pipeline_category = _pipeline_category(
        company.get("pipeline_stage"),
    )

    lead_score = _clamp(company.get("lead_score") or 0)

    score = _calculate_score(
        company,
        seller_profile,
        digital_health_score,
        opportunity_index,
        pain_points,
        recommended_services,
        pipeline_category,
    )

    confidence = _calculate_confidence(company, seller_profile)

    reasons = _build_reasons(
        company,
        seller_profile,
        lead_score,
        opportunity_index,
        opportunity_temperature,
        pain_points,
        recommended_services,
        pipeline_category,
    )

    risks = _build_risks(
        seller_profile,
        digital_health_score,
        pain_points,
        recommended_services,
        pipeline_category,
        company,
    )

    return {
        "score": score,
        "confidence": confidence,
        "reasons": reasons,
        "risks": risks,
    }
