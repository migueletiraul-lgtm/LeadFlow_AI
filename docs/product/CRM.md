# LeadFlow AI — CRM

Documentação funcional do módulo de CRM do LeadFlow AI. Cobre o que já está implementado (pipeline, interações, motores de IA) e o que é planejado (métricas de dashboard, integrações futuras).

---

# CRM Vision

## Purpose

O CRM do LeadFlow não existe para armazenar contatos — existe para que o vendedor nunca perca uma oportunidade real de venda e nunca comece uma conversa do zero.

Cada lead carrega, junto com seus dados cadastrais, um diagnóstico comercial completo: dores, soluções recomendadas, estratégia de abordagem e chance de fechamento.

## Goals

- Substituir planilhas soltas e memória do vendedor por um pipeline único e confiável.
- Garantir que todo lead tenha uma próxima ação clara, nunca "parado sem dono".
- Registrar o histórico de cada relacionamento para que qualquer pessoa do time consiga continuar a conversa.

## Value for the seller

- Menos tempo decidindo "quem abordar hoje" e mais tempo vendendo.
- Contexto pronto antes de cada ligação ou mensagem.
- Visibilidade real de quanto o pipeline vale e da chance de bater a meta do mês.

---

# Pipeline

## Default stages

1. Novo Lead
2. Contato iniciado
3. Resposta recebida
4. Reunião
5. Proposta enviada
6. Negociação
7. Cliente
8. Perdido

## Stage descriptions

- **Novo Lead** — empresa cadastrada ou importada, ainda sem contato comercial.
- **Contato iniciado** — primeira abordagem enviada, aguardando retorno.
- **Resposta recebida** — o lead respondeu; conversa em andamento.
- **Reunião** — reunião marcada ou realizada com o lead.
- **Proposta enviada** — proposta comercial formal enviada.
- **Negociação** — ajustando escopo, prazo ou condições comerciais.
- **Cliente** — negócio fechado; foco vira relacionamento e upsell.
- **Perdido** — lead encerrado sem fechamento.

## Lead movement rules

- A mudança de estágio é sempre manual e explícita — o sistema nunca move um lead sozinho sem ação do vendedor.
- Não é permitido pular direto para "Cliente" sem passar por um estágio de contato prévio, exceto quando o lead já chega como cliente existente (importação).
- Um lead em "Perdido" pode ser reaberto para um novo estágio, mas a abordagem seguinte nunca deve tratá-lo como contato frio — o histórico é preservado e considerado.

## Win/Lost flow

- **Won** — estágio "Cliente"; o lead sai da régua de prospecção ativa e entra em régua de relacionamento/upsell.
- **Lost** — estágio "Perdido"; o motivo do encerramento deve ser registrado como uma interação (nota), para alimentar aprendizado futuro do Memory Engine.
- Nenhum lead é excluído ao ser marcado como perdido — o histórico permanece salvo indefinidamente.

## Automation opportunities

- Sugestão automática de próximo estágio quando uma interação do tipo "resposta" ou "reunião" é registrada.
- Alerta quando um lead fica parado no mesmo estágio além do tempo médio observado para aquele estágio.
- Reengajamento sugerido automaticamente para leads "Perdido" após um período de descanso.

---

# Lead Details

## Company information

Nome, nicho, cidade/estado, site, Instagram, WhatsApp, seguidores, nota e avaliações do Google, Lead Score e estágio atual do pipeline.

## Intelligence summary

Digital Health (score, nível, resumo), Opportunity Index e temperatura, e o estágio de Business Evolution — reunidos em um resumo executivo por lead.

## Pain points

Lista de dores identificadas, cada uma com título, descrição, gravidade, evidência e impacto no negócio. Nunca inventadas — sempre baseadas em dados coletados.

## Recommended services

Até 5 soluções priorizadas, na ordem do roadmap de Business Evolution, cada uma com motivo, resultado esperado e sinalização de que já faz parte (ou não) do portfólio do vendedor.

## Sales coach

Roteiro consultivo por lead: abertura, argumento principal, o que evitar, objeções prováveis com resposta, fechamento e orientação de follow-up.

## Timeline

Histórico cronológico de todas as interações registradas com o lead, mais recente primeiro.

## Notes

Interações do tipo "observação" — registros livres sobre o lead que não se encaixam em ligação, mensagem, reunião ou proposta.

## Tasks

Follow-ups agendados (`follow_up_at`) funcionam como tarefas por lead; aparecem na lista de pendências até serem concluídos ou reagendados.

## Attachments

Não implementado nesta versão. Planejado para propostas em PDF e prints de conversa anexados diretamente ao lead.

---

# Follow-up

## Follow-up philosophy

Nunca deixar um lead sem próxima ação definida. O follow-up é sempre consultivo — nunca insistente — e adaptado ao estágio real da conversa.

## Recommended intervals

- Lead novo sem resposta: 3 a 5 dias úteis.
- Conversa em andamento: até 2 dias úteis.
- Cliente ativo: revisão de relacionamento a cada 30 dias.
- Lead perdido: aguardar um período maior antes de reengajar.

## Automatic reminders

Follow-ups com data agendada aparecem automaticamente na lista de pendências (`/follow-ups`), ordenados pela data mais próxima.

## Follow-up history

Cada follow-up realizado fica registrado como uma interação na timeline do lead, preservando o que foi dito e quando.

## Suggested next action

Cada lead tem uma próxima ação sugerida (prioridade, ação e motivo), adaptada ao estágio do pipeline — nunca uma abordagem fria para quem já está em conversa.

## AI recommendations

O Sales Coach reforça o follow-up com uma recomendação de cadência específica, considerando o tempo de prospecção disponível do vendedor.

---

# Activities

## Calls

Registradas como interação do tipo "ligação realizada", com descrição do que foi conversado.

## WhatsApp

Mensagens enviadas via link direto (`wa.me`) e registradas como interação do tipo "mensagem enviada".

## Emails

Sem canal dedicado nesta versão; registrável como interação do tipo "mensagem enviada" ou "observação" até haver integração com e-mail.

## Meetings

Registradas como interação do tipo "reunião", podendo incluir follow-up agendado para o próximo encontro.

## Notes

Observações livres sobre o lead, sem estrutura fixa.

## Timeline

Todas as atividades acima aparecem juntas, em ordem cronológica, na timeline do lead.

---

# Dashboard Metrics

## Active leads

Total de leads fora dos estágios "Cliente" e "Perdido".

## Conversion rate

Percentual de leads que chegam ao estágio "Cliente" em relação ao total trabalhado em um período.

## Revenue forecast

Estimativa de receita potencial do pipeline, calculada a partir do ticket médio informado no DNA Comercial e dos leads prioritários identificados pelo Executive Dashboard.

## Average sales cycle

Tempo médio entre "Novo Lead" e "Cliente", medido a partir do histórico de interações e mudanças de estágio.

## Won deals

Contagem de leads no estágio "Cliente" em um período.

## Lost deals

Contagem de leads no estágio "Perdido" em um período.

---

# AI Features

## Opportunity Score

Índice de 0 a 100 que combina Lead Score e a lacuna de presença digital, com temperatura (frio a muito quente) e nível de confiança da análise.

## Win Probability

Estimativa determinística de 0 a 100 da chance de fechamento, com nível de confiança, motivos que sustentam a estimativa e riscos identificados.

## Sales Coach

Roteiro de abordagem consultivo gerado por lead: abertura, argumento, o que evitar, objeções e respostas, fechamento e follow-up.

## Business Stage

Estágio de maturidade digital do negócio (ex.: Fundação Digital, Estruturação, Crescimento, Otimização, Consolidado) com score e roadmap de evolução de até 5 passos.

## Next Best Action

Próxima ação recomendada para o lead, com prioridade e motivo, adaptada ao estágio atual do pipeline.

## AI Summary

Resumo executivo em linguagem natural da saúde digital e do momento comercial do lead.

---

# Future Integrations

## WhatsApp

Envio e recebimento de mensagens direto pela plataforma, com registro automático na timeline (hoje é só um link `wa.me` manual).

## Google Calendar

Sincronização de reuniões e follow-ups agendados com a agenda do vendedor.

## Gmail

Registro automático de e-mails trocados com o lead na timeline.

## Stripe

Acompanhamento de pagamentos e faturamento real de clientes fechados, alimentando o Revenue Forecast com dados reais em vez de estimativas.

## OpenAI

Já utilizado hoje para gerar mensagens de abordagem sob demanda (`/ai/generate-approach`). Futuramente, para enriquecer análises dos motores internos sem nunca substituí-los — o sistema continua funcionando normalmente se a IA externa estiver indisponível.
