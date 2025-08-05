"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkModel = void 0;
/**
 * In-memory store for bookmarks.
 * Replace with actual database operations when persistence is added.
 */
class BookmarkModel {
    static bookmarks = new Map();
    static counter = 0;
    static async findAll(params) {
        let results = Array.from(this.bookmarks.values());
        if (params?.q) {
            const qLower = params.q.trim().toLowerCase();
            if (qLower) {
                results = results.filter((b) => b.title.toLowerCase().includes(qLower) ||
                    b.url.toLowerCase().includes(qLower) ||
                    b.tags.some((tag) => tag.toLowerCase().includes(qLower)));
            }
        }
        else if (params?.search) {
            const term = params.search.toLowerCase();
            results = results.filter((b) => b.title.toLowerCase().includes(term) ||
                b.url.toLowerCase().includes(term) ||
                b.notes?.toLowerCase().includes(term));
        }
        if (params?.tags) {
            const filterTags = params.tags.toLowerCase().split(",");
            results = results.filter((b) => filterTags.every((tag) => b.tags.some((t) => t.toLowerCase() === tag)));
        }
        if (params?.isFavorite !== undefined) {
            results = results.filter((b) => b.isFavorite === params.isFavorite);
        }
        const sortField = params?.sortBy || "createdAt";
        const sortOrder = params?.sortOrder || "desc";
        results.sort((a, b) => {
            const aVal = a[sortField];
            const bVal = b[sortField];
            if (aVal instanceof Date && bVal instanceof Date) {
                return sortOrder === "asc" ? aVal.getTime() - bVal.getTime() : bVal.getTime() - aVal.getTime();
            }
            if (typeof aVal === "string" && typeof bVal === "string") {
                return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            if (typeof aVal === "boolean" && typeof bVal === "boolean") {
                return sortOrder === "asc" ? (aVal === bVal ? 0 : aVal ? 1 : -1) : bVal === aVal ? 0 : bVal ? -1 : 1;
            }
            return 0;
        });
        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const start = (page - 1) * limit;
        const end = start + limit;
        return results.slice(start, end);
    }
    static async findById(id) {
        return this.bookmarks.get(id) || null;
    }
    static async create(input) {
        this.counter++;
        const id = `bookmark_${this.counter}_${Date.now()}`;
        const now = new Date();
        const bookmark = {
            id,
            url: input.url,
            title: input.title,
            notes: input.notes,
            tags: input.tags || [],
            isFavorite: input.isFavorite ?? false,
            createdAt: now,
            updatedAt: now,
        };
        this.bookmarks.set(id, bookmark);
        return bookmark;
    }
    static async update(id, input) {
        const existing = this.bookmarks.get(id);
        if (!existing)
            return null;
        const updated = {
            ...existing,
            ...input,
            updatedAt: new Date(),
        };
        this.bookmarks.set(id, updated);
        return updated;
    }
    static async delete(id) {
        return this.bookmarks.delete(id);
    }
    static async count() {
        return this.bookmarks.size;
    }
}
exports.BookmarkModel = BookmarkModel;
