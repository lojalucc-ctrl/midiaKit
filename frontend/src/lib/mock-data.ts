import type {
  DashboardOverview,
  Integration,
  MediaKitProfile,
  PublicMediaKit,
  SocialMetrics,
  User
} from "@/types";

// ----------------------------------------------------------------------------
// Dados de exemplo (mock). Substitua a camada `mock-api.ts` por chamadas reais
// quando o backend estiver disponível — os tipos permanecem os mesmos.
// ----------------------------------------------------------------------------

export const mockUser: User = {
  id: "usr_1",
  name: "João Silva",
  email: "joao@exemplo.com",
  username: "joao",
  avatarUrl: "https://i.pravatar.cc/240?img=12"
};

export const mockMetrics: SocialMetrics[] = [
  {
    platform: "instagram",
    handle: "@joaocria",
    followers: 184500,
    engagementRate: 4.7,
    avgViews: 62000,
    avgLikes: 8700,
    monthlyGrowth: 3.1
  },
  {
    platform: "youtube",
    handle: "Canal do João",
    followers: 92300,
    engagementRate: 6.2,
    avgViews: 41000,
    avgLikes: 3500,
    monthlyGrowth: 2.4
  }
];

export const mockIntegrations: Integration[] = [
  {
    platform: "instagram",
    provider: "meta",
    status: "connected",
    handle: "@joaocria",
    connectedAt: "2026-04-12T10:00:00Z"
  },
  {
    platform: "youtube",
    provider: "google",
    status: "needs_reauth",
    handle: "Canal do João",
    connectedAt: "2026-01-08T10:00:00Z"
  },
  {
    platform: "tiktok",
    provider: "meta",
    status: "disconnected"
  }
];

export const mockOverview: DashboardOverview = {
  totalFollowers: mockMetrics.reduce((acc, m) => acc + m.followers, 0),
  avgEngagementRate:
    mockMetrics.reduce((acc, m) => acc + m.engagementRate, 0) /
    mockMetrics.length,
  totalAvgViews: mockMetrics.reduce((acc, m) => acc + (m.avgViews ?? 0), 0),
  connectedNetworks: mockIntegrations.filter((i) => i.status === "connected")
    .length,
  needsReauth: mockIntegrations.some((i) => i.status === "needs_reauth"),
  metrics: mockMetrics
};

export const mockProfile: MediaKitProfile = {
  username: "joao",
  displayName: "João Silva",
  bio: "Criador de conteúdo sobre tecnologia, lifestyle e produtividade. Ajudo marcas a contar histórias autênticas para uma audiência engajada.",
  avatarUrl: "https://i.pravatar.cc/240?img=12",
  bannerUrl:
    "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=1600&q=80",
  brandColor: "#6d28d9",
  accentColor: "#db2777",
  location: "São Paulo, Brasil",
  categories: ["Tecnologia", "Lifestyle", "Produtividade"],
  links: [
    { id: "l1", label: "Portfólio de campanhas", url: "https://exemplo.com/portfolio" },
    { id: "l2", label: "Mídia Kit em PDF", url: "https://exemplo.com/mediakit.pdf" }
  ]
};

export const publicMediaKits: Record<string, PublicMediaKit> = {
  joao: {
    profile: mockProfile,
    metrics: mockMetrics,
    contactEmail: "contato@joao.com"
  }
};
