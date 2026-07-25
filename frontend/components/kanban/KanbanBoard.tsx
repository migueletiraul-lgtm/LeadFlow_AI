"use client";

import { useEffect, useMemo, useState } from "react";

import type {
  Lead,
  PipelineStage,
} from "@/lib/types";

import { updatePipelineStage } from "@/services/api";

import LeadDetailsDrawer from "../dashboard/LeadDetailsDrawer";
import KanbanColumn from "./KanbanColumn";

type KanbanBoardProps = {
  leads: Lead[];
  onLeadUpdated?: (lead: Lead) => void;
};

type KanbanColumnConfig = {
  stage: PipelineStage;
  color: string;
};

const KANBAN_COLUMNS: KanbanColumnConfig[] = [
  {
    stage: "Novo Lead",
    color:
      "border-slate-200 bg-slate-100 text-slate-700",
  },
  {
    stage: "Contato iniciado",
    color:
      "border-cyan-200 bg-cyan-50 text-cyan-700",
  },
  {
    stage: "Resposta recebida",
    color:
      "border-blue-200 bg-blue-50 text-blue-700",
  },
  {
    stage: "Reunião",
    color:
      "border-indigo-200 bg-indigo-50 text-indigo-700",
  },
  {
    stage: "Proposta enviada",
    color:
      "border-violet-200 bg-violet-50 text-violet-700",
  },
  {
    stage: "Negociação",
    color:
      "border-amber-200 bg-amber-50 text-amber-700",
  },
  {
    stage: "Cliente",
    color:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  {
    stage: "Perdido",
    color:
      "border-red-200 bg-red-50 text-red-700",
  },
];

export default function KanbanBoard({
  leads,
  onLeadUpdated,
}: KanbanBoardProps) {
  const [localLeads, setLocalLeads] =
    useState<Lead[]>(leads);

  const [draggingLead, setDraggingLead] =
    useState<Lead | null>(null);

  const [selectedLead, setSelectedLead] =
    useState<Lead | null>(null);

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    setLocalLeads(leads);
  }, [leads]);

  const leadsByStage = useMemo(() => {
    const grouped = new Map<
      PipelineStage,
      Lead[]
    >();

    KANBAN_COLUMNS.forEach(({ stage }) => {
      grouped.set(stage, []);
    });

    localLeads.forEach((lead) => {
      const stage =
        lead.pipeline_stage || "Novo Lead";

      const currentLeads =
        grouped.get(stage) || [];

      grouped.set(stage, [
        ...currentLeads,
        lead,
      ]);
    });

    return grouped;
  }, [localLeads]);

  function handleOpenLead(lead: Lead) {
    setSelectedLead(lead);
    setDrawerOpen(true);
  }

  function handleCloseDrawer() {
    setDrawerOpen(false);
    setSelectedLead(null);
  }

  function applyUpdatedLead(
    updatedLead: Lead,
  ) {
    setLocalLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === updatedLead.id
          ? updatedLead
          : lead,
      ),
    );

    setSelectedLead((currentLead) =>
      currentLead?.id === updatedLead.id
        ? updatedLead
        : currentLead,
    );

    onLeadUpdated?.(updatedLead);
  }

  async function handleDrop(
    lead: Lead,
    stage: PipelineStage,
  ) {
    setDraggingLead(null);
    setErrorMessage("");

    if (
      lead.pipeline_stage === stage ||
      isUpdating
    ) {
      return;
    }

    const previousStage =
      lead.pipeline_stage || "Novo Lead";

    const optimisticLead: Lead = {
      ...lead,
      pipeline_stage: stage,
    };

    setLocalLeads((currentLeads) =>
      currentLeads.map((currentLead) =>
        currentLead.id === lead.id
          ? optimisticLead
          : currentLead,
      ),
    );

    setSelectedLead((currentLead) =>
      currentLead?.id === lead.id
        ? optimisticLead
        : currentLead,
    );

    setIsUpdating(true);

    try {
      const updatedLead =
        await updatePipelineStage(
          lead.id,
          stage,
        );

      applyUpdatedLead(updatedLead);
    } catch (error) {
      const restoredLead: Lead = {
        ...lead,
        pipeline_stage: previousStage,
      };

      setLocalLeads((currentLeads) =>
        currentLeads.map((currentLead) =>
          currentLead.id === lead.id
            ? restoredLead
            : currentLead,
        ),
      );

      setSelectedLead((currentLead) =>
        currentLead?.id === lead.id
          ? restoredLead
          : currentLead,
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o pipeline.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <>
      <section className="space-y-4">
        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="overflow-x-auto pb-4">
          <div className="grid min-w-[2400px] grid-cols-8 gap-4">
            {KANBAN_COLUMNS.map(
              ({ stage, color }) => (
                <KanbanColumn
                  key={stage}
                  title={stage}
                  color={color}
                  leads={
                    leadsByStage.get(stage) ||
                    []
                  }
                  draggingLead={draggingLead}
                  onDragStart={setDraggingLead}
                  onDrop={handleDrop}
                  onOpenLead={handleOpenLead}
                />
              ),
            )}
          </div>
        </div>
      </section>

      <LeadDetailsDrawer
        lead={selectedLead}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        onLeadUpdated={applyUpdatedLead}
      />
    </>
  );
}