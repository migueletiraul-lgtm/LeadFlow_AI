import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

type MetricCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  subtitle?: string;
};

export default function MetricCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}: MetricCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <Icon className={`h-4 w-4 ${color}`} />
          {title}
        </div>
      </CardHeader>

      <CardContent>
        <p className={`text-3xl font-black tracking-tight ${color}`}>
          {value}
        </p>

        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
