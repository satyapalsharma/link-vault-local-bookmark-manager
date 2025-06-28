import { describe, it, expect, beforeEach } from "vitest";
import { BookmarkModel } from "@/models/Bookmark";
import { CreateBookmarkInput } from "@/types/bookmark";

describe("BookmarkModel", () => {
  beforeEach(async () => {
    // Reset in-memory store by creating fresh instances
    // Since the model uses static Map, we can't easily reset it without exposing internals.
    // For test purposes, we'll just verify operations work.
  });

  it("should create a bookmark", async () => {
    const input: CreateBookmarkInput = {
      url: "https://example.com",
      title: "Example",
      notes: "A test bookmark",
      tags: ["test", "example"],
      isFavorite: true,
    };
    const bookmark = await BookmarkModel.create(input);
    expect(bookmark).toBeDefined();
    expect(bookmark.url).toBe(input.url);
    expect(bookmark.title).toBe(input.title);
    expect(bookmark.tags).toEqual(input.tags);
    expect(bookmark.isFavorite).toBe(true);
  });

  it("should find a bookmark by id", async () => {
    const input: CreateBookmarkInput = {
      url: "https://test.com",
      title: "Test",
    };
    const created = await BookmarkModel.create(input);
    const found = await BookmarkModel.findById(created.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(created.id);
  });

  it("should return null for non-existent id", async () => {
    const found = await BookmarkModel.findById("non-existent");
    expect(found).toBeNull();
  });

  it("should update a bookmark", async () => {
    const input: CreateBookmarkInput = {
      url: "https://update.com",
      title: "Update",
    };
    const created = await BookmarkModel.create(input);
    const updated = await BookmarkModel.update(created.id, { title: "New Title" });
    expect(updated).toBeDefined();
    expect(updated?.title).toBe("New Title");
  });

  it("should delete a bookmark", async () => {
    const input: CreateBookmarkInput = {
      url: "https://delete.com",
      title: "Delete",
    };
    const created = await BookmarkModel.create(input);
    const deleted = await BookmarkModel.delete(created.id);
    expect(deleted).toBe(true);
    const found = await BookmarkModel.findById(created.id);
    expect(found).toBeNull();
  });
});
