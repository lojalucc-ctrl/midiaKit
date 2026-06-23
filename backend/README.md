# Back-End — Mídia Kit SaaS

API REST do MVP. **Node.js + TypeScript + Express + Prisma**, banco
**PostgreSQL no Supabase**.

## Rodar localmente

```bash
npm install
cp .env.example .env        # preencha [SUA_SENHA_AQUI] do Supabase
npm run prisma:generate
npm run prisma:migrate:dev  # cria as tabelas no Supabase (usa DIRECT_URL)
npm run seed                # opcional: cria usuário joao@exemplo.com / 123456
npm run dev                 # http://localhost:3333
```

## Endpoints

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/auth/register` | — | Cria usuário + perfil; seta cookie de sessão |
| POST | `/auth/login` | — | Login por e-mail/senha |
| POST | `/auth/google` | — | Social Login (Google) |
| POST | `/auth/logout` | — | Encerra a sessão |
| GET  | `/auth/me` | cookie | Usuário autenticado |
| GET  | `/dashboard/overview` | cookie | Métricas agregadas |
| GET  | `/integrations` | cookie | Lista status das plataformas |
| GET  | `/integrations/:platform/authorize-url` | cookie | URL de consentimento OAuth |
| POST | `/integrations/:platform/connect` | cookie | Conecta/reconecta plataforma |
| DELETE | `/integrations/:platform` | cookie | Desconecta plataforma |
| GET  | `/profile` | cookie | Perfil do Mídia Kit |
| PUT  | `/profile` | cookie | Atualiza perfil |
| GET  | `/public/:username` | — | Vitrine pública do Mídia Kit |
| POST | `/public/:username/quote` | — | Solicitação de orçamento |

## Segurança (conforme spec)

- **Sessão**: JWT entregue **exclusivamente** via cookie **HTTP-Only** (anti-XSS).
- **Tokens sociais**: nunca em texto puro — criptografados com **AES-256-CBC**
  (`src/utils/crypto.ts`), IV aleatório por registro.
- **Senhas**: hash com bcrypt.

## Estrutura

```
src/
├── config/        # env, prisma client
├── middlewares/   # requireAuth, errorHandler
├── modules/       # auth, profile, integrations, dashboard, public
├── utils/         # crypto (AES-256), jwt, password, cookies, mappers
├── app.ts         # montagem do Express
└── server.ts      # bootstrap
prisma/
├── schema.prisma  # User, Profile, OAuthConnection, MetricsSnapshot
└── seed.ts
```
