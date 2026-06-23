import { env } from "@/config/env";

export function buildGoogleAuthUrl(state: string, redirectUri: string): string {
  const p = new URLSearchParams({
    client_id: env.oauth.google.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    include_granted_scopes: "true",
    prompt: "select_account",
    state
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${p.toString()}`;
}

export async function exchangeGoogleCode(
  code: string,
  redirectUri: string
): Promise<{ access_token: string }> {
  const body = new URLSearchParams({
    code,
    client_id: env.oauth.google.clientId,
    client_secret: env.oauth.google.clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code"
  });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  const data = (await res.json()) as any;
  if (!res.ok || !data.access_token) throw new Error(`Google token: ${JSON.stringify(data)}`);
  return data;
}

export interface GoogleUserInfo {
  email: string;
  name?: string;
  picture?: string;
}

export async function getGoogleUserInfo(token: string): Promise<GoogleUserInfo> {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = (await res.json()) as any;
  if (!res.ok || !data.email) throw new Error(`Google userinfo: ${JSON.stringify(data)}`);
  return data;
}
