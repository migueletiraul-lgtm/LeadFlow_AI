import type {
  BestLeadsResponse,
  ExecutiveDashboardResponse,
  Lead,
  OpportunityIntelligenceResponse,
  PipelineStage,
} from "@/lib/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000";

async function handleResponse<T>(
  response: Response,
): Promise<T> {
  if (!response.ok) {
    let message = "Ocorreu um erro na comunicação com a API.";

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

  return response.json() as Promise<T>;
}

export async function getCompanies(): Promise<Lead[]> {
  const response = await fetch(`${API_URL}/companies`, {
    cache: "no-store",
  });

  return handleResponse<Lead[]>(response);
}

export async function getCompanyIntelligence(
  companyId: number,
): Promise<OpportunityIntelligenceResponse> {
  const response = await fetch(
    `${API_URL}/companies/${companyId}/intelligence`,
    {
      cache: "no-store",
    },
  );

  return handleResponse<OpportunityIntelligenceResponse>(response);
}

export async function getExecutiveDashboard(): Promise<ExecutiveDashboardResponse> {
  const response = await fetch(
    `${API_URL}/executive-dashboard`,
    {
      cache: "no-store",
    },
  );

  return handleResponse<ExecutiveDashboardResponse>(response);
}

export async function getBestLeads(
  params: {
    limit?: number;
    city?: string;
    niche?: string;
    min_score?: number;
    without_site?: boolean;
    without_instagram?: boolean;
    status?: string;
    pipeline_stage?: PipelineStage;
  } = {},
): Promise<BestLeadsResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();

  const url = queryString
    ? `${API_URL}/best-leads?${queryString}`
    : `${API_URL}/best-leads`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  return handleResponse<BestLeadsResponse>(response);
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pipeline_stage: pipelineStage,
      }),
    },
  );

  return handleResponse<Lead>(response);
}

export function exportExcel(): void {
  window.open(
    `${API_URL}/export/excel`,
    "_blank",
    "noopener,noreferrer",
  );
}