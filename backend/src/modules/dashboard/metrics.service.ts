import { prisma } from "@/config/prisma";
import { handleFor, platformToProvider, type Platform } from "@/modules/integrations/platform-map";

export interface SocialMetrics {
  platform: Platform;
  handle: string;
  followers: number;
  engagementRate: number;
  avgViews?: number;
  avgLikes?: number;
  monthlyGrowth?: number;
}

// Lê as conexões ativas de um usuário e monta as métricas a partir do snapshot
// mais recente de cada uma.
export async function buildMetricsForUser(userId: string): Promise<{
  metrics: SocialMetrics[];
  needsReauth: boolean;
  connectedNetworks: number;
}> {
  const connections = await prisma.oAuthConnection.findMany({
    where: { userId },
    include: { metrics: { orderBy: { updatedAt: "desc" }, take: 1 } }
  });

  const now = Date.now();
  let needsReauth = false;

  const metrics: SocialMetrics[] = connections.map((conn) => {
    if (conn.tokenExpiresAt && conn.tokenExpiresAt.getTime() < now) {
      needsReauth = true;
    }
    const raw = (conn.metrics[0]?.rawData ?? {}) as Record<string, number>;
    const platform = conn.provider as Platform;
    return {
      platform,
      handle: handleFor(platform),
      followers: Number(raw.followers ?? 0),
      engagementRate: Number(raw.engagementRate ?? 0),
      avgViews: raw.avgViews != null ? Number(raw.avgViews) : undefined,
      avgLikes: raw.avgLikes != null ? Number(raw.avgLikes) : undefined,
      monthlyGrowth: raw.monthlyGrowth != null ? Number(raw.monthlyGrowth) : undefined
    };
  });

  return {
    metrics,
    needsReauth,
    connectedNetworks: connections.filter(
      (c) => !(c.tokenExpiresAt && c.tokenExpiresAt.getTime() < now)
    ).length
  };
}

// Ajuda o TS a saber que platformToProvider é usado (mapeamento documentado).
export const _providerOf = platformToProvider;
