import { z } from "zod";

export const changePasswordSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "A nova senha deve ter ao menos 6 caracteres")
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
