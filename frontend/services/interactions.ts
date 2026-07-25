const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000";

export type LeadInteraction = {
  id: number;
  company_id: number;
  interaction_type: string;
  description: string;
  follow_up_at: string | null;
  created_at: string;
};

export type LeadInteractionsResponse = {
  company_id: number;
  total: number;
  results: LeadInteraction[];
};

export type CreateLeadInteractionPayload = {
  interaction_type: string;
  description: string;
  follow_up_at?: string | null;
};

async function getErrorMessage(
  response: Response,
  fallbackMessage: string,
) {
  try {
    const data = await response.json();

    if (
      data &&
      typeof data === "object" &&
      "detail" in data &&
      typeof data.detail === "string"
    ) {
      return data.detail;
    }
  } catch {
    // Mantém a mensagem padrão.
  }

  return fallbackMessage;
}

export async function getLeadInteractions(
  companyId: number,
): Promise<LeadInteractionsResponse> {
  const response = await fetch(
    `${API_URL}/companies/${companyId}/interactions`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Não foi possível carregar o histórico.",
      ),
    );
  }

  return response.json();
}

export async function createLeadInteraction(
  companyId: number,
  payload: CreateLeadInteractionPayload,
): Promise<LeadInteraction> {
  const response = await fetch(
    `${API_URL}/companies/${companyId}/interactions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Não foi possível salvar a interação.",
      ),
    );
  }

  return response.json();
}

export async function deleteLeadInteraction(
  interactionId: number,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/interactions/${interactionId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Não foi possível excluir a interação.",
      ),
    );
  }
}