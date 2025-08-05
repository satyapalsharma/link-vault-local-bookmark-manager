"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagModel = void 0;
/**
 * In-memory store for tags.
 * Replace with actual database operations when persistence is added.
 */
class TagModel {
    static tags = new Map();
    static counter = 0;
    static async findAll() {
        return Array.from(this.tags.values()).sort((a, b) => a.name.localeCompare(b.name));
    }
    static async findById(id) {
        return this.tags.get(id) || null;
    }
    static async findByName(name) {
        return Array.from(this.tags.values()).find((t) => t.name.toLowerCase() === name.toLowerCase()) || null;
    }
    static async create(input) {
        this.counter++;
        const id = `tag_${this.counter}_${Date.now()}`;
        const now = new Date();
        const slug = input.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        const tag = {
            id,
            name: input.name,
            slug,
            createdAt: now,
            updatedAt: now,
        };
        this.tags.set(id, tag);
        return tag;
    }
    static async update(id, input) {
        const existing = this.tags.get(id);
        if (!existing)
            return null;
        const updated = {
            ...existing,
            ...input,
            slug: input.name ? input.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") : existing.slug,
            updatedAt: new Date(),
        };
        this.tags.set(id, updated);
        return updated;
    }
    static async delete(id) {
        return this.tags.delete(id);
    }
}
exports.TagModel = TagModel;
