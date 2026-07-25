# LeadFlow AI — Onboarding UI

Especificação de interface para o quiz de DNA Comercial. Consome `GET`/`PUT /seller-profile`. Segue o Princípio de UX do LEADFLOW_OS: uma pergunta por tela, progresso visível, linguagem simples, edição posterior liberada.

---

## Estrutura geral

- Rota: `/onboarding` (fluxo em tela cheia, fora do layout padrão do dashboard).
- Componentes reutilizados: `Card`/`CardHeader`/`CardContent` (shadcn/ui), `Button`, `Badge`.
- Estilo: Tailwind, mesmo padrão visual do drawer de leads — cartões `rounded-2xl border border-slate-200 bg-white`, acentos em `blue-600`, textos de apoio em `slate-500`.

---

## Barra de progresso

- Fixa no topo do card, acima da pergunta atual.
- Formato: `Passo X de 8` + barra preenchida (`h-2 rounded-full bg-slate-100`, preenchimento `bg-blue-500`).
- Botão "Pular" disponível em toda pergunta (todos os campos são opcionais).

---

## Tela de pergunta (padrão, repetida por questão)

1. Título da pergunta (`text-xl font-bold text-slate-950`).
2. Subtexto curto explicando por que a resposta importa (`text-sm text-slate-500`), conteúdo vindo de `docs/product/ONBOARDING_QUESTIONS.md`.
3. Campo de resposta, variando por tipo:
   - Múltipla escolha + livre (`offered_services`, `target_niches`, `sales_channels`): chips selecionáveis (`Badge` clicável) + input de texto para adicionar opção própria.
   - Texto curto (`average_ticket_range`, `daily_prospecting_time`, `communication_style`): input de texto único.
   - Número (`monthly_goal`): input numérico com placeholder de exemplo.
   - Texto livre (`main_sales_challenge`): textarea curta (2–3 linhas).
4. Rodapé com "Voltar" (exceto na primeira tela) e "Continuar" (ou "Pular").

---

## Tela final: resumo do DNA Comercial

- Título: "Seu LeadFlow está personalizado".
- Cards de resumo (reaproveitando `MetricCard`/`SectionCard` do painel de inteligência): nichos priorizados, soluções principais, canal preferido, meta comercial.
- Texto de transparência: deixa claro que a personalização é feita por regras determinísticas, não por um modelo treinado.
- CTA final: "Ver meus primeiros leads" → redireciona para o dashboard (`/`).

---

## Estados

- Carregando: mesmo padrão do restante do app (ícone `RefreshCw` girando + texto "Carregando...").
- Erro ao salvar (`PUT /seller-profile`): bloco vermelho com mensagem e botão "Tentar novamente", igual ao padrão já usado no `LeadIntelligencePanel`.
- Todas as respostas são salvas incrementalmente a cada "Continuar", nunca só no final — para não perder progresso se o usuário sair no meio.
