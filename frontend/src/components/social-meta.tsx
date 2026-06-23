import { Instagram, Youtube, Music2 } from "lucide-react";
import type { SocialPlatform } from "@/types";

export const platformLabel: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok"
};

export function PlatformIcon({
  platform,
  className
}: {
  platform: SocialPlatform;
  className?: string;
}) {
  if (platform === "instagram") return <Instagram className={className} />;
  if (platform === "youtube") return <Youtube className={className} />;
  return <Music2 className={className} />;
}
