import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/config/prisma";
import { HttpError } from "@/utils/http-error";
import { toPublicProfile } from "@/utils/mappers";
import { buildMetricsForUser } from "@/modules/dashboard/metrics.service";

const quoteSchema = z.object({
  name: z.string().min(2),
  brand: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10)
});

export const publicController = {
  // Vitrine pública do Mídia Kit — consumida pelo Server Component /[username].
  async getMediaKit(req: Request, res: Response) {
    const profile = await prisma.profile.findUnique({
      where: { usernameUrl: req.params.username },
      include: { user: true }
    });
    if (!profile) throw new HttpError(404, "Mídia Kit não encontrado");

    const { metrics } = await buildMetricsForUser(profile.userId);

    res.json({
      profile: toPublicProfile(profile),
      metrics,
      contactEmail: profile.user.email
    });
  },

  // Solicitação de orçamento de uma marca. No MVP apenas valida e confirma;
  // em produção dispararia e-mail/notificação ao criador.
  async requestQuote(req: Request, res: Response) {
    const profile = await prisma.profile.findUnique({
      where: { usernameUrl: req.params.username }
    });
    if (!profile) throw new HttpError(404, "Mídia Kit não encontrado");
    quoteSchema.parse(req.body);
    res.status(201).json({ ok: true });
  }
};
