import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SectionCardProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
};

export default function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: SectionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-blue-600" />}

          <div>
            <CardTitle>{title}</CardTitle>

            {description && (
              <p className="mt-1 text-sm text-slate-500">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  );
}
