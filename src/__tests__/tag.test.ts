import { describe, it, expect, beforeEach } from "vitest";
import { TagModel } from "@/models/Tag";
import { CreateTagInput } from "@/types/tag";

describe("TagModel", () => {
  it("should create a tag", async () => {
    const input: CreateTagInput = { name: "Work" };
    const tag = await TagModel.create(input);
    expect(tag).toBeDefined();
    expect(tag.name).toBe("Work");
    expect(tag.slug).toBe("work");
  });

  it("should find a tag by id", async () => {
    const input: CreateTagInput = { name: "Personal" };
    const created = await TagModel.create(input);
    const found = await TagModel.findById(created.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(created.id);
  });

  it("should find a tag by name", async () => {
    const input: CreateTagInput = { name: "Projects" };
    await TagModel.create(input);
    const found = await TagModel.findByName("Projects");
    expect(found).toBeDefined();
    expect(found?.name).toBe("Projects");
  });

  it("should update a tag", async () => {
    const input: CreateTagInput = { name: "Old Name" };
    const created = await TagModel.create(input);
    const updated = await TagModel.update(created.id, { name: "New Name" });
    expect(updated).toBeDefined();
    expect(updated?.name).toBe("New Name");
    expect(updated?.slug).toBe("new-name");
  });

  it("should delete a tag", async () => {
    const input: CreateTagInput = { name: "ToDelete" };
    const created = await TagModel.create(input);
    const deleted = await TagModel.delete(created.id);
    expect(deleted).toBe(true);
    const found = await TagModel.findById(created.id);
    expect(found).toBeNull();
  });
});
