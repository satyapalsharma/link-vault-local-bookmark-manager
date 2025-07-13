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

    if (params?.tags) {
      const filterTags = params.tags.toLowerCase().split(",");
      results = results.filter((b) =>
        filterTags.every((tag) => b.tags.some((t) => t.toLowerCase() === tag))
      );
    }

    if (params?.isFavorite !== undefined) {
      results = results.filter((b) => b.isFavorite === params.isFavorite);
    }

    const sort = params?.sort || "-createdAt";
    const sortField = sort.replace("-", "");
    const sortDesc = sort.startsWith("-");

    results.sort((a, b) => {
      let cmp = 0;

      if (sortField === "createdAt") {
        const aTime = a.createdAt.getTime();
        const bTime = b.createdAt.getTime();
        cmp = aTime - bTime;
      } else if (sortField === "title") {
        cmp = a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      } else if (sortField === "lastVisitedAt") {
        const aVal = a.lastVisited;
        const bVal = b.lastVisited;
        if (aVal === undefined && bVal === undefined) {
          cmp = 0;
        } else if (aVal === undefined) {
          cmp = -1;
        } else if (bVal === undefined) {
          cmp = 1;
        } else {
          cmp = aVal.getTime() - bVal.getTime();
        }
      }

      if (cmp === 0) {
        const aTime = a.createdAt.getTime();
        const bTime = b.createdAt.getTime();
        cmp = bTime - aTime;
      }

      return sortDesc ? -cmp : cmp;
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
