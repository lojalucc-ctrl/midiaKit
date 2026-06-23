import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Informe seu e-mail").email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres")
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Informe seu nome"),
    email: z.string().min(1, "Informe seu e-mail").email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"]
  });
export type RegisterValues = z.infer<typeof registerSchema>;

export const profileSchema = z.object({
  displayName: z.string().min(2, "Informe um nome de exibição"),
  bio: z.string().max(280, "A bio deve ter no máximo 280 caracteres"),
  location: z.string().optional(),
  brandColor: z.string().regex(/^#([0-9a-fA-F]{6})$/, "Cor inválida (use #RRGGBB)"),
  accentColor: z.string().regex(/^#([0-9a-fA-F]{6})$/, "Cor inválida (use #RRGGBB)")
});
export type ProfileValues = z.infer<typeof profileSchema>;

export const quoteSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  brand: z.string().min(2, "Informe a marca/empresa"),
  email: z.string().min(1, "Informe seu e-mail").email("E-mail inválido"),
  message: z.string().min(10, "Descreva brevemente a campanha (mín. 10 caracteres)")
});
export type QuoteValues = z.infer<typeof quoteSchema>;
