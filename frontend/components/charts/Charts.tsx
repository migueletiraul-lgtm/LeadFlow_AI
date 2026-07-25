import type { Lead } from "@/lib/types";

import CityChart from "./CityChart";
import ScoreChart from "./ScoreChart";
import SegmentChart from "./SegmentChart";

type ChartsProps = {
  leads: Lead[];
};

export default function Charts({ leads }: ChartsProps) {
  return (
    <section className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <ScoreChart leads={leads} />
        <CityChart leads={leads} />
      </div>

      <SegmentChart leads={leads} />
    </section>
  );
}