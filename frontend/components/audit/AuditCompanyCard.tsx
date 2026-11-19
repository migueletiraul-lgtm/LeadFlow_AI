import { AtSign, Building2, Globe, MapPin } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuditCompanyCardProps = {
  name: string;
  website: string | null;
  instagram: string | null;
  city: string;
  state: string;
};

export default function AuditCompanyCard({
  name,
  website,
  instagram,
  city,
  state,
}: AuditCompanyCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Building2 className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <CardTitle className="truncate text-lg text-slate-950">
              {name}
            </CardTitle>

            <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {city}, {state}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
            <Globe className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="truncate">
              {website ?? "Website não identificado"}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
            <AtSign className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="truncate">
              {instagram ?? "Instagram não identificado"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
