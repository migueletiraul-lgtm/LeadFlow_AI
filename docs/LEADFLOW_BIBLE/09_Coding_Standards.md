# LeadFlow Coding Standards

## Objetivo

Garantir que qualquer pessoa consiga ler, entender e evoluir o código do LeadFlow sem depender de quem o escreveu.

---

## Filosofia

Código é lido muito mais do que é escrito.

Clareza vale mais que inteligência. Simplicidade vale mais que abstração antecipada.

Nenhum código deve exigir explicação verbal para ser entendido.

---

## Padrões de Backend

- Regras de negócio pertencem exclusivamente ao backend
- Organização por responsabilidade: rotas, serviços, schemas e modelos separados
- Cada serviço resolve um problema, não vários
- Funções pequenas, com nomes que descrevem o que fazem
- Nenhuma regra de negócio duplicada em mais de um lugar

---

## Padrões de Frontend

- Interface apenas apresenta dados e estados, nunca decide regra de negócio
- Componentização por responsabilidade única
- Componentes pequenos e reutilizáveis antes de componentes grandes e específicos
- Estado local por padrão; estado global apenas quando necessário
- Nomes de componentes descrevem o que representam, não como foram construídos

---

## Estrutura de Pastas

- Backend organizado por responsabilidade: rotas, serviços, schemas e modelos
- Frontend organizado por domínio: aplicação, componentes, serviços e utilitários
- Nenhum arquivo pertence a mais de uma responsabilidade estrutural
- Novas pastas só são criadas quando refletem uma responsabilidade real, nunca por antecipação

---

## TypeScript

- Tipagem explícita em contratos de dados: props, respostas de API e estados
- Tipos derivados de uma única fonte de verdade, nunca duplicados entre arquivos
- Tipos genéricos e não descritivos são evitados; exceções precisam de justificativa
- Tipos de conceitos de negócio (Empresa, Oportunidade, Lead) são compartilhados entre todos os componentes que os utilizam

---

## Componentização

- Um componente resolve uma responsabilidade visual ou funcional, nunca várias
- Componentes são divididos antes de crescerem além do necessário
- Lógica de negócio não vive dentro de componentes de interface
- Composição é preferida sobre configuração excessiva por propriedades

---

## APIs

- Contratos de API são explícitos e refletidos nos schemas
- O backend nunca expõe mais dado do que o necessário para o frontend
- Mudanças de contrato são coordenadas entre backend e frontend antes de implementadas
- Nomes de endpoints refletem o recurso, não a tela que os consome

---

## Tratamento de Erros

- Erros são tratados o mais próximo possível de onde ocorrem
- Mensagens voltadas ao usuário são claras e orientam uma próxima ação
- Erros técnicos nunca são expostos diretamente ao usuário final
- Falhas silenciosas são evitadas: todo erro é registrado ou comunicado

---

## Performance

- Performance é validada com volume real de dados, não apenas em cenários ideais
- Cálculos custosos não são repetidos quando podem ser reaproveitados
- Carregamento de dados prioriza o que é visível primeiro
- Otimização ocorre após um problema real ser identificado, nunca por antecipação

---

## Documentação

- Toda decisão não óbvia é documentada, não apenas comentada no código
- Padrões e arquitetura vivem na LeadFlow Bible, não dispersos em comentários
- Mudanças estruturais atualizam a documentação correspondente na mesma entrega
- Documentação desatualizada é tratada como defeito, não como débito aceitável

---

## Nomenclatura

- Nomes descrevem intenção, não implementação
- Consistência de idioma dentro da mesma camada
- Termos de negócio (Empresa, Oportunidade, Pipeline) mantidos consistentes entre backend, frontend e documentação
- Abreviações evitadas, exceto quando amplamente conhecidas

---

## Revisão de Código

Todo código passa por revisão antes de ser incorporado ao produto.

A revisão avalia clareza, aderência à arquitetura, ausência de duplicação e cobertura do que foi pedido.

Ajustes solicitados na revisão fazem parte da entrega, não trabalho futuro.

---

## O que Evitar

- Código morto ou funcionalidade parcialmente implementada
- Duplicação de lógica já existente em outro lugar
- Componentes ou serviços com mais de uma responsabilidade
- Dados inventados ou estimados sem origem real
- Comentários que explicam o óbvio
- Arquivos gigantes que acumulam responsabilidades diferentes
- Componentes monolíticos que fazem tudo em vez de uma coisa bem feita
- Valores mágicos sem nome ou explicação de origem
- Código comentado sem uso

---

## Princípios

- Simplicidade antes de otimização prematura
- Previsibilidade antes de flexibilidade
- Reutilização antes de duplicação
- Consistência antes de preferência pessoal
- Manutenção fácil é uma responsabilidade de quem escreve, não de quem lê depois
