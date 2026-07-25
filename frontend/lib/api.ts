import type {
  BestLeadsResponse,
  Lead,
  PipelineStage,
} from "@/lib/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000";

async function handleResponse<T>(
  response: Response,
): Promise<T> {
  if (!response.ok) {
    let message =
      "Ocorreu um erro na comunicação com a API.";

    try {
      const data = await response.json();

      if (
        data &&
        typeof data === "object" &&
        "detail" in data
      ) {
        message = String(data.detail);
      }
    } catch {
      // Mantém a mensagem padrão.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getCompanies(): Promise<
  Lead[]
> {
  const response = await fetch(
    `${API_URL}/companies`,
    {
      cache: "no-store",
    },
  );

  return handleResponse<Lead[]>(response);
}

export async function getBestLeads(
  params?: {
    limit?: number;
    city?: string;
    niche?: string;
    min_score?: number;
    without_site?: boolean;
    without_instagram?: boolean;
    status?: string;
    pipeline_stage?: PipelineStage;
  },
): Promise<BestLeadsResponse> {
  const searchParams =
    new URLSearchParams();

  if (!params) {
    params = {};
  }

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        searchParams.append(
          key,
          String(value),
        );
      }
    },
  );

  const response = await fetch(
    `${API_URL}/best-leads?${
      searchParams.toString()
    }`,
    {
      cache: "no-store",
    },
  );

  return handleResponse<BestLeadsResponse>(
    response,
  );
}

export async function updatePipelineStage(
  companyId: number,
  pipelineStage: PipelineStage,
): Promise<Lead> {
  const response = await fetch(
    `${API_URL}/companies/${companyId}/pipeline-stage`,
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        pipeline_stage: pipelineStage,
      }),
    },
  );

  return handleResponse<Lead>(response);
}

export async function exportExcel() {
  window.open(
    `${API_URL}/export/excel`,
    "_blank",
  );
}