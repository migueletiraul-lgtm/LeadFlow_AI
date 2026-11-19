"use client";

import type { ReactNode } from "react";

import {
  BarChart3,
  Building2,
  Download,
  LayoutDashboard,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type DashboardLayoutProps = {
  children: ReactNode;
  apiConnected: boolean;
};

function getNavLinkClasses(isActive: boolean) {
  return isActive
    ? "flex items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500"
    : "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white";
}

export default function DashboardLayout({
  children,
  apiConnected,
}: DashboardLayoutProps) {
  const pathname = usePathname();

  const isDashboardActive = pathname === "/";
  const isEmpresasActive = pathname.startsWith("/empresas");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-r border-white/10 bg-[#071426] text-white">
          <div className="sticky top-0 flex min-h-screen flex-col p-5">
            <div className="mb-10 flex items-center gap-3 px-2 pt-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <p className="text-lg font-bold">LeadFlow IA</p>
                <p className="text-xs text-slate-400">
                  Inteligência comercial
                </p>
              </div>
            </div>

            <nav className="space-y-2">
              <Link
                href="/"
                className={getNavLinkClasses(
                  isDashboardActive,
                )}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>

              <Link
                href="/empresas"
                className={getNavLinkClasses(
                  isEmpresasActive,
                )}
              >
                <Building2 className="h-5 w-5" />
                Empresas
              </Link>

              <Link
                href="/#melhores-leads"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <Target className="h-5 w-5" />
                Melhores leads
              </Link>

              <Link
                href="/#indicadores"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <BarChart3 className="h-5 w-5" />
                Indicadores
              </Link>
            </nav>

            <div className="mt-auto pt-8">
              <a
                href="http://127.0.0.1:8000/export/excel"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <Download className="h-4 w-4" />
                Exportar Excel
              </a>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-medium text-slate-400">
                  Status do sistema
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      apiConnected ? "bg-emerald-400" : "bg-red-400"
                    }`}
                  />

                  <p className="text-sm font-semibold">
                    {apiConnected ? "Operacional" : "Indisponível"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}