import type { Profile } from "@prisma/client";

export interface PortfolioLink {
  id: string;
  label: string;
  url: string;
}

// Converte o Profile do banco no formato esperado pelo Front-End.
export function toPublicProfile(profile: Profile) {
  return {
    username: profile.usernameUrl,
    displayName: profile.displayName ?? profile.usernameUrl,
    bio: profile.bio ?? "",
    avatarUrl: profile.avatarUrl ?? undefined,
    bannerUrl: profile.bannerUrl ?? undefined,
    brandColor: profile.brandColor,
    accentColor: profile.accentColor,
    location: profile.location ?? undefined,
    categories: profile.categories ?? [],
    links: (profile.links as unknown as PortfolioLink[]) ?? []
  };
}
