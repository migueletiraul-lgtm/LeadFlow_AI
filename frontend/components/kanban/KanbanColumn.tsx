"use client";

import { useState } from "react";
import {
  Circle,
  MoveVertical,
} from "lucide-react";

import type {
  Lead,
  PipelineStage,
} from "@/lib/types";

import KanbanCard from "./KanbanCard";

type KanbanColumnProps = {
  title: PipelineStage;
  color: string;
  leads: Lead[];
  draggingLead: Lead | null;
  onDragStart: (lead: Lead) => void;
  onDrop: (
    lead: Lead,
    stage: PipelineStage,
  ) => void;
  onOpenLead: (lead: Lead) => void;
};

export default function KanbanColumn({
  title,
  color,
  leads,
  draggingLead,
  onDragStart,
  onDrop,
  onOpenLead,
}: KanbanColumnProps) {
  const [isOver, setIsOver] =
    useState(false);

  function handleDrop() {
    if (!draggingLead) {
      return;
    }

    onDrop(draggingLead, title);

    setIsOver(false);
  }

  return (
    <section
      onDragOver={(event) => {
        event.preventDefault();

        setIsOver(true);
      }}
      onDragLeave={() =>
        setIsOver(false)
      }
      onDrop={handleDrop}
      className={`flex min-h-[650px] flex-col rounded-2xl border bg-slate-50 transition-all duration-200 ${
        isOver
          ? "border-blue-500 ring-4 ring-blue-100"
          : "border-slate-200"
      }`}
    >
      <header
        className={`rounded-t-2xl border-b px-4 py-4 ${color}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Circle className="h-3 w-3 fill-current" />

            <h3 className="font-semibold">
              {title}
            </h3>
          </div>

          <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-bold">
            {leads.length}
          </span>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {leads.length === 0 && (
          <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-400">
            <MoveVertical className="h-5 w-5" />

            <p className="mt-2 text-xs">
              Arraste um lead
            </p>
          </div>
        )}

        {leads.map((lead) => (
          <KanbanCard
            key={lead.id}
            lead={lead}
            onOpen={onOpenLead}
            onDragStart={onDragStart}
            isDragging={
              draggingLead?.id === lead.id
            }
          />
        ))}
      </div>
    </section>
  );
}