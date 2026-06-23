# Configuração de OAuth (Google + Instagram)

As credenciais já vêm no `.env`. Para funcionarem, os **redirect URIs** precisam
estar cadastrados em cada console (devem bater caractere por caractere).

## Google (login social)

Google Cloud Console → projeto **midiakit-500223** → APIs e serviços →
Credenciais → seu OAuth Client (Aplicativo da Web). Adicione em
**URIs de redirecionamento autorizados**:

```
http://localhost:3333/auth/google/callback
```

Se o app estiver em modo "Testes" (Tela de consentimento OAuth), adicione seu
e-mail em **Usuários de teste**.

## Instagram (fluxo "Instagram API with Instagram Login")

> Importante: este projeto usa o fluxo NOVO (Business Login for Instagram),
> com endpoints `instagram.com` / `graph.instagram.com` e escopo
> `instagram_business_basic`. NÃO é o fluxo antigo via Facebook Login.

No **Meta App Dashboard → Instagram → API setup with Instagram login →
3. Set up Instagram business login → Business login settings**:

1. Confirme o **Instagram App ID** e **Instagram App Secret** (são os que estão
   no `.env`: `META_CLIENT_ID` / `META_CLIENT_SECRET`).
2. Em **OAuth redirect URIs**, adicione:
   ```
   http://localhost:3333/integrations/instagram/callback
   ```
   (O dashboard pode adicionar uma barra `/` no fim — confira a lista.)

Requisitos:
- A conta do Instagram precisa ser **profissional** (Business ou Creator).
- Enquanto o app estiver em desenvolvimento, adicione a conta como **tester**
  (App Roles → Roles) e aceite o convite no Instagram.
- Escopo usado: `instagram_business_basic` (já dá `followers_count`,
  `follows_count`, `media_count`, `username`).

### Atenção ao HTTPS (limitação comum em local)

O Business Login do Instagram costuma exigir **redirect URIs em HTTPS**. Se o
console recusar `http://localhost`, use um túnel HTTPS (ex.: ngrok):

1. Rode `ngrok http 3333` → pegue a URL https (ex.: `https://abc123.ngrok.app`).
2. Cadastre no dashboard: `https://abc123.ngrok.app/integrations/instagram/callback`
3. No `.env`, ajuste:
   ```
   BACKEND_PUBLIC_URL="https://abc123.ngrok.app"
   META_REDIRECT_URI="https://abc123.ngrok.app/integrations/instagram/callback"
   ```
4. `docker compose down && docker compose up` (sem rebuild).

## YouTube (OAuth Google + YouTube Data API v3)

Usa o **mesmo** OAuth Client do login Google. No Google Cloud Console
(projeto **midiakit-500223**):

1. **APIs e serviços → Biblioteca** → habilite a **YouTube Data API v3**.
2. No seu OAuth Client (Web), em **URIs de redirecionamento autorizados**, adicione:
   ```
   http://localhost:3333/integrations/youtube/callback
   ```
3. Na **Tela de consentimento OAuth**, adicione o escopo
   `https://www.googleapis.com/auth/youtube.readonly` e, se estiver em "Testes",
   inclua seu e-mail em **Usuários de teste**.

Ao conectar, o app pega o canal do usuário (`channels?mine=true`) e salva
`subscriberCount` (seguidores), `videoCount` e média de views por vídeo.

## Como funciona no app

- **Google**: botão "Continuar com Google" → `/auth/google` → consent →
  `/auth/google/callback` cria/loga o usuário e volta ao `/dashboard`.
- **Instagram**: "Conectar" → `/integrations/instagram/authorize-url` gera a URL
  do consent → após autorizar, `/integrations/instagram/callback` troca o code
  por token de curta duração → token de **longa duração (60 dias)** → busca
  `followers_count` etc. em `graph.instagram.com/me` → salva o token
  **cifrado (AES-256)** e as métricas **reais**.
- **YouTube**: "Conectar" → consent do Google (escopo youtube.readonly) →
  `/integrations/youtube/callback` busca o canal e salva inscritos/vídeos reais.
- TikTok segue simulado (sem credenciais).
