"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CompanyActions() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link href="/audit">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
        >
          <ShieldCheck className="h-4 w-4 text-amber-600" />
          Auditoria
        </Button>
      </Link>
    </div>
  );
}
