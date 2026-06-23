import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { integrationsService } from "./integrations.service";
import { buildInstagramAuthUrl, exchangeCodeForToken, getLongLivedToken, getInstagramData } from "./meta-oauth";
import { buildYouTubeAuthUrl, exchangeYouTubeCode, getYouTubeChannel } from "./youtube-oauth";
import { renderOAuthResult } from "./oauth-result";
import { ALL_PLATFORMS, type Platform } from "./platform-map";
import { HttpError } from "@/utils/http-error";
import { env } from "@/config/env";
import {
  instagramCallbackUrl,
  youtubeCallbackUrl,
  frontendOrigin
} from "@/utils/request-url";

function parsePlatform(value: string): Platform {
  if (!ALL_PLATFORMS.includes(value as Platform)) {
    throw new HttpError(400, "Plataforma inválida");
  }
  return value as Platform;
}

export const integrationsController = {
  async list(req: Request, res: Response) {
    res.json(await integrationsService.list(req.userId!));
  },

  async authorizeUrl(req: Request, res: Response) {
    const platform = parsePlatform(req.params.platform);
    const fe = frontendOrigin(req);
    if (platform === "instagram" && env.oauth.meta.clientId) {
      const state = jwt.sign({ uid: req.userId, p: "ig_oauth", fe }, env.jwtSecret, { expiresIn: "10m" });
      return res.json({ url: buildInstagramAuthUrl(state, instagramCallbackUrl(req)) });
    }
    if (platform === "youtube" && env.oauth.google.clientId) {
      const state = jwt.sign({ uid: req.userId, p: "yt_oauth", fe }, env.jwtSecret, { expiresIn: "10m" });
      return res.json({ url: buildYouTubeAuthUrl(state, youtubeCallbackUrl(req)) });
    }
    res.json({ url: null });
  },

  async connect(req: Request, res: Response) {
    const platform = parsePlatform(req.params.platform);
    res.json(await integrationsService.connect(req.userId!, platform));
  },

  async instagramCallback(req: Request, res: Response) {
    const { code, state, error, error_description } = req.query as Record<string, string>;
    let fe = env.frontendUrl;
    try {
      const payload = jwt.verify(state, env.jwtSecret) as { uid: string; p: string; fe?: string };
      if (payload.fe) fe = payload.fe;
      if (error) return renderOAuthResult(res, { provider: "instagram", ok: false, message: error_description || error, frontendUrl: fe });
      if (payload.p !== "ig_oauth" || !payload.uid) throw new Error("state inválido");
      const { token: shortToken } = await exchangeCodeForToken(code, instagramCallbackUrl(req));
      const { token: longToken, expiresIn } = await getLongLivedToken(shortToken);
      const igData = await getInstagramData(longToken);
      await integrationsService.saveInstagramConnection(payload.uid, igData, longToken, expiresIn);
      renderOAuthResult(res, { provider: "instagram", ok: true, frontendUrl: fe });
    } catch (e: any) {
      console.error("[instagram callback]", e?.message || e);
      renderOAuthResult(res, { provider: "instagram", ok: false, message: e?.message || "falha_instagram", frontendUrl: fe });
    }
  },

  async youtubeCallback(req: Request, res: Response) {
    const { code, state, error } = req.query as Record<string, string>;
    let fe = env.frontendUrl;
    try {
      const payload = jwt.verify(state, env.jwtSecret) as { uid: string; p: string; fe?: string };
      if (payload.fe) fe = payload.fe;
      if (error) return renderOAuthResult(res, { provider: "youtube", ok: false, message: error, frontendUrl: fe });
      if (payload.p !== "yt_oauth" || !payload.uid) throw new Error("state inválido");
      const { token, expiresIn } = await exchangeYouTubeCode(code, youtubeCallbackUrl(req));
      const channel = await getYouTubeChannel(token);
      await integrationsService.saveYouTubeConnection(payload.uid, channel, token, expiresIn);
      renderOAuthResult(res, { provider: "youtube", ok: true, frontendUrl: fe });
    } catch (e: any) {
      console.error("[youtube callback]", e?.message || e);
      renderOAuthResult(res, { provider: "youtube", ok: false, message: e?.message || "falha_youtube", frontendUrl: fe });
    }
  },

  async disconnect(req: Request, res: Response) {
    const platform = parsePlatform(req.params.platform);
    res.json(await integrationsService.disconnect(req.userId!, platform));
  }
};
