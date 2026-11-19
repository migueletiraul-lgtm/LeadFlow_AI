import CompanyWorkspace from "@/components/workspace/CompanyWorkspace";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { Lead } from "@/lib/types";
import { getCompany } from "@/services/api";

export const dynamic = "force-dynamic";

type CompanyWorkspacePageProps = {
  params: Promise<{ id: string }>;
};

export default async function CompanyWorkspacePage({
  params,
}: CompanyWorkspacePageProps) {
  const { id } = await params;
  const companyId = Number(id);

  let company: Lead | null = null;
  let apiConnected = true;

  try {
    company = await getCompany(companyId);
  } catch (error) {
    apiConnected = false;
    console.error("Erro ao carregar empresa:", error);
  }

  return (
    <DashboardLayout apiConnected={apiConnected}>
      {company ? (
        <CompanyWorkspace lead={company} />
      ) : (
        <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-7 sm:px-8">
          <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-center text-sm text-red-700">
            Não foi possível carregar esta empresa. Verifique o backend ou o identificador informado.
          </div>
        </main>
      )}
    </DashboardLayout>
  );
}
