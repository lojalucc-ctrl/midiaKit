import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { env } from "@/config/env";
import { errorHandler } from "@/middlewares/error-handler";

import authRoutes from "@/modules/auth/auth.routes";
import profileRoutes from "@/modules/profile/profile.routes";
import integrationsRoutes from "@/modules/integrations/integrations.routes";
import dashboardRoutes from "@/modules/dashboard/dashboard.routes";
import publicRoutes from "@/modules/public/public.routes";

// Origem permitida: a do FRONTEND_URL, localhost (dev) ou qualquer *.vercel.app.
function isAllowedOrigin(origin: string): boolean {
  try {
    const { hostname } = new URL(origin);
    if (origin === env.frontendUrl) return true;
    if (hostname === "localhost" || hostname === "127.0.0.1") return true;
    if (hostname.endsWith(".vercel.app")) return true;
    return false;
  } catch {
    return false;
  }
}

export function createApp() {
  const app = express();
  app.set("trust proxy", 1);

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })
  );

  app.use(express.json({ limit: "8mb" }));
  app.use(cookieParser());

  // CORS com credenciais (cookies HTTP-Only) — reflete a origem se permitida.
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true); // server-to-server / curl
        cb(null, isAllowedOrigin(origin));
      },
      credentials: true
    })
  );

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Muitas tentativas. Tente novamente em alguns minutos." }
  });
  app.use(["/auth/login", "/auth/register"], authLimiter);

  app.use("/auth", authRoutes);
  app.use("/profile", profileRoutes);
  app.use("/integrations", integrationsRoutes);
  app.use("/dashboard", dashboardRoutes);
  app.use("/public", publicRoutes);

  app.use(errorHandler);
  return app;
}
