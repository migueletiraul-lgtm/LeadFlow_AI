"use client";

import {
  Bell,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const NOTIFICATIONS = [
  {
    id: 1,
    title: "Novo lead de alta prioridade",
    description: "Clínica Boa Vista entrou como oportunidade quente.",
  },
  {
    id: 2,
    title: "Follow-up pendente",
    description: "3 leads aguardam retorno hoje.",
  },
];

type AppHeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onOpenMobileNav: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
};

export default function AppHeader({
  search,
  onSearchChange,
  onOpenMobileNav,
  isDarkMode,
  onToggleDarkMode,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex flex-col gap-4 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 md:flex-row md:items-center md:justify-between lg:px-8">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onOpenMobileNav}
          aria-label="Abrir menu de navegação"
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            Dashboard
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gerencie e priorize suas melhores oportunidades.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden w-72 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar empresa..."
            className="h-10 pl-9"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onToggleDarkMode}
          aria-label={
            isDarkMode
              ? "Ativar tema claro"
              : "Ativar tema escuro"
          }
          title={
            isDarkMode
              ? "Ativar tema claro"
              : "Ativar tema escuro"
          }
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Notificações"
          >
            <Bell className="h-5 w-5" />

            {NOTIFICATIONS.length > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-80 bg-white p-2 dark:bg-slate-900"
          >
            <DropdownMenuLabel className="flex items-center justify-between px-2 py-1.5">
              Notificações

              <Badge variant="outline">
                {NOTIFICATIONS.length} novas
              </Badge>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {NOTIFICATIONS.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex-col items-start gap-0.5 rounded-lg px-3 py-2"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {notification.title}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {notification.description}
                </p>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
            aria-label="Menu do usuário"
          >
            RC
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 bg-white p-1 dark:bg-slate-900"
          >
            <DropdownMenuLabel className="px-2 py-1.5">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Raul Migueleti
              </p>
              <p className="text-xs font-normal text-slate-500 dark:text-slate-400">
                raul@leadflow.ai
              </p>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-2">
              <User className="h-4 w-4" />
              Meu perfil
            </DropdownMenuItem>

            <DropdownMenuItem className="gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
