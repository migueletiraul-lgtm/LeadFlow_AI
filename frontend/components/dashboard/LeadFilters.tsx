"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

type LeadTableControlsProps = {
  search: string;
  niche: string;
  city: string;
  minimumScore: string;
  niches: string[];
  cities: string[];
  onSearchChange: (value: string) => void;
  onNicheChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onMinimumScoreChange: (value: string) => void;
  onClear: () => void;
};

export default function LeadTableControls({
  search,
  niche,
  city,
  minimumScore,
  niches,
  cities,
  onSearchChange,
  onNicheChange,
  onCityChange,
  onMinimumScoreChange,
  onClear,
}: LeadTableControlsProps) {
  const hasFilters =
    search !== "" ||
    niche !== "" ||
    city !== "" ||
    minimumScore !== "";

  return (
    <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar empresa, nicho ou cidade..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
        </div>

        <select
          value={niche}
          onChange={(event) => onNicheChange(event.target.value)}
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400"
        >
          <option value="">Todos os nichos</option>

          {niches.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={city}
          onChange={(event) => onCityChange(event.target.value)}
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400"
        >
          <option value="">Todas as cidades</option>

          {cities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={minimumScore}
          onChange={(event) =>
            onMinimumScoreChange(event.target.value)
          }
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400"
        >
          <option value="">Qualquer score</option>
          <option value="40">Score mínimo 40</option>
          <option value="60">Score mínimo 60</option>
          <option value="70">Score mínimo 70</option>
          <option value="80">Score mínimo 80</option>
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <X className="h-4 w-4" />
            Limpar
          </button>
        )}
      </div>
    </div>
  );
}