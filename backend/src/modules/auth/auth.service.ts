import { prisma } from "@/config/prisma";
import { hashPassword, comparePassword } from "@/utils/password";
import { HttpError } from "@/utils/http-error";
import type { RegisterInput, LoginInput } from "./auth.schema";

function slugFromEmail(email: string): string {
  return email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 20);
}

async function uniqueUsername(base: string): Promise<string> {
  let candidate = base || "user";
  let n = 0;
  while (await prisma.profile.findUnique({ where: { usernameUrl: candidate } })) {
    n += 1;
    candidate = `${base}${n}`;
  }
  return candidate;
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new HttpError(409, "E-mail já cadastrado");

    const passwordHash = await hashPassword(input.password);
    const username = await uniqueUsername(slugFromEmail(input.email));

    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: passwordHash,
        profile: {
          create: {
            usernameUrl: username,
            displayName: input.name ?? username,
            bio: ""
          }
        }
      },
      include: { profile: true }
    });

    return user;
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: { profile: true }
    });
    if (!user || !user.password) {
      throw new HttpError(401, "Credenciais inválidas");
    }
    const ok = await comparePassword(input.password, user.password);
    if (!ok) throw new HttpError(401, "Credenciais inválidas");
    return user;
  },

  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { profile: true }
    });
    if (!user) throw new HttpError(404, "Usuário não encontrado");
    return user;
  },

  // Troca de senha. Usuários sociais (sem senha) podem definir a primeira.
  async changePassword(userId: string, currentPassword: string | undefined, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new HttpError(404, "Usuário não encontrado");
    if (user.password) {
      if (!currentPassword) throw new HttpError(400, "Informe a senha atual");
      const ok = await comparePassword(currentPassword, user.password);
      if (!ok) throw new HttpError(401, "Senha atual incorreta");
    }
    await prisma.user.update({
      where: { id: userId },
      data: { password: await hashPassword(newPassword) }
    });
  },

  // Social Login (Google): cria/retorna usuário sem senha, preenchendo avatar/nome.
  async findOrCreateSocialUser(email: string, name?: string, avatarUrl?: string) {
    const existing = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });
    if (existing) {
      // Atualiza avatar se ainda não houver.
      if (avatarUrl && existing.profile && !existing.profile.avatarUrl) {
        await prisma.profile.update({
          where: { userId: existing.id },
          data: { avatarUrl }
        });
      }
      return existing;
    }

    const username = await uniqueUsername(slugFromEmail(email));
    const user = await prisma.user.create({
      data: {
        email,
        password: null,
        profile: {
          create: {
            usernameUrl: username,
            displayName: name ?? username,
            bio: "",
            avatarUrl: avatarUrl ?? null
          }
        }
      },
      include: { profile: true }
    });
    return user;
  }
};
