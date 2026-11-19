import { Compass } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { NextActionPriority } from "@/lib/types";

type AuditNextActionCardProps = {
  priority: NextActionPriority;
  action: string;
  reason: string;
};

export default function AuditNextActionCard({
  priority,
  action,
  reason,
}: AuditNextActionCardProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-[0_24px_70px_rgba(37,99,235,0.25)] transition-transform duration-300 hover:-translate-y-0.5 sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 flex flex-wrap items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <Compass className="h-5 w-5" />
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
          Próxima ação recomendada
        </p>

        <Badge
          variant="outline"
          className="ml-auto border-white/30 bg-white/10 text-white"
        >
          Prioridade {priority}
        </Badge>
      </div>

      <p className="relative z-10 mt-4 text-xl font-bold leading-tight sm:text-2xl">
        {action}
      </p>

      <p className="relative z-10 mt-3 max-w-2xl text-sm leading-6 text-blue-100">
        {reason}
      </p>
    </section>
  );
}
