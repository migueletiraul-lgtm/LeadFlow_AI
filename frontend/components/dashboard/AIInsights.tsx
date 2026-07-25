import {
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Globe2,
  Lightbulb,
  MessageCircle,
  Send,
  Star,
  Target,
} from "lucide-react";

import type { Lead } from "@/lib/types";

type AIInsightsProps = {
  leads: Lead[];
};

function normalizeStatus(
  status: string | null | undefined,
) {
  return (
    status?.trim().toLocaleLowerCase("pt-BR") ??
    "novo"
  );
}

export default function AIInsights({
  leads,
}: AIInsightsProps) {
  const totalLeads = leads.length;

  const hotLeads = leads.filter(
    (lead) => lead.lead_score >= 80,
  ).length;

  const withoutWebsite = leads.filter(
    (lead) => !lead.website?.trim(),
  ).length;

  const highRatedLeads = leads.filter(
    (lead) =>
      typeof lead.google_rating === "number" &&
      lead.google_rating >= 4.5,
  ).length;

  const newLeads = leads.filter(
    (lead) =>
      normalizeStatus(lead.status) === "novo",
  ).length;

  const contactedLeads = leads.filter(
    (lead) =>
      normalizeStatus(lead.status) ===
      "contatado",
  ).length;

  const respondedLeads = leads.filter(
    (lead) =>
      normalizeStatus(lead.status) ===
      "respondeu",
  ).length;

  const meetingLeads = leads.filter(
    (lead) =>
      normalizeStatus(lead.status) ===
      "reunião",
  ).length;

  const proposalLeads = leads.filter(
    (lead) =>
      normalizeStatus(lead.status) ===
      "proposta",
  ).length;

  const clients = leads.filter(
    (lead) =>
      normalizeStatus(lead.status) ===
      "cliente",
  ).length;

  const lostLeads = leads.filter(
    (lead) =>
      normalizeStatus(lead.status) ===
      "perdido",
  ).length;

  const activeLeads = leads.filter(
    (lead) =>
      normalizeStatus(lead.status) !==
        "cliente" &&
      normalizeStatus(lead.status) !==
        "perdido",
  );

  const bestLead = [...activeLeads].sort(
    (firstLead, secondLead) =>
      secondLead.lead_score -
      firstLead.lead_score,
  )[0];

  const responseRate =
    contactedLeads + respondedLeads > 0
      ? Math.round(
          (respondedLeads /
            (contactedLeads +
              respondedLeads)) *
            100,
        )
      : 0;

  const conversionRate =
    totalLeads > 0
      ? Math.round(
          (clients / totalLeads) * 100,
        )
      : 0;

  const insights = [
    {
      title: `${newLeads} leads aguardando contato`,
      description:
        newLeads > 0
          ? "Ainda existem oportunidades na base que não receberam nenhuma abordagem."
          : "Todos os leads da base já avançaram para alguma etapa comercial.",
      icon: Target,
      iconClasses:
        "bg-orange-50 text-orange-600",
    },
    {
      title: `${contactedLeads} aguardando resposta`,
      description:
        contactedLeads > 0
          ? "Esses leads podem entrar em uma estratégia de follow-up para aumentar a taxa de resposta."
          : "Não há leads parados na etapa de primeiro contato.",
      icon: Send,
      iconClasses:
        "bg-blue-50 text-blue-600",
    },
    {
      title: `${respondedLeads} leads engajados`,
      description:
        respondedLeads > 0
          ? "Leads que responderam devem ser priorizados para avançar para reunião ou proposta."
          : "Ainda não há leads registrados como respondidos.",
      icon: MessageCircle,
      iconClasses:
        "bg-cyan-50 text-cyan-600",
    },
  ];

  let recommendation =
    "Continue alimentando sua base e priorize os leads com maior score comercial.";

  if (proposalLeads > 0) {
    recommendation =
      `Você tem ${proposalLeads} ${
        proposalLeads === 1
          ? "proposta em andamento"
          : "propostas em andamento"
      }. Priorize o acompanhamento desses leads para aumentar as chances de fechamento.`;
  } else if (meetingLeads > 0) {
    recommendation =
      `Existem ${meetingLeads} ${
        meetingLeads === 1
          ? "lead em reunião"
          : "leads em reunião"
      }. Concentre-se em entender a necessidade do cliente e conduzir essas oportunidades para uma proposta.`;
  } else if (respondedLeads > 0) {
    recommendation =
      `Você tem ${respondedLeads} ${
        respondedLeads === 1
          ? "lead que respondeu"
          : "leads que responderam"
      }. Priorize esses contatos agora e tente avançá-los para uma reunião.`;
  } else if (contactedLeads > 0) {
    recommendation =
      `Há ${contactedLeads} ${
        contactedLeads === 1
          ? "lead aguardando resposta"
          : "leads aguardando resposta"
      }. Faça um follow-up curto e personalizado antes de buscar novos contatos.`;
  } else if (newLeads > 0) {
    recommendation =
      `Você ainda tem ${newLeads} ${
        newLeads === 1
          ? "lead novo"
          : "leads novos"
      }. Comece pelos leads com score mais alto e sem website para aumentar a chance de resposta.`;
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-[#071426] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl" />

      <div className="relative z-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
              <BrainCircuit className="h-4 w-4" />
              Inteligência comercial
            </div>

            <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
              Insights comerciais do LeadFlow
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              O LeadFlow analisou {totalLeads}{" "}
              {totalLeads === 1
                ? "empresa"
                : "empresas"}{" "}
              e identificou os principais pontos de atenção do seu pipeline.
            </p>
          </div>

          <div className="min-w-[240px] rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
            <p className="text-xs font-medium text-slate-400">
              Melhor oportunidade ativa
            </p>

            <p className="mt-2 text-lg font-bold text-white">
              {bestLead?.name ??
                "Nenhum lead disponível"}
            </p>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />

              <span>
                Score{" "}
                {bestLead?.lead_score ?? 0}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {insights.map((insight) => {
            const Icon = insight.icon;

            return (
              <article
                key={insight.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/10"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${insight.iconClasses}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-5 text-base font-semibold text-white">
                  {insight.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {insight.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Globe2 className="h-4 w-4" />
              <span className="text-xs">
                Sem website
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold">
              {withoutWebsite}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Star className="h-4 w-4" />
              <span className="text-xs">
                Muito quentes
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold">
              {hotLeads}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs">
                Taxa de conversão
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold">
              {conversionRate}%
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Clock3 className="h-4 w-4" />
              <span className="text-xs">
                Taxa de resposta
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold">
              {responseRate}%
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-200">
            <Lightbulb className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Próxima ação recomendada
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-300">
              {recommendation}
            </p>

            {lostLeads > 0 && (
              <p className="mt-2 text-xs text-slate-400">
                Existem também {lostLeads}{" "}
                {lostLeads === 1
                  ? "lead marcado como perdido"
                  : "leads marcados como perdidos"}{" "}
                na base.
              </p>
            )}

            {highRatedLeads > 0 && (
              <p className="mt-2 text-xs text-slate-400">
                {highRatedLeads}{" "}
                {highRatedLeads === 1
                  ? "empresa possui"
                  : "empresas possuem"}{" "}
                nota Google 4,5 ou superior, um bom argumento para personalizar suas abordagens.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}