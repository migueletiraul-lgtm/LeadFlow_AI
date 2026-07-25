# LeadFlow AI — Onboarding

---

# Flow

No primeiro acesso, o usuário responde a um quiz curto para personalizar o LeadFlow antes de ver qualquer lead.

Descoberta de empresas
→ Diagnóstico automático (Opportunity Intelligence)
→ Priorização
→ Prospecção assistida
→ Negociação
→ Fechamento

O onboarding acontece antes da Etapa 1 (Descoberta): sem um DNA Comercial preenchido, o sistema ainda funciona, mas com recomendações genéricas — não personalizadas ao que o vendedor realmente vende.

---

# Steps

1. Boas-vindas e explicação rápida do que é o LeadFlow.
2. Quiz do DNA Comercial (uma pergunta por tela, com progresso visível).
3. Resumo do DNA Comercial gerado.
4. Primeira lista de leads já priorizada de acordo com o perfil.

O quiz deve levar no máximo dois minutos, permitir múltiplas respostas quando necessário, usar linguagem simples, explicar brevemente por que cada resposta importa, e permitir edição posterior nas configurações (`GET`/`PUT /seller-profile`).

---

# Questions

1. Quais soluções você vende? → `offered_services`
2. Quais nichos deseja prospectar? → `target_niches`
3. Qual é seu ticket médio? → `average_ticket_range`
4. Quais canais usa para vender? → `sales_channels`
5. Quantos clientes deseja conquistar por mês? → `monthly_goal`
6. Quanto tempo dedica à prospecção? → `daily_prospecting_time`
7. Qual é sua maior dificuldade comercial? → `main_sales_challenge`

Uma oitava informação, o estilo de comunicação preferido (`communication_style`), pode ser capturada no mesmo fluxo para personalizar o tom das mensagens geradas.

Todos os campos são opcionais: o usuário pode pular perguntas e completar depois.

---

# Goals

Entender o que o usuário vende, para nunca recomendar como oferta principal um serviço fora do seu catálogo.

Identificar o público ideal, para adaptar a priorização dos leads ao nicho-alvo.

Personalizar mensagens, objeções e estratégias de acordo com o estilo de comunicação e a maior dificuldade comercial informada.

Deixar claro, ao final, que a inteligência foi personalizada por regras com base nas respostas — nunca afirmar que um modelo foi treinado quando houve apenas configuração por regras.
