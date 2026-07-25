import Charts from "@/components/charts/Charts";
import AIInsights from "@/components/dashboard/AIInsights";
import DashboardLeadsView from "@/components/dashboard/DashboardLeadsView";
import Hero from "@/components/dashboard/Hero";
import NextActions from "@/components/dashboard/NextActions";
import OverviewCards from "@/components/dashboard/OverviewCards";
import SalesFunnel from "@/components/dashboard/SalesFunnel";
import ExecutiveDashboardCard from "@/components/intelligence/ExecutiveDashboardCard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { ExecutiveDashboardResponse, Lead } from "@/lib/types";
import { getBestLeads, getExecutiveDashboard } from "@/services/api";

export const dynamic = "force-dynamic";

type BestLeadsResponse = {
  leads?: Lead[];
  companies?: Lead[];
  results?: Lead[];
  data?: Lead[];
  items?: Lead[];
};

function extractLeads(response: unknown): Lead[] {
  if (Array.isArray(response)) {
    return response as Lead[];
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  const result = response as BestLeadsResponse;

  const possibleLists = [
    result.leads,
    result.companies,
    result.results,
    result.data,
    result.items,
  ];

  for (const list of possibleLists) {
    if (Array.isArray(list)) {
      return list;
    }
  }

  return [];
}

export default async function Home() {
  let leads: Lead[] = [];
  let apiConnected = true;

  try {
    const response = await getBestLeads();
    leads = extractLeads(response);
  } catch (error) {
    apiConnected = false;

    console.error(
      "Erro ao carregar os leads:",
      error,
    );
  }

  let executiveDashboard: ExecutiveDashboardResponse | null = null;

  try {
    executiveDashboard = await getExecutiveDashboard();
  } catch (error) {
    console.error(
      "Erro ao carregar o painel executivo:",
      error,
    );
  }

  return (
    <DashboardLayout
      apiConnected={apiConnected}
    >
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="flex min-h-20 items-center justify-between gap-4 px-5 sm:px-8">
          <div>
            <p className="text-sm font-semibold text-slate-950">
              Central de inteligência
            </p>

            <p className="text-xs text-slate-500">
              Dados atualizados pelo LeadFlow IA
            </p>
          </div>

          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
              apiConnected
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              {apiConnected && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              )}

              <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                  apiConnected
                    ? "bg-emerald-500"
                    : "bg-red-500"
                }`}
              />
            </span>

            {apiConnected
              ? "API conectada"
              : "API desconectada"}
          </div>
        </div>
      </header>

      <main
        id="dashboard"
        className="relative min-h-[calc(100vh-80px)] overflow-hidden px-5 py-7 sm:px-8"
      >
        <div className="pointer-events-none absolute left-[10%] top-0 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="pointer-events-none absolute right-[5%] top-48 h-72 w-72 rounded-full bg-indigo-200/25 blur-3xl" />

        <div className="relative z-10 mx-auto w-full max-w-[1600px]">
          <div className="mb-8">
            <Hero
              totalLeads={leads.length}
            />
          </div>

          {!apiConnected && (
            <section className="mb-8">
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                Não foi possível carregar os leads.
                Confirme se o backend está funcionando em{" "}
                <strong>
                  http://127.0.0.1:8000
                </strong>
                .
              </div>
            </section>
          )}

          <section
            id="indicadores"
            className="mb-8"
          >
            <OverviewCards
              leads={leads}
            />
          </section>

          {executiveDashboard && (
            <section className="mb-8">
              <ExecutiveDashboardCard
                summary={executiveDashboard.summary}
                potentialRevenue={executiveDashboard.potential_revenue}
                avgWinProbability={executiveDashboard.avg_win_probability}
                priorityLeads={executiveDashboard.priority_leads}
              />
            </section>
          )}

          <section className="mb-8">
            <AIInsights
              leads={leads}
            />
          </section>

          <section className="mb-8">
            <NextActions
              leads={leads}
            />
          </section>

          <section className="mb-8">
            <SalesFunnel
              leads={leads}
            />
          </section>

          <section className="mb-8">
            <Charts
              leads={leads}
            />
          </section>

          <DashboardLeadsView
            leads={leads}
          />
        </div>
      </main>
    </DashboardLayout>
  );
}