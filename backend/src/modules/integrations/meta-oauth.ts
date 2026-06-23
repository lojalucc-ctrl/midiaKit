import { env } from "@/config/env";

// Instagram API with Instagram Login (Business Login).
export function buildInstagramAuthUrl(state: string, redirectUri: string): string {
  const p = new URLSearchParams({
    client_id: env.oauth.meta.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "instagram_business_basic",
    enable_fb_login: "false",
    force_reauth: "true",
    state
  });
  return `https://www.instagram.com/oauth/authorize?${p.toString()}`;
}

export async function exchangeCodeForToken(
  code: string,
  redirectUri: string
): Promise<{ token: string }> {
  const form = new URLSearchParams({
    client_id: env.oauth.meta.clientId,
    client_secret: env.oauth.meta.clientSecret,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code: code.replace(/#_$/, "")
  });
  const res = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form
  });
  const data = (await res.json()) as any;
  const payload = Array.isArray(data?.data) ? data.data[0] : data;
  if (!res.ok || !payload?.access_token) throw new Error(`IG token: ${JSON.stringify(data)}`);
  return { token: payload.access_token };
}

export async function getLongLivedToken(short: string): Promise<{ token: string; expiresIn: number }> {
  const p = new URLSearchParams({
    grant_type: "ig_exchange_token",
    client_secret: env.oauth.meta.clientSecret,
    access_token: short
  });
  const res = await fetch(`https://graph.instagram.com/access_token?${p.toString()}`);
  const data = (await res.json()) as any;
  if (!res.ok || !data.access_token) throw new Error(`IG long token: ${JSON.stringify(data)}`);
  return { token: data.access_token, expiresIn: Number(data.expires_in ?? 5184000) };
}

export interface InstagramData {
  igId: string;
  username: string;
  followers: number;
  follows: number;
  mediaCount: number;
}

export async function getInstagramData(token: string): Promise<InstagramData> {
  const fields = "user_id,username,followers_count,follows_count,media_count";
  const res = await fetch(`https://graph.instagram.com/me?fields=${fields}&access_token=${token}`);
  const m = (await res.json()) as any;
  if (!res.ok || (!m.user_id && !m.id)) throw new Error(`IG data: ${JSON.stringify(m)}`);
  return {
    igId: String(m.user_id ?? m.id),
    username: m.username ?? "",
    followers: Number(m.followers_count ?? 0),
    follows: Number(m.follows_count ?? 0),
    mediaCount: Number(m.media_count ?? 0)
  };
}
