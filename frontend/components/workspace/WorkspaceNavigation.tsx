"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export const WORKSPACE_TABS = [
  { value: "resumo", label: "Resumo" },
  { value: "estrategia", label: "Estratégia" },
  { value: "execucao", label: "Execução" },
  { value: "historico", label: "Histórico" },
] as const;

export type WorkspaceTabValue =
  (typeof WORKSPACE_TABS)[number]["value"];

export default function WorkspaceNavigation() {
  return (
    <TabsList
      variant="line"
      className="w-full justify-start border-b border-slate-200"
    >
      {WORKSPACE_TABS.map((tab) => (
        <TabsTrigger key={tab.value} value={tab.value}>
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
