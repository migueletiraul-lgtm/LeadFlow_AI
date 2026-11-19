# LeadFlow Architecture

## Visão Geral

O LeadFlow IA é dividido em dois grandes módulos.

- Backend (FastAPI)
- Frontend (Next.js)

Cada módulo possui responsabilidades bem definidas para facilitar manutenção, escalabilidade e desenvolvimento.

---

# Backend

Responsável por:

- API
- Banco de Dados
- Inteligência Comercial
- Auditoria
- Pipeline
- Exportações
- Regras de negócio

Estrutura principal:

backend/

app/

routers/

services/

schemas/

models/

core/

utils/

tests/

database.py

---

# Frontend

Responsável por:

- Interface
- Experiência do usuário
- Dashboard
- Company Workspace
- Auditoria
- Pipeline Kanban
- Componentes reutilizáveis

Estrutura principal:

frontend/

app/

components/

services/

lib/

store/

public/

---

# Fluxo da aplicação

Usuário

↓

Frontend

↓

API

↓

Services

↓

Database

↓

Resposta

↓

Interface

---

# Organização

Toda regra de negócio pertence ao Backend.

O Frontend apenas apresenta informações e controla estados da interface.

---

# Componentização

Cada funcionalidade deve possuir componentes independentes.

Exemplo:

CompanyHeader

CompanyMetrics

CompanyTimeline

CompanyActions

CompanyInsights

Cada componente possui responsabilidade única.

---

# Princípios

- Separação de responsabilidades
- Componentes pequenos
- Alta reutilização
- Código previsível
- Fácil manutenção
- Escalabilidade