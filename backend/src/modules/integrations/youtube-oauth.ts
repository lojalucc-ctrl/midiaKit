import { env } from "@/config/env";

export function buildYouTubeAuthUrl(state: string, redirectUri: string): string {
  const p = new URLSearchParams({
    client_id: env.oauth.google.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/youtube.readonly",
    access_type: "offline",
    include_granted_scopes: "true",
    prompt: "consent",
    state
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${p.toString()}`;
}

export async function exchangeYouTubeCode(
  code: string,
  redirectUri: string
): Promise<{ token: string; expiresIn: number }> {
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
  if (!res.ok || !data.access_token) throw new Error(`YT token: ${JSON.stringify(data)}`);
  return { token: data.access_token, expiresIn: Number(data.expires_in ?? 3600) };
}

export interface YouTubeData {
  channelId: string;
  title: string;
  subscribers: number;
  views: number;
  videos: number;
}

export async function getYouTubeChannel(token: string): Promise<YouTubeData> {
  const res = await fetch(
    "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = (await res.json()) as any;
  const ch = data?.items?.[0];
  if (!res.ok || !ch) throw new Error(`YT channel: ${JSON.stringify(data)}`);
  const st = ch.statistics ?? {};
  return {
    channelId: ch.id,
    title: ch.snippet?.title ?? "",
    subscribers: Number(st.subscriberCount ?? 0),
    views: Number(st.viewCount ?? 0),
    videos: Number(st.videoCount ?? 0)
  };
}
