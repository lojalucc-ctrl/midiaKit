import { Router } from "express";
import { dashboardController } from "./dashboard.controller";
import { requireAuth } from "@/middlewares/auth";
import { asyncHandler } from "@/utils/async-handler";

const router = Router();

router.use(requireAuth);
router.get("/overview", asyncHandler(dashboardController.overview));

export default router;
