import { prisma } from "@/config/prisma";
import { HttpError } from "@/utils/http-error";
import type { UpdateProfileInput } from "./profile.schema";
import type { Prisma } from "@prisma/client";

export const profileService = {
  async getByUserId(userId: string) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new HttpError(404, "Perfil não encontrado");
    return profile;
  },

  async update(userId: string, input: UpdateProfileInput) {
    const data: Prisma.ProfileUpdateInput = { ...input } as Prisma.ProfileUpdateInput;
    if (input.links) {
      data.links = input.links as unknown as Prisma.InputJsonValue;
    }
    const profile = await prisma.profile.update({ where: { userId }, data });
    return profile;
  }
};
