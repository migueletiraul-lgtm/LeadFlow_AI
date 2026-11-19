from backend.schemas.opportunity_intelligence import (
    BusinessEvolution,
    DigitalHealth,
    NextAction,
    Objection,
    Opportunity,
    OpportunityIntelligence,
    PainPoint,
    RecommendedService,
    SalesStrategy,
    WinProbability,
)
from backend.services.solution_engine import (
    is_service_offered_by_user,
)


# ===========================
# CONSTANTES
# ===========================

SEVERITY_RANK = {
    "alta": 3,
    "média": 2,
    "baixa": 1,
}

NICHE_SERVICES = {
    "alimentacao": {
        "service": "Cardápio Digital com Pedidos e CTA de WhatsApp",
        "reason": (
            "Para o segmento de alimentação, um cardápio digital com "
            "pedidos integrados e botão de WhatsApp facilita a decisão "
            "de compra do cliente."
        ),
        "expected_result": (
            "Mais pedidos diretos pelo WhatsApp e redução de fricção "
            "no processo de compra."
        ),
    },
    "saude": {
        "service": "Página de Tratamentos com Agendamento e Prova Social",
        "reason": (
            "Para clínicas e consultórios, apresentar tratamentos com "
            "agendamento online e prova social aumenta a confiança do "
            "paciente antes do primeiro contato."
        ),
        "expected_result": (
            "Mais agendamentos qualificados e maior confiança do paciente."
        ),
    },
    "beleza": {
        "service": "Agenda Online com Serviços e Preços",
        "reason": (
            "Para barbearias e salões, disponibilizar agenda online com "
            "serviços e preços facilita a marcação e reduz atrito no "
            "atendimento."
        ),
        "expected_result": (
            "Redução do tempo gasto com agendamento manual e mais "
            "marcações."
        ),
    },
    "fitness": {
        "service": "Página de Planos com Avaliação e Resultados",
        "reason": (
            "Para academias e personal trainers, exibir planos, avaliação "
            "física e resultados reais ajuda a converter interessados em "
            "matrículas."
        ),
        "expected_result": (
            "Mais matrículas e maior clareza sobre planos e resultados."
        ),
    },
}

NICHE_KEYWORDS = {
    "alimentacao": (
        "aliment", "restaurante", "pizzaria", "lanchonete", "comida",
        "padaria", "café", "cafe", "bar", "confeitaria", "hamburgueria",
    ),
    "saude": (
        "dentist", "odont", "clinica", "clínica", "medic", "saude",
        "saúde", "fisioterap", "psicolog",
    ),
    "beleza": (
        "barbearia", "salao", "salão", "cabelei", "estetica", "estética",
        "beleza", "manicure",
    ),
    "fitness": (
        "academia", "personal", "fitness", "crossfit", "pilates",
        "muay", "jiu",
    ),
}

PIPELINE_LOST_STAGE = "perdido"
PIPELINE_CLIENT_STAGE = "cliente"

# Mapa best-effort de dor -> serviço, usado apenas quando o catálogo
# de soluções falha ao carregar (ver solution_engine.py).
LEGACY_SERVICE_PAIN_CODE_MAP = {
    "Landing Page ou Site Institucional": "NO_WEBSITE",
    "SEO Local (Google Meu Negócio)": "NO_WEBSITE",
    "Configuração de Atendimento via WhatsApp": "NO_WHATSAPP",
    "Gestão de Reputação Online": "LOW_RATING",
    "Estratégia de Avaliações no Google": "LOW_SOCIAL_PROOF",
    "Gestão de Instagram": "NO_INSTAGRAM",
    "Produção de Conteúdo para Redes Sociais": "LOW_FOLLOWERS",
}


# ===========================
# HELPERS
# ===========================

def _clamp(value: float, low: int = 0, high: int = 100) -> int:
    return max(low, min(high, round(value)))


def _niche_bucket(niche: str | None) -> str | None:
    normalized = (niche or "").strip().lower()

    if not normalized:
        return None

    for bucket, keywords in NICHE_KEYWORDS.items():
        if any(keyword in normalized for keyword in keywords):
            return bucket

    return None


def _pipeline_category(pipeline_stage: str | None) -> str:
    normalized = (pipeline_stage or "").strip().lower()

    if normalized in {"", "novo lead"}:
        return "novo"

    if normalized == PIPELINE_LOST_STAGE:
        return "perdido"

    if normalized == PIPELINE_CLIENT_STAGE:
        return "cliente"

    return "em_andamento"


# ===========================
# SAÚDE DIGITAL
# ===========================

def _digital_health_score(company: dict) -> int:
    score = 0.0

    if company.get("website"):
        score += 30

    if company.get("instagram"):
        score += 20

    if company.get("whatsapp"):
        score += 20

    google_rating = company.get("google_rating")

    if google_rating is not None:
        if google_rating >= 4.5:
            score += 20
        elif google_rating >= 4.0:
            score += 15
        elif google_rating >= 3.0:
            score += 8
        else:
            score += 3

    google_reviews = company.get("google_reviews") or 0

    if google_reviews >= 20:
        score += 10
    elif google_reviews >= 1:
        score += 4

    return _clamp(score)


def _digital_health_level(score: int) -> str:
    if score >= 80:
        return "excelente"
    if score >= 60:
        return "bom"
    if score >= 40:
        return "médio"
    if score >= 20:
        return "baixo"
    return "crítico"


def _strengths(company: dict) -> list[str]:
    strengths = []

    if company.get("website"):
        strengths.append("possui site")

    if company.get("instagram"):
        strengths.append("possui Instagram")

    if company.get("whatsapp"):
        strengths.append("possui WhatsApp")

    google_rating = company.get("google_rating")

    if google_rating is not None and google_rating >= 4.5:
        strengths.append("nota alta no Google (força comercial)")

    if (company.get("google_reviews") or 0) >= 20:
        strengths.append("boa quantidade de avaliações no Google")

    return strengths


def _digital_health_summary(
    level: str,
    strengths: list[str],
    pain_points: list[PainPoint],
) -> str:
    strengths_text = (
        "Pontos fortes: " + ", ".join(strengths) + "."
        if strengths
        else "Nenhum ponto forte digital identificado no momento."
    )

    pain_text = (
        f"{len(pain_points)} ponto(s) de atenção identificados na análise."
        if pain_points
        else "Nenhum ponto de atenção identificado na análise."
    )

    return (
        f"Presença digital classificada como {level}. "
        f"{strengths_text} {pain_text}"
    )


# ===========================
# DORES (PAIN POINTS)
# ===========================

def _pain_points(company: dict) -> list[PainPoint]:
    points: list[PainPoint] = []

    website = company.get("website")
    instagram = company.get("instagram")
    whatsapp = company.get("whatsapp")
    followers = company.get("followers")
    google_rating = company.get("google_rating")
    google_reviews = company.get("google_reviews") or 0

    if not website:
        points.append(
            PainPoint(
                code="NO_WEBSITE",
                title="Ausência de site institucional",
                description=(
                    "A empresa não possui site cadastrado, o que reduz a "
                    "credibilidade e limita a captação de clientes pela "
                    "internet."
                ),
                severity="alta",
                impact="captação de clientes e credibilidade online",
                evidence="Nenhum site informado no cadastro da empresa.",
            )
        )

    if not whatsapp:
        points.append(
            PainPoint(
                code="NO_WHATSAPP",
                title="Dificuldade de contato comercial",
                description=(
                    "A empresa não possui WhatsApp cadastrado, o que "
                    "dificulta o contato direto e a conversão comercial."
                ),
                severity="alta",
                impact="facilidade de contato e conversão comercial",
                evidence="Nenhum WhatsApp informado no cadastro.",
            )
        )

    if not instagram:
        points.append(
            PainPoint(
                code="NO_INSTAGRAM",
                title="Ausência de Instagram",
                description=(
                    "A empresa não possui perfil de Instagram cadastrado, "
                    "representando uma oportunidade moderada de ampliar "
                    "alcance e prova social visual."
                ),
                severity="média",
                impact="alcance de marca e prova social visual",
                evidence="Nenhum perfil de Instagram informado no cadastro.",
            )
        )

    if google_rating is None:
        points.append(
            PainPoint(
                code="NO_GOOGLE_PRESENCE",
                title="Sem nota registrada no Google",
                description=(
                    "Não há nota do Google cadastrada; recomenda-se "
                    "validar se a empresa possui perfil no Google Meu "
                    "Negócio."
                ),
                severity="média",
                impact="visibilidade e confiança no Google",
                evidence="Campo de nota do Google não informado.",
            )
        )
    elif google_rating < 4.0:
        points.append(
            PainPoint(
                code="LOW_RATING",
                title="Nota do Google abaixo do ideal",
                description=(
                    "A nota atual no Google pode reduzir a confiança de "
                    "novos clientes; recomenda-se validar os motivos e "
                    "reforçar a prova social."
                ),
                severity="alta" if google_rating < 3.5 else "média",
                impact="reputação e confiança do cliente",
                evidence=f"Nota Google atual: {google_rating}.",
            )
        )

    if google_reviews < 20:
        points.append(
            PainPoint(
                code="LOW_SOCIAL_PROOF",
                title="Poucas avaliações no Google",
                description=(
                    "O número reduzido de avaliações limita a prova "
                    "social diante de novos clientes."
                ),
                severity="média",
                impact="confiança de novos clientes",
                evidence=(
                    f"Apenas {google_reviews} avaliações registradas "
                    "no Google."
                ),
            )
        )

    if instagram and followers is not None and followers < 500:
        points.append(
            PainPoint(
                code="LOW_FOLLOWERS",
                title="Baixo alcance no Instagram",
                description=(
                    "O perfil possui poucos seguidores; possível "
                    "oportunidade de fortalecer a presença digital com "
                    "conteúdo consistente."
                ),
                severity="baixa",
                impact="alcance e engajamento digital",
                evidence=f"Apenas {followers} seguidores informados.",
            )
        )

    points.sort(
        key=lambda point: SEVERITY_RANK[point.severity],
        reverse=True,
    )

    return points


# ===========================
# OPORTUNIDADE
# ===========================

def _opportunity(company: dict, digital_health_score: int) -> Opportunity:
    lead_score = _clamp(company.get("lead_score") or 0)
    gap_score = _clamp(100 - digital_health_score)
    index = _clamp(0.6 * lead_score + 0.4 * gap_score)

    if index >= 75:
        temperature = "muito quente"
    elif index >= 50:
        temperature = "quente"
    elif index >= 25:
        temperature = "morno"
    else:
        temperature = "frio"

    evidence_fields = [
        bool(company.get("website")),
        bool(company.get("instagram")),
        bool(company.get("whatsapp")),
        company.get("google_rating") is not None,
        (company.get("google_reviews") or 0) > 0,
        company.get("followers") is not None,
    ]

    known = sum(1 for field in evidence_fields if field)
    confidence = _clamp(known / len(evidence_fields) * 100)

    return Opportunity(
        index=index,
        temperature=temperature,
        confidence=confidence,
    )


# ===========================
# SERVIÇOS RECOMENDADOS
# ===========================

def _legacy_recommended_services(
    company: dict,
    niche_bucket: str | None,
    offered_services: list[str],
) -> list[RecommendedService]:
    website = company.get("website")
    instagram = company.get("instagram")
    whatsapp = company.get("whatsapp")
    followers = company.get("followers")
    google_rating = company.get("google_rating")
    google_reviews = company.get("google_reviews") or 0

    candidates: list[tuple[int, dict]] = []

    if not website:
        candidates.append((
            100,
            {
                "service": "Landing Page ou Site Institucional",
                "reason": (
                    "A empresa não possui site cadastrado, o que limita "
                    "a credibilidade e a captação de clientes pela "
                    "internet."
                ),
                "expected_result": (
                    "Mais credibilidade, canal de vendas profissional e "
                    "melhor posicionamento online."
                ),
            },
        ))

        candidates.append((
            90,
            {
                "service": "SEO Local (Google Meu Negócio)",
                "reason": (
                    "Sem site cadastrado, o SEO local ajuda a empresa a "
                    "aparecer nas buscas da região mesmo antes de o "
                    "site estar pronto."
                ),
                "expected_result": (
                    "Maior visibilidade nas buscas do Google e no "
                    "Google Maps."
                ),
            },
        ))

    if not whatsapp:
        candidates.append((
            85,
            {
                "service": "Configuração de Atendimento via WhatsApp",
                "reason": (
                    "Sem WhatsApp cadastrado, o contato comercial direto "
                    "fica mais difícil para o cliente."
                ),
                "expected_result": (
                    "Facilidade de contato e maior taxa de conversão "
                    "em vendas."
                ),
            },
        ))

    if google_rating is not None and google_rating < 4.0:
        candidates.append((
            65,
            {
                "service": "Gestão de Reputação Online",
                "reason": (
                    "A nota atual no Google pode estar afastando novos "
                    "clientes; recomenda-se validar os motivos e "
                    "reforçar a prova social."
                ),
                "expected_result": (
                    "Melhora gradual da reputação e maior confiança "
                    "do público."
                ),
            },
        ))
    elif google_reviews < 20:
        candidates.append((
            55,
            {
                "service": "Estratégia de Avaliações no Google",
                "reason": (
                    "O número reduzido de avaliações limita a prova "
                    "social; recomenda-se validar e estimular avaliações "
                    "de clientes reais."
                ),
                "expected_result": (
                    "Mais prova social e confiança para novos clientes."
                ),
            },
        ))

    if not instagram:
        candidates.append((
            60,
            {
                "service": "Gestão de Instagram",
                "reason": (
                    "A empresa não possui Instagram, representando uma "
                    "oportunidade moderada de alcance e prova social."
                ),
                "expected_result": (
                    "Mais alcance de marca e engajamento com o público "
                    "local."
                ),
            },
        ))

    if niche_bucket and niche_bucket in NICHE_SERVICES:
        candidates.append((50, dict(NICHE_SERVICES[niche_bucket])))

    if instagram and followers is not None and followers < 500:
        candidates.append((
            30,
            {
                "service": "Produção de Conteúdo para Redes Sociais",
                "reason": (
                    "O perfil possui poucos seguidores; possível "
                    "oportunidade de aumentar alcance com conteúdo "
                    "consistente."
                ),
                "expected_result": (
                    "Maior alcance orgânico e engajamento no Instagram."
                ),
            },
        ))

    if not candidates:
        candidates.append((
            10,
            {
                "service": "Otimização Contínua da Presença Digital",
                "reason": (
                    "A empresa já possui uma presença digital "
                    "consistente; recomenda-se validar oportunidades de "
                    "otimização contínua para manter a vantagem "
                    "competitiva."
                ),
                "expected_result": (
                    "Manutenção da vantagem competitiva e possível "
                    "aumento de conversão."
                ),
            },
        ))

    candidates.sort(key=lambda item: item[0], reverse=True)
    top_candidates = candidates[:5]

    return [
        RecommendedService(
            service=data["service"],
            priority=index + 1,
            reason=data["reason"],
            expected_result=data["expected_result"],
            pain_code=LEGACY_SERVICE_PAIN_CODE_MAP.get(
                data["service"],
                "",
            ),
            offered_by_user=is_service_offered_by_user(
                data["service"],
                offered_services,
            ),
        )
        for index, (_, data) in enumerate(top_candidates)
    ]


def _build_recommended_services(
    company: dict,
    niche_bucket: str | None,
    pain_points: list[PainPoint],
    offered_services: list[str],
) -> list[RecommendedService]:
    # Import local para evitar dependência circular: business_evolution.py
    # importa _niche_bucket deste módulo. recommended_services é montado
    # a partir da mesma fonte de candidatos do roadmap do Business
    # Evolution, para que as duas respostas nunca divirjam.
    from backend.services.business_evolution import (
        build_solution_candidates,
    )

    candidates = build_solution_candidates(
        pain_points,
        niche_bucket,
        offered_services,
    )

    if candidates is not None:
        return [
            RecommendedService(
                service=candidate["service"],
                priority=index + 1,
                reason=candidate["description"],
                expected_result=candidate["expected_result"],
                pain_code=candidate["pain_code"],
                offered_by_user=candidate["offered_by_user"],
            )
            for index, candidate in enumerate(candidates)
        ]

    return _legacy_recommended_services(
        company,
        niche_bucket,
        offered_services,
    )


# ===========================
# ESTRATÉGIA DE VENDAS
# ===========================

def _best_channel(company: dict) -> str:
    if company.get("whatsapp"):
        return "WhatsApp"

    if company.get("instagram"):
        return "Instagram (Direct)"

    if company.get("website"):
        return "Formulário/E-mail do site"

    return "Telefone ou visita presencial (recomenda-se validar o melhor canal)"


def _sales_angle(
    company: dict,
    pain_points: list[PainPoint],
) -> str:
    name = company.get("name") or "a empresa"

    if pain_points:
        top = pain_points[0]

        return (
            f"Abordar {name} destacando {top.impact} como principal "
            "possível oportunidade de melhoria, com foco em resultado "
            "prático e sem pressão."
        )

    return (
        f"Abordar {name} valorizando a presença digital já consolidada "
        "e oferecendo otimizações complementares, uma possível "
        "oportunidade de upsell."
    )


def _opening_message(
    company: dict,
    pipeline_category: str,
    pain_points: list[PainPoint],
) -> str:
    name = company.get("name") or "tudo bem"

    if pipeline_category == "em_andamento":
        return (
            f"Olá! Dando sequência à nossa conversa com a {name} — "
            "consegui olhar com mais calma os pontos que discutimos. "
            "Podemos continuar de onde paramos?"
        )

    if pipeline_category == "cliente":
        return (
            f"Olá! Passando para saber como estão os resultados com a "
            f"{name} e se há algo novo que possamos melhorar juntos."
        )

    if pipeline_category == "perdido":
        return (
            f"Olá! Faz um tempo que não conversamos com a {name}. "
            "Surgiram novidades que podem fazer sentido agora, sem "
            "compromisso. Posso compartilhar?"
        )

    if pain_points:
        top = pain_points[0]

        return (
            f"Olá! Vi o trabalho da {name} e percebi uma possível "
            f"oportunidade relacionada a {top.impact}. Se fizer sentido, "
            "posso te mostrar rapidamente como isso poderia ajudar. "
            "Faz sentido conversarmos?"
        )

    return (
        f"Olá! Vi o trabalho da {name} e a presença digital de vocês já "
        "está bem estruturada. Tenho algumas ideias de otimização que "
        "podem ajudar ainda mais. Posso compartilhar?"
    )


def _probable_objections(
    pain_points: list[PainPoint],
) -> list[Objection]:
    objections = [
        Objection(
            objection="Não tenho orçamento para isso agora.",
            answer=(
                "Entendo. Podemos começar pela ação de maior prioridade "
                "e menor custo, validando o resultado antes de expandir."
            ),
        ),
        Objection(
            objection="Já tentei algo parecido antes e não funcionou.",
            answer=(
                "Faz sentido ter esse receio. Por isso a proposta é "
                "personalizada, com base no que foi identificado "
                "especificamente no seu negócio, e não um pacote "
                "genérico."
            ),
        ),
    ]

    if pain_points:
        top = pain_points[0]

        objections.append(
            Objection(
                objection=(
                    f"Não acho que {top.title.lower()} seja um "
                    "problema para o meu negócio."
                ),
                answer=(
                    f"Entendo a percepção. Com base no que foi "
                    f"analisado, {top.impact} é uma possível "
                    "oportunidade — recomenda-se validar com um "
                    "diagnóstico rápido antes de decidir."
                ),
            )
        )

    return objections[:3]


# ===========================
# PRÓXIMA AÇÃO
# ===========================

def _next_action(
    pipeline_category: str,
    opportunity: Opportunity,
) -> NextAction:
    if pipeline_category == "em_andamento":
        return NextAction(
            priority="alta",
            action=(
                "Dar continuidade à conversa já iniciada, retomando os "
                "pontos discutidos, sem reiniciar com abordagem fria."
            ),
            reason=(
                "O lead já está em conversa; abordagem fria não é "
                "recomendada nesta etapa do pipeline."
            ),
        )

    if pipeline_category == "cliente":
        return NextAction(
            priority="média",
            action=(
                "Agendar contato de relacionamento para identificar "
                "oportunidades de upsell."
            ),
            reason=(
                "Cliente ativo; foco em manutenção do relacionamento e "
                "possível expansão de serviços."
            ),
        )

    if pipeline_category == "perdido":
        return NextAction(
            priority="baixa",
            action=(
                "Reengajar com uma nova proposta de valor, sem "
                "abordagem fria, respeitando o histórico anterior."
            ),
            reason=(
                "Lead marcado como perdido; recomenda-se validar "
                "interesse antes de uma nova tentativa."
            ),
        )

    if opportunity.index >= 50:
        return NextAction(
            priority="alta",
            action=(
                "Realizar primeiro contato comercial explicando a "
                "principal oportunidade identificada."
            ),
            reason=(
                "Lead novo com oportunidade relevante identificada pela "
                "análise de dados."
            ),
        )

    return NextAction(
        priority="média",
        action=(
            "Realizar primeiro contato para qualificar melhor o lead "
            "antes de propor soluções."
        ),
        reason=(
            "Lead novo com oportunidade moderada; recomenda-se validar "
            "necessidades antes de avançar."
        ),
    )


# ===========================
# MONTAGEM FINAL
# ===========================

def build_opportunity_intelligence(
    company: dict,
    seller_profile: dict | None = None,
) -> OpportunityIntelligence:
    digital_health_score = _digital_health_score(company)
    level = _digital_health_level(digital_health_score)
    strengths = _strengths(company)
    pain_points = _pain_points(company)

    digital_health = DigitalHealth(
        score=digital_health_score,
        level=level,
        summary=_digital_health_summary(level, strengths, pain_points),
    )

    opportunity = _opportunity(company, digital_health_score)

    niche_bucket = _niche_bucket(company.get("niche"))
    offered_services = (
        (seller_profile or {}).get("offered_services") or []
    )
    recommended_services = _build_recommended_services(
        company,
        niche_bucket,
        pain_points,
        offered_services,
    )

    pipeline_category = _pipeline_category(company.get("pipeline_stage"))

    sales_strategy = SalesStrategy(
        best_channel=_best_channel(company),
        sales_angle=_sales_angle(company, pain_points),
        opening_message=_opening_message(
            company,
            pipeline_category,
            pain_points,
        ),
        probable_objections=_probable_objections(pain_points),
    )

    next_action = _next_action(pipeline_category, opportunity)

    # Import local para evitar dependência circular: business_evolution.py
    # importa _niche_bucket deste módulo.
    from backend.services.business_evolution import (
        build_business_evolution,
    )

    business_evolution = BusinessEvolution(
        **build_business_evolution(
            company,
            seller_profile,
            pain_points,
        )
    )

    # Import local para evitar dependência circular: win_probability.py
    # importa _pipeline_category deste módulo.
    from backend.services.win_probability import (
        build_win_probability,
    )

    win_probability = WinProbability(
        **build_win_probability(
            company,
            seller_profile,
            {
                "digital_health": digital_health,
                "opportunity": opportunity,
                "pain_points": pain_points,
                "recommended_services": recommended_services,
            },
        )
    )

    return OpportunityIntelligence(
        company_id=company["id"],
        company_name=company["name"],
        website=company.get("website"),
        instagram=company.get("instagram"),
        city=company["city"],
        state=company["state"],
        digital_health=digital_health,
        opportunity=opportunity,
        pain_points=pain_points,
        recommended_services=recommended_services,
        sales_strategy=sales_strategy,
        next_action=next_action,
        business_evolution=business_evolution,
        win_probability=win_probability,
    )
