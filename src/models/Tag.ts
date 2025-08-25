import { Tag, CreateTagInput, UpdateTagInput } from "@/types/tag";

/**
 * In-memory store for tags.
 * Replace with actual database operations when persistence is added.
 */
export class TagModel {
  private static tags: Map<string, Tag> = new Map();
  private static counter = 0;

  /**
   * Retrieve all tags, sorted alphabetically by name.
   * @returns A promise that resolves to an array of tags
   */
  static async findAll(): Promise<Tag[]> {
    return Array.from(this.tags.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Find a tag by its unique identifier.
   * @param id - The tag ID to search for
   * @returns A promise that resolves to the tag if found, or null
   */
  static async findById(id: string): Promise<Tag | null> {
    return this.tags.get(id) || null;
  }

  /**
   * Find a tag by its name (case-insensitive).
   * @param name - The tag name to search for
   * @returns A promise that resolves to the tag if found, or null
   */
  static async findByName(name: string): Promise<Tag | null> {
    return Array.from(this.tags.values()).find((t) => t.name.toLowerCase() === name.toLowerCase()) || null;
  }

  /**
   * Create a new tag entry.
   * @param input - The tag data to create
   * @returns A promise that resolves to the created tag
   */
  static async create(input: CreateTagInput): Promise<Tag> {
    this.counter++;
    const id = `tag_${this.counter}_${Date.now()}`;
    const now = new Date();
    const slug = input.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const tag: Tag = {
      id,
      name: input.name,
      slug,
      createdAt: now,
      updatedAt: now,
    };
    this.tags.set(id, tag);
    return tag;
  }

  /**
   * Update an existing tag.
   * @param id - The tag ID to update
   * @param input - The partial tag data to apply
   * @returns A promise that resolves to the updated tag, or null if not found
   */
  static async update(id: string, input: UpdateTagInput): Promise<Tag | null> {
    const existing = this.tags.get(id);
    if (!existing) return null;

    const updated: Tag = {
      ...existing,
      ...input,
      slug: input.name ? input.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") : existing.slug,
      updatedAt: new Date(),
    };
    this.tags.set(id, updated);
    return updated;
  }

  /**
   * Delete a tag by its ID.
   * @param id - The tag ID to delete
   * @returns A promise that resolves to true if the tag was deleted, false otherwise
   */
  static async delete(id: string): Promise<boolean> {
    return this.tags.delete(id);
  }
}
