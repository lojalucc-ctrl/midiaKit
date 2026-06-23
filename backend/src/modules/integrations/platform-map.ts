// Plataforma exibida no front vs. provedor OAuth que a autentica.
export type Platform = "instagram" | "youtube" | "tiktok";
export type Provider = "google" | "meta";

export const platformToProvider: Record<Platform, Provider> = {
  instagram: "meta",
  youtube: "google",
  tiktok: "meta"
};

export const ALL_PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok"];

export function handleFor(platform: Platform): string {
  return platform === "youtube" ? "Meu Canal" : "@meuperfil";
}
