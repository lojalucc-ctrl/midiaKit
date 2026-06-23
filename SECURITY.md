# Segurança & Autenticação

Resumo das práticas aplicadas no MVP.

## Sessão e logout
- Sessão por **JWT em cookie HTTP-Only** (não acessível por JavaScript → anti-XSS),
  com `SameSite` e `Secure` em produção.
- **Logout seguro**: encerra a sessão no servidor (limpa o cookie), apaga TODO o
  cache em memória do app e navega com `replace()`. O **botão "voltar" não reabre
  a conta**.
- **Proteção de rotas** (`middleware.ts`): sem sessão, `/dashboard/*` redireciona
  para `/login`; com sessão, `/login` e `/register` redirecionam ao painel.
- **No-store** nas páginas autenticadas (impede o navegador de reexibir telas do
  cache após o logout) + `AuthGuard` que valida a sessão e redireciona em caso de
  token inválido/expirado (defesa em profundidade).

## Alertas ao usuário
- Aviso ao **encerrar sessão** (diálogo de confirmação explicando o efeito).
- Toast de **sessão iniciada com segurança** ao logar/cadastrar.
- Toast de **sessão expirada** em qualquer `401` dentro da área logada, com
  redirecionamento automático ao login.
- Mensagens de retorno do OAuth (sucesso/erro) ao conectar redes.
- Nota de segurança nas telas de login/registro e banner de permissões nas
  integrações (tokens criptografados, possibilidade de revogar a qualquer momento).

## Tokens de redes sociais
- Nunca em texto puro: **AES-256-CBC** em repouso (`backend/src/utils/crypto.ts`).
- O front nunca recebe esses tokens; toda a comunicação com Instagram/YouTube é
  feita pelo backend.

## Backend
- **helmet**: cabeçalhos de segurança (anti-clickjacking, nosniff, etc.).
- **express-rate-limit**: limite de tentativas em `/auth/login` e `/auth/register`
  (anti força-bruta).
- **bcrypt** para hash de senhas. **CORS** restrito ao domínio do front com
  `credentials`. Body limitado a 1MB.

## Recomendações para produção
- Rotacione `JWT_SECRET`, `ENCRYPTION_KEY` e os segredos OAuth (e a senha do banco).
- Use HTTPS e domínios reais; ajuste `SameSite=None; Secure` nos cookies.
- Ative verificação dos apps no Google/Meta antes de uso público.
