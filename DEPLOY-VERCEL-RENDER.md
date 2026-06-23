# Deploy: Frontend na Vercel + Backend no Render (sem ngrok)

Arquitetura: o **backend Express** roda no **Render** (HTTPS automático, resolve o
Instagram) e o **frontend Next.js** roda na **Vercel**. Banco no Supabase.

> Importante: como front e back ficam em domínios diferentes, a sessão usa cookie
> `SameSite=None; Secure` (cross-site) — já configurado. A proteção de rotas é
> feita no cliente (AuthGuard + verificação de sessão).

## 0. Subir no GitHub

Na pasta `midiakit-platform`:
```bash
git init && git add . && git commit -m "MVP Midia Kit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/midiakit.git
git push -u origin main
```

## 1. Backend no Render

1. render.com → **New → Blueprint** → conecte o repo (ele lê o `render.yaml`),
   OU **New → Web Service** → selecione o repo, **Root Directory = `backend`**,
   **Runtime = Docker**.
2. Em **Environment**, defina:
   - `DATABASE_URL`, `DIRECT_URL` (pooler do Supabase)
   - `JWT_SECRET`, `ENCRYPTION_KEY`
   - `FRONTEND_URL` = URL da Vercel (ex.: `https://midiakit.vercel.app`) — defina depois do passo 2
   - `BACKEND_PUBLIC_URL` = URL do Render (ex.: `https://midiakit-backend.onrender.com`)
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI` = `https://SEU-BACKEND.onrender.com/auth/google/callback`
   - `YOUTUBE_REDIRECT_URI` = `https://SEU-BACKEND.onrender.com/integrations/youtube/callback`
   - `META_CLIENT_ID`, `META_CLIENT_SECRET`
   - `META_REDIRECT_URI` = `https://SEU-BACKEND.onrender.com/integrations/instagram/callback`
   - `META_GRAPH_VERSION` = `v23.0`
3. Deploy. Anote a URL do backend (ex.: `https://midiakit-backend.onrender.com`).
4. Teste: abra `https://SEU-BACKEND.onrender.com/health` → deve responder `{"status":"ok"}`.

## 2. Frontend na Vercel

1. vercel.com → **Add New → Project** → mesmo repo.
2. **Root Directory = `frontend`** (importante!). Framework: Next.js.
3. Environment Variables:
   - `NEXT_PUBLIC_API_URL` = URL do Render (ex.: `https://midiakit-backend.onrender.com`)
   - `API_INTERNAL_URL` = a mesma URL do Render
   - `NEXT_PUBLIC_USE_MOCK` = `0`
4. Deploy. Anote a URL da Vercel.
5. Volte no Render e ajuste `FRONTEND_URL` para a URL da Vercel → **redeploy** do backend
   (CORS e cookies dependem disso).

## 3. Migrar o banco (uma vez)

Do seu PC (aponta pro Supabase):
```bash
cd backend
npm install
npx prisma migrate deploy
npm run seed   # opcional: joao@exemplo.com / 123456
```

## 4. Cadastrar os redirects OAuth (com a URL do RENDER)

**Google Cloud** (URIs de redirecionamento autorizados):
```
https://SEU-BACKEND.onrender.com/auth/google/callback
https://SEU-BACKEND.onrender.com/integrations/youtube/callback
```
Habilite a YouTube Data API v3 e o escopo `youtube.readonly`.

**Meta / Instagram** (Business login settings → OAuth redirect URIs):
```
https://SEU-BACKEND.onrender.com/integrations/instagram/callback
```
Como o Render é HTTPS, o Instagram aceita — **não precisa de ngrok**.

## Observações
- Plano free do Render "dorme" após inatividade; a 1ª requisição pode demorar ~30s.
- Rotacione os segredos (banco, Google, Meta, JWT/ENCRYPTION) antes de uso real.
