import { z } from "zod";

export const updateProfileSchema = z.object({
  displayName: z.string().min(2).optional(),
  bio: z.string().max(280).optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  bannerUrl: z.string().url().optional().or(z.literal("")),
  location: z.string().optional(),
  brandColor: z.string().regex(/^#([0-9a-fA-F]{6})$/).optional(),
  accentColor: z.string().regex(/^#([0-9a-fA-F]{6})$/).optional(),
  categories: z.array(z.string()).optional(),
  links: z
    .array(z.object({ id: z.string(), label: z.string(), url: z.string().url() }))
    .optional()
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
