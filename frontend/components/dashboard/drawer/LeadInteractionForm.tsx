"use client";

import {
  type FormEvent,
  useState,
} from "react";
import {
  CalendarClock,
  Loader2,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  createLeadInteraction,
  type LeadInteraction,
} from "@/services/interactions";

type LeadInteractionFormProps = {
  companyId: number;
  onInteractionCreated?: (
    interaction: LeadInteraction,
  ) => void;
};

export default function LeadInteractionForm({
  companyId,
  onInteractionCreated,
}: LeadInteractionFormProps) {
  const [interactionType, setInteractionType] =
    useState("mensagem");

  const [description, setDescription] =
    useState("");

  const [followUpAt, setFollowUpAt] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const normalizedDescription =
      description.trim();

    setSuccessMessage("");
    setErrorMessage("");

    if (!normalizedDescription) {
      setErrorMessage(
        "Digite uma descrição para a interação.",
      );

      return;
    }

    if (normalizedDescription.length < 2) {
      setErrorMessage(
        "A descrição deve ter pelo menos 2 caracteres.",
      );

      return;
    }

    setIsSaving(true);

    try {
      const createdInteraction =
        await createLeadInteraction(
          companyId,
          {
            interaction_type:
              interactionType,
            description:
              normalizedDescription,
            follow_up_at:
              followUpAt || null,
          },
        );

      setDescription("");
      setFollowUpAt("");
      setInteractionType("mensagem");

      setSuccessMessage(
        "Interação salva com sucesso.",
      );

      onInteractionCreated?.(
        createdInteraction,
      );

      window.dispatchEvent(
        new CustomEvent(
          "lead-interaction-created",
          {
            detail: {
              companyId,
              interaction:
                createdInteraction,
            },
          },
        ),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a interação.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <Plus className="h-5 w-5 text-blue-600" />

        <div>
          <h3 className="font-semibold text-slate-950">
            Nova interação
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Registre mensagens, ligações,
            reuniões, propostas ou observações.
          </p>
        </div>
      </div>

      <form
        className="mt-6 space-y-4"
        onSubmit={handleSubmit}
      >
        <div>
          <label
            htmlFor={`interaction-type-${companyId}`}
            className="text-sm font-medium text-slate-700"
          >
            Tipo da interação
          </label>

          <select
            id={`interaction-type-${companyId}`}
            value={interactionType}
            disabled={isSaving}
            onChange={(event) => {
              setInteractionType(
                event.target.value,
              );

              setSuccessMessage("");
              setErrorMessage("");
            }}
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="mensagem">
              Mensagem enviada
            </option>

            <option value="ligacao">
              Ligação realizada
            </option>

            <option value="resposta">
              Resposta recebida
            </option>

            <option value="reuniao">
              Reunião
            </option>

            <option value="proposta">
              Proposta enviada
            </option>

            <option value="observacao">
              Observação
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor={`interaction-description-${companyId}`}
            className="text-sm font-medium text-slate-700"
          >
            Descrição
          </label>

          <textarea
            id={`interaction-description-${companyId}`}
            value={description}
            disabled={isSaving}
            rows={4}
            maxLength={2000}
            placeholder="Ex.: Enviei uma apresentação pelo WhatsApp e aguardo retorno."
            onChange={(event) => {
              setDescription(
                event.target.value,
              );

              setSuccessMessage("");
              setErrorMessage("");
            }}
            className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          />

          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              Campo obrigatório
            </p>

            <p className="text-xs text-slate-400">
              {description.length}/2000
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor={`interaction-follow-up-${companyId}`}
            className="text-sm font-medium text-slate-700"
          >
            Próximo follow-up
          </label>

          <p className="mt-1 text-xs text-slate-400">
            Opcional
          </p>

          <div className="relative mt-2">
            <CalendarClock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id={`interaction-follow-up-${companyId}`}
              type="datetime-local"
              value={followUpAt}
              disabled={isSaving}
              onChange={(event) => {
                setFollowUpAt(
                  event.target.value,
                );

                setSuccessMessage("");
                setErrorMessage("");
              }}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
          >
            {successMessage}
          </div>
        )}

        <Button
          type="submit"
          disabled={
            isSaving ||
            description.trim().length < 2
          }
          className="w-full"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Salvar interação
            </>
          )}
        </Button>
      </form>
    </section>
  );
}