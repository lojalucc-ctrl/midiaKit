import { Router } from "express";
import { profileController } from "./profile.controller";
import { requireAuth } from "@/middlewares/auth";
import { asyncHandler } from "@/utils/async-handler";

const router = Router();

router.use(requireAuth);
router.get("/", asyncHandler(profileController.get));
router.put("/", asyncHandler(profileController.update));

export default router;
