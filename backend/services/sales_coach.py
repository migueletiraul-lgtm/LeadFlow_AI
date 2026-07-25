from backend.schemas.opportunity_intelligence import (
    PainPoint,
    RecommendedService,
)
from backend.services.opportunity_intelligence_service import (
    _pipeline_category,
)


MAX_OBJECTIONS = 5

CASUAL_STYLE_KEYWORDS = (
    "descontra", "informal", "casual", "leve", "amigável", "amigavel",
)

FORMAL_STYLE_KEYWORDS = (
    "formal", "direto", "objetivo", "profissional", "sério", "serio",
)


# ===========================
# HELPERS
# ===========================

def _field(source, key: str, default=None):
    if source is None:
        return default

    if isinstance(source, dict):
        return source.get(key, default)

    return getattr(source, key, default)


def _detect_tone(seller_profile: dict | None) -> str:
    style = (
        (seller_profile or {}).get("communication_style") or ""
    )
    normalized = style.strip().lower()

    if any(keyword in normalized for keyword in CASUAL_STYLE_KEYWORDS):
        return "casual"

    if any(keyword in normalized for keyword in FORMAL_STYLE_KEYWORDS):
        return "formal"

    return "neutro"


# ===========================
# BLOCOS DO ROTEIRO
# ===========================

def _build_opening(
    company: dict,
    pain_points: list[PainPoint],
    business_evolution,
    tone: str,
) -> str:
    name = company.get("name") or "a empresa"
    niche = company.get("niche")
    city = company.get("city")

    location = f" em {city}" if city else ""
    segment = f" no segmento de {niche.lower()}" if niche else ""

    if tone == "casual":
        greeting = f"Oi! Tudo bem? Dei uma olhada na {name}{segment}{location}"
    elif tone == "formal":
        greeting = (
            f"Olá, tudo bem? Estive analisando a {name}{segment}{location}"
        )
    else:
        greeting = (
            f"Olá! Tudo bem? Estive olhando com calma a {name}{segment}"
            f"{location}"
        )

    if pain_points:
        top_pain = pain_points[0]
        observation = (
            f" e percebi um ponto que pode fazer diferença: "
            f"{top_pain.impact}."
        )
    else:
        observation = (
            " e a presença digital já parece bem estruturada."
        )

    stage = _field(business_evolution, "stage")
    stage_note = (
        f" Pelo que vi, o momento atual é de \"{stage}\"."
        if stage
        else ""
    )

    return (
        f"{greeting}{observation}{stage_note} Se fizer sentido, posso "
        "compartilhar uma ideia rápida — sem compromisso. Topa conversar?"
    )


def _build_main_argument(
    recommended_services: list[RecommendedService],
    business_evolution,
) -> str:
    if not recommended_services:
        summary = _field(business_evolution, "summary")

        return summary or (
            "A presença digital já está bem estruturada; o foco agora é "
            "otimização contínua e fortalecimento da vantagem competitiva."
        )

    top_service = recommended_services[0]
    service_name = _field(top_service, "service")
    expected_result = _field(top_service, "expected_result")
    offered = _field(top_service, "offered_by_user", False)

    ownership_note = (
        "que já faz parte do seu portfólio de soluções"
        if offered
        else "que pode ser encaminhada como parceria complementar"
    )

    return (
        f"O ponto central da conversa é {service_name}, {ownership_note}. "
        f"Resultado esperado: {expected_result}"
    )


def _build_avoid(
    company: dict,
    pain_points: list[PainPoint],
    pipeline_category: str,
) -> str:
    tips = [
        "não inventar faturamento, prazos ou resultados que não foram "
        "validados com o cliente",
        "não insistir se o lead demonstrar desinteresse",
    ]

    google_rating = company.get("google_rating")

    if google_rating is not None and google_rating >= 4.5:
        tips.append(
            "não tratar a nota do Google como um problema — é um ponto "
            "forte a ser valorizado"
        )

    if pipeline_category == "em_andamento":
        tips.append(
            "não recomeçar como se fosse o primeiro contato; retome de "
            "onde a conversa parou"
        )
    elif pipeline_category == "cliente":
        tips.append(
            "não tratar como um lead novo; o foco é relacionamento e "
            "upsell, não prospecção fria"
        )
    elif pipeline_category == "perdido":
        tips.append(
            "não usar abordagem fria; reconheça o histórico antes de "
            "propor algo novo"
        )

    if not pain_points:
        tips.append(
            "não forçar uma dor que não foi identificada nos dados "
            "analisados"
        )

    return "Evite: " + "; ".join(tips[:5]) + "."


def _build_objections(
    pain_points: list[PainPoint],
    recommended_services: list[RecommendedService],
) -> list[dict]:
    objections = [
        {
            "objection": "Não tenho orçamento para isso agora.",
            "answer": (
                "Sem problema. Podemos começar pela ação de maior "
                "prioridade e menor custo, validando o resultado antes "
                "de expandir."
            ),
        },
        {
            "objection": (
                "Já tentei algo parecido antes e não funcionou."
            ),
            "answer": (
                "Faz sentido ter esse receio. A proposta aqui é "
                "personalizada, baseada no que foi identificado "
                "especificamente no seu negócio, não um pacote "
                "genérico."
            ),
        },
    ]

    for pain in pain_points:
        if len(objections) >= MAX_OBJECTIONS:
            break

        objections.append(
            {
                "objection": (
                    f"Não acho que {pain.title.lower()} seja um "
                    "problema para o meu negócio."
                ),
                "answer": (
                    f"Entendo a percepção. Com base no que foi "
                    f"analisado, {pain.impact} é uma possível "
                    "oportunidade — recomenda-se validar com um "
                    "diagnóstico rápido antes de decidir."
                ),
            }
        )

    for service in recommended_services:
        if len(objections) >= MAX_OBJECTIONS:
            break

        service_name = _field(service, "service")
        expected_result = _field(service, "expected_result") or (
            "gerar resultado prático"
        )

        objections.append(
            {
                "objection": (
                    f"Não sei se {service_name} realmente traria "
                    "resultado."
                ),
                "answer": (
                    f"É uma dúvida legítima. O objetivo com "
                    f"{service_name} é justamente "
                    f"{expected_result[0].lower()}{expected_result[1:]} "
                    "— recomenda-se validar com um piloto antes de um "
                    "compromisso maior."
                ),
            }
        )

    return objections[:MAX_OBJECTIONS]


def _build_closing(tone: str) -> str:
    if tone == "casual":
        return (
            "Combinado? Se fizer sentido pra você, me chama e a gente "
            "já alinha os próximos passos com calma."
        )

    if tone == "formal":
        return (
            "Fico à disposição para esclarecer dúvidas e alinhar os "
            "próximos passos, sem qualquer compromisso neste momento."
        )

    return (
        "Se fizer sentido, posso te mostrar com mais detalhes como "
        "isso funcionaria na prática. Podemos seguir?"
    )


def _build_follow_up(
    seller_profile: dict | None,
    pipeline_category: str,
) -> str:
    if pipeline_category == "em_andamento":
        base = (
            "Retome o contato em até 2 dias úteis, reforçando o ponto "
            "onde a conversa parou."
        )
    elif pipeline_category == "cliente":
        base = (
            "Agende um follow-up de relacionamento em até 30 dias para "
            "revisar resultados."
        )
    elif pipeline_category == "perdido":
        base = (
            "Aguarde um período maior antes de reengajar, com uma nova "
            "proposta de valor e sem abordagem fria."
        )
    else:
        base = (
            "Se não houver resposta em 3 a 5 dias úteis, envie um "
            "follow-up leve reforçando o valor, sem pressionar."
        )

    prospecting_time = (
        (seller_profile or {}).get("daily_prospecting_time")
    )

    if prospecting_time:
        base += (
            f" Aproveite a janela de prospecção já reservada "
            f"({prospecting_time}) para isso."
        )

    return base


# ===========================
# MONTAGEM FINAL
# ===========================

def build_sales_coach(
    company: dict,
    seller_profile: dict | None,
    pain_points: list[PainPoint],
    recommended_services: list[RecommendedService],
    business_evolution,
) -> dict:
    tone = _detect_tone(seller_profile)
    pipeline_category = _pipeline_category(
        company.get("pipeline_stage"),
    )

    return {
        "opening": _build_opening(
            company,
            pain_points,
            business_evolution,
            tone,
        ),
        "main_argument": _build_main_argument(
            recommended_services,
            business_evolution,
        ),
        "avoid": _build_avoid(
            company,
            pain_points,
            pipeline_category,
        ),
        "objections": _build_objections(
            pain_points,
            recommended_services,
        ),
        "closing": _build_closing(tone),
        "follow_up": _build_follow_up(
            seller_profile,
            pipeline_category,
        ),
    }
