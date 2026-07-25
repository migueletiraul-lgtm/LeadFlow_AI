"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  Copy,
  HelpCircle,
  Lightbulb,
  MessageCircle,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AISummaryCard from "@/components/intelligence/AISummaryCard";
import IntelligenceOverview from "@/components/intelligence/IntelligenceOverview";
import { getCompanyIntelligence } from "@/services/api";
import type {
  Lead,
  NextActionPriority,
  OpportunityIntelligenceResponse,
  PainPointSeverity,
} from "@/lib/types";

type LeadIntelligencePanelProps = {
  lead: Lead;
};

const SEVERITY_BADGE_STYLES: Record<
  PainPointSeverity,
  string
> = {
  "alta": "border-red-200 bg-red-50 text-red-700",
  "média": "border-amber-200 bg-amber-50 text-amber-700",
  "baixa": "border-slate-200 bg-slate-100 text-slate-700",
};

const PRIORITY_BADGE_STYLES: Record<
  NextActionPriority,
  string
> = {
  "alta": "border-red-200 bg-red-50 text-red-700",
  "média": "border-amber-200 bg-amber-50 text-amber-700",
  "baixa": "border-slate-200 bg-slate-100 text-slate-700",
};

function CardSection({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2">
        {icon}

        <div>
          <h4 className="font-semibold text-slate-950">
            {title}
          </h4>

          {subtitle && (
            <p className="mt-0.5 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function LeadIntelligencePanel({
  lead,
}: LeadIntelligencePanelProps) {
  const [intelligence, setIntelligence] =
    useState<OpportunityIntelligenceResponse | null>(
      null,
    );

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  const loadIntelligence = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await getCompanyIntelligence(
        lead.id,
      );

      setIntelligence(response);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Não foi possível carregar o diagnóstico.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [lead.id]);

  useEffect(() => {
    setCopyMessage("");
    loadIntelligence();
  }, [loadIntelligence]);

  async function handleCopyOpeningMessage() {
    if (!intelligence) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        intelligence.sales_strategy.opening_message,
      );

      setCopyMessage("Mensagem copiada com sucesso.");
    } catch {
      setCopyMessage(
        "Não foi possível copiar a mensagem.",
      );
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />

          <div>
            <h3 className="font-semibold text-slate-950">
              Opportunity Intelligence
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Diagnóstico automático de oportunidades
              comerciais para este lead.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => loadIntelligence()}
          disabled={isLoading}
          aria-label="Atualizar diagnóstico"
          title="Atualizar diagnóstico"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              isLoading ? "animate-spin" : ""
            }`}
          />
        </Button>
      </div>

      {isLoading && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-500" />

          <p className="mt-3 text-sm font-medium text-slate-600">
            Carregando diagnóstico...
          </p>
        </div>
      )}

      {!isLoading && error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadIntelligence()}
            className="mt-4"
          >
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      )}

      {!isLoading && !error && intelligence && (
        <div className="mt-6 space-y-4">
          <IntelligenceOverview
            opportunityScore={intelligence.opportunity.index}
            temperature={intelligence.opportunity.temperature}
            digitalHealth={intelligence.digital_health.score}
            digitalHealthLevel={intelligence.digital_health.level}
            businessStage={intelligence.business_evolution.stage}
            businessStageScore={intelligence.business_evolution.score}
            winProbabilityScore={intelligence.win_probability.score}
            winProbabilityConfidence={
              intelligence.win_probability.confidence
            }
          />

          <AISummaryCard summary={intelligence.digital_health.summary} />

          {intelligence.pain_points.length > 0 && (
            <CardSection
              title="Principais dores"
              subtitle="Pontos de atenção identificados na análise."
              icon={
                <AlertTriangle className="h-5 w-5 text-red-500" />
              }
            >
              <div className="space-y-3">
                {intelligence.pain_points.map(
                  (painPoint) => (
                    <div
                      key={painPoint.code}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-slate-900">
                          {painPoint.title}
                        </p>

                        <Badge
                          variant="outline"
                          className={
                            SEVERITY_BADGE_STYLES[
                              painPoint.severity
                            ]
                          }
                        >
                          {painPoint.severity}
                        </Badge>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {painPoint.description}
                      </p>

                      <p className="mt-2 text-xs italic text-slate-400">
                        Evidência: {painPoint.evidence}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </CardSection>
          )}

          {intelligence.recommended_services.length > 0 && (
            <CardSection
              title="Soluções recomendadas"
              subtitle="Ordenadas por prioridade."
              icon={
                <Lightbulb className="h-5 w-5 text-amber-500" />
              }
            >
              <div className="space-y-3">
                {intelligence.recommended_services
                  .slice()
                  .sort(
                    (a, b) => a.priority - b.priority,
                  )
                  .map((service) => (
                    <div
                      key={service.service}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-slate-900">
                          {service.service}
                        </p>

                        <Badge variant="outline">
                          Prioridade {service.priority}
                        </Badge>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {service.reason}
                      </p>

                      <p className="mt-2 text-xs font-medium text-emerald-700">
                        Resultado esperado:{" "}
                        {service.expected_result}
                      </p>
                    </div>
                  ))}
              </div>
            </CardSection>
          )}

          <CardSection
            title="Estratégia de vendas"
            icon={
              <MessageCircle className="h-5 w-5 text-blue-600" />
            }
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-slate-500">
                Melhor canal:
              </span>

              <Badge
                variant="outline"
                className="border-blue-200 bg-blue-50 text-blue-700"
              >
                {intelligence.sales_strategy.best_channel}
              </Badge>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {intelligence.sales_strategy.sales_angle}
            </p>

            <div className="mt-4">
              <p className="text-xs font-medium text-slate-500">
                Mensagem inicial sugerida
              </p>

              <div className="mt-2 whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {intelligence.sales_strategy.opening_message}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyOpeningMessage}
                >
                  <Copy className="h-4 w-4" />
                  Copiar mensagem
                </Button>

                {copyMessage && (
                  <p
                    className={`text-xs font-medium ${
                      copyMessage.includes("sucesso")
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {copyMessage}
                  </p>
                )}
              </div>
            </div>

            {intelligence.sales_strategy
              .probable_objections.length > 0 && (
              <div className="mt-5">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-slate-400" />

                  <p className="text-xs font-medium text-slate-500">
                    Objeções prováveis
                  </p>
                </div>

                <div className="mt-2 space-y-3">
                  {intelligence.sales_strategy.probable_objections.map(
                    (objection, index) => (
                      <div
                        key={`${objection.objection}-${index}`}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          &ldquo;{objection.objection}&rdquo;
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {objection.answer}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </CardSection>

          <CardSection
            title="Próxima ação"
            icon={
              <Target className="h-5 w-5 text-emerald-600" />
            }
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={
                  PRIORITY_BADGE_STYLES[
                    intelligence.next_action.priority
                  ]
                }
              >
                Prioridade {intelligence.next_action.priority}
              </Badge>
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-900">
              {intelligence.next_action.action}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {intelligence.next_action.reason}
            </p>
          </CardSection>
        </div>
      )}
    </section>
  );
}
