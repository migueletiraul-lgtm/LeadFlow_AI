"use client";

import type {
  DragEvent,
  MouseEvent,
} from "react";

import {
  Building2,
  ExternalLink,
  Eye,
  Globe,
  GripVertical,
  MapPin,
  MessageCircle,
  Star,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Lead } from "@/lib/types";

type KanbanCardProps = {
  lead: Lead;
  onOpen: (lead: Lead) => void;
  onDragStart: (lead: Lead) => void;
  isDragging?: boolean;
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
    .replace(
      /^https?:\/\/(www\.)?instagram\.com\//i,
      "",
    )
    .replace(/^@/, "")
    .replace(/\/+$/, "");

  return `https://instagram.com/${username}`;
}

function normalizeWhatsAppUrl(whatsapp: string) {
  const phone = whatsapp.replace(/\D/g, "");

  return `https://wa.me/${phone}`;
}

function getScoreClasses(score: number) {
  if (score >= 80) {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (score >= 60) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-700";
}

function getScoreIndicatorClasses(score: number) {
  if (score >= 80) {
    return "bg-red-500";
  }

  if (score >= 60) {
    return "bg-amber-500";
  }

  return "bg-slate-400";
}

function getScoreLabel(score: number) {
  if (score >= 80) {
    return "Muito quente";
  }

  if (score >= 60) {
    return "Quente";
  }

  return "Regular";
}

function getCompanyInitial(name: string) {
  const normalizedName = name.trim();

  if (!normalizedName) {
    return "E";
  }

  return normalizedName
    .charAt(0)
    .toLocaleUpperCase("pt-BR");
}

export default function KanbanCard({
  lead,
  onOpen,
  onDragStart,
  isDragging = false,
}: KanbanCardProps) {
  const hasWebsite = Boolean(
    lead.website?.trim(),
  );

  const hasInstagram = Boolean(
    lead.instagram?.trim(),
  );

  const hasWhatsApp = Boolean(
    lead.whatsapp?.trim(),
  );

  function handleDragStart(
    event: DragEvent<HTMLDivElement>,
  ) {
    event.dataTransfer.effectAllowed = "move";

    event.dataTransfer.setData(
      "text/plain",
      String(lead.id),
    );

    onDragStart(lead);
  }

  function stopCardClick(
    event: MouseEvent<HTMLElement>,
  ) {
    event.stopPropagation();
  }

  function handleOpenButton(
    event: MouseEvent<HTMLButtonElement>,
  ) {
    event.stopPropagation();
    onOpen(lead);
  }

  return (
    <article
      draggable
      onDragStart={handleDragStart}
      onClick={() => onOpen(lead)}
      className={`group relative cursor-grab overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg active:cursor-grabbing ${
        isDragging
          ? "scale-[0.98] opacity-40 shadow-none"
          : ""
      }`}
    >
      <div
        className={`absolute inset-y-0 left-0 w-1 ${getScoreIndicatorClasses(
          lead.lead_score,
        )}`}
      />

      <div className="p-4 pl-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 text-sm font-bold text-blue-700 ring-1 ring-blue-100">
            {getCompanyInitial(lead.name)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3
                  className="line-clamp-2 text-sm font-bold leading-5 text-slate-950"
                  title={lead.name}
                >
                  {lead.name}
                </h3>

                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <Building2 className="h-3.5 w-3.5 shrink-0" />

                  <span className="truncate capitalize">
                    {lead.niche ||
                      "Nicho não informado"}
                  </span>
                </div>
              </div>

              <GripVertical className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:text-slate-500" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />

            <span className="truncate">
              {lead.city ||
                "Cidade não informada"}
              {lead.state
                ? `/${lead.state}`
                : ""}
            </span>
          </div>

          <Badge
            variant="outline"
            className={`shrink-0 font-bold ${getScoreClasses(
              lead.lead_score,
            )}`}
          >
            {lead.lead_score}
          </Badge>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge
            variant="outline"
            className="bg-white text-xs font-medium text-slate-700"
          >
            {getScoreLabel(
              lead.lead_score,
            )}
          </Badge>

          {!hasWebsite && (
            <Badge className="border border-red-100 bg-red-50 text-xs font-medium text-red-700 hover:bg-red-50">
              Sem site
            </Badge>
          )}

          {!hasInstagram && (
            <Badge className="border border-violet-100 bg-violet-50 text-xs font-medium text-violet-700 hover:bg-violet-50">
              Sem Instagram
            </Badge>
          )}

          {!hasWhatsApp && (
            <Badge className="border border-slate-200 bg-slate-50 text-xs font-medium text-slate-600 hover:bg-slate-50">
              Sem WhatsApp
            </Badge>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
            <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400" />

            <span className="font-semibold text-slate-700">
              {lead.google_rating ??
                "Sem nota"}
            </span>

            {lead.google_reviews !== null &&
              lead.google_reviews !==
                undefined && (
                <span className="truncate text-slate-400">
                  ({lead.google_reviews})
                </span>
              )}
          </div>

          <div className="flex items-center gap-0.5">
            {lead.whatsapp && (
              <a
                href={normalizeWhatsAppUrl(
                  lead.whatsapp,
                )}
                target="_blank"
                rel="noreferrer"
                title="Abrir WhatsApp"
                aria-label={`Abrir WhatsApp de ${lead.name}`}
                onClick={stopCardClick}
              >
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-lg hover:bg-emerald-50"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-600" />
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
                onClick={stopCardClick}
              >
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-lg hover:bg-blue-50"
                >
                  <Globe className="h-4 w-4 text-blue-600" />
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
                onClick={stopCardClick}
              >
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-lg hover:bg-violet-50"
                >
                  <ExternalLink className="h-4 w-4 text-violet-600" />
                </Button>
              </a>
            )}

            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-lg hover:bg-slate-100"
              title="Abrir detalhes do lead"
              aria-label={`Abrir detalhes de ${lead.name}`}
              onClick={handleOpenButton}
            >
              <Eye className="h-4 w-4 text-slate-600" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}