import { Tag, CreateTagInput, UpdateTagInput } from "@/types/tag";

/**
 * In-memory store for tags.
 * Replace with actual database operations when persistence is added.
 */
export class TagModel {
  private static tags: Map<string, Tag> = new Map();
  private static counter = 0;

  static async findAll(): Promise<Tag[]> {
    return Array.from(this.tags.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  static async findById(id: string): Promise<Tag | null> {
    return this.tags.get(id) || null;
  }

  static async findByName(name: string): Promise<Tag | null> {
    return Array.from(this.tags.values()).find((t) => t.name.toLowerCase() === name.toLowerCase()) || null;
  }

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

  static async delete(id: string): Promise<boolean> {
    return this.tags.delete(id);
  }
}
