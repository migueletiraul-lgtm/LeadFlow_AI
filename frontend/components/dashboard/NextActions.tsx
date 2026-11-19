import {
  ArrowRight,
  Flame,
  MessageCircle,
  Sparkles,
  Star,
  Target,
  Trophy,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Lead } from "@/lib/types";

type NextActionsProps = {
  leads: Lead[];
};

type SuggestedAction = {
  title: string;
  leadId: number;
  leadName: string;
  description: string;
  reasons: string[];
  icon: typeof Target;
  iconClasses: string;
  borderClasses: string;
  ctaLabel: string;
};

function normalizeStatus(
  status: string | null | undefined,
) {
  return (
    status?.trim().toLocaleLowerCase("pt-BR") ??
    "novo"
  );
}

export default function NextActions({
  leads,
}: NextActionsProps) {
  const activeLeads = leads.filter((lead) => {
    const status = normalizeStatus(lead.status);

    return (
      status !== "cliente" &&
      status !== "perdido"
    );
  });

  const bestNewLead = [...activeLeads]
    .filter(
      (lead) =>
        normalizeStatus(lead.status) === "novo",
    )
    .sort(
      (first, second) =>
        second.lead_score - first.lead_score,
    )[0];

  const followUpLead = [...activeLeads]
    .filter(
      (lead) =>
        normalizeStatus(lead.status) ===
        "contatado",
    )
    .sort(
      (first, second) =>
        second.lead_score - first.lead_score,
    )[0];

  const respondedLead = [...activeLeads]
    .filter(
      (lead) =>
        normalizeStatus(lead.status) ===
        "respondeu",
    )
    .sort(
      (first, second) =>
        second.lead_score - first.lead_score,
    )[0];

  const premiumLead = [...activeLeads]
    .filter(
      (lead) =>
        lead.google_rating !== null &&
        lead.google_rating >= 4.5,
    )
    .sort(
      (first, second) =>
        second.lead_score - first.lead_score,
    )[0];

  const actions: SuggestedAction[] = [];

  if (bestNewLead) {
    actions.push({
      title: "Aborde hoje",
      leadId: bestNewLead.id,
      leadName: bestNewLead.name,
      description:
        "Este é o melhor lead novo disponível na sua base.",
      reasons: [
        `Score ${bestNewLead.lead_score}`,
        bestNewLead.website
          ? "Possui website"
          : "Não possui website",
        bestNewLead.google_rating !== null
          ? `Nota Google ${bestNewLead.google_rating}`
          : "Nota Google não informada",
      ],
      icon: Flame,
      iconClasses:
        "bg-red-100 text-red-600",
      borderClasses:
        "border-red-200 bg-red-50/50",
      ctaLabel: "Analisar oportunidade",
    });
  }

  if (followUpLead) {
    actions.push({
      title: "Faça follow-up",
      leadId: followUpLead.id,
      leadName: followUpLead.name,
      description:
        "Este lead já foi contatado e ainda pode avançar no funil.",
      reasons: [
        `Score ${followUpLead.lead_score}`,
        "Status: Contatado",
        "Envie uma mensagem curta de acompanhamento",
      ],
      icon: MessageCircle,
      iconClasses:
        "bg-blue-100 text-blue-600",
      borderClasses:
        "border-blue-200 bg-blue-50/50",
      ctaLabel: "Ver oportunidade",
    });
  }

  if (respondedLead) {
    actions.push({
      title: "Avance para reunião",
      leadId: respondedLead.id,
      leadName: respondedLead.name,
      description:
        "Este lead já respondeu e merece atenção imediata.",
      reasons: [
        `Score ${respondedLead.lead_score}`,
        "Status: Respondeu",
        "Tente marcar uma conversa ou reunião",
      ],
      icon: Target,
      iconClasses:
        "bg-violet-100 text-violet-600",
      borderClasses:
        "border-violet-200 bg-violet-50/50",
      ctaLabel: "Ver oportunidade",
    });
  }

  if (
    premiumLead &&
    premiumLead.id !== bestNewLead?.id &&
    premiumLead.id !== followUpLead?.id &&
    premiumLead.id !== respondedLead?.id
  ) {
    actions.push({
      title: "Lead premium",
      leadId: premiumLead.id,
      leadName: premiumLead.name,
      description:
        "Empresa com boa reputação e potencial comercial relevante.",
      reasons: [
        `Score ${premiumLead.lead_score}`,
        `Nota Google ${premiumLead.google_rating}`,
        premiumLead.website
          ? "Presença digital existente"
          : "Sem website identificado",
      ],
      icon: Star,
      iconClasses:
        "bg-amber-100 text-amber-600",
      borderClasses:
        "border-amber-200 bg-amber-50/50",
      ctaLabel: "Ver oportunidade",
    });
  }

  if (actions.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.05)] sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <Trophy className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Próximas ações sugeridas
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Nenhuma ação prioritária foi identificada no momento.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.05)] sm:p-8">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          <Sparkles className="h-5 w-5" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
            Assistente comercial
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
            Próximas ações sugeridas
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Recomendações automáticas baseadas no score e no status dos seus leads.
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 xl:grid-cols-2">
        {actions.slice(0, 4).map((action, index) => {
          const Icon = action.icon;
          const isTopPriority = index === 0;

          return (
            <article
              key={`${action.title}-${action.leadName}`}
              className={`rounded-2xl border p-5 ${action.borderClasses} ${
                isTopPriority
                  ? "ring-1 ring-red-200"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${action.iconClasses}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {action.title}
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-slate-950">
                    {action.leadName}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {action.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {action.reasons.map((reason) => (
                  <div
                    key={reason}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    {reason}
                  </div>
                ))}
              </div>

              <Link
                href={`/empresas/${action.leadId}`}
                className="mt-4 block"
              >
                <Button
                  type="button"
                  variant={
                    isTopPriority
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  className="w-full"
                >
                  {action.ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}