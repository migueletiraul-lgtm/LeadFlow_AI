"use client";

import {
  BarChart3,
  Building2,
  LayoutDashboard,
  Settings,
  Target,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Empresas",
    href: "/leads",
    icon: Building2,
  },
  {
    label: "Melhores leads",
    href: "/best-leads",
    icon: Target,
  },
  {
    label: "Indicadores",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Configurações",
    href: "/settings",
    icon: Settings,
  },
];

function isItemActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

type NavListProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function NavList({
  collapsed = false,
  onNavigate,
}: NavListProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1.5">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isItemActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              collapsed ? "justify-center px-0" : ""
            } ${
              active
                ? "bg-blue-600 text-white shadow-lg shadow-blue-950/20"
                : "text-slate-300 hover:bg-white/10 hover:text-white dark:text-slate-400"
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" />

            {!collapsed && item.label}
          </Link>
        );
      })}
    </nav>
  );
}
