"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, MessageCircle, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Lead, NextAction } from "@/lib/types";
import {
  buildWhatsAppUrl,
  NEXT_ACTION_PRIORITY_STYLES,
} from "@/lib/lead-utils";

type NextActionBarProps = {
  lead: Lead;
  nextAction: NextAction;
};

export default function NextActionBar({
  lead,
  nextAction,
}: NextActionBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    const barElement = barRef.current;

    if (!barElement) {
      return;
    }

    function reportHeight() {
      if (!barElement) {
        return;
      }

      document.documentElement.style.setProperty(
        "--next-action-bar-height",
        `${barElement.offsetHeight}px`,
      );
    }

    reportHeight();

    const resizeObserver = new ResizeObserver(
      reportHeight,
    );

    resizeObserver.observe(barElement);

    return () => {
      resizeObserver.disconnect();

      document.documentElement.style.removeProperty(
        "--next-action-bar-height",
      );
    };
  }, []);

  const hasWhatsApp = Boolean(lead.whatsapp?.trim());

  const whatsappUrl = hasWhatsApp
    ? buildWhatsAppUrl(
        lead.whatsapp as string,
        nextAction.action,
      )
    : null;

  async function handleCopyAction() {
    try {
      await navigator.clipboard.writeText(
        nextAction.action,
      );

      setCopyMessage("Ação copiada.");
    } catch {
      setCopyMessage("Não foi possível copiar a ação.");
    }
  }

  return (
    <div
      ref={barRef}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-8 lg:pl-[280px]"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Target className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-slate-950">
                {nextAction.action}
              </p>

              <Badge
                variant="outline"
                className={
                  NEXT_ACTION_PRIORITY_STYLES[
                    nextAction.priority
                  ]
                }
              >
                Prioridade {nextAction.priority}
              </Badge>
            </div>

            <p className="mt-1 truncate text-sm text-slate-500">
              {nextAction.reason}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {copyMessage && (
            <p className="text-xs font-medium text-slate-500">
              {copyMessage}
            </p>
          )}

          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Button type="button">
                <MessageCircle className="h-4 w-4" />
                Agir agora
              </Button>
            </a>
          ) : (
            <Button
              type="button"
              onClick={handleCopyAction}
            >
              <Copy className="h-4 w-4" />
              Copiar ação
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
