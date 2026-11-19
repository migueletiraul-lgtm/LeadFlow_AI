# LeadFlow — Audit Spec

Especificação de execução para o **LeadFlow Audit**, a oferta de entrada definida em `LEADFLOW_BIBLE/01_MARKET/GoToMarket.md` (seção 4): o mesmo motor de Opportunity Intelligence já existente (`LEADFLOW_OS.md`, Módulos Premium — LeadFlow AI Report™), empacotado como primeira experiência, sem exigir contrato nem configuração completa do DNA Comercial.

Este documento não cria produto novo — descreve como a capacidade já existente deve ser exposta como Audit. Onde uma decisão de execução ainda não foi validada, ela está marcada como **[Hipótese não validada]**.

---

## 1. Audit Objective

Provar, na primeira interação, a diferença central do LeadFlow: entregar diagnóstico, dores com evidência, soluções recomendadas e estratégia de abordagem prontos para uma empresa real — não uma lista ou um score isolado. O Audit existe para quebrar a objeção mais crítica do ICP ("isso é só mais uma lista", `ICP.md`, seção 11) antes de qualquer pedido de compromisso.

## 2. Target User

Definido em `ICP.md` e priorizado em `GoToMarket.md` (Beachhead Market): o Operador Solo de Crescimento Digital, começando pelos sub-segmentos Freelancers e Consultores Comerciais. O Audit é rodado por essa pessoa sobre uma empresa real que ela já conhece (um cliente dela ou um concorrente que ela acompanha) — o usuário do Audit e a empresa analisada nunca são a mesma pessoa.

## 3. Entry Inputs

**[Hipótese não validada]** Formulário mínimo de entrada, sem necessidade de login:

- Nome da empresa a ser analisada.
- Cidade/estado (para contexto de nicho local).
- Pelo menos um sinal público de presença digital (site, Instagram ou perfil do Google) — sem esse mínimo, o Audit não tem evidência suficiente para rodar (ver seção 12, Failure States).

Nenhum dado pessoal do dono da empresa analisada é solicitado — apenas sinais públicos de negócio, consistente com Privacy and Data Restraint (`ProductPrinciples.md`, princípio 7).

## 4. Analysis Stages

Sequência real dos motores já implementados (`LEADFLOW_OS.md`, Motores Inteligentes), na ordem em que são executados:

1. **Digital Health Engine** — avalia site, Instagram, WhatsApp, nota e avaliações do Google.
2. **Pain Engine** — identifica dores com evidência associada, nunca inventadas.
3. **Opportunity Engine** — calcula o Opportunity Index e a temperatura do lead.
4. **Solution Engine** — cruza as dores com o catálogo de soluções, respeitando prioridade e exclusividade entre soluções concorrentes (ex.: Landing Page vs. Site Institucional).
5. **Business Evolution** — traduz o resultado em estágio de maturidade digital e roadmap de até 5 passos.
6. **Sales Coach** — gera canal ideal, argumento comercial, mensagem inicial e objeções prováveis.
7. **Win Probability** — estima chance de fechamento e confiança da estimativa.

## 5. Loading Experience

**[Hipótese não validada]** Seguir o padrão já estabelecido no produto (`LeadIntelligencePanel`, estado de carregamento com texto "Carregando diagnóstico..."), adaptado ao Audit com mensagens que acompanham as etapas da seção 4 (ex.: "Analisando presença digital...", "Identificando dores...", "Montando estratégia..."), para que a espera comunique profundidade de análise em vez de parecer um carregamento genérico.

Tempo de carregamento deve respeitar o princípio de Time to Value (`ProductPrinciples.md`, princípio 2): qualquer espera perceptível como "longa" é um risco a ser medido e reduzido, não uma característica aceitável do Audit.

## 6. Output Sections

O relatório final do Audit apresenta, nesta ordem, o mesmo conteúdo já retornado pelo motor de Opportunity Intelligence:

1. **Resumo executivo** — saúde digital, nível e resumo em linguagem natural.
2. **Opportunity Index** — índice, temperatura e confiança da análise.
3. **Principais dores** — cada uma com título, gravidade, evidência e impacto.
4. **Soluções recomendadas** — até 5, ordenadas por prioridade, com motivo e resultado esperado.
5. **Estratégia de abordagem** — melhor canal, argumento comercial, mensagem inicial e objeções prováveis com resposta.
6. **Estágio de evolução do negócio** — estágio atual e roadmap recomendado.
7. **Chance de fechamento** — score, confiança, motivos e riscos.

## 7. Scoring Model

Três scores compõem o Audit, todos em escala 0–100, todos já existentes no produto:

- **Digital Health Score** — combinação ponderada de presença digital (site, Instagram, WhatsApp) e reputação (nota e volume de avaliações do Google).
- **Opportunity Index** — combinação entre o potencial comercial identificado e a lacuna de presença digital detectada.
- **Win Probability Score** — combinação entre o Opportunity Index, a saúde digital, a gravidade das dores encontradas e o quanto as soluções recomendadas já fazem parte do que o usuário do Audit vende (quando o DNA Comercial já existe).

**[Hipótese não validada]** Quando o Audit é rodado sem DNA Comercial configurado (usuário ainda não cadastrado), o alinhamento de oferta é tratado como neutro — nenhuma solução aparece marcada como "já oferecida", o que é esperado e não deve ser lido como uma falha do relatório.

## 8. Evidence Shown

Cada dor listada no Audit exibe sua evidência de origem (ex.: "Nenhum site informado no cadastro da empresa.", "Apenas 4 avaliações registradas no Google."), nunca uma afirmação sem lastro. Onde não há dado suficiente, o relatório usa linguagem condicional ("possível oportunidade", "recomenda-se validar"), nunca uma afirmação categórica — consistente com Evidence Over Assumptions (`ProductPrinciples.md`, princípio 6).

## 9. Recommendations

Até 5 soluções, ordenadas por prioridade, cada uma com motivo e resultado esperado — nunca uma sugestão solta. Quando o usuário já tem DNA Comercial configurado, soluções que ele já vende são priorizadas; soluções fora do seu catálogo aparecem apenas como complementares, nunca como oferta principal (regra já validada do produto).

## 10. CTA

Ao final do relatório gratuito, a chamada para ação segue o Audit-Selling Workflow (`GoToMarket.md`, seção 8): convidar o usuário a testar o mesmo diagnóstico com os próprios leads dele, avançando para uma Discovery Call ou diretamente para o Pilot Program. O CTA nunca pede pagamento neste ponto — pede apenas o próximo passo de conversa.

## 11. Free vs Paid Boundary

**[Hipótese não validada — nenhum documento de preço existe hoje.]** Nenhuma fronteira entre gratuito e pago está validada ou definida em qualquer documento existente (`docs/product/PRICING.md` está vazio). O único fato estabelecido é que o Audit, como oferta de entrada (`GoToMarket.md`, seção 4), é gratuito e sem compromisso.

Como ponto de partida a validar, não como decisão tomada: o Audit gratuito poderia se limitar a uma única empresa por vez, sem histórico salvo; uso contínuo sobre a própria carteira de leads do usuário seria o que caracteriza o produto pago. Essa fronteira precisa ser validada com os primeiros 10 clientes (`GoToMarket.md`, seção 15) antes de virar regra.

## 12. Failure States

- **Empresa não identificável** — input insuficiente para rodar qualquer motor (nenhum sinal público de presença digital informado): o Audit não deve gerar um relatório vazio ou inventado; deve informar que não há dado suficiente e pedir mais um sinal de identificação.
- **Empresa com presença digital mínima** — não é uma falha do sistema, é um resultado real: o relatório deve mostrar digital health baixo e dores de alta gravidade, exatamente como o motor já faz hoje.
- **Falha técnica genérica** — segue o padrão já existente no produto: mensagem de erro clara e botão de "Tentar novamente", nunca uma tela em branco.
- **Catálogo de soluções indisponível** — o produto já possui fallback determinístico para esse cenário (motor legado de recomendação); o Audit deve herdar esse comportamento sem expor o usuário a uma falha visível.

## 13. Privacy Rules

Aplicação direta de Privacy and Data Restraint (`ProductPrinciples.md`, princípio 7) ao contexto específico do Audit:

- Apenas dados públicos sobre o negócio analisado são usados (site, Instagram, Google, WhatsApp comercial) — nunca dado pessoal de indivíduos.
- Como a empresa analisada não é, necessariamente, cliente do LeadFlow, toda dor é apresentada em tom consultivo e não pejorativo (ex.: "possível oportunidade de melhoria", nunca linguagem que exponha ou constranja o negócio analisado).
- Nenhum dado do Audit é compartilhado publicamente (conteúdo, ver `GoToMarket.md`, seção 18) sem anonimização — apenas a mecânica do relatório pode ser usada como exemplo, nunca a empresa real analisada.

## 14. Success Metrics

Alinhados ao funil já definido em `GoToMarket.md` (seção 14 e 20); nenhum valor abaixo é resultado real, apenas o que deve ser instrumentado:

- Tempo entre o envio do input e a entrega do relatório (Time to Value).
- Taxa de Audits que geram resposta do prospect (`GoToMarket.md`, KPIs).
- Taxa de Audits que avançam para Discovery Call.
- Proporção de relatórios com pelo menos uma dor de alta gravidade identificada (indicador de que o Audit está sendo rodado sobre empresas com oportunidade real, não aleatórias).

**[Hipótese não validada]** Nenhuma meta numérica é fixada aqui; segue a mesma regra de `GoToMarket.md` (seção 20) — metas só depois de baseline real.

## 15. Acceptance Criteria

O Audit está pronto para uso quando, verificavelmente:

- [ ] Todo relatório gerado contém as 7 seções da seção 6, sem exceção.
- [ ] Nenhuma dor aparece sem evidência associada (Explainable AI, `ProductPrinciples.md`, princípio 4).
- [ ] No máximo 5 soluções recomendadas, ordenadas por prioridade, nunca Landing Page e Site Institucional juntas.
- [ ] Todos os três scores (Digital Health, Opportunity Index, Win Probability) estão sempre entre 0 e 100.
- [ ] Existe um CTA claro ao final do relatório, sem pedido de pagamento.
- [ ] Existe um estado de carregamento visível durante o processamento.
- [ ] Existem estados de falha definidos para: input insuficiente, falha técnica genérica e indisponibilidade do catálogo de soluções.
- [ ] Nenhum dado pessoal é coletado sobre indivíduos — apenas sinais públicos de negócio.
- [ ] Nenhuma dor ou recomendação usa linguagem categórica quando a evidência é insuficiente — usa linguagem condicional.
