"use client";

import { Bell, Menu, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type HeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function Header({
  search,
  onSearchChange,
}: HeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b bg-white px-5 py-4 md:flex-row md:items-center md:justify-between lg:px-8">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="lg:hidden"
        >
          <Menu className="size-5" />
        </Button>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Dashboard
          </h2>
          <p className="text-sm text-slate-500">
            Gerencie e priorize suas melhores oportunidades.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden w-72 md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar empresa..."
            className="pl-9"
          />
        </div>

        <Button type="button" variant="outline" size="icon">
          <Bell className="size-5" />
        </Button>

        <div className="flex size-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
          RC
        </div>
      </div>
    </header>
  );
}