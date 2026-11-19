import pytest
from fastapi.testclient import TestClient

import backend.database as database
from backend.database import insert_company
from backend.main import app as main_app


@pytest.fixture()
def client(tmp_path, monkeypatch):
    monkeypatch.setattr(
        database,
        "DATABASE_PATH",
        tmp_path / "test_leadflow.db",
    )

    with TestClient(main_app) as test_client:
        yield test_client


def create_company_with_status(status: str) -> int:
    company_id = insert_company(
        name="Empresa Teste",
        niche="Restaurante",
        city="Franca",
        state="SP",
    )

    connection = database.get_connection()

    try:
        connection.execute(
            "UPDATE companies SET status = ? WHERE id = ?",
            (status, company_id),
        )
        connection.commit()

    finally:
        connection.close()

    return company_id


def test_register_proposal_from_reuniao_updates_status_and_value(client):
    company_id = create_company_with_status("Reunião")

    response = client.patch(
        f"/companies/{company_id}/proposal",
        json={"proposal_value": 2500.0},
    )

    assert response.status_code == 200

    payload = response.json()
    assert payload["status"] == "Proposta"
    assert payload["proposal_value"] == 2500.0


def test_register_proposal_persists_after_refetch(client):
    company_id = create_company_with_status("Reunião")

    client.patch(
        f"/companies/{company_id}/proposal",
        json={"proposal_value": 1899.9},
    )

    response = client.get(f"/companies/{company_id}")

    assert response.status_code == 200

    payload = response.json()
    assert payload["status"] == "Proposta"
    assert payload["proposal_value"] == 1899.9


def test_register_proposal_rejected_outside_reuniao_status(client):
    company_id = create_company_with_status("Novo")

    response = client.patch(
        f"/companies/{company_id}/proposal",
        json={"proposal_value": 1000.0},
    )

    assert response.status_code == 400

    company = client.get(f"/companies/{company_id}").json()
    assert company["status"] == "Novo"
    assert company["proposal_value"] is None


def test_register_proposal_rejects_non_positive_value(client):
    company_id = create_company_with_status("Reunião")

    response = client.patch(
        f"/companies/{company_id}/proposal",
        json={"proposal_value": 0},
    )

    assert response.status_code == 422


def test_register_proposal_missing_company_returns_404(client):
    response = client.patch(
        "/companies/999999/proposal",
        json={"proposal_value": 1000.0},
    )

    assert response.status_code == 404
