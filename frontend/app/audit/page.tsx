import AuditFlow from "@/components/audit/AuditFlow";

export const metadata = {
  title: "Auditoria | LeadFlow IA",
  description:
    "Descubra em 60 segundos onde sua empresa está perdendo clientes com a auditoria inteligente do LeadFlow IA.",
};

export default function AuditPage() {
  return (
    <main className="min-h-screen px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col">
        <AuditFlow />
      </div>
    </main>
  );
}
