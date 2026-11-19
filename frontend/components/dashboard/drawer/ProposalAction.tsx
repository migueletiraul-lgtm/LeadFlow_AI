"use client";

import { useState } from "react";
import {
  CheckCircle2,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Lead } from "@/lib/types";
import { registerCompanyProposal } from "@/services/api";
import { createLeadInteraction } from "@/services/interactions";

type ProposalActionProps = {
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

function formatCurrencyFromCents(digits: string) {
  const cents = digits ? Number(digits) : 0;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export default function ProposalAction({
  lead,
  onLeadUpdated,
}: ProposalActionProps) {
  const [valueDigits, setValueDigits] = useState("");
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  const currentStatus = normalizeStatus(lead.status);
  const canRegisterProposal =
    currentStatus === "reunião";
  const alreadyProposed = [
    "proposta",
    "cliente",
  ].includes(currentStatus);

  const proposalValue = valueDigits
    ? Number(valueDigits) / 100
    : 0;

  function handleValueChange(
    rawValue: string,
  ) {
    const digits = rawValue
      .replace(/\D/g, "")
      .slice(0, 12);

    setValueDigits(digits);
    setErrorMessage("");
  }

  async function handleRegisterProposal() {
    if (
      isSaving ||
      !canRegisterProposal ||
      proposalValue <= 0
    ) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const updatedLead = await registerCompanyProposal(
        lead.id,
        proposalValue,
      );

      const formattedValue = new Intl.NumberFormat(
        "pt-BR",
        {
          style: "currency",
          currency: "BRL",
        },
      ).format(proposalValue);

      const normalizedNote = note.trim();

      await createLeadInteraction(lead.id, {
        interaction_type: "proposta",
        description: normalizedNote
          ? `Proposta comercial registrada: ${formattedValue}. ${normalizedNote}`
          : `Proposta comercial registrada: ${formattedValue}.`,
      });

      onLeadUpdated?.(updatedLead);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível registrar a proposta.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-amber-600" />

        <div>
          <h3 className="font-semibold text-slate-950">
            Proposta comercial
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Registre a proposta comercial
            apresentada para este lead.
          </p>
        </div>
      </div>

      <div className="mt-5">
        {alreadyProposed ? (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            {lead.proposal_value
              ? `Proposta já registrada: ${new Intl.NumberFormat(
                  "pt-BR",
                  {
                    style: "currency",
                    currency: "BRL",
                  },
                ).format(lead.proposal_value)}`
              : "Proposta já registrada para este lead."}
          </div>
        ) : canRegisterProposal ? (
          <div className="space-y-4">
            <div>
              <label
                htmlFor={`proposal-value-${lead.id}`}
                className="text-sm font-medium text-slate-700"
              >
                Valor da proposta
              </label>

              <input
                id={`proposal-value-${lead.id}`}
                type="text"
                inputMode="numeric"
                placeholder="R$ 0,00"
                value={
                  valueDigits
                    ? formatCurrencyFromCents(
                        valueDigits,
                      )
                    : ""
                }
                disabled={isSaving}
                onChange={(event) =>
                  handleValueChange(
                    event.target.value,
                  )
                }
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

            <div>
              <label
                htmlFor={`proposal-note-${lead.id}`}
                className="text-sm font-medium text-slate-700"
              >
                Observação
              </label>

              <p className="mt-1 text-xs text-slate-400">
                Opcional
              </p>

              <textarea
                id={`proposal-note-${lead.id}`}
                value={note}
                disabled={isSaving}
                rows={3}
                maxLength={2000}
                placeholder="Ex.: Proposta enviada por e-mail, aguardando retorno."
                onChange={(event) => {
                  setNote(event.target.value);
                  setErrorMessage("");
                }}
                className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

            <Button
              type="button"
              onClick={handleRegisterProposal}
              disabled={
                isSaving || proposalValue <= 0
              }
            >
              <FileText className="h-4 w-4" />
              {isSaving
                ? "Registrando..."
                : "Registrar proposta"}
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Aguardando reunião para registrar a
            proposta.
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
