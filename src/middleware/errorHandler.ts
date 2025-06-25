import { Request, Response, NextFunction } from "express";
import { AppError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    logger.warn(`Handled error: ${err.message}`, { statusCode: err.statusCode });
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  logger.error("Unhandled error", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
}
