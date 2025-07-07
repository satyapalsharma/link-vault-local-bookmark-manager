import { Bookmark, CreateBookmarkInput, UpdateBookmarkInput, BookmarkQueryParams } from "@/types/bookmark";

/**
 * In-memory store for bookmarks.
 * Replace with actual database operations when persistence is added.
 */
export class BookmarkModel {
  private static bookmarks: Map<string, Bookmark> = new Map();
  private static counter = 0;

  static async findAll(params?: BookmarkQueryParams): Promise<Bookmark[]> {
    let results = Array.from(this.bookmarks.values());

    if (params?.search) {
      const term = params.search.toLowerCase();
      results = results.filter(
        (b) =>
          b.title.toLowerCase().includes(term) ||
          b.url.toLowerCase().includes(term) ||
          b.notes?.toLowerCase().includes(term)
      );
    }

    if (params?.tag) {
      results = results.filter((b) => b.tags.includes(params.tag!));
    }

    if (params?.from) {
      const fromDate = new Date(params.from);
      results = results.filter((b) => new Date(b.createdAt) >= fromDate);
    }

    if (params?.to) {
      const toDate = new Date(params.to);
      results = results.filter((b) => new Date(b.createdAt) <= toDate);
    }

    if (params?.tags) {
      const filterTags = params.tags.toLowerCase().split(",");
      results = results.filter((b) =>
        filterTags.every((tag) => b.tags.some((t) => t.toLowerCase() === tag))
      );
    }

    if (params?.isFavorite !== undefined) {
      results = results.filter((b) => b.isFavorite === params.isFavorite);
    }

    const sortField = params?.sortBy || "createdAt";
    const sortOrder = params?.sortOrder || "desc";

    results.sort((a, b) => {
      const aVal = a[sortField as keyof Bookmark];
      const bVal = b[sortField as keyof Bookmark];
      if (aVal instanceof Date && bVal instanceof Date) {
        return sortOrder === "asc" ? aVal.getTime() - bVal.getTime() : bVal.getTime() - aVal.getTime();
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "boolean" && typeof bVal === "boolean") {
        return sortOrder === "asc" ? (aVal === bVal ? 0 : aVal ? 1 : -1) : aVal === bVal ? 0 : aVal ? -1 : 1;
      }
      return 0;
    });

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return results.slice(start, end);
  }

  static async findById(id: string): Promise<Bookmark | null> {
    return this.bookmarks.get(id) || null;
  }

  static async create(input: CreateBookmarkInput): Promise<Bookmark> {
    this.counter++;
    const id = `bookmark_${this.counter}_${Date.now()}`;
    const now = new Date();
    const bookmark: Bookmark = {
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

  static async update(id: string, input: UpdateBookmarkInput): Promise<Bookmark | null> {
    const existing = this.bookmarks.get(id);
    if (!existing) return null;

    const updated: Bookmark = {
      ...existing,
      ...input,
      updatedAt: new Date(),
    };
    this.bookmarks.set(id, updated);
    return updated;
  }

  static async delete(id: string): Promise<boolean> {
    return this.bookmarks.delete(id);
  }

  static async count(): Promise<number> {
    return this.bookmarks.size;
  }
}
