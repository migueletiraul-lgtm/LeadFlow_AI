import DashboardLeadsView from "@/components/dashboard/DashboardLeadsView";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { Lead } from "@/lib/types";
import { getCompanies } from "@/services/api";

export const dynamic = "force-dynamic";

export default async function EmpresasPage() {
  let companies: Lead[] = [];
  let apiConnected = true;

  try {
    companies = await getCompanies();
  } catch (error) {
    apiConnected = false;
    console.error("Erro ao carregar empresas:", error);
  }

  return (
    <DashboardLayout apiConnected={apiConnected}>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="flex min-h-20 items-center justify-between gap-4 px-5 sm:px-8">
          <div>
            <h1 className="text-lg font-semibold text-slate-950">
              Empresas
            </h1>

            <p className="text-sm text-slate-500">
              Consulte e analise todas as empresas cadastradas no LeadFlow.
            </p>
          </div>

          <div
            className={`rounded-full border px-3 py-2 text-xs font-semibold ${
              apiConnected
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {apiConnected ? "API conectada" : "API desconectada"}
          </div>
        </div>
      </header>

      <main className="min-h-[calc(100vh-80px)] px-5 py-7 sm:px-8">
        <div className="mx-auto w-full max-w-[1600px]">
          {!apiConnected && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              Não foi possível carregar as empresas. Verifique o backend.
            </div>
          )}

          <DashboardLeadsView leads={companies} />
        </div>
      </main>
    </DashboardLayout>
  );
}
