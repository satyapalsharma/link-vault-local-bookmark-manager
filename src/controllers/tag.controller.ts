import { Request, Response, NextFunction } from "express";
import { TagModel } from "@/models/Tag";
import { validateRequired } from "@/lib/validation";
import { BadRequestError, NotFoundError, ConflictError } from "@/lib/errors";
import { CreateTagInput, UpdateTagInput } from "@/types/tag";

export class TagController {
  static async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tags = await TagModel.findAll();
      res.json({ status: "success", data: tags });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const tag = await TagModel.findById(id);
      if (!tag) {
        throw new NotFoundError("Tag not found");
      }
      res.json({ status: "success", data: tag });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as CreateTagInput;
      validateRequired(body, ["name"]);
      const existing = await TagModel.findByName(body.name);
      if (existing) {
        throw new ConflictError("Tag with this name already exists");
      }
      const tag = await TagModel.create(body);
      res.status(201).json({ status: "success", data: tag });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const body = req.body as UpdateTagInput;
      const tag = await TagModel.update(id, body);
      if (!tag) {
        throw new NotFoundError("Tag not found");
      }
      res.json({ status: "success", data: tag });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await TagModel.delete(id);
      if (!deleted) {
        throw new NotFoundError("Tag not found");
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
