# Rodar o Instagram com ngrok (HTTPS)

O Business Login do Instagram exige redirect **HTTPS**. Em desenvolvimento,
use um túnel ngrok apontando para o backend (porta 3333).

## Passos

1. Instale o ngrok (https://ngrok.com/download) e autentique (`ngrok config add-authtoken ...`).

2. Suba o projeto normalmente:
   ```powershell
   docker compose up --build
   ```

3. Em outro terminal, abra o túnel para o backend:
   ```powershell
   ngrok http 3333
   ```
   Copie a URL https gerada, ex.: `https://abc123.ngrok-free.app`

4. No arquivo `.env` (raiz), troque estas duas linhas pela URL do túnel:
   ```env
   BACKEND_PUBLIC_URL="https://abc123.ngrok-free.app"
   META_REDIRECT_URI="https://abc123.ngrok-free.app/integrations/instagram/callback"
   ```

5. No painel da Meta (Instagram → API setup with Instagram login → Business
   login settings → **OAuth redirect URIs**), cadastre **exatamente**:
   ```
   https://abc123.ngrok-free.app/integrations/instagram/callback
   ```

6. Recarregue o backend para ler o novo `.env` (sem rebuild):
   ```powershell
   docker compose up -d
   ```
   (ou `docker compose down && docker compose up`)

7. No app, clique em **Conectar** no Instagram. O popup abre o login do
   Instagram; ao autorizar, o ngrok recebe o callback, a janela fecha sozinha
   e o card é atualizado.

## Observações

- A URL gratuita do ngrok muda a cada reinício do túnel. Quando mudar, repita
  os passos 4 e 5 (atualizar `.env` e o redirect no painel da Meta).
- Google/YouTube continuam em `http://localhost:3333` (o Google aceita localhost),
  então **só o Instagram** precisa do ngrok.
- O frontend continua em `http://localhost:3000`.
