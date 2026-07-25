"use client";

import { useEffect, useState } from "react";
import { Columns3, Table2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Lead } from "@/lib/types";

import KanbanBoard from "../kanban/KanbanBoard";
import LeadTable from "./LeadTable";

type DashboardLeadsViewProps = {
  leads: Lead[];
};

type ViewMode = "table" | "kanban";

export default function DashboardLeadsView({
  leads,
}: DashboardLeadsViewProps) {
  const [viewMode, setViewMode] =
    useState<ViewMode>("table");

  const [localLeads, setLocalLeads] =
    useState<Lead[]>(leads);

  useEffect(() => {
    setLocalLeads(leads);
  }, [leads]);

  function handleLeadUpdated(updatedLead: Lead) {
    setLocalLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === updatedLead.id
          ? updatedLead
          : lead,
      ),
    );
  }

  return (
    <section
      id="melhores-leads"
      className="space-y-4"
    >
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950">
            Gestão comercial
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Visualize os leads em tabela ou acompanhe o pipeline pelo Kanban.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
          <Button
            type="button"
            size="sm"
            variant={
              viewMode === "table"
                ? "default"
                : "ghost"
            }
            onClick={() =>
              setViewMode("table")
            }
            aria-pressed={viewMode === "table"}
          >
            <Table2 className="h-4 w-4" />
            Tabela
          </Button>

          <Button
            type="button"
            size="sm"
            variant={
              viewMode === "kanban"
                ? "default"
                : "ghost"
            }
            onClick={() =>
              setViewMode("kanban")
            }
            aria-pressed={viewMode === "kanban"}
          >
            <Columns3 className="h-4 w-4" />
            Kanban
          </Button>
        </div>
      </div>

      {viewMode === "table" ? (
        <LeadTable
          leads={localLeads}
          onLeadUpdated={handleLeadUpdated}
        />
      ) : (
        <KanbanBoard
          leads={localLeads}
          onLeadUpdated={handleLeadUpdated}
        />
      )}
    </section>
  );
}