import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "@/lib/errors";

export function validateBody<T>(schema: (body: unknown) => T): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema(req.body);
      next();
    } catch (error) {
      if (error instanceof BadRequestError) {
        next(error);
      } else {
        next(new BadRequestError("Invalid request body"));
      }
    }
  };
}
