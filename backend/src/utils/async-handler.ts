import { NextFunction, Request, Response, RequestHandler } from "express";

// Envolve handlers async para encaminhar rejeições ao errorHandler.
export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
