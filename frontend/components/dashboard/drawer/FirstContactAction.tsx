"use client";

import { useState } from "react";
import { CheckCircle2, MessageSquarePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Lead } from "@/lib/types";
import { updateCompanyStatus } from "@/services/api";
import { createLeadInteraction } from "@/services/interactions";

type FirstContactActionProps = {
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

export default function FirstContactAction({
  lead,
  onLeadUpdated,
}: FirstContactActionProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  const alreadyContacted =
    normalizeStatus(lead.status) !== "novo";

  async function handleRegisterContact() {
    if (isSaving || alreadyContacted) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const updatedLead = await updateCompanyStatus(
        lead.id,
        "Contatado",
      );

      await createLeadInteraction(lead.id, {
        interaction_type: "mensagem",
        description: "Primeiro contato registrado.",
      });

      onLeadUpdated?.(updatedLead);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível registrar o contato.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <MessageSquarePlus className="h-5 w-5 text-blue-600" />

        <div>
          <h3 className="font-semibold text-slate-950">
            Primeiro contato
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Registre quando o primeiro contato comercial
            for realizado com este lead.
          </p>
        </div>
      </div>

      <div className="mt-5">
        {alreadyContacted ? (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Contato já registrado para este lead.
          </div>
        ) : (
          <Button
            type="button"
            onClick={handleRegisterContact}
            disabled={isSaving}
          >
            <MessageSquarePlus className="h-4 w-4" />
            {isSaving
              ? "Registrando..."
              : "Registrar contato"}
          </Button>
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
