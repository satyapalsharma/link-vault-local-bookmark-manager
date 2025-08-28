import { Id, Timestamps } from "./common";

/** Represents a tag resource with timestamps. */
export interface Tag extends Timestamps {
  id: Id;
  name: string;
  slug: string;
}

/** Input for creating a new tag. */
export interface CreateTagInput {
  name: string;
}

/** Input for updating an existing tag. */
export interface UpdateTagInput {
  name?: string;
}
