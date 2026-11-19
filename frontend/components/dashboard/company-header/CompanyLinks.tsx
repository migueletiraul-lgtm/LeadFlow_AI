"use client";

import { ExternalLink, Globe, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Lead } from "@/lib/types";
import {
  normalizeInstagramUrl,
  normalizeWebsiteUrl,
  normalizeWhatsAppUrl,
} from "@/lib/lead-utils";

type CompanyLinksProps = {
  lead: Lead;
};

export default function CompanyLinks({
  lead,
}: CompanyLinksProps) {
  const hasWhatsApp = Boolean(lead.whatsapp?.trim());
  const hasInstagram = Boolean(lead.instagram?.trim());
  const hasWebsite = Boolean(lead.website?.trim());

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={
          hasWhatsApp
            ? normalizeWhatsAppUrl(lead.whatsapp as string)
            : undefined
        }
        target="_blank"
        rel="noreferrer"
        aria-disabled={!hasWhatsApp}
        className={
          !hasWhatsApp ? "pointer-events-none" : undefined
        }
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasWhatsApp}
          className="gap-1.5"
        >
          <MessageCircle className="h-4 w-4 text-emerald-600" />
          WhatsApp
        </Button>
      </a>

      <a
        href={
          hasInstagram
            ? normalizeInstagramUrl(lead.instagram as string)
            : undefined
        }
        target="_blank"
        rel="noreferrer"
        aria-disabled={!hasInstagram}
        className={
          !hasInstagram ? "pointer-events-none" : undefined
        }
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasInstagram}
          className="gap-1.5"
        >
          <ExternalLink className="h-4 w-4 text-violet-600" />
          Instagram
        </Button>
      </a>

      <a
        href={
          hasWebsite
            ? normalizeWebsiteUrl(lead.website as string)
            : undefined
        }
        target="_blank"
        rel="noreferrer"
        aria-disabled={!hasWebsite}
        className={
          !hasWebsite ? "pointer-events-none" : undefined
        }
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasWebsite}
          className="gap-1.5"
        >
          <Globe className="h-4 w-4 text-blue-600" />
          Site
        </Button>
      </a>
    </div>
  );
}
