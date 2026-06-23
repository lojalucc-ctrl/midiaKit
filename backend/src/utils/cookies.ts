import { Response } from "express";
import { env } from "@/config/env";

export const SESSION_COOKIE = "mk_session";

// Token de sessão entregue EXCLUSIVAMENTE via cookie HTTP-Only (proteção XSS).
export function setSessionCookie(res: Response, token: string): void {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    path: "/"
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
}
