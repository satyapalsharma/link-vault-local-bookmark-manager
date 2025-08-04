import { Request, Response, NextFunction } from "express";
import { BookmarkModel } from "@/models/Bookmark";
import { validateUrl, validateRequired } from "@/lib/validation";
import { BadRequestError, NotFoundError } from "@/lib/errors";
import { CreateBookmarkInput, UpdateBookmarkInput, AddTagInput, BookmarkQueryParams } from "@/types/bookmark";

export class BookmarkController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as unknown as BookmarkQueryParams;
      const data = await BookmarkModel.findAll(query);
      const total = await BookmarkModel.count();
      const page = query.page || 1;
      const limit = query.limit || 10;
      res.json({
        status: "success",
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const bookmark = await BookmarkModel.findById(id);
      if (!bookmark) {
        throw new NotFoundError("Bookmark not found");
      }
      res.json({ status: "success", data: bookmark });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as CreateBookmarkInput;
      validateRequired(body, ["url", "title"]);
      validateUrl(body.url);

      if (body.tags !== undefined) {
        if (!Array.isArray(body.tags) || !body.tags.every((t) => typeof t === "string" && t.trim() !== "")) {
          throw new BadRequestError("tags must be an array of strings.");
        }
      }

      const bookmark = await BookmarkModel.create(body);
      res.status(201).json({ status: "success", data: bookmark });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const body = req.body as UpdateBookmarkInput;
      if (body.url) validateUrl(body.url);

      if (body.tags !== undefined) {
        if (!Array.isArray(body.tags) || !body.tags.every((t) => typeof t === "string" && t.trim() !== "")) {
          throw new BadRequestError("tags must be an array of strings.");
        }
      }

      const bookmark = await BookmarkModel.update(id, body);
      if (!bookmark) {
        throw new NotFoundError("Bookmark not found");
      }
      res.json({ status: "success", data: bookmark });
    } catch (error) {
      next(error);
    }
  }

  static async addTag(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const body = req.body as AddTagInput;

      if (!body.tag || typeof body.tag !== "string" || body.tag.trim() === "") {
        throw new BadRequestError("tag must be a non-empty string.");
      }

      const bookmark = await BookmarkModel.addTag(id, body.tag);
      if (!bookmark) {
        throw new NotFoundError("Bookmark not found");
      }
      res.json({ status: "success", data: bookmark });
    } catch (error) {
      next(error);
    }
  }

  static async removeTag(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, tag } = req.params;
      const bookmark = await BookmarkModel.removeTag(id, decodeURIComponent(tag));
      if (!bookmark) {
        throw new NotFoundError("Bookmark not found");
      }
      res.json({ status: "success", data: bookmark });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await BookmarkModel.delete(id);
      if (!deleted) {
        throw new NotFoundError("Bookmark not found");
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
