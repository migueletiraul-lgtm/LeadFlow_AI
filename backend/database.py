import sqlite3
from pathlib import Path


DATABASE_PATH = Path(__file__).parent / "leadflow.db"


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database() -> None:
    connection = get_connection()

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
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    connection.commit()
    connection.close()