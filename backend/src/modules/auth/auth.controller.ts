import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authService } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.schema";
import { changePasswordSchema } from "./password.schema";
import { buildGoogleAuthUrl, exchangeGoogleCode, getGoogleUserInfo } from "./google-oauth";
import { signToken } from "@/utils/jwt";
import { setSessionCookie, clearSessionCookie } from "@/utils/cookies";
import { env } from "@/config/env";
import { googleCallbackUrl, frontendOrigin } from "@/utils/request-url";

function publicUser(user: { id: string; email: string; profile: any }) {
  return {
    id: user.id,
    email: user.email,
    name: user.profile?.displayName ?? user.email.split("@")[0],
    username: user.profile?.usernameUrl ?? "",
    avatarUrl: user.profile?.avatarUrl ?? undefined
  };
}

export const authController = {
  async register(req: Request, res: Response) {
    const input = registerSchema.parse(req.body);
    const user = await authService.register(input);
    const token = signToken({ sub: user.id, email: user.email });
    setSessionCookie(res, token);
    res.status(201).json({ user: publicUser(user) });
  },

  async login(req: Request, res: Response) {
    const input = loginSchema.parse(req.body);
    const user = await authService.login(input);
    const token = signToken({ sub: user.id, email: user.email });
    setSessionCookie(res, token);
    res.json({ user: publicUser(user) });
  },

  // Início do OAuth do Google. O redirect_uri é derivado do host do request,
  // e a origem do frontend (para voltar depois) vai assinada no state.
  async googleStart(req: Request, res: Response) {
    const fe = frontendOrigin(req);
    if (!env.oauth.google.clientId) {
      return res.redirect(`${fe}/login?error=google_nao_configurado`);
    }
    const state = jwt.sign({ p: "google_login", fe }, env.jwtSecret, { expiresIn: "10m" });
    res.redirect(buildGoogleAuthUrl(state, googleCallbackUrl(req)));
  },

  async googleCallback(req: Request, res: Response) {
    const { code, state, error } = req.query as Record<string, string>;
    let fe = env.frontendUrl;
    try {
      const payload = jwt.verify(state, env.jwtSecret) as { p: string; fe?: string };
      if (payload.fe) fe = payload.fe;
      if (error) return res.redirect(`${fe}/login?error=${encodeURIComponent(error)}`);
      const { access_token } = await exchangeGoogleCode(code, googleCallbackUrl(req));
      const info = await getGoogleUserInfo(access_token);
      const user = await authService.findOrCreateSocialUser(info.email, info.name, info.picture);
      const token = signToken({ sub: user.id, email: user.email });
      setSessionCookie(res, token);
      res.redirect(`${fe}/dashboard`);
    } catch (e) {
      console.error("[google callback]", e);
      res.redirect(`${fe}/login?error=google_falhou`);
    }
  },

  async changePassword(req: Request, res: Response) {
    const input = changePasswordSchema.parse(req.body);
    await authService.changePassword(req.userId!, input.currentPassword, input.newPassword);
    res.json({ ok: true });
  },

  async me(req: Request, res: Response) {
    const user = await authService.getById(req.userId!);
    res.json(publicUser(user));
  },

  async logout(_req: Request, res: Response) {
    clearSessionCookie(res);
    res.status(204).send();
  }
};
