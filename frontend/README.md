# MídiaKit — MVP SaaS (Front-End)

Plataforma de **Mídia Kit para Influenciadores**. MVP front-end construído com
Next.js (App Router), seguindo a especificação técnica fornecida.

## Stack

- **Next.js 14** (App Router, Server Components)
- **React 18** + **TypeScript**
- **Tailwind CSS** + componentes estilo **shadcn/ui** sobre **Radix UI**
- **TanStack Query (React Query)** — cache, revalidação e estados de loading
- **React Hook Form** + **Zod** — formulários com validação em tempo real
- **Lucide React** — ícones
- `next/font` (Inter) e `next/image` — performance e zero layout shift

## Como rodar

```bash
npm install
npm run dev
# abra http://localhost:3000
```

Outros comandos: `npm run build`, `npm run start`, `npm run lint`.

## Dados (mock)

Este MVP roda **standalone** com uma camada de dados mockada em
`src/lib/mock-api.ts` (alimentada por `src/lib/mock-data.ts`). As assinaturas e
tipos são idênticos aos de uma API real — para conectar ao backend, troque o
corpo das funções de `mock-api.ts` por chamadas a `apiFetch` (`src/lib/api.ts`)
e remova/ajuste o flag `NEXT_PUBLIC_USE_MOCK`. Veja `.env.example`.

## Rotas

| Rota                       | Tipo     | Descrição |
|----------------------------|----------|-----------|
| `/`                        | Pública  | Landing page comercial |
| `/login`, `/register`      | Pública  | Autenticação + Social Login (Google) |
| `/dashboard`               | Privada  | Visão geral com métricas agregadas e alerta de reautenticação |
| `/dashboard/integracoes`   | Privada  | Gestor de fluxos OAuth (Google/Meta) |
| `/dashboard/perfil`        | Privada  | Bio, cores, uploaders de imagem com preview, links |
| `/[username]`              | Pública  | Vitrine do Mídia Kit (Server Component) — ex.: `/joao` |

## Estrutura

```
src/
├── app/                 # Rotas (App Router)
│   ├── (auth)/          # login / register (grupo sem afetar URL)
│   ├── dashboard/       # área logada (layout + sub-rotas + loading.tsx)
│   ├── [username]/      # mídia kit público (RSC) + loading + not-found
│   ├── layout.tsx       # root (Providers, fontes)
│   └── page.tsx         # landing
├── components/
│   ├── ui/              # primitivos (button, input, card, toast, dialog...)
│   ├── auth/            # botão de Social Login
│   ├── dashboard/       # sidebar, header, cards, formulários, uploader
│   └── mediakit/        # blocos públicos + modal de orçamento
├── lib/                 # utils, api, mock-api, mock-data, validations (zod)
├── hooks/               # useAuth, useMetrics, useIntegrations, useProfile
└── types/               # interfaces de API
```

## Decisões de arquitetura (conforme spec)

- **RSC vs Client**: `/[username]` busca dados no servidor e renderiza como
  Server Component; `"use client"` fica restrito a peças interativas (botão
  "Solicitar Orçamento" com modal, formulários do dashboard).
- **UX**: `loading.tsx` com Skeleton Loaders, `EmptyState` reutilizável e
  **Toast Notifications** para ações de salvar/conectar.
- **Performance**: imagens via `next/image` (WebP automático) e fontes via
  `next/font` (sem layout shift).
- **Segurança OAuth**: nenhum Access Token é guardado no `localStorage`. O
  cliente HTTP (`lib/api.ts`) usa `credentials: "include"` (cookies HTTP-Only);
  o backend orquestra a comunicação com Instagram/YouTube.
