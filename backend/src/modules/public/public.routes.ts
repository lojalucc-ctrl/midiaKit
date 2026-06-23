import { Router } from "express";
import { publicController } from "./public.controller";
import { asyncHandler } from "@/utils/async-handler";

const router = Router();

// Rotas públicas (sem autenticação).
router.get("/:username", asyncHandler(publicController.getMediaKit));
router.post("/:username/quote", asyncHandler(publicController.requestQuote));

export default router;
