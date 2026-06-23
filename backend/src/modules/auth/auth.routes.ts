import { Router } from "express";
import { authController } from "./auth.controller";
import { asyncHandler } from "@/utils/async-handler";
import { requireAuth } from "@/middlewares/auth";

const router = Router();

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.post("/logout", asyncHandler(authController.logout));

// OAuth Google (login social)
router.get("/google", asyncHandler(authController.googleStart));
router.get("/google/callback", asyncHandler(authController.googleCallback));

router.post("/password", requireAuth, asyncHandler(authController.changePassword));
router.get("/me", requireAuth, asyncHandler(authController.me));

export default router;
