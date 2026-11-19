# LeadFlow AI — Beta Checklist

Checklist de prontidão para o beta fechado. Itens marcados com contexto já conhecido vêm do estado real do código; os demais são pontos a validar antes do lançamento.

---

## UX

- [ ] Conectar `AppShell` (sidebar colapsável, header, drawer mobile) ao `app/page.tsx` — hoje ele existe mas ainda não substituiu o `DashboardLayout` em produção.
- [ ] Conectar `DashboardHome`/`DashboardProvider` a dados reais (`getBestLeads`, `getExecutiveDashboard`) — hoje roda inteiramente sobre dados de demonstração (`lib/demo/demo-data.ts`).
- [ ] Validar se o usuário entende, sem explicação, a diferença entre "Opportunity Score", "Digital Health" e "Win Probability" no painel do lead.
- [ ] Revisar a ordem de leitura do Drawer do lead: saúde digital → dores → soluções → estratégia → próxima ação — confirmar que faz sentido para quem nunca usou o produto.
- [ ] Definir o fluxo real de onboarding (`docs/product/ONBOARDING.md`) em telas de verdade — hoje é só especificação.
- [ ] Decidir se `DemoBanner` deve aparecer por padrão em contas novas antes de haver dados reais.

## Performance

- [ ] Validar tempo de resposta de `GET /companies/{id}/intelligence` e `GET /executive-dashboard` com uma base grande de empresas (o Executive Dashboard hoje recalcula os motores de IA para cada empresa a cada chamada, sem cache).
- [ ] Verificar se `build_opportunity_intelligence` recalculado por empresa no `/executive-dashboard` não vira gargalo quando o número de leads crescer (hoje limitado a `limit` do `get_best_leads`, default 100).
- [ ] Medir o tempo de carregamento inicial do dashboard com o número real de componentes premium (múltiplos cards com blur/backdrop) em dispositivos mais fracos.
- [ ] Confirmar que `frontend/lib/api.ts` (versão antiga, duplicada de `services/api.ts`) não está sendo importada em nenhum lugar — código morto que pode confundir manutenção futura.

## Copy

- [ ] Revisar todo texto gerado pelos motores (Sales Coach, objeções, mensagens de abertura) com um vendedor real — hoje é 100% regra determinística, nunca testado com usuário final.
- [ ] Padronizar termos em português vs. inglês nos nomes de métricas (ex.: "Opportunity Score" e "Chance de Fechamento" aparecem lado a lado em telas diferentes).
- [ ] Revisar mensagens de erro do frontend ("Não foi possível carregar o diagnóstico.") — confirmar que orientam uma próxima ação clara.
- [ ] Confirmar que nenhum texto afirma faturamento ou resultado garantido (princípio do LEADFLOW_OS: nunca inventar dado financeiro da empresa prospectada).

## Responsiveness

- [ ] Testar `LeadIntelligencePanel` e o Drawer em telas pequenas (o drawer ocupa `max-w-xl`, mas ainda não foi validado em mobile real).
- [ ] Testar os cards premium (`AIInsights`, `LeadFlowCopilotCard`, `AIRecommendationCard`, `AIFocusCard`, `DecisionCard`, `ActionCenterCard`) em telas entre 320px e 768px — grids `sm:grid-cols-2`/`sm:grid-cols-3` precisam de checagem visual real, não só de código.
- [ ] Testar o `MobileNavDrawer` (Sheet lateral) em iOS Safari, onde comportamento de drawer/scroll costuma divergir do Chrome.
- [ ] Verificar truncamento de nomes longos de empresa em `PriorityLeadCard`, `NextBestActionCard` e `ActionCenterCard`.

## Accessibility

- [ ] Auditar contraste de texto sobre os cards escuros (`bg-[#071426]`) — várias combinações usam `text-slate-300`/`text-slate-400`, que podem ficar abaixo do mínimo AA em telas mal calibradas.
- [ ] Adicionar `aria-label`/texto acessível nos botões de ícone que hoje dependem só do ícone (ex.: botão de copiar mensagem, refresh do painel de inteligência).
- [ ] Testar navegação por teclado no `DropdownMenu` (usuário, notificações, seletor de workspace) e no `Sheet` de navegação mobile.
- [ ] Confirmar que o seletor de status nativo em `ActionCenterCard` tem rótulo associado corretamente para leitores de tela (já usa `<label>`, validar com NVDA/VoiceOver).

## Bugs

- [ ] `components/ui/dialog.tsx` e `components/ui/sheet.tsx` usam `size="icon-sm"` no botão de fechar, variante que não existe em `buttonVariants` (`default`/`sm`/`lg`/`icon`) — erro de tipo presente desde antes desta sprint, nunca corrigido.
- [ ] Tokens de tema `bg-popover`, `text-muted-foreground`, `bg-accent`, `border-input` (usados por `dropdown-menu.tsx`, `select.tsx`, `sheet.tsx`) não têm nenhuma definição em `globals.css` (sem bloco `@theme` mapeando essas variáveis) — risco real de popups/menus renderizarem sem fundo visível.
- [ ] `react-hooks/set-state-in-effect` aparece em ~10 arquivos (leitura de `localStorage`/tema/dados no mount) — comportamento correto para SSR, mas vale documentar a exceção para não ser "corrigido" incorretamente no futuro.
- [ ] `LeadAIRecommendation.tsx` está vazio e não é renderizado em lugar nenhum — decidir entre remover de vez ou reaproveitar.
- [ ] Confirmar que `frontend/components/layout/Sidebar.tsx` e `Header.tsx` (não usados por `DashboardLayout.tsx`) não geram confusão para quem for mexer no layout depois.

## Polish

- [ ] Unificar o visual dos cards "premium" (fundo `#071426`) com os cards claros (`Card`/`CardContent` do shadcn) — hoje o dashboard mistura os dois estilos sem uma regra clara de quando usar cada um.
- [ ] Adicionar favicon/branding consistente (hoje ainda é o ícone padrão do Next.js em `app/favicon.ico`).
- [ ] Revisar espaçamento vertical entre seções do dashboard (`space-y-6`) com o conteúdo real do `DashboardHome` completo, incluindo `NextBestActionCard`/`DecisionCard`, que ainda não foram encaixados na composição principal.
- [ ] Ativar o dark mode de fato: hoje o toggle existe (`AppShell`), mas nenhuma página real usa `AppShell`, então o modo escuro nunca foi visto rodando.
- [ ] Preencher os documentos ainda vazios (`docs/engineering/ARCHITECTURE.md`, `AI.md`, `CHANGELOG.md`, `docs/product/ROADMAP.md`, `PRICING.md`, `SALES.md`, `docs/brand/BRAND.md`, `VISION.md`, `prompts/*.md`) antes de compartilhar a documentação externamente.
