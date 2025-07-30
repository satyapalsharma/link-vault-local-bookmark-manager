"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkController = void 0;
const Bookmark_1 = require("@/models/Bookmark");
const validation_1 = require("@/lib/validation");
const errors_1 = require("@/lib/errors");
class BookmarkController {
    static async getAll(req, res, next) {
        try {
            const query = req.query;
            const data = await Bookmark_1.BookmarkModel.findAll(query);
            const total = await Bookmark_1.BookmarkModel.count();
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
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const bookmark = await Bookmark_1.BookmarkModel.findById(id);
            if (!bookmark) {
                throw new errors_1.NotFoundError("Bookmark not found");
            }
            res.json({ status: "success", data: bookmark });
        }
        catch (error) {
            next(error);
        }
    }
    static async create(req, res, next) {
        try {
            const body = req.body;
            (0, validation_1.validateRequired)(body, ["url", "title"]);
            (0, validation_1.validateUrl)(body.url);
            const bookmark = await Bookmark_1.BookmarkModel.create(body);
            res.status(201).json({ status: "success", data: bookmark });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const body = req.body;
            if (body.url)
                (0, validation_1.validateUrl)(body.url);
            const bookmark = await Bookmark_1.BookmarkModel.update(id, body);
            if (!bookmark) {
                throw new errors_1.NotFoundError("Bookmark not found");
            }
            res.json({ status: "success", data: bookmark });
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await Bookmark_1.BookmarkModel.delete(id);
            if (!deleted) {
                throw new errors_1.NotFoundError("Bookmark not found");
            }
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BookmarkController = BookmarkController;
