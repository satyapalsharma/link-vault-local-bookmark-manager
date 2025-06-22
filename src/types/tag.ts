import { Id, Timestamps } from "./common";

export interface Tag extends Timestamps {
  id: Id;
  name: string;
  slug: string;
}

export interface CreateTagInput {
  name: string;
}

export interface UpdateTagInput {
  name?: string;
}
