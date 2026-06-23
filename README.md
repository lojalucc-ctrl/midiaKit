# Mídia Kit SaaS — Plataforma completa (Front-End + Back-End)

MVP de plataforma de **Mídia Kit para Influenciadores**. Monorepo com:

- **`frontend/`** — Next.js 14 (App Router) + React + TypeScript + Tailwind.
- **`backend/`** — Node.js + TypeScript + Express + Prisma (PostgreSQL/Supabase).
- **`docker-compose.yml`** — sobe os dois serviços integrados (o banco fica no Supabase).

## Arquitetura

```
┌─────────────┐      cookies HTTP-Only      ┌─────────────┐      Prisma      ┌──────────────┐
│  Front-End  │ ─────────────────────────▶ │  Back-End   │ ───────────────▶ │  Supabase    │
│ Next.js:3000│ ◀───────── JSON ────────── │ Express:3333│                  │ PostgreSQL   │
└─────────────┘                            └─────────────┘                  └──────────────┘
```

- Sessão via **JWT em cookie HTTP-Only** (anti-XSS); o front usa `credentials: include`.
- Tokens das redes sociais **criptografados (AES-256-CBC)** em repouso.
- A vitrine pública `/[username]` é **Server Component** e busca dados no servidor.

## Início rápido

Pré-requisitos: **Docker Desktop aberto** (ícone verde) e **Node 20+**.

O `.env` da raiz e o `backend/.env` já vêm preenchidos com as credenciais do
Supabase fornecidas (troque depois por segurança). Então:

**Windows (PowerShell):**
```powershell
./setup.ps1
```

**Linux / macOS:**
```bash
./setup.sh
```

**Ou com make:**
```bash
make setup
```

Os scripts fazem: instalar deps do backend → `prisma generate` → `migrate dev`
→ seed → `docker compose up --build`.

- Front-End: http://localhost:3000
- Back-End: http://localhost:3333
- Usuário demo: `joao@exemplo.com` / `123456` (e a vitrine em `/joao`)

## Passo a passo manual

```bash
# 1) Migrations (uma vez, localmente — precisa do Supabase ativo)
cd backend
npm install
# o .env já existe; senão: cp ../.env .env
npx prisma generate
npx prisma migrate dev --name init     # cria as tabelas no Supabase
npm run seed                            # opcional

# 2) Subir os serviços
cd ..
docker compose up --build
```

> Para rodar o front **sem** backend, defina `NEXT_PUBLIC_USE_MOCK=1` em
> `frontend/.env` — usa dados mockados e funciona standalone.

## Comandos de migration

```bash
cd backend
npx prisma migrate dev --name nome       # nova migration (desenvolvimento)
npx prisma migrate deploy                # aplica pendentes (CI/produção e no container)
npx prisma migrate status                # estado das migrations
npx prisma studio                        # UI do banco
```

O container do backend roda `prisma migrate deploy` no start (ver `backend/Dockerfile`),
aplicando as migrations já versionadas — por isso crie a migration **localmente** antes.

## Troubleshooting

**`Cannot connect to the Docker daemon` / `dockerDesktopLinuxEngine`**
O Docker Desktop não está rodando. Abra-o, aguarde "Engine running" e tente de novo.
Confirme com `docker version` (precisa aparecer a seção "Server").

**`The "DATABASE_URL" variable is not set`**
O `.env` precisa estar na **mesma pasta** do `docker-compose.yml`. Ele já vem
incluído; se sumir, `cp .env.example .env` e preencha.

**`FATAL: (ENOTFOUND) tenant/user ... not found`** (no `prisma migrate`)
Erro do pooler do Supabase ao resolver o projeto. Verifique:
1. O projeto está **Active** no painel (não pausado).
2. As URLs usam o **pooler** com usuário `postgres.<PROJECT_REF>` e a **região**
   correta no host (`aws-0-<REGIAO>.pooler.supabase.com`). Pegue as strings exatas
   em **Settings → Database → Connection pooling**.
3. A senha está correta; caracteres especiais (`@ : / # ?`) precisam de URL-encode.

**Conexão direta não conecta (`db.<ref>.supabase.co`)**
Esse host costuma ser **IPv6-only**. Em Docker/redes IPv4, use o **pooler**
(porta 5432 para `DIRECT_URL`, 6543 para `DATABASE_URL`) como já configurado.

## Stack

| Camada | Tecnologias |
|--------|-------------|
| Front  | Next.js 14, React 18, TypeScript, Tailwind, React Query, RHF + Zod, Radix, Lucide |
| Back   | Node.js, TypeScript, Express, Prisma, JWT, bcrypt, AES-256-CBC |
| Dados  | PostgreSQL (Supabase) |
| DevOps | Docker, docker-compose |

Veja `frontend/README.md` e `backend/README.md` para detalhes de cada serviço.

## Segurança

As credenciais incluídas no `.env` foram fornecidas para facilitar o setup.
**Recomenda-se trocá-las** (reset da senha do banco e rotação de chaves no Supabase)
e gerar `JWT_SECRET`/`ENCRYPTION_KEY` próprios. O `.env` está no `.gitignore`.
