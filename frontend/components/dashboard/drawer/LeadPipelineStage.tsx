"use client";

import { useEffect, useState } from "react";
import {
  CircleDot,
  Loader2,
} from "lucide-react";

import type {
  Lead,
  PipelineStage,
} from "@/lib/types";
import { updatePipelineStage } from "@/services/api";

type LeadPipelineStageProps = {
  lead: Lead;
  onLeadUpdated?: (lead: Lead) => void;
};

const PIPELINE_STAGES: PipelineStage[] = [
  "Novo Lead",
  "Contato iniciado",
  "Resposta recebida",
  "Reunião",
  "Proposta enviada",
  "Negociação",
  "Cliente",
  "Perdido",
];

function getStageClasses(
  stage: PipelineStage,
) {
  const classes: Record<
    PipelineStage,
    string
  > = {
    "Novo Lead":
      "border-slate-200 bg-slate-50 text-slate-700",
    "Contato iniciado":
      "border-blue-200 bg-blue-50 text-blue-700",
    "Resposta recebida":
      "border-cyan-200 bg-cyan-50 text-cyan-700",
    Reunião:
      "border-violet-200 bg-violet-50 text-violet-700",
    "Proposta enviada":
      "border-amber-200 bg-amber-50 text-amber-700",
    Negociação:
      "border-orange-200 bg-orange-50 text-orange-700",
    Cliente:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    Perdido:
      "border-red-200 bg-red-50 text-red-700",
  };

  return classes[stage];
}

export default function LeadPipelineStage({
  lead,
  onLeadUpdated,
}: LeadPipelineStageProps) {
  const initialStage =
    lead.pipeline_stage || "Novo Lead";

  const [pipelineStage, setPipelineStage] =
    useState<PipelineStage>(initialStage);

  const [isSaving, setIsSaving] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    setPipelineStage(
      lead.pipeline_stage || "Novo Lead",
    );

    setSuccessMessage("");
    setErrorMessage("");
  }, [lead]);

  async function handleStageChange(
    newStage: PipelineStage,
  ) {
    if (
      newStage === pipelineStage ||
      isSaving
    ) {
      return;
    }

    const previousStage = pipelineStage;

    setPipelineStage(newStage);
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const updatedLead =
        await updatePipelineStage(
          lead.id,
          newStage,
        );

      setPipelineStage(
        updatedLead.pipeline_stage,
      );

      onLeadUpdated?.(updatedLead);

      setSuccessMessage(
        "Etapa atualizada com sucesso.",
      );
    } catch (error) {
      setPipelineStage(previousStage);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a etapa.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <CircleDot className="h-5 w-5 text-blue-600" />

        <div>
          <h3 className="font-semibold text-slate-950">
            Pipeline Comercial
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Defina a etapa atual deste lead no processo de vendas.
          </p>
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor={`pipeline-stage-${lead.id}`}
          className="text-sm font-medium text-slate-700"
        >
          Etapa atual
        </label>

        <div className="relative mt-2">
          <select
            id={`pipeline-stage-${lead.id}`}
            value={pipelineStage}
            disabled={isSaving}
            onChange={(event) =>
              handleStageChange(
                event.target
                  .value as PipelineStage,
              )
            }
            className={`h-12 w-full appearance-none rounded-xl border px-4 pr-10 text-sm font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70 ${getStageClasses(
              pipelineStage,
            )}`}
          >
            {PIPELINE_STAGES.map(
              (stage) => (
                <option
                  key={stage}
                  value={stage}
                >
                  {stage}
                </option>
              ),
            )}
          </select>

          {isSaving && (
            <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-blue-600" />
          )}
        </div>

        {isSaving && (
          <p className="mt-2 text-xs font-medium text-blue-600">
            Salvando etapa...
          </p>
        )}

        {!isSaving &&
          successMessage && (
            <p className="mt-2 text-xs font-medium text-emerald-600">
              {successMessage}
            </p>
          )}

        {!isSaving &&
          errorMessage && (
            <p className="mt-2 text-xs font-medium text-red-600">
              {errorMessage}
            </p>
          )}
      </div>
    </section>
  );
}