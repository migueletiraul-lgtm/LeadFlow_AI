import SectionCard from "@/components/intelligence/SectionCard";

type AISummaryCardProps = {
  summary: string;
};

export default function AISummaryCard({
  summary,
}: AISummaryCardProps) {
  return (
    <SectionCard
      title="Resumo da IA"
      description="Diagnóstico executivo deste lead."
    >
      <p className="text-sm leading-6 text-slate-600">{summary}</p>
    </SectionCard>
  );
}
