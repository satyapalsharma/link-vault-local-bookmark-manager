import { Request, Response, NextFunction } from "express";
import { BookmarkModel } from "@/models/Bookmark";
import { validateUrl, validateRequired } from "@/lib/validation";
import { BadRequestError, NotFoundError } from "@/lib/errors";
import { CreateBookmarkInput, UpdateBookmarkInput, BookmarkQueryParams } from "@/types/bookmark";

const ALLOWED_SORTS = new Set([
  "createdAt",
  "-createdAt",
  "title",
  "-title",
  "lastVisitedAt",
  "-lastVisitedAt",
]);

export class BookmarkController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as unknown as BookmarkQueryParams;

      if (query.sort && !ALLOWED_SORTS.has(query.sort)) {
        res.status(400).json({ error: "Invalid sort parameter." });
        return;
      }

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
      const { id } = req.params as { id: string };
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
      const bookmark = await BookmarkModel.create(body);
      res.status(201).json({ status: "success", data: bookmark });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const body = req.body as UpdateBookmarkInput;
      if (body.url) validateUrl(body.url);
      const bookmark = await BookmarkModel.update(id, body);
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
      const { id } = req.params as { id: string };
      const deleted = await BookmarkModel.delete(id);
      if (!deleted) {
        throw new NotFoundError("Bookmark not found");
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async visit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const bookmark = await BookmarkModel.visit(id);
      if (!bookmark) {
        res.status(404).json({ error: "Bookmark not found." });
        return;
      }
      res.json({ status: "success", data: bookmark });
    } catch (error) {
      next(error);
    }
  }
}
