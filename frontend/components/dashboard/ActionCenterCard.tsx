import {
  ArrowUpRight,
  Copy,
  MessageCircle,
  Radio,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export type ActionCenterAction = {
  label: string;
  onClick: () => void;
};

const STATUS_OPTIONS = [
  "Novo Lead",
  "Contato iniciado",
  "Resposta recebida",
  "Reunião",
  "Proposta enviada",
  "Negociação",
  "Cliente",
  "Perdido",
];

type ActionCenterCardProps = {
  company: string;
  channel: string;
  message: string;
  actions: ActionCenterAction[];
  status: string;
  onCopy: () => void;
  onOpen: () => void;
  onStatusChange: (status: string) => void;
};

export default function ActionCenterCard({
  company,
  channel,
  message,
  actions,
  status,
  onCopy,
  onOpen,
  onStatusChange,
}: ActionCenterCardProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-[#071426] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl" />

      <div className="relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
              <Radio className="h-4 w-4" />
              Central de ação
            </div>

            <h2 className="mt-4 truncate text-2xl font-bold tracking-tight sm:text-3xl">
              {company}
            </h2>

            <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">
              <MessageCircle className="h-4 w-4" />
              Canal: {channel}
            </div>
          </div>

          <label className="flex shrink-0 flex-col gap-1.5 text-xs font-medium text-slate-400">
            Status do lead
            <select
              value={status}
              onChange={(event) =>
                onStatusChange(event.target.value)
              }
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40"
            >
              {STATUS_OPTIONS.map((option) => (
                <option
                  key={option}
                  value={option}
                  className="bg-slate-900 text-white"
                >
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Prévia da mensagem
          </p>

          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-200">
            {message}
          </p>
        </div>

        {actions.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {actions.map((action) => (
              <Button
                key={action.label}
                type="button"
                variant="outline"
                size="sm"
                onClick={action.onClick}
                className="border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={onCopy}
            className="gap-2 border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white sm:w-auto"
          >
            <Copy className="h-4 w-4" />
            Copiar mensagem
          </Button>

          <Button
            type="button"
            onClick={onOpen}
            className="gap-2 bg-blue-600 text-white hover:bg-blue-500 sm:w-auto"
          >
            Abrir conversa
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
