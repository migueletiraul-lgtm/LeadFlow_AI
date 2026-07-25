import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

import backend.database as database
from backend.routers.seller_profile import router as seller_profile_router


@pytest.fixture()
def client(tmp_path, monkeypatch):
    monkeypatch.setattr(
        database,
        "DATABASE_PATH",
        tmp_path / "test_leadflow.db",
    )

    database.initialize_database()

    test_app = FastAPI()
    test_app.include_router(seller_profile_router)

    return TestClient(test_app)


def test_get_seller_profile_returns_default_when_missing(client):
    response = client.get("/seller-profile")

    assert response.status_code == 200

    payload = response.json()
    assert payload == {
        "offered_services": [],
        "target_niches": [],
        "average_ticket_range": None,
        "sales_channels": [],
        "monthly_goal": None,
        "daily_prospecting_time": None,
        "main_sales_challenge": None,
        "communication_style": None,
        "updated_at": None,
    }


def test_put_seller_profile_creates_profile(client):
    response = client.put(
        "/seller-profile",
        json={
            "offered_services": [
                "Landing Page",
                "SEO Local",
            ],
            "target_niches": ["Dentistas"],
            "average_ticket_range": "R$800 - R$2000",
            "sales_channels": ["WhatsApp", "Instagram"],
            "monthly_goal": 10,
            "daily_prospecting_time": "1 hora por dia",
            "main_sales_challenge": "Falta de tempo para prospectar",
            "communication_style": "Direto e consultivo",
        },
    )

    assert response.status_code == 200

    payload = response.json()
    assert payload["offered_services"] == [
        "Landing Page",
        "SEO Local",
    ]
    assert payload["target_niches"] == ["Dentistas"]
    assert payload["monthly_goal"] == 10
    assert payload["updated_at"] is not None


def test_get_seller_profile_after_put_returns_persisted_data(client):
    client.put(
        "/seller-profile",
        json={
            "offered_services": ["Site Institucional"],
            "monthly_goal": 15,
        },
    )

    response = client.get("/seller-profile")

    assert response.status_code == 200

    payload = response.json()
    assert payload["offered_services"] == [
        "Site Institucional",
    ]
    assert payload["monthly_goal"] == 15


def test_put_seller_profile_partial_update_preserves_existing_fields(
    client,
):
    client.put(
        "/seller-profile",
        json={
            "offered_services": ["Landing Page"],
            "monthly_goal": 5,
        },
    )

    response = client.put(
        "/seller-profile",
        json={
            "communication_style": "Descontraído",
        },
    )

    assert response.status_code == 200

    payload = response.json()
    assert payload["offered_services"] == ["Landing Page"]
    assert payload["monthly_goal"] == 5
    assert payload["communication_style"] == "Descontraído"


def test_put_seller_profile_accepts_empty_body(client):
    response = client.put(
        "/seller-profile",
        json={},
    )

    assert response.status_code == 200

    payload = response.json()
    assert payload["offered_services"] == []
    assert payload["monthly_goal"] is None
