import { Router } from "express";
import { integrationsController } from "./integrations.controller";
import { requireAuth } from "@/middlewares/auth";
import { asyncHandler } from "@/utils/async-handler";

const router = Router();

// Callbacks públicos (provedor redireciona o navegador; userId vem no `state`).
router.get("/instagram/callback", asyncHandler(integrationsController.instagramCallback));
router.get("/youtube/callback", asyncHandler(integrationsController.youtubeCallback));

// Demais rotas exigem sessão.
router.use(requireAuth);
router.get("/", asyncHandler(integrationsController.list));
router.get("/:platform/authorize-url", asyncHandler(integrationsController.authorizeUrl));
router.post("/:platform/connect", asyncHandler(integrationsController.connect));
router.delete("/:platform", asyncHandler(integrationsController.disconnect));

export default router;
