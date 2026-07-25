"use client";

import {
  Check,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

import { NavList } from "@/components/layout/AppNav";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const WORKSPACES = [
  "Minha agência",
  "Cliente — Loja Norte",
  "Cliente — Studio Fit",
];

type AppSidebarProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
};

export default function AppSidebar({
  collapsed,
  onToggleCollapse,
}: AppSidebarProps) {
  const [activeWorkspace, setActiveWorkspace] = useState(
    WORKSPACES[0],
  );

  return (
    <aside
      className={`sticky top-0 hidden min-h-screen flex-col border-r border-white/10 bg-[#071426] text-white transition-[width] duration-200 dark:border-slate-800 lg:flex ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="flex min-h-screen flex-col p-4">
        <div
          className={`mb-6 flex items-center gap-3 px-1 pt-2 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
            <Sparkles className="h-5 w-5" />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-lg font-bold">
                LeadFlow AI
              </p>
              <p className="truncate text-xs text-slate-400">
                Inteligência comercial
              </p>
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            className={`mb-6 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-sm font-medium text-white transition hover:bg-white/10 ${
              collapsed ? "justify-center" : "justify-between"
            }`}
          >
            {!collapsed && (
              <span className="truncate">{activeWorkspace}</span>
            )}

            <ChevronsUpDown className="h-4 w-4 shrink-0 text-slate-400" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            {WORKSPACES.map((workspace) => (
              <DropdownMenuItem
                key={workspace}
                onClick={() => setActiveWorkspace(workspace)}
                className="flex items-center justify-between gap-2"
              >
                {workspace}

                {workspace === activeWorkspace && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <NavList collapsed={collapsed} />

        <div className="mt-auto space-y-3 pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={onToggleCollapse}
            aria-label={
              collapsed ? "Expandir menu" : "Recolher menu"
            }
            className={`w-full text-slate-300 hover:bg-white/10 hover:text-white ${
              collapsed ? "justify-center px-0" : "justify-start"
            }`}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                Recolher menu
              </>
            )}
          </Button>

          {!collapsed && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold">
                LeadFlow Pro
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Transforme empresas locais em oportunidades
                comerciais.
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
