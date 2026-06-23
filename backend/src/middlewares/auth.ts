import { NextFunction, Request, Response } from "express";
import { verifyToken } from "@/utils/jwt";
import { SESSION_COOKIE } from "@/utils/cookies";
import { HttpError } from "@/utils/http-error";

// Lê o JWT do cookie HTTP-Only e popula req.userId.
export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) {
    throw new HttpError(401, "Não autenticado");
  }
  try {
    const payload = verifyToken(token);
    req.userId = payload.sub;
    req.userEmail = payload.email;
    next();
  } catch {
    throw new HttpError(401, "Sessão inválida ou expirada");
  }
}
