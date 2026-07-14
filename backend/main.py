from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from backend.services.apify_service import search_google_maps
from backend.services.apify_service import search_google_maps

from backend.database import get_connection, initialize_database

load_dotenv()

app = FastAPI(
    title="LeadFlow AI",
    version="0.2.0",
)

@app.on_event("startup")
def startup_event():
    initialize_database()

class CompanyCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    niche: str = Field(min_length=2, max_length=80)
    city: str = Field(default="Franca")
    state: str = Field(default="SP", min_length=2, max_length=2)
    instagram: str | None = None
    website: str | None = None
    whatsapp: str | None = None
    followers: int | None = Field(default=None, ge=0)
    google_rating: float | None = Field(default=None, ge=0, le=5)


companies: list[dict] = []

class SearchRequest(BaseModel):
    city: str = Field(min_length=2, max_length=80)
    state: str = Field(default="SP", min_length=2, max_length=2)
    niche: str = Field(min_length=2, max_length=80)
    max_results: int = Field(default=20, ge=1, le=50)

@app.get("/")
def home():
    return {
        "status": "online",
        "project": "LeadFlow AI",
        "version": "0.2.0",
    }

@app.post("/companies", status_code=201)
def create_company(company: CompanyCreate):
    connection = get_connection()

    cursor = connection.execute(
        """
        INSERT INTO companies (
            name,
            niche,
            city,
            state,
            instagram,
            website,
            whatsapp,
            followers,
            google_rating
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            company.name,
            company.niche,
            company.city,
            company.state,
            company.instagram,
            company.website,
            company.whatsapp,
            company.followers,
            company.google_rating,
        ),
    )

    connection.commit()

    company_id = cursor.lastrowid

    saved_company = connection.execute(
        "SELECT * FROM companies WHERE id = ?",
        (company_id,),
    ).fetchone()

    connection.close()

    return dict(saved_company)

@app.get("/companies")
def list_companies():
    connection = get_connection()

    companies = connection.execute(
        "SELECT * FROM companies ORDER BY id"
    ).fetchall()

    connection.close()

    return [dict(company) for company in companies]


@app.get("/companies/{company_id}")
def get_company(company_id: int):
    connection = get_connection()

    company = connection.execute(
        "SELECT * FROM companies WHERE id = ?",
        (company_id,),
    ).fetchone()

    connection.close()

    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Empresa não encontrada",
        )

    return dict(company)

@app.post("/search")
def search_companies(request: SearchRequest):

    results = search_google_maps(
        query=request.niche,
        location=f"{request.city}, {request.state}, Brasil",
        max_results=request.max_results,
    )

    return {
        "total": len(results),
        "results": results,
    }