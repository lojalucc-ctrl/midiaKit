import { prisma } from "@/config/prisma";
import { encrypt } from "@/utils/crypto";
import {
  ALL_PLATFORMS,
  platformToProvider,
  handleFor,
  type Platform
} from "./platform-map";
import type { InstagramData } from "./meta-oauth";
import type { YouTubeData } from "./youtube-oauth";

// Métricas simuladas (usadas só por plataformas ainda sem OAuth real: youtube/tiktok).
function fakeMetrics(platform: Platform) {
  const base = platform === "youtube" ? 90000 : 150000;
  return {
    followers: base + Math.floor(Math.random() * 80000),
    engagementRate: Number((3 + Math.random() * 4).toFixed(1)),
    avgViews: Math.floor((base / 3) * (0.8 + Math.random())),
    avgLikes: Math.floor((base / 20) * (0.8 + Math.random()))
  };
}

// Lê o handle real do último snapshot, se houver.
function handleFromSnapshot(conn: any, platform: Platform): string {
  const raw = conn?.metrics?.[0]?.rawData as Record<string, unknown> | undefined;
  const username = raw?.username as string | undefined;
  return username ? `@${username}` : handleFor(platform);
}

export const integrationsService = {
  async list(userId: string) {
    const connections = await prisma.oAuthConnection.findMany({
      where: { userId },
      include: { metrics: { orderBy: { updatedAt: "desc" }, take: 1 } }
    });

    return ALL_PLATFORMS.map((platform) => {
      const provider = platformToProvider[platform];
      const conn = connections.find((c) => c.provider === platform);
      const expired =
        conn?.tokenExpiresAt && conn.tokenExpiresAt.getTime() < Date.now();
      return {
        platform,
        provider,
        status: !conn ? "disconnected" : expired ? "needs_reauth" : "connected",
        handle: conn ? handleFromSnapshot(conn, platform) : undefined,
        connectedAt: conn ? conn.tokenExpiresAt?.toISOString() : undefined
      };
    });
  },

  // Conexão SIMULADA (apenas youtube/tiktok no MVP). Instagram usa OAuth real.
  async connect(userId: string, platform: Platform, accessToken?: string) {
    const token = accessToken ?? `mock-access-token-${platform}-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

    const connection = await prisma.oAuthConnection.upsert({
      where: { userId_provider: { userId, provider: platform } },
      update: {
        accessTokenEncrypted: encrypt(token),
        tokenExpiresAt: expiresAt,
        accountId: `acct_${platform}`
      },
      create: {
        userId,
        provider: platform,
        accountId: `acct_${platform}`,
        accessTokenEncrypted: encrypt(token),
        refreshTokenEncrypted: encrypt(`mock-refresh-${platform}`),
        tokenExpiresAt: expiresAt
      }
    });

    await prisma.metricsSnapshot.create({
      data: { connectionId: connection.id, rawData: fakeMetrics(platform) }
    });

    return this.list(userId);
  },

  // Conexão REAL do Instagram (fluxo Instagram Login). Guarda o token de longa
  // duração CIFRADO (AES-256) e as métricas reais.
  async saveInstagramConnection(
    userId: string,
    data: InstagramData,
    token: string,
    expiresInSeconds: number
  ) {
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
    const connection = await prisma.oAuthConnection.upsert({
      where: { userId_provider: { userId, provider: "instagram" } },
      update: {
        accountId: data.igId,
        accessTokenEncrypted: encrypt(token),
        tokenExpiresAt: expiresAt
      },
      create: {
        userId,
        provider: "instagram",
        accountId: data.igId,
        accessTokenEncrypted: encrypt(token),
        tokenExpiresAt: expiresAt
      }
    });

    await prisma.metricsSnapshot.create({
      data: {
        connectionId: connection.id,
        rawData: {
          username: data.username,
          followers: data.followers,
          follows: data.follows,
          mediaCount: data.mediaCount,
          engagementRate: 0,
          avgViews: 0,
          avgLikes: 0
        }
      }
    });

    return connection;
  },

  // Conexão REAL do YouTube (OAuth Google + Data API v3).
  async saveYouTubeConnection(
    userId: string,
    data: YouTubeData,
    token: string,
    expiresInSeconds: number
  ) {
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
    const connection = await prisma.oAuthConnection.upsert({
      where: { userId_provider: { userId, provider: "youtube" } },
      update: {
        accountId: data.channelId,
        accessTokenEncrypted: encrypt(token),
        tokenExpiresAt: expiresAt
      },
      create: {
        userId,
        provider: "youtube",
        accountId: data.channelId,
        accessTokenEncrypted: encrypt(token),
        tokenExpiresAt: expiresAt
      }
    });

    await prisma.metricsSnapshot.create({
      data: {
        connectionId: connection.id,
        rawData: {
          username: data.title,
          followers: data.subscribers,
          mediaCount: data.videos,
          // Média de views por vídeo como aproximação.
          avgViews: data.videos > 0 ? Math.round(data.views / data.videos) : 0,
          follows: 0,
          engagementRate: 0,
          avgLikes: 0
        }
      }
    });

    return connection;
  },

  async disconnect(userId: string, platform: Platform) {
    await prisma.oAuthConnection.deleteMany({
      where: { userId, provider: platform }
    });
    return this.list(userId);
  },

  // Remove TODAS as conexões/dados de um usuário (usado na exclusão de dados).
  async disconnectAll(userId: string) {
    await prisma.oAuthConnection.deleteMany({ where: { userId } });
  }
};
