"use client";

import {
  BarChart3,
  Building2,
  Download,
  LayoutDashboard,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "Empresas",
    icon: Building2,
  },
  {
    label: "Buscar leads",
    icon: Search,
  },
  {
    label: "Analytics",
    icon: BarChart3,
  },
  {
    label: "Exportações",
    icon: Download,
  },
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 p-5 text-white lg:flex">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
          <Sparkles className="size-6" />
        </div>

        <div>
          <h1 className="text-lg font-bold">LeadFlow AI</h1>
          <p className="text-xs text-slate-400">Prospecção inteligente</p>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                item.active
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon className="size-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-slate-800 pt-5">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
        >
          <Settings className="size-5" />
          Configurações
        </button>

        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm font-semibold">LeadFlow Pro</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Transforme empresas locais em oportunidades comerciais.
          </p>
        </div>
      </div>
    </aside>
  );
}