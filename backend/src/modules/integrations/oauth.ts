import { env } from "@/config/env";
import type { Platform } from "./platform-map";

// Monta a URL de consentimento OAuth real (usada pelo endpoint /authorize-url).
// O Front-End redireciona o navegador para esta URL; o callback é tratado no
// backend, que troca o code por tokens e os salva CRIPTOGRAFADOS.
export function buildAuthorizeUrl(platform: Platform, redirectUri: string): string | null {
  if (platform === "youtube") {
    if (!env.oauth.google.clientId) return null;
    const params = new URLSearchParams({
      client_id: env.oauth.google.clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
      scope: "https://www.googleapis.com/auth/youtube.readonly"
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }
  // instagram / tiktok -> Meta
  if (!env.oauth.meta.clientId) return null;
  const params = new URLSearchParams({
    client_id: env.oauth.meta.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "instagram_basic,instagram_manage_insights"
  });
  return `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;
}
