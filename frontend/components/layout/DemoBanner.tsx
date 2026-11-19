"use client";

import { FlaskConical, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDemoMode } from "@/lib/demo/demo-mode";

export default function DemoBanner() {
  const { isDemoMode, setDemoMode } = useDemoMode();

  if (!isDemoMode) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-800 sm:flex-row sm:justify-center dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200">
      <span className="flex items-center gap-2 font-medium">
        <FlaskConical className="h-4 w-4 shrink-0" />
        Modo demonstração ativo — os dados exibidos são fictícios.
      </span>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setDemoMode(false)}
        className="h-7 gap-1 px-2 text-amber-800 hover:bg-amber-100 hover:text-amber-900 dark:text-amber-200 dark:hover:bg-amber-900/40"
      >
        <X className="h-3.5 w-3.5" />
        Desativar
      </Button>
    </div>
  );
}
