"use client";

import { useState } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Lead } from "@/lib/types";
import { updateCompanyStatus } from "@/services/api";
import { createLeadInteraction } from "@/services/interactions";

type LeadResponseActionProps = {
  lead: Lead;
  onLeadUpdated?: (lead: Lead) => void;
};

function normalizeStatus(
  status: string | null | undefined,
) {
  return (
    status?.trim().toLocaleLowerCase("pt-BR") ??
    "novo"
  );
}

export default function LeadResponseAction({
  lead,
  onLeadUpdated,
}: LeadResponseActionProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  const currentStatus = normalizeStatus(lead.status);
  const isContacted = currentStatus === "contatado";
  const alreadyResponded =
    currentStatus !== "novo" &&
    currentStatus !== "contatado";

  async function handleRegisterResponse() {
    if (isSaving || !isContacted) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const updatedLead = await updateCompanyStatus(
        lead.id,
        "Respondeu",
      );

      await createLeadInteraction(lead.id, {
        interaction_type: "resposta",
        description: "Resposta do lead registrada.",
      });

      onLeadUpdated?.(updatedLead);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível registrar a resposta.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-cyan-600" />

        <div>
          <h3 className="font-semibold text-slate-950">
            Resposta do lead
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Registre quando este lead responder ao
            primeiro contato.
          </p>
        </div>
      </div>

      <div className="mt-5">
        {alreadyResponded ? (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Resposta já registrada para este lead.
          </div>
        ) : isContacted ? (
          <Button
            type="button"
            onClick={handleRegisterResponse}
            disabled={isSaving}
          >
            <MessageCircle className="h-4 w-4" />
            {isSaving
              ? "Registrando..."
              : "Registrar resposta"}
          </Button>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Aguardando registro do primeiro contato.
          </div>
        )}

        {errorMessage && (
          <p className="mt-3 text-xs font-medium text-red-600">
            {errorMessage}
          </p>
        )}
      </div>
    </section>
  );
}
