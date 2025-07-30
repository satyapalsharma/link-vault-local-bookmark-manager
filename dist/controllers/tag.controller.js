"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagController = void 0;
const Tag_1 = require("@/models/Tag");
const validation_1 = require("@/lib/validation");
const errors_1 = require("@/lib/errors");
class TagController {
    static async getAll(_req, res, next) {
        try {
            const tags = await Tag_1.TagModel.findAll();
            res.json({ status: "success", data: tags });
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const tag = await Tag_1.TagModel.findById(id);
            if (!tag) {
                throw new errors_1.NotFoundError("Tag not found");
            }
            res.json({ status: "success", data: tag });
        }
        catch (error) {
            next(error);
        }
    }
    static async create(req, res, next) {
        try {
            const body = req.body;
            (0, validation_1.validateRequired)(body, ["name"]);
            const existing = await Tag_1.TagModel.findByName(body.name);
            if (existing) {
                throw new errors_1.ConflictError("Tag with this name already exists");
            }
            const tag = await Tag_1.TagModel.create(body);
            res.status(201).json({ status: "success", data: tag });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const body = req.body;
            const tag = await Tag_1.TagModel.update(id, body);
            if (!tag) {
                throw new errors_1.NotFoundError("Tag not found");
            }
            res.json({ status: "success", data: tag });
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await Tag_1.TagModel.delete(id);
            if (!deleted) {
                throw new errors_1.NotFoundError("Tag not found");
            }
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TagController = TagController;
