# LeadFlow — Operating System

Este documento define como o time de LeadFlow trabalha no dia a dia. Ele não redefine posicionamento, valores ou público — esses já estão fixados em `LEADFLOW_OS.md`, `docs/rfc/RFC-001_LEADFLOW_VISION.md` e `docs/brand/POSITIONING.md`. Aqui, a pergunta é operacional: como transformamos essa visão em execução consistente, semana após semana.

---

## Purpose

Garantir que toda decisão de produto, engenharia e prospecção do próprio LeadFlow siga o mesmo padrão de rigor que o produto promete entregar aos seus usuários: nunca inventar, sempre validar com evidência, e nunca gerar trabalho que não aumente conversão ou produtividade.

Este documento existe para que qualquer pessoa nova no time saiba, sem perguntar, como uma ideia vira uma funcionalidade em produção.

## Decision Principles

Toda decisão de produto ou engenharia é filtrada pelos princípios já fixados em `LEADFLOW_OS.md`:

1. Nunca inventar informação — decidir com base em evidência, não em achismo.
2. Vender/entregar soluções, nunca funcionalidades soltas sem propósito comercial claro.
3. O usuário nunca começa do zero — toda entrega já vem com contexto e próximo passo.
4. Economizar tempo é inegociável — nenhuma decisão pode gerar trabalho manual desnecessário.
5. Mostrar só o que importa — recusar complexidade que não muda a decisão do usuário.
6. Todo recurso novo precisa aumentar conversão ou produtividade (`LEADFLOW_OS.md`, Princípio 8); se não aumentar nenhum dos dois, a resposta é não.
7. O sistema deve funcionar sem IA externa — nenhuma decisão de arquitetura pode criar uma dependência rígida de um provedor externo.

Quando duas prioridades conflitam, vence a que mais se aproxima da Success Definition do RFC-001: o vendedor abrir um lead e saber, em segundos, por que priorizá-lo, o que oferecer e o que dizer.

## Weekly Operating Rhythm

- **Segunda-feira** — revisão da semana anterior (métricas + feedback de clientes) e definição do foco da semana.
- **Terça a quinta** — execução: construção, validação de hipóteses e ajustes com base em uso real.
- **Sexta-feira** — corte: nada novo entra em produção nesse dia; é dia de estabilização, documentação e revisão do que foi entregue.
- **Recorrente, todo dia** — checagem rápida do que está bloqueando o ICP (Agências, Freelancers, Web Designers, Desenvolvedores, Especialistas em Marketing, Empresas de Automação, Consultores Comerciais) de usar o produto para vender mais hoje.

## Product Prioritization

Toda ideia de produto passa pelo mesmo filtro do Princípio 8: **aumenta conversão ou aumenta produtividade do vendedor?** Se a resposta for não para ambos, a ideia não entra no roadmap, independentemente de quão interessante ela seja tecnicamente.

Entre duas ideias que passam no filtro, prioriza-se:

1. O que remove um passo manual do fluxo Descoberta → Diagnóstico → Priorização → Prospecção → Negociação → Fechamento (`LEADFLOW_OS.md`, Fluxo Operacional).
2. O que aumenta a fidelidade da personalização pelo DNA Comercial (nunca recomendar como oferta principal um serviço que o usuário não vende).
3. O que reduz a distância entre "abrir um lead" e "saber o que fazer" (a Success Definition do RFC-001).

## Hypothesis Validation

Nenhuma funcionalidade nova nasce como certeza — nasce como hipótese, testada nesta ordem:

1. **Hipótese escrita** — uma frase clara do tipo "Se fizermos X, o vendedor Y vai Z", nunca uma ideia vaga.
2. **Validação com o ICP real** — pelo menos um perfil do público-alvo (`LEADFLOW_OS.md`, Público) usa a hipótese antes de ela virar prioridade de sprint.
3. **Evidência de comportamento, não de opinião** — o critério de sucesso é o que o usuário faz (usa, volta, recomenda), não o que ele diz que achou.
4. **Decisão binária** — a hipótese é confirmada e vira funcionalidade permanente, ou é descartada e documentada como aprendizado (nunca fica "meio validada" indefinidamente).

## Customer Feedback Process

- Todo feedback de cliente é registrado no mesmo lugar (histórico centralizado), nunca perdido em conversas soltas de WhatsApp ou e-mail.
- Feedback é classificado em três categorias: **bloqueio** (impede o uso), **fricção** (atrapalha mas não impede) e **desejo** (pedido de algo novo).
- Bloqueios entram na semana corrente. Fricções entram no próximo ciclo de priorização. Desejos só avançam se passarem pelo filtro de Product Prioritization.
- Nenhum feedback vira funcionalidade sem antes ser confrontado com os Princípios de Decisão — o cliente pede a solução que imagina, o time entrega a solução validada pelos princípios.

## Development Workflow

1. A ideia passa pelo filtro de Product Prioritization.
2. É escrita como hipótese (ver Hypothesis Validation) antes de qualquer código.
3. Implementação segue a arquitetura de motores independentes já estabelecida (`LEADFLOW_OS.md`, Motores Inteligentes): cada motor tem responsabilidade única, para permitir evolução contínua sem quebrar o restante do sistema.
4. Toda funcionalidade nova preserva o Princípio 7: o sistema continua funcionando normalmente mesmo sem IA externa disponível.
5. Revisão de código confirma que nenhuma regra de negócio já validada foi enfraquecida silenciosamente (ex.: catálogo de soluções, regras do DNA Comercial, limites de recomendação).

## Release Workflow

- Lançamentos pequenos e frequentes são preferíveis a lançamentos grandes e raros — cada entrega precisa ser rastreável a uma hipótese específica.
- Antes de liberar: confirmar que o sistema continua funcionando sem IA externa configurada (Princípio 7) e que nenhuma recomendação passou a inventar dado sem evidência (Princípio 1).
- Checkpoints de versão são registrados (tag + changelog) sempre que um conjunto de hipóteses validadas se consolida em um estado estável — o mesmo padrão já usado no checkpoint `v0.6-intelligence-stable`.
- Reversão é sempre uma opção válida: se uma entrega piora a Success Definition (o vendedor demora mais para decidir o que fazer com um lead), ela é revertida, não "ajustada aos poucos" em produção.

## Documentation Rules

- A visão e o posicionamento vivem em um único lugar cada (`LEADFLOW_OS.md`, RFC-001, `docs/brand/POSITIONING.md`) — nunca duplicados ou reescritos informalmente em outro documento.
- Documentos operacionais (como este) descrevem processo; documentos de produto (`docs/product/`) descrevem funcionalidade; documentos de engenharia (`docs/engineering/`) descrevem arquitetura. Cada informação tem um único dono de localização.
- Todo documento novo declara, logo no topo, se é definitivo (posicionamento, princípios) ou vivo (roadmap, checklist, changelog) — documentos vivos podem mudar; documentos definitivos só mudam por decisão explícita, nunca por edição incidental.
- Nenhuma decisão de negócio é considerada "oficial" até estar escrita em algum documento — decisão verbal não gera obrigação para o time.

## Metrics Reviewed Weekly

- **Leads analisados** e **leads priorizados** (saúde do topo de funil).
- **Chance média de fechamento** (Win Probability médio da carteira ativa).
- **Potencial de receita estimado** (Executive Dashboard).
- **Taxa de conversão** por estágio do pipeline (Novo Lead → Cliente).
- **Tempo entre abrir um lead e a primeira ação do vendedor** — o indicador mais próximo da Success Definition do produto.
- **Bloqueios de feedback abertos** (da Customer Feedback Process) — nenhum bloqueio deve atravessar duas semanas sem resposta.

## Rules for Using AI

Estas regras valem tanto para a IA dentro do produto quanto para IA usada pelo próprio time para construir o LeadFlow:

1. IA nunca inventa informação — toda saída precisa ser rastreável a um dado real ou a uma regra explícita.
2. IA enriquece, nunca substitui os motores internos determinísticos — o produto continua funcionando com IA externa indisponível.
3. IA nunca afirma ter "aprendido" ou ter sido "treinada" quando o que existe é configuração por regras.
4. IA nunca recomenda, como oferta principal, algo fora do que já foi validado pelo DNA Comercial do usuário.
5. Toda saída gerada por IA que vira interação com um cliente final passa por revisão do vendedor antes do envio — a IA prepara, o vendedor decide.

## 70/30 Execution Rule

70% do tempo do time é dedicado a executar o que já foi validado: hipóteses confirmadas, itens do roadmap priorizado e correção de bloqueios reportados por clientes.

30% do tempo é reservado para exploração deliberada: novas hipóteses, dívida técnica que não é urgente mas se acumula, e ideias fora do roadmap atual que ainda não passaram pelo filtro de Product Prioritization.

Essa reserva de 30% nunca é "o que sobrar" — é alocada de propósito toda semana, para que a exploração não dependa de haver tempo livre por acaso. Se uma exploração dentro dos 30% se prova valiosa (passa pela Hypothesis Validation), ela migra para os 70% do ciclo seguinte.
