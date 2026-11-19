# LeadFlow — Product Principles

Estes princípios traduzem `LEADFLOW_OS.md`, `docs/rfc/RFC-001_LEADFLOW_VISION.md`, `docs/brand/POSITIONING.md` e `LEADFLOW_BIBLE/00_FOUNDATION/FirstPrinciples.md`/`OperatingSystem.md` em regras aplicáveis diretamente a decisões de produto. Nenhum princípio abaixo cria posicionamento novo — cada um é uma consequência direta de algo já declarado.

Cada princípio segue o mesmo formato: **Statement** (a regra), **Rationale** (por que ela existe, com referência ao documento de origem), **Product Implication** (o que isso exige na prática) e **Rejection Test** (a pergunta que reprova uma decisão que viola o princípio).

---

## 1. Customer Outcome Over Feature Output

**Statement:** Toda funcionalidade é avaliada pelo quanto aproxima o usuário de fechar uma venda — nunca pela sofisticação técnica que demonstra.

**Rationale:** A Success Definition do RFC-001 é comportamental, não numérica: o usuário reconhecer que nunca viu uma ferramenta funcionar assim, e voltar por decisão própria. Product Truths (`FirstPrinciples.md`) já estabelece que toda entrega combina diagnóstico, estratégia e mensagem — nunca dado bruto.

**Product Implication:** Nenhuma tela nasce apenas para "mostrar dado"; toda tela precisa apontar para uma decisão comercial concreta que o usuário pode tomar em seguida.

**Rejection Test:** Essa funcionalidade ajuda o vendedor a agir melhor ou mais rápido em um lead real? Se a resposta for não, ela é rejeitada, independentemente de quão interessante pareça.

---

## 2. Time to Value

**Statement:** A distância entre abrir o produto e receber uma decisão utilizável precisa ser de segundos, não de minutos.

**Rationale:** RFC-001 (Long-term Goal e Success Definition) define explicitamente que o padrão é o usuário saber, "em poucos segundos", por que priorizar um lead, o que oferecer e o que dizer.

**Product Implication:** Onboarding, configuração e qualquer etapa intermediária nunca podem bloquear o primeiro diagnóstico útil; complexidade adicional vem depois do primeiro valor entregue, nunca antes.

**Rejection Test:** Essa mudança adiciona um passo antes do primeiro resultado útil que o usuário recebe? Se sim, ela precisa ser redesenhada ou descartada.

---

## 3. Next Best Action Always Visible

**Statement:** O produto sempre diz ao usuário o que fazer a seguir — nunca apenas exibe informação.

**Rationale:** Princípio 6 de `LEADFLOW_OS.md` ("cada tela deve responder uma pergunta, nunca apenas mostrar informações") e a existência do próprio conceito de Next Best Action / próxima ação já embutido no produto.

**Product Implication:** Toda tela que apresenta um lead, uma métrica ou um relatório precisa terminar em uma ação recomendada explícita, com prioridade e motivo.

**Rejection Test:** Depois de ver esta tela, o usuário sabe exatamente o que fazer a seguir? Se a resposta exigir que ele mesmo interprete o que fazer, a tela está incompleta.

---

## 4. Explainable AI

**Statement:** Toda recomendação gerada por IA precisa expor o raciocínio por trás dela — a evidência e a regra aplicada — nunca um veredito de caixa-preta.

**Rationale:** AI Truths e Data Truths (`FirstPrinciples.md`): "toda dor exibida precisa estar amarrada a uma evidência coletada"; a IA enriquece, nunca decide sem rastro de justificativa.

**Product Implication:** Toda dor, recomendação ou próxima ação carrega evidência, motivo e resultado esperado — nunca uma sugestão solta sem explicação.

**Rejection Test:** É possível apontar, para essa recomendação, qual dado real ou regra explícita a sustenta? Se não for possível, ela não pode ser publicada como afirmação categórica — no máximo como "recomenda-se validar".

---

## 5. Simplicity Over Sophistication

**Statement:** O produto mostra apenas o que muda a decisão do usuário; tudo o que não muda uma decisão é ruído e deve ser removido.

**Rationale:** Princípio 5 de `LEADFLOW_OS.md`: "a interface deve mostrar apenas o que realmente importa".

**Product Implication:** Antes de adicionar um dado, métrica ou painel novo, é preciso justificar qual decisão ele muda; se nenhuma, ele não entra na interface.

**Rejection Test:** Se este elemento fosse removido, alguma decisão do usuário mudaria? Se a resposta for não, ele deve ser removido, não apenas simplificado.

---

## 6. Evidence Over Assumptions

**Statement:** O produto só afirma o que pode ser rastreado a um dado real coletado — nunca uma suposição apresentada como fato.

**Rationale:** Princípio 1 de `LEADFLOW_OS.md` ("a IA nunca inventa informações, sempre utiliza evidências") e Data Truths (`FirstPrinciples.md`).

**Product Implication:** Ausência de dado é tratada como informação válida ("sem nota do Google", "sem WhatsApp cadastrado"), nunca preenchida com suposição; onde não há evidência suficiente, a linguagem é sempre condicional ("possível oportunidade", "recomenda-se validar").

**Rejection Test:** Essa afirmação pode ser rastreada até um dado real coletado? Se não, ela precisa ser reescrita em linguagem de hipótese ou removida.

---

## 7. Privacy and Data Restraint

**Statement:** O produto usa apenas dados publicamente disponíveis sobre a empresa prospectada ou explicitamente fornecidos pelo próprio usuário — nunca dado inferido ou coletado além do necessário para a decisão comercial.

**Rationale:** Data Truths (`FirstPrinciples.md`): "dados públicos são a única fonte de verdade sobre a empresa prospectada"; o produto opera sobre sinais de negócio (site, Instagram, Google, WhatsApp), nunca sobre dado pessoal sensível de indivíduos.

**Product Implication:** Qualquer nova fonte de dado avaliada precisa ser pública ou fornecida diretamente pelo usuário; nenhuma funcionalidade pode depender de inferência sobre pessoas físicas além do contexto comercial da empresa.

**Rejection Test:** Esse dado é público sobre o negócio ou foi fornecido explicitamente pelo usuário? Se não for nenhum dos dois, a funcionalidade não é construída dessa forma.

---

## 8. Human Control Over Automation

**Statement:** A IA prepara a decisão; quem decide e envia é sempre a pessoa. Nenhuma ação voltada a um cliente final é disparada de forma autônoma.

**Rationale:** AI Truths (`FirstPrinciples.md`): "toda saída de IA que chega a um cliente final passa pelo vendedor antes do envio — a IA prepara a decisão, quem decide é a pessoa."

**Product Implication:** Mensagens, propostas e qualquer comunicação externa gerada pela IA sempre passam por uma etapa explícita de revisão/cópia pelo usuário antes de qualquer envio.

**Rejection Test:** Essa funcionalidade permite que uma ação chegue a um cliente final sem revisão humana explícita? Se sim, ela viola o princípio e não pode ser lançada como está.

---

## 9. Learning Loops Over Static Rules

**Statement:** Todo resultado real (contato, resposta, reunião, proposta, ganho, perda) deve ser preservado de forma estruturada, para alimentar melhorias futuras nas recomendações — mesmo enquanto esse aprendizado ainda for manual.

**Rationale:** Etapa 7 — Aprendizado, e o Memory Engine (`LEADFLOW_OS.md`): "utilizará os resultados reais para melhorar recomendações, score e estratégias de abordagem" — uma capacidade declarada como horizonte, ainda não implementada.

**Product Implication:** Nenhuma funcionalidade pode descartar dado de resultado real (histórico de interações, motivo de perda, follow-ups) só porque o motor de aprendizado automático ainda não existe; a estrutura de dados de hoje precisa permitir esse uso amanhã.

**Rejection Test:** Essa funcionalidade preserva o resultado real de forma que possa alimentar uma melhoria futura de recomendação? Se ela descarta esse dado, precisa ser redesenhada antes de ir ao ar.

---

## 10. Feature Prioritization by Dual Filter

**Statement:** Uma funcionalidade só entra no roadmap se aumentar, de forma demonstrável, conversão ou produtividade do vendedor — nunca por novidade ou sofisticação isolada.

**Rationale:** Princípio 8 de `LEADFLOW_OS.md` ("todo recurso novo deve aumentar conversão ou produtividade; caso contrário, não entra no produto") e o Decision Filter equivalente em `FirstPrinciples.md` e `OperatingSystem.md` (Product Prioritization).

**Product Implication:** Toda proposta de funcionalidade precisa declarar, antes de entrar em desenvolvimento, qual dos dois eixos ela move — conversão ou produtividade — e como isso será observado.

**Rejection Test:** É possível nomear se essa funcionalidade aumenta conversão, produtividade, ou nenhum dos dois? Se a resposta for "nenhum dos dois" ou "não sei", ela não entra no roadmap.
