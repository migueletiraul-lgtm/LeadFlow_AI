export default function Sidebar() {
  return (
    <aside className="min-h-screen w-64 bg-slate-900 p-6 text-white">
      <h2 className="mb-8 text-xl font-bold">LeadFlow IA</h2>

      <nav className="space-y-4">
        <p>Dashboard</p>
        <p>Empresas</p>
        <p>Melhores Leads</p>
        <p>Exportar Excel</p>
      </nav>
    </aside>
  );
}