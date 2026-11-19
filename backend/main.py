import os

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

from backend.database import (
    convert_company_to_client,
    find_company_by_name_and_city,
    get_best_leads,
    get_companies_by_pipeline_stage,
    get_connection,
    initialize_database,
    insert_company,
    register_company_proposal,
    update_company,
    update_company_pipeline_stage,
)
from backend.excel_service import export_best_leads_to_excel
from backend.services.apify_service import search_google_maps
from backend.routers.audit import (
    router as audit_router,
)
from backend.routers.interactions import (
    router as interactions_router,
)
from backend.routers.intelligence import (
    router as intelligence_router,
)
from backend.routers.seller_profile import (
    router as seller_profile_router,
)
from backend.routers.executive_dashboard import (
    router as executive_dashboard_router,
)


load_dotenv()


app = FastAPI(
    title="LeadFlow AI",
    version="0.6.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(audit_router)
app.include_router(interactions_router)
app.include_router(intelligence_router)
app.include_router(seller_profile_router)
app.include_router(executive_dashboard_router)


@app.on_event("startup")
def startup_event() -> None:
    initialize_database()


# ===========================
# MODELOS
# ===========================

class CompanyCreate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=120,
    )

    niche: str = Field(
        min_length=2,
        max_length=80,
    )

    city: str = Field(
        default="Franca",
        min_length=2,
        max_length=80,
    )

    state: str = Field(
        default="SP",
        min_length=2,
        max_length=2,
    )

    instagram: str | None = None
    website: str | None = None
    whatsapp: str | None = None

    followers: int | None = Field(
        default=None,
        ge=0,
    )

    google_rating: float | None = Field(
        default=None,
        ge=0,
        le=5,
    )


class SearchRequest(BaseModel):
    city: str = Field(
        min_length=2,
        max_length=80,
    )

    state: str = Field(
        default="SP",
        min_length=2,
        max_length=2,
    )

    niche: str = Field(
        min_length=2,
        max_length=80,
    )

    max_results: int = Field(
        default=20,
        ge=10,
        le=50,
    )


class CompanyStatusUpdate(BaseModel):
    status: str = Field(
        min_length=2,
        max_length=40,
    )


class PipelineStageUpdate(BaseModel):
    pipeline_stage: str = Field(
        min_length=2,
        max_length=40,
    )


class ProposalCreate(BaseModel):
    proposal_value: float = Field(
        gt=0,
    )


class ClientConversionCreate(BaseModel):
    closed_value: float = Field(
        gt=0,
    )


class GenerateApproachRequest(BaseModel):
    company_name: str = Field(
        min_length=2,
        max_length=120,
    )
    niche: str | None = Field(
        default=None,
        max_length=80,
    )
    city: str | None = Field(
        default=None,
        max_length=80,
    )
    state: str | None = Field(
        default=None,
        max_length=2,
    )
    website: str | None = None
    instagram: str | None = None
    google_rating: float | None = Field(
        default=None,
        ge=0,
        le=5,
    )
    lead_score: int | None = Field(
        default=None,
        ge=0,
        le=100,
    )


# ===========================
# HOME
# ===========================

@app.get("/")
def home():
    return {
        "status": "online",
        "project": "LeadFlow AI",
        "version": "0.6.0",
    }


# ===========================
# CREATE COMPANY
# ===========================

@app.post("/companies", status_code=201)
def create_company(company: CompanyCreate):
    existing = find_company_by_name_and_city(
        name=company.name,
        city=company.city,
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Esta empresa já está cadastrada nesta cidade.",
        )

    company_id = insert_company(
        name=company.name.strip(),
        niche=company.niche.strip(),
        city=company.city.strip(),
        state=company.state.strip().upper(),
        instagram=company.instagram,
        website=company.website,
        whatsapp=company.whatsapp,
        followers=company.followers,
        google_rating=company.google_rating,
    )

    connection = get_connection()

    try:
        saved_company = connection.execute(
            """
            SELECT *
            FROM companies
            WHERE id = ?
            """,
            (company_id,),
        ).fetchone()

    finally:
        connection.close()

    if saved_company is None:
        raise HTTPException(
            status_code=500,
            detail="Erro ao recuperar empresa criada.",
        )

    return dict(saved_company)


# ===========================
# LIST COMPANIES
# ===========================

@app.get("/companies")
def list_companies():
    connection = get_connection()

    try:
        companies = connection.execute(
            """
            SELECT *
            FROM companies
            ORDER BY id DESC
            """
        ).fetchall()

        return [
            dict(company)
            for company in companies
        ]

    finally:
        connection.close()


# ===========================
# MELHORES LEADS
# ===========================

@app.get("/best-leads")
def best_leads(
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
    city: str | None = Query(
        default=None,
        min_length=2,
        max_length=80,
    ),
    niche: str | None = Query(
        default=None,
        min_length=2,
        max_length=80,
    ),
    min_score: int = Query(
        default=0,
        ge=0,
        le=100,
    ),
    without_site: bool = Query(
        default=False,
    ),
    without_instagram: bool = Query(
        default=False,
    ),
    status: str | None = Query(
        default=None,
        min_length=2,
        max_length=40,
    ),
    pipeline_stage: str | None = Query(
        default=None,
        min_length=2,
        max_length=40,
    ),
):
    leads = get_best_leads(
        limit=limit,
        city=city,
        niche=niche,
        min_score=min_score,
        without_site=without_site,
        without_instagram=without_instagram,
        status=status,
        pipeline_stage=pipeline_stage,
    )

    return {
        "total": len(leads),
        "filters": {
            "limit": limit,
            "city": city,
            "niche": niche,
            "min_score": min_score,
            "without_site": without_site,
            "without_instagram": without_instagram,
            "status": status,
            "pipeline_stage": pipeline_stage,
        },
        "results": leads,
    }


# ===========================
# PIPELINE POR ESTÁGIO
# ===========================

@app.get("/pipeline/{pipeline_stage}")
def list_pipeline_stage(
    pipeline_stage: str,
    limit: int = Query(
        default=100,
        ge=1,
        le=1000,
    ),
):
    try:
        companies = get_companies_by_pipeline_stage(
            pipeline_stage=pipeline_stage,
            limit=limit,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    return {
        "pipeline_stage": pipeline_stage,
        "total": len(companies),
        "results": companies,
    }


# ===========================
# EXPORTAR LEADS PARA EXCEL
# ===========================

@app.get("/export/excel")
def export_excel(
    limit: int = Query(
        default=100,
        ge=1,
        le=1000,
    ),
):
    try:
        file_path = export_best_leads_to_excel(
            limit=limit,
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao gerar planilha: {error}",
        ) from error

    return FileResponse(
        path=file_path,
        filename="best_leads.xlsx",
        media_type=(
            "application/vnd.openxmlformats-officedocument."
            "spreadsheetml.sheet"
        ),
    )


# ===========================
# GET COMPANY
# ===========================

@app.get("/companies/{company_id}")
def get_company(
    company_id: int,
):
    connection = get_connection()

    try:
        company = connection.execute(
            """
            SELECT *
            FROM companies
            WHERE id = ?
            """,
            (company_id,),
        ).fetchone()

    finally:
        connection.close()

    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Empresa não encontrada.",
        )

    return dict(company)


# ===========================
# UPDATE COMPANY STATUS
# ===========================

@app.patch("/companies/{company_id}/status")
def update_company_status(
    company_id: int,
    payload: CompanyStatusUpdate,
):
    allowed_statuses = {
        "Novo",
        "Contatado",
        "Respondeu",
        "Reunião",
        "Proposta",
        "Cliente",
        "Perdido",
    }

    status = payload.status.strip()

    if status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Status inválido.",
        )

    connection = get_connection()

    try:
        company = connection.execute(
            """
            SELECT *
            FROM companies
            WHERE id = ?
            """,
            (company_id,),
        ).fetchone()

        if company is None:
            raise HTTPException(
                status_code=404,
                detail="Empresa não encontrada.",
            )

        connection.execute(
            """
            UPDATE companies
            SET status = ?
            WHERE id = ?
            """,
            (
                status,
                company_id,
            ),
        )

        connection.commit()

        updated_company = connection.execute(
            """
            SELECT *
            FROM companies
            WHERE id = ?
            """,
            (company_id,),
        ).fetchone()

    finally:
        connection.close()

    if updated_company is None:
        raise HTTPException(
            status_code=500,
            detail="Erro ao recuperar empresa atualizada.",
        )

    return dict(updated_company)


# ===========================
# UPDATE PIPELINE STAGE
# ===========================

@app.patch("/companies/{company_id}/pipeline-stage")
def update_pipeline_stage(
    company_id: int,
    payload: PipelineStageUpdate,
):
    try:
        company = update_company_pipeline_stage(
            company_id=company_id,
            pipeline_stage=payload.pipeline_stage,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Empresa não encontrada.",
        )

    return company


# ===========================
# REGISTRAR PROPOSTA COMERCIAL
# ===========================

@app.patch("/companies/{company_id}/proposal")
def create_company_proposal(
    company_id: int,
    payload: ProposalCreate,
):
    try:
        company = register_company_proposal(
            company_id=company_id,
            proposal_value=payload.proposal_value,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Empresa não encontrada.",
        )

    return company


# ===========================
# CONVERTER EM CLIENTE
# ===========================

@app.patch("/companies/{company_id}/client-conversion")
def create_client_conversion(
    company_id: int,
    payload: ClientConversionCreate,
):
    try:
        company = convert_company_to_client(
            company_id=company_id,
            closed_value=payload.closed_value,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Empresa não encontrada.",
        )

    return company


# ===========================
# GERAR ABORDAGEM COM IA
# ===========================

@app.post("/ai/generate-approach")
def generate_ai_approach(
    request: GenerateApproachRequest,
):
    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail=(
                "OPENAI_API_KEY não configurada. "
                "Adicione a chave no arquivo .env do projeto."
            ),
        )

    model = os.getenv(
        "OPENAI_MODEL",
        "gpt-5",
    )

    company_name = request.company_name.strip()
    niche = (
        request.niche.strip()
        if request.niche
        else "segmento não informado"
    )
    city = (
        request.city.strip()
        if request.city
        else "cidade não informada"
    )
    state = (
        request.state.strip().upper()
        if request.state
        else ""
    )

    location = (
        f"{city}/{state}"
        if state
        else city
    )

    website_status = (
        "possui site"
        if request.website
        else "não possui site informado"
    )

    instagram_status = (
        "possui Instagram"
        if request.instagram
        else "não possui Instagram informado"
    )

    rating_text = (
        str(request.google_rating)
        if request.google_rating is not None
        else "não informada"
    )

    score_text = (
        str(request.lead_score)
        if request.lead_score is not None
        else "não informado"
    )

    prompt = f"""
Você é um especialista brasileiro em prospecção comercial B2B.

Crie uma mensagem curta, natural e personalizada para primeiro contato
com uma empresa via WhatsApp.

Objetivo:
Oferecer criação ou melhoria de site/landing page de forma consultiva,
sem parecer spam e sem inventar informações.

Dados do lead:
- Empresa: {company_name}
- Nicho: {niche}
- Localização: {location}
- Presença digital: {website_status}; {instagram_status}
- Nota Google: {rating_text}
- Lead Score interno: {score_text}

Regras:
- Escreva em português do Brasil.
- Use tom humano, profissional e amigável.
- Não diga que a mensagem foi gerada por IA.
- Não invente nome do responsável.
- Não invente problemas que não estejam nos dados.
- Não use linguagem excessivamente agressiva ou apelativa.
- Faça no máximo 4 parágrafos curtos.
- Termine com uma pergunta simples que facilite a resposta.
- Entregue somente a mensagem final, sem título, explicações ou aspas.
""".strip()

    try:
        client = OpenAI(
            api_key=api_key,
        )

        response = client.responses.create(
            model=model,
            input=prompt,
        )

        message = response.output_text.strip()

        if not message:
            raise RuntimeError(
                "A IA retornou uma resposta vazia."
            )

        return {
            "message": message,
            "model": model,
        }

    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=(
                "Erro ao gerar abordagem com IA: "
                f"{error}"
            ),
        ) from error


# ===========================
# SEARCH GOOGLE MAPS
# ===========================

@app.post("/search")
def search_companies(
    request: SearchRequest,
):
    try:
        results = search_google_maps(
            query=request.niche.strip(),
            location=(
                f"{request.city.strip()}, "
                f"{request.state.strip().upper()}, Brasil"
            ),
            max_results=request.max_results,
        )

    except RuntimeError as error:
        raise HTTPException(
            status_code=502,
            detail=str(error),
        ) from error

    saved = 0
    updated = 0
    skipped = 0

    for company in results:
        name = company.get("title")

        if not name:
            skipped += 1
            continue

        existing = find_company_by_name_and_city(
            name=name,
            city=request.city,
        )

        if existing:
            update_company(
                company_id=existing["id"],
                niche=request.niche.strip(),
                state=request.state.strip().upper(),
                instagram=None,
                website=company.get("website"),
                whatsapp=company.get("phone"),
                followers=None,
                google_rating=company.get("totalScore"),
                google_reviews=company.get("reviewsCount") or 0,
            )

            updated += 1
            continue

        insert_company(
            name=name.strip(),
            niche=request.niche.strip(),
            city=request.city.strip(),
            state=request.state.strip().upper(),
            instagram=None,
            website=company.get("website"),
            whatsapp=company.get("phone"),
            followers=None,
            google_rating=company.get("totalScore"),
            google_reviews=company.get("reviewsCount") or 0,
        )

        saved += 1

    skipped = (
        len(results)
        - saved
        - updated
    )

    return {
        "total_found": len(results),
        "total_saved": saved,
        "total_updated": updated,
        "total_skipped": skipped,
        "message": (
            f"{saved} empresas novas, "
            f"{updated} atualizadas e "
            f"{skipped} ignoradas."
        ),
    }