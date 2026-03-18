# Casarao Luz

![CI](https://github.com/institutoveigacabral-maker/casarao-luz/actions/workflows/ci.yml/badge.svg)

Plataforma web para gestao de projetos luminotecnicos com conformidade automatizada a norma **NBR 8995-1** (iluminacao de ambientes de trabalho). O sistema permite criar projetos, cadastrar ambientes, selecionar luminarias LED de um catalogo tecnico e verificar conformidade em tempo real, incluindo calculos luminotecnicos, geracao de Bill of Quantities (BOQ) e o programa de fidelidade **Seja Luz** para profissionais do setor.

---

## Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, Lucide Icons |
| Linguagem | TypeScript 5 |
| ORM | Drizzle ORM |
| Banco de Dados | PostgreSQL (Neon Serverless) |
| Autenticacao | NextAuth.js v5 (Credentials + Google OAuth) |
| Graficos | Recharts |
| Validacao | Zod 4 |
| Testes | Vitest + Testing Library + jsdom |
| Monitoramento | Sentry |
| CI | GitHub Actions |
| Deploy | Vercel |

---

## Funcionalidades

### Conformidade NBR 8995-1

- Regras de iluminancia minima (lux) e indice de reproducao de cor (CRI) por tipo de atividade
- 10 tipos de ambiente cobertos: escritorio open plan, sala de reuniao, corredor, lobby, recepcao, copa, banheiro, sala de diretoria, auditorio, estacionamento
- Verificacao automatica com status: conforme, alerta ou nao conforme
- Validacao de valores-limite exatos conforme a norma

### Calculos Luminotecnicos

- Calculo de iluminancia (lux = lumens / area)
- Eficiencia luminosa (lm/W)
- Custo energetico anual (8h/dia, 252 dias uteis, R$0,85/kWh)
- Metricas agregadas por ambiente e por projeto
- CRI medio ponderado por ambiente

### Gestao de Projetos

- CRUD completo de projetos (corporativo, residencial, comercial, hospitalar, educacional)
- Cadastro de ambientes com area, pe-direito e tipo de atividade
- Catalogo de produtos LED com SKU, fluxo luminoso, potencia, CCT, CRI, IP, angulo de facho e preco
- Bill of Quantities (BOQ) por ambiente
- Dashboard com visao geral, graficos e projetos recentes
- Fluxo de status: rascunho, enviado, aprovado

### Programa Seja Luz

- Cadastro de profissionais com niveis (Bronze, Prata, Ouro, Platina, Diamante)
- Sistema de pontos por compras e bonus
- Ranking mensal e anual
- Recompensas (dinheiro, viagens, produtos, experiencias)
- Conquistas e badges

### Autenticacao e Seguranca

- Login por credenciais (email/senha com bcrypt)
- Login via Google OAuth
- Middleware de protecao de rotas (dashboard, projetos, APIs)
- Sessao JWT

---

## Setup Local

### Pre-requisitos

- Node.js 20+
- pnpm

### Instalacao

```bash
git clone https://github.com/institutoveigacabral-maker/casarao-luz.git
cd casarao-luz
pnpm install
```

### Variaveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
DATABASE_URL=postgresql://...@neon.tech/casarao-luz
AUTH_SECRET=sua-chave-secreta

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Sentry (opcional)
SENTRY_DSN=...
```

### Banco de Dados

```bash
pnpm drizzle-kit push
```

### Executar em Desenvolvimento

```bash
pnpm dev
```

O servidor inicia em `http://localhost:3000`.

---

## Scripts

| Comando | Descricao |
|---------|-----------|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build de producao |
| `pnpm start` | Iniciar servidor de producao |
| `pnpm lint` | Executar ESLint |
| `pnpm test` | Executar todos os testes |
| `pnpm test:watch` | Testes em modo watch |
| `pnpm format` | Formatar codigo com Prettier |
| `pnpm format:check` | Verificar formatacao |
| `pnpm drizzle-kit push` | Aplicar schema no banco |
| `pnpm drizzle-kit generate` | Gerar migration |

---

## Arquitetura

```
casarao-luz/
├── .github/workflows/    # CI (GitHub Actions)
├── public/               # Assets estaticos
├── src/
│   ├── app/
│   │   ├── (auth)/       # Paginas de login e registro
│   │   ├── (dashboard)/  # Dashboard, projetos, produtos, Seja Luz, settings
│   │   ├── api/          # Route handlers (projects, spaces, boq, products, auth, register, health, seja-luz)
│   │   └── layout.tsx    # Layout raiz
│   ├── __tests__/        # Suite de testes (Vitest)
│   ├── auth.ts           # Configuracao NextAuth.js
│   ├── db/
│   │   ├── schema.ts     # Schema Drizzle (users, projects, spaces, products, boq, compliance, seja-luz)
│   │   ├── seed.ts       # Seed de dados e regras NBR
│   │   └── index.ts      # Conexao Neon
│   ├── lib/utils.ts      # Utilitarios (cn)
│   ├── instrumentation.ts # Sentry instrumentation
│   └── types/            # Tipos TypeScript
├── middleware.ts          # Protecao de rotas
├── drizzle.config.ts     # Configuracao Drizzle Kit
├── vitest.config.ts      # Configuracao Vitest
├── sentry.*.config.ts    # Configuracao Sentry (client, server, edge)
└── package.json
```

### Modelo de Dados

O schema cobre 11 tabelas com relacoes:

- **users** -- Usuarios do sistema
- **projects** -- Projetos luminotecnicos (tipos: corporativo, residencial, comercial, hospitalar, educacional)
- **spaces** -- Ambientes dentro de projetos (com area, pe-direito, tipo de atividade)
- **products** -- Catalogo de luminarias LED
- **boq_items** -- Itens do Bill of Quantities (ligando ambientes a produtos)
- **compliance_rules** -- Regras NBR 8995-1 por tipo de atividade
- **professionals** -- Profissionais do programa Seja Luz
- **point_transactions** -- Transacoes de pontos
- **rewards** -- Recompensas resgatadas
- **rankings** -- Rankings periodicos
- **achievements** -- Conquistas e badges

---

## Deploy

O projeto esta configurado para deploy na **Vercel**.

### Variaveis de Ambiente (Producao)

| Variavel | Descricao |
|----------|-----------|
| `DATABASE_URL` | Connection string do Neon PostgreSQL |
| `AUTH_SECRET` | Secret do NextAuth.js |
| `GOOGLE_CLIENT_ID` | OAuth Google (client ID) |
| `GOOGLE_CLIENT_SECRET` | OAuth Google (client secret) |
| `SENTRY_DSN` | Monitoramento Sentry |

### Banco de Dados (Neon)

O banco utiliza Neon (PostgreSQL serverless) com driver `@neondatabase/serverless`. As migrations sao gerenciadas pelo Drizzle Kit:

```bash
pnpm drizzle-kit push      # Aplicar schema
pnpm drizzle-kit generate   # Gerar migration
```

---

## Licenca

Este projeto esta licenciado sob a [MIT License](LICENSE).
