import json
import sqlite3
from pathlib import Path


DATABASE_PATH = Path(__file__).parent / "leadflow.db"


# ===========================
# CONEXÃO
# ===========================

def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(
        DATABASE_PATH,
    )

    connection.row_factory = sqlite3.Row

    # Ativa relacionamentos e exclusão em cascata.
    connection.execute(
        "PRAGMA foreign_keys = ON"
    )

    return connection


# ===========================
# LEAD SCORE
# ===========================

def calculate_lead_score(
    website: str | None,
    instagram: str | None,
    whatsapp: str | None,
    followers: int | None,
    google_rating: float | None,
    google_reviews: int,
) -> int:
    score = 0

    if not website:
        score += 25

    if not instagram:
        score += 20

    if not whatsapp:
        score += 15

    if followers is None or followers < 500:
        score += 10

    if google_rating is None:
        score += 10
    elif google_rating < 4.2:
        score += 15
    elif google_rating < 4.5:
        score += 8

    if google_reviews < 20:
        score += 15
    elif google_reviews < 100:
        score += 8

    return min(score, 100)


# ===========================
# INICIALIZAÇÃO DO BANCO
# ===========================

def initialize_database() -> None:
    connection = get_connection()

    try:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS companies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                niche TEXT NOT NULL,
                city TEXT NOT NULL DEFAULT 'Franca',
                state TEXT NOT NULL DEFAULT 'SP',
                instagram TEXT,
                website TEXT,
                whatsapp TEXT,
                followers INTEGER,
                google_rating REAL,
                google_reviews INTEGER DEFAULT 0,
                has_site INTEGER DEFAULT 0,
                lead_score INTEGER DEFAULT 0,
                status TEXT DEFAULT 'Novo',
                pipeline_stage TEXT DEFAULT 'Novo Lead',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
            """
        )

        existing_columns = {
            row["name"]
            for row in connection.execute(
                "PRAGMA table_info(companies)"
            ).fetchall()
        }

        if "pipeline_stage" not in existing_columns:
            connection.execute(
                """
                ALTER TABLE companies
                ADD COLUMN pipeline_stage TEXT
                DEFAULT 'Novo Lead'
                """
            )

        connection.execute(
            """
            UPDATE companies
            SET pipeline_stage = CASE
                WHEN pipeline_stage IS NOT NULL
                     AND TRIM(pipeline_stage) <> ''
                    THEN pipeline_stage
                WHEN LOWER(TRIM(status)) = 'contatado'
                    THEN 'Contato iniciado'
                WHEN LOWER(TRIM(status)) = 'respondeu'
                    THEN 'Resposta recebida'
                WHEN LOWER(TRIM(status)) = 'reunião'
                    THEN 'Reunião'
                WHEN LOWER(TRIM(status)) = 'proposta'
                    THEN 'Proposta enviada'
                WHEN LOWER(TRIM(status)) = 'cliente'
                    THEN 'Cliente'
                WHEN LOWER(TRIM(status)) = 'perdido'
                    THEN 'Perdido'
                ELSE 'Novo Lead'
            END
            WHERE pipeline_stage IS NULL
               OR TRIM(pipeline_stage) = ''
            """
        )

        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS lead_interactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_id INTEGER NOT NULL,
                interaction_type TEXT NOT NULL,
                description TEXT NOT NULL,
                follow_up_at TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (company_id)
                    REFERENCES companies (id)
                    ON DELETE CASCADE
            )
            """
        )

        connection.execute(
            """
            CREATE INDEX IF NOT EXISTS
            idx_lead_interactions_company_id
            ON lead_interactions (company_id)
            """
        )

        connection.execute(
            """
            CREATE INDEX IF NOT EXISTS
            idx_lead_interactions_created_at
            ON lead_interactions (created_at)
            """
        )

        connection.execute(
            """
            CREATE INDEX IF NOT EXISTS
            idx_lead_interactions_follow_up_at
            ON lead_interactions (follow_up_at)
            """
        )

        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS seller_profile (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                offered_services TEXT,
                target_niches TEXT,
                average_ticket_range TEXT,
                sales_channels TEXT,
                monthly_goal INTEGER,
                daily_prospecting_time TEXT,
                main_sales_challenge TEXT,
                communication_style TEXT,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
            """
        )

        connection.commit()

    finally:
        connection.close()


# ===========================
# EMPRESAS
# ===========================

def insert_company(
    name: str,
    niche: str,
    city: str,
    state: str,
    instagram: str | None = None,
    website: str | None = None,
    whatsapp: str | None = None,
    followers: int | None = None,
    google_rating: float | None = None,
    google_reviews: int = 0,
) -> int:
    connection = get_connection()

    lead_score = calculate_lead_score(
        website=website,
        instagram=instagram,
        whatsapp=whatsapp,
        followers=followers,
        google_rating=google_rating,
        google_reviews=google_reviews,
    )

    try:
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
                google_rating,
                google_reviews,
                has_site,
                lead_score
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                name.strip(),
                niche.strip(),
                city.strip(),
                state.strip().upper(),
                instagram,
                website,
                whatsapp,
                followers,
                google_rating,
                google_reviews,
                1 if website else 0,
                lead_score,
            ),
        )

        connection.commit()

        if cursor.lastrowid is None:
            raise RuntimeError(
                "Não foi possível obter o ID da empresa cadastrada."
            )

        return cursor.lastrowid

    finally:
        connection.close()


def find_company_by_name_and_city(
    name: str,
    city: str,
) -> dict | None:
    connection = get_connection()

    try:
        company = connection.execute(
            """
            SELECT *
            FROM companies
            WHERE LOWER(TRIM(name)) = LOWER(TRIM(?))
              AND LOWER(TRIM(city)) = LOWER(TRIM(?))
            LIMIT 1
            """,
            (
                name.strip(),
                city.strip(),
            ),
        ).fetchone()

        if company is None:
            return None

        return dict(company)

    finally:
        connection.close()


def get_company_by_id(
    company_id: int,
) -> dict | None:
    connection = get_connection()

    try:
        company = connection.execute(
            """
            SELECT *
            FROM companies
            WHERE id = ?
            LIMIT 1
            """,
            (company_id,),
        ).fetchone()

        if company is None:
            return None

        return dict(company)

    finally:
        connection.close()


def update_company(
    company_id: int,
    niche: str,
    state: str,
    instagram: str | None = None,
    website: str | None = None,
    whatsapp: str | None = None,
    followers: int | None = None,
    google_rating: float | None = None,
    google_reviews: int = 0,
) -> None:
    connection = get_connection()

    lead_score = calculate_lead_score(
        website=website,
        instagram=instagram,
        whatsapp=whatsapp,
        followers=followers,
        google_rating=google_rating,
        google_reviews=google_reviews,
    )

    try:
        connection.execute(
            """
            UPDATE companies
            SET
                niche = ?,
                state = ?,
                instagram = ?,
                website = ?,
                whatsapp = ?,
                followers = ?,
                google_rating = ?,
                google_reviews = ?,
                has_site = ?,
                lead_score = ?
            WHERE id = ?
            """,
            (
                niche.strip(),
                state.strip().upper(),
                instagram,
                website,
                whatsapp,
                followers,
                google_rating,
                google_reviews,
                1 if website else 0,
                lead_score,
                company_id,
            ),
        )

        connection.commit()

    finally:
        connection.close()


ALLOWED_PIPELINE_STAGES = {
    "Novo Lead",
    "Contato iniciado",
    "Resposta recebida",
    "Reunião",
    "Proposta enviada",
    "Negociação",
    "Cliente",
    "Perdido",
}


def update_company_pipeline_stage(
    company_id: int,
    pipeline_stage: str,
) -> dict | None:
    normalized_stage = pipeline_stage.strip()

    if normalized_stage not in ALLOWED_PIPELINE_STAGES:
        raise ValueError(
            "Estágio do pipeline inválido."
        )

    connection = get_connection()

    try:
        company = connection.execute(
            """
            SELECT id
            FROM companies
            WHERE id = ?
            LIMIT 1
            """,
            (company_id,),
        ).fetchone()

        if company is None:
            return None

        connection.execute(
            """
            UPDATE companies
            SET pipeline_stage = ?
            WHERE id = ?
            """,
            (
                normalized_stage,
                company_id,
            ),
        )

        connection.commit()

        updated_company = connection.execute(
            """
            SELECT *
            FROM companies
            WHERE id = ?
            LIMIT 1
            """,
            (company_id,),
        ).fetchone()

        if updated_company is None:
            return None

        return dict(updated_company)

    finally:
        connection.close()


def get_companies_by_pipeline_stage(
    pipeline_stage: str,
    limit: int = 100,
) -> list[dict]:
    normalized_stage = pipeline_stage.strip()

    if normalized_stage not in ALLOWED_PIPELINE_STAGES:
        raise ValueError(
            "Estágio do pipeline inválido."
        )

    connection = get_connection()

    try:
        rows = connection.execute(
            """
            SELECT *
            FROM companies
            WHERE LOWER(TRIM(pipeline_stage)) =
                  LOWER(TRIM(?))
            ORDER BY
                lead_score DESC,
                id DESC
            LIMIT ?
            """,
            (
                normalized_stage,
                limit,
            ),
        ).fetchall()

        return [
            dict(row)
            for row in rows
        ]

    finally:
        connection.close()


def get_best_leads(
    limit: int = 20,
    city: str | None = None,
    niche: str | None = None,
    min_score: int = 0,
    without_site: bool = False,
    without_instagram: bool = False,
    status: str | None = None,
    pipeline_stage: str | None = None,
) -> list[dict]:
    connection = get_connection()

    filters = ["lead_score >= ?"]
    parameters: list[object] = [min_score]

    if city:
        filters.append(
            "LOWER(TRIM(city)) = LOWER(TRIM(?))"
        )
        parameters.append(
            city.strip(),
        )

    if niche:
        filters.append(
            "LOWER(TRIM(niche)) = LOWER(TRIM(?))"
        )
        parameters.append(
            niche.strip(),
        )

    if without_site:
        filters.append(
            "(website IS NULL OR TRIM(website) = '')"
        )

    if without_instagram:
        filters.append(
            "(instagram IS NULL OR TRIM(instagram) = '')"
        )

    if status:
        filters.append(
            "LOWER(TRIM(status)) = LOWER(TRIM(?))"
        )
        parameters.append(
            status.strip(),
        )

    if pipeline_stage:
        filters.append(
            "LOWER(TRIM(pipeline_stage)) = LOWER(TRIM(?))"
        )
        parameters.append(
            pipeline_stage.strip(),
        )

    where_clause = " AND ".join(
        filters,
    )

    query = f"""
        SELECT *
        FROM companies
        WHERE {where_clause}
        ORDER BY
            lead_score DESC,
            google_rating ASC,
            google_reviews ASC,
            id DESC
        LIMIT ?
    """

    parameters.append(limit)

    try:
        rows = connection.execute(
            query,
            parameters,
        ).fetchall()

        return [
            dict(row)
            for row in rows
        ]

    finally:
        connection.close()


# ===========================
# INTERAÇÕES DOS LEADS
# ===========================

def create_lead_interaction(
    company_id: int,
    interaction_type: str,
    description: str,
    follow_up_at: str | None = None,
) -> int:
    connection = get_connection()

    try:
        company = connection.execute(
            """
            SELECT id
            FROM companies
            WHERE id = ?
            LIMIT 1
            """,
            (company_id,),
        ).fetchone()

        if company is None:
            raise ValueError(
                "Empresa não encontrada."
            )

        cursor = connection.execute(
            """
            INSERT INTO lead_interactions (
                company_id,
                interaction_type,
                description,
                follow_up_at
            )
            VALUES (?, ?, ?, ?)
            """,
            (
                company_id,
                interaction_type.strip(),
                description.strip(),
                (
                    follow_up_at.strip()
                    if follow_up_at
                    else None
                ),
            ),
        )

        connection.commit()

        if cursor.lastrowid is None:
            raise RuntimeError(
                "Não foi possível obter o ID da interação."
            )

        return cursor.lastrowid

    finally:
        connection.close()


def get_lead_interactions(
    company_id: int,
) -> list[dict]:
    connection = get_connection()

    try:
        interactions = connection.execute(
            """
            SELECT
                id,
                company_id,
                interaction_type,
                description,
                follow_up_at,
                created_at
            FROM lead_interactions
            WHERE company_id = ?
            ORDER BY
                datetime(created_at) DESC,
                id DESC
            """,
            (company_id,),
        ).fetchall()

        return [
            dict(interaction)
            for interaction in interactions
        ]

    finally:
        connection.close()


def get_lead_interaction_by_id(
    interaction_id: int,
) -> dict | None:
    connection = get_connection()

    try:
        interaction = connection.execute(
            """
            SELECT
                id,
                company_id,
                interaction_type,
                description,
                follow_up_at,
                created_at
            FROM lead_interactions
            WHERE id = ?
            LIMIT 1
            """,
            (interaction_id,),
        ).fetchone()

        if interaction is None:
            return None

        return dict(interaction)

    finally:
        connection.close()


def delete_lead_interaction(
    interaction_id: int,
) -> bool:
    connection = get_connection()

    try:
        cursor = connection.execute(
            """
            DELETE FROM lead_interactions
            WHERE id = ?
            """,
            (interaction_id,),
        )

        connection.commit()

        return cursor.rowcount > 0

    finally:
        connection.close()


# ===========================
# FOLLOW-UPS
# ===========================

def get_pending_follow_ups() -> list[dict]:
    connection = get_connection()

    try:
        rows = connection.execute(
            """
            SELECT
                lead_interactions.id,
                lead_interactions.company_id,
                lead_interactions.interaction_type,
                lead_interactions.description,
                lead_interactions.follow_up_at,
                lead_interactions.created_at,
                companies.name AS company_name,
                companies.niche,
                companies.city,
                companies.state,
                companies.whatsapp,
                companies.lead_score,
                companies.status
            FROM lead_interactions
            INNER JOIN companies
                ON companies.id =
                   lead_interactions.company_id
            WHERE lead_interactions.follow_up_at IS NOT NULL
              AND datetime(
                    lead_interactions.follow_up_at
                  ) >= datetime('now')
            ORDER BY
                datetime(
                    lead_interactions.follow_up_at
                ) ASC
            """
        ).fetchall()

        return [
            dict(row)
            for row in rows
        ]

    finally:
        connection.close()


# ===========================
# DNA COMERCIAL (SELLER PROFILE)
# ===========================

SELLER_PROFILE_LIST_FIELDS = (
    "offered_services",
    "target_niches",
    "sales_channels",
)


def _deserialize_seller_profile(
    row: dict,
) -> dict:
    for field in SELLER_PROFILE_LIST_FIELDS:
        raw_value = row.get(field)
        row[field] = (
            json.loads(raw_value)
            if raw_value
            else []
        )

    return row


def get_seller_profile() -> dict | None:
    connection = get_connection()

    try:
        row = connection.execute(
            """
            SELECT *
            FROM seller_profile
            WHERE id = 1
            LIMIT 1
            """
        ).fetchone()

        if row is None:
            return None

        return _deserialize_seller_profile(
            dict(row),
        )

    finally:
        connection.close()


def upsert_seller_profile(
    offered_services: list[str] | None = None,
    target_niches: list[str] | None = None,
    average_ticket_range: str | None = None,
    sales_channels: list[str] | None = None,
    monthly_goal: int | None = None,
    daily_prospecting_time: str | None = None,
    main_sales_challenge: str | None = None,
    communication_style: str | None = None,
) -> dict:
    connection = get_connection()

    try:
        connection.execute(
            """
            INSERT INTO seller_profile (
                id,
                offered_services,
                target_niches,
                average_ticket_range,
                sales_channels,
                monthly_goal,
                daily_prospecting_time,
                main_sales_challenge,
                communication_style,
                updated_at
            )
            VALUES (
                1, ?, ?, ?, ?, ?, ?, ?, ?,
                CURRENT_TIMESTAMP
            )
            ON CONFLICT (id) DO UPDATE SET
                offered_services =
                    excluded.offered_services,
                target_niches =
                    excluded.target_niches,
                average_ticket_range =
                    excluded.average_ticket_range,
                sales_channels =
                    excluded.sales_channels,
                monthly_goal =
                    excluded.monthly_goal,
                daily_prospecting_time =
                    excluded.daily_prospecting_time,
                main_sales_challenge =
                    excluded.main_sales_challenge,
                communication_style =
                    excluded.communication_style,
                updated_at = CURRENT_TIMESTAMP
            """,
            (
                json.dumps(
                    offered_services or [],
                ),
                json.dumps(
                    target_niches or [],
                ),
                average_ticket_range,
                json.dumps(
                    sales_channels or [],
                ),
                monthly_goal,
                daily_prospecting_time,
                main_sales_challenge,
                communication_style,
            ),
        )

        connection.commit()

        row = connection.execute(
            """
            SELECT *
            FROM seller_profile
            WHERE id = 1
            LIMIT 1
            """
        ).fetchone()

        if row is None:
            raise RuntimeError(
                "Não foi possível salvar o perfil comercial."
            )

        return _deserialize_seller_profile(
            dict(row),
        )

    finally:
        connection.close()