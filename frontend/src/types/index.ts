// Tipagens compartilhadas da API do SaaS de Mídia Kit.

export type SocialPlatform = "instagram" | "youtube" | "tiktok";

export type IntegrationStatus = "connected" | "disconnected" | "needs_reauth";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatarUrl?: string;
}

export interface SocialMetrics {
  platform: SocialPlatform;
  handle: string;
  followers: number;
  engagementRate: number; // percentual, ex.: 4.2
  avgViews?: number;
  avgLikes?: number;
  monthlyGrowth?: number; // percentual
}

export interface Integration {
  platform: SocialPlatform;
  status: IntegrationStatus;
  /** Provedor OAuth que orquestra a conexão. */
  provider: "google" | "meta";
  handle?: string;
  connectedAt?: string;
}

export interface DashboardOverview {
  totalFollowers: number;
  avgEngagementRate: number;
  totalAvgViews: number;
  connectedNetworks: number;
  needsReauth: boolean;
  metrics: SocialMetrics[];
}

export interface PortfolioLink {
  id: string;
  label: string;
  url: string;
}

export interface MediaKitProfile {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl?: string;
  bannerUrl?: string;
  /** Cores do tema do mídia kit público. */
  brandColor: string;
  accentColor: string;
  location?: string;
  categories: string[];
  links: PortfolioLink[];
}

export interface PublicMediaKit {
  profile: MediaKitProfile;
  metrics: SocialMetrics[];
  contactEmail: string;
}

export interface QuoteRequest {
  name: string;
  brand: string;
  email: string;
  message: string;
}

export interface AuthResponse {
  user: User;
}
