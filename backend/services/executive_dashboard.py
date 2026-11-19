import re


MAX_PRIORITY_LEADS = 5
HIGH_PRIORITY_THRESHOLD = 70


# ===========================
# HELPERS
# ===========================

def _parse_average_ticket(average_ticket_range: str | None) -> float | None:
    """Extrai um valor médio numérico de uma faixa de ticket informada
    pelo vendedor (ex.: "R$800 - R$2000" -> 1400.0). Nunca inventa um
    valor: retorna None quando não há dado ou ele não é interpretável."""

    if not average_ticket_range:
        return None

    raw_numbers = re.findall(r"[\d.,]+", average_ticket_range)
    parsed_numbers: list[float] = []

    for raw in raw_numbers:
        cleaned = (
            raw.replace(".", "").replace(",", ".")
            if "," in raw
            else raw.replace(".", "")
        )

        try:
            parsed_numbers.append(float(cleaned))
        except ValueError:
            continue

    if not parsed_numbers:
        return None

    return sum(parsed_numbers) / len(parsed_numbers)


def _format_currency(value: float) -> str:
    return (
        f"R$ {value:,.2f}"
        .replace(",", "_")
        .replace(".", ",")
        .replace("_", ".")
    )


# ===========================
# MONTAGEM FINAL
# ===========================

def build_executive_dashboard(
    companies: list[dict],
    seller_profile: dict | None = None,
) -> dict:
    """Função pura: recebe as empresas e o DNA comercial já carregados
    pelo chamador e apenas calcula o resumo executivo, sem acessar
    banco de dados, rede ou qualquer estado externo."""

    from backend.services.opportunity_intelligence_service import (
        build_opportunity_intelligence,
    )

    if not companies:
        return {
            "summary": (
                "Nenhuma empresa disponível para análise no momento."
            ),
            "priority_leads": [],
            "potential_revenue": None,
            "avg_win_probability": 0,
        }

    entries: list[dict] = []

    for company in companies:
        intelligence = build_opportunity_intelligence(
            company,
            seller_profile,
        )

        entries.append(
            {
                "id": company.get("id"),
                "name": company.get("name"),
                "opportunity_index": intelligence.opportunity.index,
                "temperature": intelligence.opportunity.temperature,
                "win_probability_score": (
                    intelligence.win_probability.score
                ),
            }
        )

    entries.sort(
        key=lambda entry: (
            entry["win_probability_score"],
            entry["opportunity_index"],
        ),
        reverse=True,
    )

    priority_leads = entries[:MAX_PRIORITY_LEADS]

    avg_win_probability = round(
        sum(entry["win_probability_score"] for entry in entries)
        / len(entries)
    )

    high_priority_count = sum(
        1
        for entry in entries
        if entry["win_probability_score"] >= HIGH_PRIORITY_THRESHOLD
    )

    average_ticket = _parse_average_ticket(
        (seller_profile or {}).get("average_ticket_range"),
    )

    if average_ticket is not None:
        potential_revenue = round(
            average_ticket * len(priority_leads),
            2,
        )
        revenue_text = (
            f"Potencial estimado de receita nos leads prioritários: "
            f"{_format_currency(potential_revenue)}, com base no "
            "ticket médio informado no seu DNA comercial."
        )
    else:
        potential_revenue = None
        revenue_text = (
            "Ticket médio não informado no DNA comercial; recomenda-se "
            "cadastrar para estimar o potencial de receita."
        )

    summary = (
        f"{len(entries)} empresa(s) analisada(s), {high_priority_count} "
        f"com alta chance de fechamento. Chance média de fechamento: "
        f"{avg_win_probability}%. {revenue_text}"
    )

    return {
        "summary": summary,
        "priority_leads": priority_leads,
        "potential_revenue": potential_revenue,
        "avg_win_probability": avg_win_probability,
    }
