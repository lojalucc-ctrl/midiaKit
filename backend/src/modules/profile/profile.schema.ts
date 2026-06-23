import { z } from "zod";

// avatarUrl/bannerUrl aceitam URL http(s) OU data URL (base64) — por isso
// validamos como string (não z.url(), que rejeitaria data:).
export const updateProfileSchema = z.object({
  displayName: z.string().min(2).optional(),
  bio: z.string().max(280).optional(),
  avatarUrl: z.string().max(8_000_000).optional(),
  bannerUrl: z.string().max(8_000_000).optional(),
  location: z.string().max(120).optional(),
  brandColor: z.string().regex(/^#([0-9a-fA-F]{6})$/).optional(),
  accentColor: z.string().regex(/^#([0-9a-fA-F]{6})$/).optional(),
  categories: z.array(z.string()).optional(),
  links: z
    .array(z.object({ id: z.string(), label: z.string(), url: z.string().url() }))
    .optional()
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
