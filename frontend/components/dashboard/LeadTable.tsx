"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownAZ,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  ExternalLink,
  Flame,
  Globe,
  MessageCircle,
  Search,
  Target,
  Timer,
  Trophy,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import LeadDetailsDrawer from "./LeadDetailsDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Lead } from "@/lib/types";

type LeadTableProps = {
  leads: Lead[];
  onLeadUpdated?: (lead: Lead) => void;
};

type SortMode =
  | "priority"
  | "score-desc"
  | "score-asc"
  | "name";

type PriorityFilter =
  | ""
  | "approach-now"
  | "medium"
  | "follow-up"
  | "converted"
  | "closed";

type LeadPriority =
  | "approach-now"
  | "medium"
  | "follow-up"
  | "converted"
  | "closed";

type LeadPriorityInfo = {
  value: LeadPriority;
  label: string;
  rank: number;
  badgeClasses: string;
  rowClasses: string;
  icon: typeof Flame;
};

function normalizePipelineStage(
  pipelineStage: string | null | undefined,
) {
  return (
    pipelineStage
      ?.trim()
      .toLocaleLowerCase("pt-BR") ??
    "novo lead"
  );
}

function getLeadPriority(
  lead: Lead,
): LeadPriorityInfo {
  const pipelineStage = normalizePipelineStage(
    lead.pipeline_stage,
  );
  const hasWebsite = Boolean(
    lead.website?.trim(),
  );

  if (pipelineStage === "cliente") {
    return {
      value: "converted",
      label: "Convertido",
      rank: 4,
      badgeClasses:
        "border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
      rowClasses:
        "bg-emerald-50/30 hover:bg-emerald-50/60",
      icon: Trophy,
    };
  }

  if (pipelineStage === "perdido") {
    return {
      value: "closed",
      label: "Encerrado",
      rank: 5,
      badgeClasses:
        "border-transparent bg-slate-200 text-slate-700 hover:bg-slate-200",
      rowClasses:
        "bg-slate-50/70 hover:bg-slate-100",
      icon: X,
    };
  }

  if (
    pipelineStage === "contato iniciado" ||
    pipelineStage === "resposta recebida" ||
    pipelineStage === "reunião" ||
    pipelineStage === "proposta enviada" ||
    pipelineStage === "negociação"
  ) {
    return {
      value: "follow-up",
      label: "Em acompanhamento",
      rank: 3,
      badgeClasses:
        "border-transparent bg-blue-100 text-blue-700 hover:bg-blue-100",
      rowClasses:
        "bg-blue-50/30 hover:bg-blue-50/60",
      icon: Timer,
    };
  }

  if (
    lead.lead_score >= 80 &&
    !hasWebsite
  ) {
    return {
      value: "approach-now",
      label: "Abordar agora",
      rank: 1,
      badgeClasses:
        "border-transparent bg-red-100 text-red-700 hover:bg-red-100",
      rowClasses:
        "bg-red-50/30 hover:bg-red-50/60",
      icon: Flame,
    };
  }

  return {
    value: "medium",
    label: "Prioridade média",
    rank: 2,
    badgeClasses:
      "border-transparent bg-amber-100 text-amber-700 hover:bg-amber-100",
    rowClasses:
      "bg-amber-50/20 hover:bg-amber-50/50",
    icon: Target,
  };
}

function getPipelineBadgeClasses(
  pipelineStage: string | null | undefined,
) {
  const normalizedStage =
    normalizePipelineStage(pipelineStage);

  if (normalizedStage === "cliente") {
    return "border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
  }

  if (normalizedStage === "perdido") {
    return "border-transparent bg-slate-200 text-slate-700 hover:bg-slate-200";
  }

  if (
    normalizedStage === "proposta enviada" ||
    normalizedStage === "negociação"
  ) {
    return "border-transparent bg-violet-100 text-violet-700 hover:bg-violet-100";
  }

  if (
    normalizedStage === "resposta recebida" ||
    normalizedStage === "reunião"
  ) {
    return "border-transparent bg-blue-100 text-blue-700 hover:bg-blue-100";
  }

  if (normalizedStage === "contato iniciado") {
    return "border-transparent bg-cyan-100 text-cyan-700 hover:bg-cyan-100";
  }

  return "border-transparent bg-amber-100 text-amber-700 hover:bg-amber-100";
}

function getPriorityBadge(lead: Lead) {
  const priority = getLeadPriority(lead);
  const Icon = priority.icon;

  return (
    <Badge className={priority.badgeClasses}>
      <Icon className="mr-1 h-3.5 w-3.5" />
      {priority.label}
    </Badge>
  );
}

function getScoreBadge(score: number) {
  if (score >= 80) {
    return (
      <Badge className="border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
        {score} • Muito quente
      </Badge>
    );
  }

  if (score >= 60) {
    return (
      <Badge className="border-transparent bg-amber-100 text-amber-700 hover:bg-amber-100">
        {score} • Quente
      </Badge>
    );
  }

  return (
    <Badge variant="secondary">
      {score} • Regular
    </Badge>
  );
}

function normalizeText(value: string | null | undefined) {
  return value?.trim().toLocaleLowerCase("pt-BR") ?? "";
}

function normalizeWebsiteUrl(website: string) {
  const normalizedWebsite = website.trim();

  if (
    normalizedWebsite.startsWith("http://") ||
    normalizedWebsite.startsWith("https://")
  ) {
    return normalizedWebsite;
  }

  return `https://${normalizedWebsite}`;
}

function normalizeInstagramUrl(instagram: string) {
  const username = instagram
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/\/+$/, "");

  return `https://instagram.com/${username}`;
}

export default function LeadTable({
  leads,
  onLeadUpdated,
}: LeadTableProps) {
  const router = useRouter();

  const [localLeads, setLocalLeads] =
    useState<Lead[]>(leads);

  useEffect(() => {
    setLocalLeads(leads);
  }, [leads]);

  const [sortMode, setSortMode] =
    useState<SortMode>("priority");

  const [search, setSearch] = useState("");
  const [niche, setNiche] = useState("");
  const [city, setCity] = useState("");
  const [minimumScore, setMinimumScore] = useState("");
  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilter>("");
  const [pipelineFilter, setPipelineFilter] =
    useState("");

  // Lead atualmente selecionado para exibição no drawer.
  const [selectedLead, setSelectedLead] =
    useState<Lead | null>(null);

  // Controla a abertura e o fechamento do drawer.
  const [drawerOpen, setDrawerOpen] =
    useState(false);

  function handleOpenLead(lead: Lead) {
    router.push(`/empresas/${lead.id}`);
  }

  function handleCloseDrawer() {
    setDrawerOpen(false);
    setSelectedLead(null);
  }
function handleLeadUpdated(updatedLead: Lead) {
  setLocalLeads((currentLeads) =>
    currentLeads.map((lead) =>
      lead.id === updatedLead.id
        ? updatedLead
        : lead,
    ),
  );

  setSelectedLead(updatedLead);

  onLeadUpdated?.(updatedLead);
}
  useEffect(() => {
    if (!selectedLead) {
      return;
    }

    const refreshedLead = localLeads.find(
      (lead) => lead.id === selectedLead.id,
    );

    if (
      refreshedLead &&
      refreshedLead !== selectedLead
    ) {
      setSelectedLead(refreshedLead);
    }
  }, [localLeads, selectedLead]);

  const niches = useMemo(() => {
    return Array.from(
      new Set(
        localLeads
          .map((lead) => lead.niche?.trim())
          .filter(
            (value): value is string =>
              Boolean(value),
          ),
      ),
    ).sort((first, second) =>
      first.localeCompare(second, "pt-BR"),
    );
  }, [localLeads]);

  const cities = useMemo(() => {
    return Array.from(
      new Set(
        localLeads
          .map((lead) => lead.city?.trim())
          .filter(
            (value): value is string =>
              Boolean(value),
          ),
      ),
    ).sort((first, second) =>
      first.localeCompare(second, "pt-BR"),
    );
  }, [localLeads]);

  const filteredAndSortedLeads = useMemo(() => {
    const normalizedSearch =
      normalizeText(search);

    const parsedMinimumScore =
      minimumScore === ""
        ? 0
        : Number(minimumScore);

    const filteredLeads = localLeads.filter(
      (lead) => {
        const searchableContent = [
          lead.name,
          lead.niche,
          lead.city,
          lead.state,
          lead.pipeline_stage,
          getLeadPriority(lead).label,
        ]
          .map(normalizeText)
          .join(" ");

        const matchesSearch =
          normalizedSearch === "" ||
          searchableContent.includes(
            normalizedSearch,
          );

        const matchesNiche =
          niche === "" ||
          normalizeText(lead.niche) ===
            normalizeText(niche);

        const matchesCity =
          city === "" ||
          normalizeText(lead.city) ===
            normalizeText(city);

        const matchesMinimumScore =
          lead.lead_score >=
          parsedMinimumScore;

        const matchesPriority =
          priorityFilter === "" ||
          getLeadPriority(lead).value ===
            priorityFilter;

        const matchesPipeline =
          pipelineFilter === "" ||
          normalizePipelineStage(
            lead.pipeline_stage,
          ) ===
            normalizePipelineStage(
              pipelineFilter,
            );

        return (
          matchesSearch &&
          matchesNiche &&
          matchesCity &&
          matchesMinimumScore &&
          matchesPriority &&
          matchesPipeline
        );
      },
    );

    const result = [...filteredLeads];

    if (sortMode === "priority") {
      return result.sort(
        (first, second) => {
          const priorityDifference =
            getLeadPriority(first).rank -
            getLeadPriority(second).rank;

          if (priorityDifference !== 0) {
            return priorityDifference;
          }

          return (
            second.lead_score -
            first.lead_score
          );
        },
      );
    }

    if (sortMode === "score-asc") {
      return result.sort(
        (first, second) =>
          first.lead_score -
          second.lead_score,
      );
    }

    if (sortMode === "name") {
      return result.sort(
        (first, second) =>
          first.name.localeCompare(
            second.name,
            "pt-BR",
          ),
      );
    }

    return result.sort(
      (first, second) =>
        second.lead_score -
        first.lead_score,
    );
  }, [
    localLeads,
    search,
    niche,
    city,
    minimumScore,
    priorityFilter,
    pipelineFilter,
    sortMode,
  ]);

  const hasFilters =
    search.trim() !== "" ||
    niche !== "" ||
    city !== "" ||
    minimumScore !== "" ||
    priorityFilter !== "" ||
    pipelineFilter !== "";

  function clearFilters() {
    setSearch("");
    setNiche("");
    setCity("");
    setMinimumScore("");
    setPriorityFilter("");
    setPipelineFilter("");
  }

  return (
    <>
      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>
                Melhores oportunidades
              </CardTitle>

              <p className="mt-1 text-sm text-slate-500">
                {filteredAndSortedLeads.length} de{" "}
                {localLeads.length} leads exibidos
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant={
                  sortMode === "priority"
                    ? "secondary"
                    : "ghost"
                }
                size="sm"
                onClick={() =>
                  setSortMode("priority")
                }
              >
                <Target className="h-4 w-4" />
                Prioridade comercial
              </Button>

              <Button
                type="button"
                variant={
                  sortMode === "score-desc"
                    ? "secondary"
                    : "ghost"
                }
                size="sm"
                onClick={() =>
                  setSortMode("score-desc")
                }
              >
                <ArrowDownWideNarrow className="h-4 w-4" />
                Maior score
              </Button>

              <Button
                type="button"
                variant={
                  sortMode === "score-asc"
                    ? "secondary"
                    : "ghost"
                }
                size="sm"
                onClick={() =>
                  setSortMode("score-asc")
                }
              >
                <ArrowUpWideNarrow className="h-4 w-4" />
                Menor score
              </Button>

              <Button
                type="button"
                variant={
                  sortMode === "name"
                    ? "secondary"
                    : "ghost"
                }
                size="sm"
                onClick={() =>
                  setSortMode("name")
                }
              >
                <ArrowDownAZ className="h-4 w-4" />
                Empresa
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Pesquisar empresa, cidade, nicho ou etapa do pipeline..."
              aria-label="Pesquisar leads"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
            <select
              value={niche}
              onChange={(event) =>
                setNiche(
                  event.target.value,
                )
              }
              aria-label="Filtrar por nicho"
              className="h-11 min-w-44 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">
                Todos os nichos
              </option>

              {niches.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

            <select
              value={city}
              onChange={(event) =>
                setCity(
                  event.target.value,
                )
              }
              aria-label="Filtrar por cidade"
              className="h-11 min-w-44 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">
                Todas as cidades
              </option>

              {cities.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

            <select
              value={minimumScore}
              onChange={(event) =>
                setMinimumScore(
                  event.target.value,
                )
              }
              aria-label="Filtrar por score mínimo"
              className="h-11 min-w-40 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">
                Qualquer score
              </option>
              <option value="40">
                Score 40+
              </option>
              <option value="60">
                Score 60+
              </option>
              <option value="70">
                Score 70+
              </option>
              <option value="80">
                Score 80+
              </option>
            </select>

            <select
              value={pipelineFilter}
              onChange={(event) =>
                setPipelineFilter(event.target.value)
              }
              aria-label="Filtrar por etapa do pipeline"
              className="h-11 min-w-48 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">
                Todas as etapas
              </option>
              <option value="Novo Lead">
                Novo Lead
              </option>
              <option value="Contato iniciado">
                Contato iniciado
              </option>
              <option value="Resposta recebida">
                Resposta recebida
              </option>
              <option value="Reunião">
                Reunião
              </option>
              <option value="Proposta enviada">
                Proposta enviada
              </option>
              <option value="Negociação">
                Negociação
              </option>
              <option value="Cliente">
                Cliente
              </option>
              <option value="Perdido">
                Perdido
              </option>
            </select>

            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(
                  event.target
                    .value as PriorityFilter,
                )
              }
              aria-label="Filtrar por prioridade"
              className="h-11 min-w-48 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">
                Todas as prioridades
              </option>
              <option value="approach-now">
                Abordar agora
              </option>
              <option value="medium">
                Prioridade média
              </option>
              <option value="follow-up">
                Em acompanhamento
              </option>
              <option value="converted">
                Convertidos
              </option>
              <option value="closed">
                Encerrados
              </option>
            </select>

            {hasFilters && (
              <Button
                type="button"
                variant="outline"
                onClick={clearFilters}
                className="h-11"
              >
                <X className="h-4 w-4" />
                Limpar filtros
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  Empresa
                </TableHead>

                <TableHead>
                  Nicho
                </TableHead>

                <TableHead>
                  Cidade
                </TableHead>

                <TableHead>
                  Score
                </TableHead>

                <TableHead>
                  Pipeline
                </TableHead>

                <TableHead>
                  Prioridade
                </TableHead>

                <TableHead className="text-right">
                  Contato
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredAndSortedLeads.length ===
              0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center"
                  >
                    <p className="font-semibold text-slate-700">
                      Nenhum lead encontrado
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Ajuste a pesquisa ou os
                      filtros para visualizar
                      outros resultados.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedLeads.map(
                  (lead) => (
                    <TableRow
                      key={lead.id}
                      onClick={() =>
                        handleOpenLead(
                          lead,
                        )
                      }
                      className={`cursor-pointer transition-colors ${
                        getLeadPriority(
                          lead,
                        ).rowClasses
                      }`}
                    >
                      <TableCell>
                        <div>
                          <Link
                            href={`/empresas/${lead.id}`}
                            onClick={(event) =>
                              event.stopPropagation()
                            }
                            className="font-semibold text-slate-900 hover:text-blue-700 hover:underline"
                          >
                            {lead.name}
                          </Link>

                          <p className="mt-1 text-xs text-slate-500">
                            Nota Google:{" "}
                            {lead.google_rating ??
                              "Não informada"}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="capitalize">
                        {lead.niche ||
                          "Não informado"}
                      </TableCell>

                      <TableCell>
                        {lead.city ||
                          "Não informada"}

                        {lead.state
                          ? `/${lead.state}`
                          : ""}
                      </TableCell>

                      <TableCell>
                        {getScoreBadge(
                          lead.lead_score,
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge
                          className={getPipelineBadgeClasses(
                            lead.pipeline_stage,
                          )}
                        >
                          {lead.pipeline_stage ||
                            "Novo Lead"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {getPriorityBadge(lead)}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          {lead.whatsapp && (
                            <a
                              href={`https://wa.me/${lead.whatsapp.replace(
                                /\D/g,
                                "",
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              title="Abrir WhatsApp"
                              aria-label={`Abrir WhatsApp de ${lead.name}`}
                              onClick={(
                                event,
                              ) =>
                                event.stopPropagation()
                              }
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                              >
                                <MessageCircle className="h-4 w-4" />
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
                              title="Abrir website"
                              aria-label={`Abrir website de ${lead.name}`}
                              onClick={(
                                event,
                              ) =>
                                event.stopPropagation()
                              }
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                              >
                                <Globe className="h-4 w-4" />
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
                              title="Abrir Instagram"
                              aria-label={`Abrir Instagram de ${lead.name}`}
                              onClick={(
                                event,
                              ) =>
                                event.stopPropagation()
                              }
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </a>
                          )}

                          <Link
                            href={`/empresas/${lead.id}`}
                            onClick={(event) =>
                              event.stopPropagation()
                            }
                          >
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="Ver detalhes"
                              aria-label={`Ver detalhes de ${lead.name}`}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ),
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <LeadDetailsDrawer
        lead={selectedLead}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        onLeadUpdated={handleLeadUpdated}
      />
    </>
  );
}