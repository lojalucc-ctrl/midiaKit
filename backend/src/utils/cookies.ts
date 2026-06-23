import { Response } from "express";
import { env } from "@/config/env";

export const SESSION_COOKIE = "mk_session";

// Atributos do cookie de sessão. Cross-site (front e back em domínios
// diferentes) exige SameSite=None + Secure em produção.
const cookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.isProd ? ("none" as const) : ("lax" as const),
  path: "/"
};

// Token de sessão entregue EXCLUSIVAMENTE via cookie HTTP-Only (proteção XSS).
export function setSessionCookie(res: Response, token: string): void {
  res.cookie(SESSION_COOKIE, token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
  });
}

// Para o navegador remover um cookie cross-site (SameSite=None; Secure) os
// atributos precisam ser os MESMOS do set — senão o cookie não é apagado e o
// usuário continua "logado" após o logout.
export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE, cookieOptions);
  // Reforço: também sobrescreve com valor vazio e expiração no passado.
  res.cookie(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0, expires: new Date(0) });
}
