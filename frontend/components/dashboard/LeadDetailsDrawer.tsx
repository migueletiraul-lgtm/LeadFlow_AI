"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Globe,
  MessageCircle,
  Sparkles,
  Target,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Lead } from "@/lib/types";
import LeadTimeline from "./drawer/LeadTimeline";
import LeadInteractionForm from "./drawer/LeadInteractionForm";
import LeadHeader from "./drawer/LeadHeader";
import LeadIntelligencePanel from "./drawer/LeadIntelligencePanel";
import LeadPipelineStage from "./drawer/LeadPipelineStage";
import LeadScoreCard from "./drawer/LeadScoreCard";

type LeadDetailsDrawerProps = {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onLeadUpdated?: (lead: Lead) => void;
};


function normalizeWebsiteUrl(website: string) {
  const value = website.trim();

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  return `https://${value}`;
}

function normalizeInstagramUrl(instagram: string) {
  const username = instagram
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/\/+$/, "");

  return `https://instagram.com/${username}`;
}

function generateLocalApproach(
  lead: Lead,
  variation: number,
) {
  const companyName =
    lead.name?.trim() || "sua empresa";
  const niche =
    lead.niche?.trim() || "seu segmento";
  const city = lead.city?.trim();

  const hasWebsite = Boolean(
    lead.website?.trim(),
  );
  const hasInstagram = Boolean(
    lead.instagram?.trim(),
  );
  const rating = lead.google_rating;
  const score = lead.lead_score;

  const locationText = city
    ? `, de ${city}`
    : "";

  const ratingCompliment =
    rating !== null &&
    rating !== undefined &&
    rating >= 4.5
      ? `Também vi que vocês têm uma ótima avaliação no Google (${rating}), o que mostra que o trabalho de vocês já é bem reconhecido pelos clientes.`
      : rating !== null &&
          rating !== undefined &&
          rating >= 4
        ? `Vi também que vocês têm uma boa avaliação no Google (${rating}), o que é um ponto positivo para fortalecer ainda mais a presença digital da empresa.`
        : "";

  const digitalOpportunity = !hasWebsite
    ? "Percebi que vocês ainda não possuem um site próprio. Acredito que existe uma boa oportunidade de apresentar os serviços de forma mais profissional, facilitar o contato e transformar pesquisas no Google em novos clientes."
    : "Vi que vocês já possuem presença online. Ainda assim, existem oportunidades de melhorar a apresentação dos serviços, facilitar o contato e criar páginas mais focadas em transformar visitantes em novos clientes.";

  const presenceOpportunity =
    !hasWebsite && !hasInstagram
      ? "Como a presença digital ainda parece estar pouco estruturada, um site simples e profissional pode ser um ótimo primeiro passo para dar mais credibilidade e facilitar que novos clientes encontrem vocês."
      : !hasInstagram
        ? "Uma presença digital mais integrada também pode ajudar a empresa a ser encontrada com mais facilidade e passar ainda mais confiança para novos clientes."
        : "";

  const priorityCta =
    score >= 80
      ? "Se fizer sentido, posso montar uma ideia rápida e personalizada para vocês, sem compromisso. Posso te mostrar?"
      : score >= 60
        ? "Posso te mostrar uma sugestão rápida de como isso poderia funcionar para vocês?"
        : "Faria sentido eu te enviar uma ideia simples de como melhorar essa presença online?";

  const openings = [
    `Olá! Tudo bem? Meu nome é Raul e encontrei a ${companyName}${locationText} enquanto pesquisava empresas do segmento de ${niche}.`,
    `Oi! Tudo bem? Estava pesquisando empresas de ${niche}${city ? ` em ${city}` : ""} e encontrei a ${companyName}.`,
    `Olá! Tudo certo? Conheci a ${companyName}${locationText} enquanto analisava negócios do segmento de ${niche} na região.`,
    `Oi! Tudo bem? Dei uma olhada na presença digital da ${companyName}${locationText} e achei interessante entrar em contato.`,
  ];

  const serviceTexts = [
    "Eu trabalho com criação de sites e páginas focadas em apresentar o negócio de forma profissional e gerar mais oportunidades de contato.",
    "Meu trabalho é ajudar empresas a terem uma presença online mais profissional, com sites e páginas pensadas para facilitar o contato de novos clientes.",
    "Eu desenvolvo sites e páginas comerciais com foco em credibilidade, apresentação dos serviços e geração de novos contatos.",
    "Trabalho criando soluções digitais simples e profissionais para empresas que querem melhorar sua presença online e facilitar a chegada de novos clientes.",
  ];

  const variationIndex =
    Math.abs(variation) % openings.length;

  const paragraphs = [
    openings[variationIndex],
  ];

  if (ratingCompliment) {
    paragraphs.push(ratingCompliment);
  }

  paragraphs.push(digitalOpportunity);

  if (presenceOpportunity) {
    paragraphs.push(presenceOpportunity);
  }

  paragraphs.push(
    serviceTexts[variationIndex],
  );

  paragraphs.push(priorityCta);

  return paragraphs.join("\n\n");
}

type OpportunityInsight = {
  title: string;
  description: string;
  points?: string;
  tone: "high" | "medium" | "positive";
};

function getOpportunityInsights(
  lead: Lead,
): OpportunityInsight[] {
  const insights: OpportunityInsight[] = [];

  const hasWebsite = Boolean(
    lead.website?.trim(),
  );
  const hasInstagram = Boolean(
    lead.instagram?.trim(),
  );

  if (!hasWebsite) {
    insights.push({
      title: "Não possui site",
      description:
        "Alta oportunidade para oferecer criação de site ou landing page profissional.",
      points: "+25",
      tone: "high",
    });
  }

  if (!hasInstagram) {
    insights.push({
      title: "Sem Instagram identificado",
      description:
        "A presença digital pode estar pouco estruturada, abrindo espaço para uma solução mais completa.",
      points: "+20",
      tone: "high",
    });
  }

  if (
    lead.google_reviews !== null &&
    lead.google_reviews !== undefined
  ) {
    if (lead.google_reviews < 20) {
      insights.push({
        title: "Poucas avaliações no Google",
        description:
          "A empresa ainda possui pouca prova social e pode se beneficiar de uma presença digital mais forte.",
        points: "+15",
        tone: "medium",
      });
    } else if (lead.google_reviews < 100) {
      insights.push({
        title: "Volume moderado de avaliações",
        description:
          "Existe espaço para fortalecer autoridade e presença online.",
        points: "+8",
        tone: "medium",
      });
    }
  }

  if (
    lead.google_rating !== null &&
    lead.google_rating !== undefined
  ) {
    if (lead.google_rating >= 4.5) {
      insights.push({
        title: "Excelente reputação no Google",
        description:
          `Nota ${lead.google_rating} é um ponto forte que pode ser usado na abordagem comercial.`,
        tone: "positive",
      });
    } else if (lead.google_rating < 4.2) {
      insights.push({
        title: "Reputação digital pode melhorar",
        description:
          `A nota ${lead.google_rating} indica uma oportunidade de fortalecer confiança e posicionamento online.`,
        points: "+15",
        tone: "medium",
      });
    } else {
      insights.push({
        title: "Boa avaliação no Google",
        description:
          `Nota ${lead.google_rating} demonstra uma base positiva para fortalecer a presença digital.`,
        tone: "positive",
      });
    }
  }

  if (lead.lead_score >= 80) {
    insights.push({
      title: "Lead de alta prioridade",
      description:
        "O score indica uma oportunidade comercial muito quente. Vale priorizar o contato.",
      tone: "high",
    });
  } else if (lead.lead_score >= 60) {
    insights.push({
      title: "Boa oportunidade comercial",
      description:
        "O score indica um lead quente e com bom potencial para prospecção.",
      tone: "medium",
    });
  }

  if (insights.length === 0) {
    insights.push({
      title: "Presença digital estruturada",
      description:
        "Não foram identificadas lacunas evidentes. A abordagem pode focar em otimização e conversão.",
      tone: "positive",
    });
  }

  return insights;
}


function buildWhatsAppUrl(whatsapp: string, message: string) {
  const phone = whatsapp.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export default function LeadDetailsDrawer({
  lead,
  open,
  onClose,
  onLeadUpdated,
}: LeadDetailsDrawerProps) {
  const [approachMessage, setApproachMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [approachVariation, setApproachVariation] = useState(0);

  useEffect(() => {
    if (lead) {
      setApproachMessage("");
      setCopyMessage("");
      setApproachVariation(0);
    }
  }, [lead]);

  function handleGenerateApproach() {
    if (!lead) {
      return;
    }

    const nextVariation =
      approachMessage === ""
        ? 0
        : approachVariation + 1;

    setApproachMessage(
      generateLocalApproach(
        lead,
        nextVariation,
      ),
    );

    setApproachVariation(nextVariation);
    setCopyMessage("");
  }

  async function handleCopyApproach() {
    if (!approachMessage) {
      return;
    }

    try {
      await navigator.clipboard.writeText(approachMessage);
      setCopyMessage("Mensagem copiada com sucesso.");
    } catch {
      setCopyMessage("Não foi possível copiar a mensagem.");
    }
  }

  if (!open || !lead) {
    return null;
  }

  const whatsappApproachUrl =
    lead.whatsapp && approachMessage
      ? buildWhatsAppUrl(lead.whatsapp, approachMessage)
      : null;

  const opportunityInsights =
    getOpportunityInsights(lead);

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Fechar detalhes do lead"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl">
        <div className="relative border-b border-slate-200 bg-slate-50 px-6 py-6">
          <LeadHeader lead={lead} />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Fechar painel de detalhes"
            className="absolute right-8 top-8 z-10 bg-white/80 shadow-sm backdrop-blur hover:bg-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          <LeadIntelligencePanel lead={lead} />

          <LeadScoreCard lead={lead} />

          <LeadPipelineStage
            lead={lead}
            onLeadUpdated={onLeadUpdated}
          />

          <div className="rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />

              <div>
                <h3 className="font-semibold text-slate-950">
                  Oportunidades identificadas
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Análise automática dos principais sinais deste lead.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {opportunityInsights.map(
                (insight, index) => (
                  <div
                    key={`${insight.title}-${index}`}
                    className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mt-0.5">
                      {insight.tone ===
                      "positive" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Target
                          className={
                            insight.tone ===
                            "high"
                              ? "h-5 w-5 text-red-500"
                              : "h-5 w-5 text-amber-500"
                          }
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-slate-900">
                          {insight.title}
                        </p>

                        {insight.points && (
                          <Badge variant="outline">
                            {insight.points} pontos
                          </Badge>
                        )}
                      </div>

                      <p className="mt-1 text-sm leading-5 text-slate-600">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-950">
              Contatos
            </h3>

            <div className="mt-4 flex flex-wrap gap-2">
              {lead.whatsapp && (
                <a
                  href={`https://wa.me/${lead.whatsapp.replace(
                    /\D/g,
                    "",
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Abrir WhatsApp de ${lead.name}`}
                >
                  <Button
                    type="button"
                    variant="outline"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </Button>
                </a>
              )}

              {lead.website && (
                <a
                  href={normalizeWebsiteUrl(
                    lead.website,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Abrir website de ${lead.name}`}
                >
                  <Button
                    type="button"
                    variant="outline"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </Button>
                </a>
              )}

              {lead.instagram && (
                <a
                  href={normalizeInstagramUrl(
                    lead.instagram,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Abrir Instagram de ${lead.name}`}
                >
                  <Button
                    type="button"
                    variant="outline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Instagram
                  </Button>
                </a>
              )}
            </div>
          </div>


          <LeadTimeline companyId={lead.id} />

          <LeadInteractionForm companyId={lead.id} />

          <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-950">
                    Abordagem com IA
                  </h3>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Gere uma primeira mensagem personalizada para este lead.
                </p>
              </div>

              <Button
                type="button"
                onClick={handleGenerateApproach}
              >
                <Sparkles className="h-4 w-4" />
                {approachMessage
                  ? "Gerar novamente"
                  : "Gerar abordagem"}
              </Button>
            </div>

            {approachMessage && (
              <div className="mt-5 space-y-4">
                <textarea
                  value={approachMessage}
                  onChange={(event) => {
                    setApproachMessage(event.target.value);
                    setCopyMessage("");
                  }}
                  rows={10}
                  aria-label="Mensagem de abordagem"
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopyApproach}
                  >
                    <Copy className="h-4 w-4" />
                    Copiar mensagem
                  </Button>

                  {whatsappApproachUrl && (
                    <a
                      href={whatsappApproachUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button type="button">
                        <MessageCircle className="h-4 w-4" />
                        Abrir no WhatsApp
                      </Button>
                    </a>
                  )}
                </div>

                {copyMessage && (
                  <p className="text-xs font-medium text-emerald-600">
                    {copyMessage}
                  </p>
                )}

                {!lead.whatsapp && (
                  <p className="text-xs text-slate-500">
                    Este lead não possui WhatsApp cadastrado. Você ainda pode copiar a mensagem manualmente.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}