"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import CompanyHeader from "@/components/dashboard/CompanyHeader";
import { getCompanyIntelligence } from "@/services/api";
import type {
  Lead,
  OpportunityIntelligenceResponse,
} from "@/lib/types";

import DecisionCard from "./DecisionCard";
import NextActionBar from "./NextActionBar";
import WorkspaceContent from "./WorkspaceContent";
import WorkspaceNavigation, {
  type WorkspaceTabValue,
} from "./WorkspaceNavigation";
import WorkspaceSummary from "./WorkspaceSummary";

type CompanyWorkspaceProps = {
  lead: Lead;
};

export default function CompanyWorkspace({
  lead,
}: CompanyWorkspaceProps) {
  const [currentLead, setCurrentLead] = useState(lead);

  const [intelligence, setIntelligence] =
    useState<OpportunityIntelligenceResponse | null>(
      null,
    );

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] =
    useState<WorkspaceTabValue>("resumo");

  const loadIntelligence = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await getCompanyIntelligence(
        currentLead.id,
      );

      setIntelligence(response);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Não foi possível carregar o diagnóstico desta empresa.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentLead.id]);

  useEffect(() => {
    loadIntelligence();
  }, [loadIntelligence]);

  const isEmpty =
    intelligence !== null &&
    intelligence.pain_points.length === 0 &&
    intelligence.recommended_services.length === 0;

  return (
    <main
      className="min-h-[calc(100vh-80px)] px-5 py-7 sm:px-8"
      style={{
        paddingBottom:
          "calc(var(--next-action-bar-height, 96px) + 24px)",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
        <CompanyHeader
          lead={currentLead}
          intelligence={intelligence}
          isLoading={isLoading}
          error={error}
        />

        {isLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-500" />

            <p className="mt-3 text-sm font-medium text-slate-600">
              Carregando inteligência da empresa...
            </p>
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadIntelligence()}
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </Button>
          </div>
        )}

        {!isLoading && !error && isEmpty && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <p className="font-medium text-slate-700">
              Nenhum diagnóstico disponível para esta
              empresa ainda.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Assim que houver dados suficientes, o
              diagnóstico e a estratégia aparecerão aqui.
            </p>
          </div>
        )}

        {!isLoading &&
          !error &&
          intelligence &&
          !isEmpty && (
            <>
              <DecisionCard intelligence={intelligence} />

              <WorkspaceSummary
                intelligence={intelligence}
              />

              <Tabs
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(
                    value as WorkspaceTabValue,
                  )
                }
                className="flex-col gap-4"
              >
                <WorkspaceNavigation />

                <WorkspaceContent
                  lead={currentLead}
                  intelligence={intelligence}
                  onLeadUpdated={setCurrentLead}
                />
              </Tabs>
            </>
          )}
      </div>

      {!isLoading && !error && intelligence && (
        <NextActionBar
          lead={currentLead}
          nextAction={intelligence.next_action}
        />
      )}
    </main>
  );
}
