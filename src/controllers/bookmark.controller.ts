import { Request, Response, NextFunction } from "express";
import { BookmarkModel } from "@/models/Bookmark";
import { validateUrl, validateRequired } from "@/lib/validation";
import { NotFoundError } from "@/lib/errors";
import { CreateBookmarkInput, UpdateBookmarkInput, BookmarkQueryParams } from "@/types/bookmark";

export class BookmarkController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as unknown as BookmarkQueryParams;

      // Map `favorites=true` query param to `isFavorite` for the model
      if (query.favorites === "true") {
        query.isFavorite = true;
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

      if (body.isFavorite !== undefined && typeof body.isFavorite !== "boolean") {
        res.status(400).json({ error: "isFavorite must be a boolean." });
        return;
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

      if (body.isFavorite !== undefined && typeof body.isFavorite !== "boolean") {
        res.status(400).json({ error: "isFavorite must be a boolean." });
        return;
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

  static async toggleFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const bookmark = await BookmarkModel.findById(id);
      if (!bookmark) {
        throw new NotFoundError("Bookmark not found");
      }
      const updated = await BookmarkModel.update(id, { isFavorite: !bookmark.isFavorite });
      res.json({ status: "success", data: updated });
    } catch (error) {
      next(error);
    }
  }
}
