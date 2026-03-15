# Casarão Luz

Sistema de gestão de iluminação arquitetural. Permite gerenciar projetos de iluminação com autenticação, dashboard com gráficos e controle de ambientes.

## Tech Stack

- Next.js 16 + React 19 + TypeScript
- Drizzle ORM + Neon (PostgreSQL serverless)
- NextAuth.js (autenticação)
- Tailwind CSS + shadcn/ui
- Recharts (gráficos)

## Como rodar

```bash
git clone https://github.com/institutoveigacabral-maker/casarao-luz.git
cd casarao-luz
npm install
npm run dev
```

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Connection string do PostgreSQL (Neon) |
| `AUTH_SECRET` | Secret do NextAuth.js |

## Estrutura

```
src/
├── app/       # App Router (páginas e layouts)
├── auth.ts    # Configuração de autenticação
├── db/        # Schema e conexão Drizzle
├── lib/       # Utilitários
└── types/     # Tipos TypeScript
```
