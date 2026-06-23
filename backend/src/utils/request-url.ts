import { Request } from "express";
import { env } from "@/config/env";

// URL pública do backend, derivada do request (atrás do proxy do Render usa
// x-forwarded-proto). Ex.: https://midiakit.onrender.com
export function backendBaseUrl(req: Request): string {
  const proto = (req.headers["x-forwarded-proto"] as string)?.split(",")[0] || req.protocol;
  const host = req.get("host");
  if (host) return `${proto}://${host}`;
  return env.backendUrl;
}

// Caminhos de callback de cada provedor (a partir do host do request).
export function googleCallbackUrl(req: Request): string {
  return `${backendBaseUrl(req)}/auth/google/callback`;
}
export function youtubeCallbackUrl(req: Request): string {
  return `${backendBaseUrl(req)}/integrations/youtube/callback`;
}
export function instagramCallbackUrl(req: Request): string {
  return `${backendBaseUrl(req)}/integrations/instagram/callback`;
}

// Origem do frontend (para redirecionar de volta / postMessage), derivada do
// cabeçalho Origin ou Referer; cai para FRONTEND_URL se não houver.
export function frontendOrigin(req: Request): string {
  const origin = req.headers.origin as string | undefined;
  if (origin) return origin;
  const referer = req.headers.referer as string | undefined;
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      /* ignore */
    }
  }
  return env.frontendUrl;
}
