"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarClock,
  Clock3,
  MessageCircle,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  getLeadInteractions,
  type LeadInteraction,
} from "@/services/interactions";

type LeadTimelineProps = {
  companyId: number;
};

type LeadInteractionCreatedEvent = CustomEvent<{
  companyId: number;
  interaction: LeadInteraction;
}>;

function formatInteractionDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function formatInteractionType(
  interactionType: string,
) {
  const labels: Record<string, string> = {
    mensagem: "Mensagem enviada",
    ligacao: "Ligação realizada",
    resposta: "Resposta recebida",
    reuniao: "Reunião",
    proposta: "Proposta enviada",
    observacao: "Observação",
  };

  const normalizedType = interactionType
    .trim()
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return labels[normalizedType] || interactionType;
}

export default function LeadTimeline({
  companyId,
}: LeadTimelineProps) {
  const [interactions, setInteractions] =
    useState<LeadInteraction[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadInteractions = useCallback(
    async (showLoading = true) => {
      if (showLoading) {
        setIsLoading(true);
      }

      setError("");

      try {
        const response =
          await getLeadInteractions(companyId);

        setInteractions(response.results);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Não foi possível carregar o histórico.",
        );
      } finally {
        if (showLoading) {
          setIsLoading(false);
        }
      }
    },
    [companyId],
  );

  useEffect(() => {
    loadInteractions();
  }, [loadInteractions]);

  useEffect(() => {
    function handleInteractionCreated(
      event: Event,
    ) {
      const customEvent =
        event as LeadInteractionCreatedEvent;

      if (
        customEvent.detail.companyId !==
        companyId
      ) {
        return;
      }

      const createdInteraction =
        customEvent.detail.interaction;

      setInteractions((currentInteractions) => {
        const alreadyExists =
          currentInteractions.some(
            (interaction) =>
              interaction.id ===
              createdInteraction.id,
          );

        if (alreadyExists) {
          return currentInteractions;
        }

        return [
          createdInteraction,
          ...currentInteractions,
        ];
      });

      setError("");
    }

    window.addEventListener(
      "lead-interaction-created",
      handleInteractionCreated,
    );

    return () => {
      window.removeEventListener(
        "lead-interaction-created",
        handleInteractionCreated,
      );
    };
  }, [companyId]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <Clock3 className="h-5 w-5 text-blue-600" />

          <div>
            <h3 className="font-semibold text-slate-950">
              Histórico de Interações
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Acompanhe todas as ações realizadas
              com este lead.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() =>
            loadInteractions(true)
          }
          disabled={isLoading}
          aria-label="Atualizar histórico"
          title="Atualizar histórico"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              isLoading
                ? "animate-spin"
                : ""
            }`}
          />
        </Button>
      </div>

      {isLoading && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-500" />

          <p className="mt-3 text-sm font-medium text-slate-600">
            Carregando histórico...
          </p>
        </div>
      )}

      {!isLoading && error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              loadInteractions(true)
            }
            className="mt-4"
          >
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      )}

      {!isLoading &&
        !error &&
        interactions.length === 0 && (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <Clock3 className="mx-auto h-10 w-10 text-slate-400" />

            <p className="mt-3 font-medium text-slate-700">
              Nenhuma interação cadastrada
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Mensagens, ligações, reuniões,
              propostas e observações aparecerão
              aqui.
            </p>
          </div>
        )}

      {!isLoading &&
        !error &&
        interactions.length > 0 && (
          <div className="relative mt-6 space-y-4">
            <div className="absolute bottom-3 left-5 top-3 w-px bg-slate-200" />

            {interactions.map(
              (interaction) => (
                <article
                  key={interaction.id}
                  className="relative flex gap-4"
                >
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600">
                    <MessageCircle className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="font-semibold text-slate-900">
                        {formatInteractionType(
                          interaction.interaction_type,
                        )}
                      </p>

                      <time className="text-xs text-slate-400">
                        {formatInteractionDate(
                          interaction.created_at,
                        )}
                      </time>
                    </div>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {interaction.description}
                    </p>

                    {interaction.follow_up_at && (
                      <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                        <CalendarClock className="h-4 w-4" />

                        Follow-up:{" "}
                        {formatInteractionDate(
                          interaction.follow_up_at,
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ),
            )}
          </div>
        )}
    </section>
  );
}