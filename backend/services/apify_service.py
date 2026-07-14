import os
import time
from typing import Any

import requests
from dotenv import load_dotenv


load_dotenv()

APIFY_API_TOKEN = os.getenv("APIFY_API_TOKEN")
APIFY_ACTOR_ID = "vortex_data~google-maps"


def search_google_maps(
    query: str,
    location: str,
    max_results: int = 20,
) -> list[dict[str, Any]]:
    if not APIFY_API_TOKEN:
        raise RuntimeError(
            "APIFY_API_TOKEN não foi configurado."
        )

    run_url = (
        f"https://api.apify.com/v2/acts/"
        f"{APIFY_ACTOR_ID}/runs"
    )

    headers = {
        "Authorization": f"Bearer {APIFY_API_TOKEN}",
    }

    payload = {
        "searchStringsArray": [query],
        "locationQueries": [location],
        "maxCrawledPlacesPerSearch": max_results,
        "language": "pt",
    }

    response = requests.post(
        run_url,
        json=payload,
        headers=headers,
        timeout=30,
    )

    if not response.ok:
        raise RuntimeError(
            f"Erro do Apify {response.status_code}: "
            f"{response.text}"
        )

    run_data = response.json()["data"]
    run_id = run_data["id"]

    status_url = (
        f"https://api.apify.com/v2/actor-runs/{run_id}"
    )

    while True:
        status_response = requests.get(
            status_url,
            headers=headers,
            timeout=30,
        )

        if not status_response.ok:
            raise RuntimeError(
                f"Erro ao consultar execução "
                f"{status_response.status_code}: "
                f"{status_response.text}"
            )

        status_data = status_response.json()["data"]
        status = status_data["status"]

        if status == "SUCCEEDED":
            dataset_id = status_data["defaultDatasetId"]
            break

        if status in {"FAILED", "ABORTED", "TIMED-OUT"}:
            raise RuntimeError(
                f"A execução do Apify terminou com status: "
                f"{status}"
            )

        time.sleep(3)

    dataset_url = (
        f"https://api.apify.com/v2/datasets/"
        f"{dataset_id}/items?clean=true"
    )

    dataset_response = requests.get(
        dataset_url,
        headers=headers,
        timeout=60,
    )

    if not dataset_response.ok:
        raise RuntimeError(
            f"Erro ao baixar resultados "
            f"{dataset_response.status_code}: "
            f"{dataset_response.text}"
        )

    return dataset_response.json()