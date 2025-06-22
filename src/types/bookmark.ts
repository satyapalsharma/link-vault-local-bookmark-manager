import { Id, Timestamps } from "./common";

export interface Bookmark extends Timestamps {
  id: Id;
  url: string;
  title: string;
  notes?: string;
  tags: string[];
  isFavorite: boolean;
  lastVisited?: Date;
}

export interface CreateBookmarkInput {
  url: string;
  title: string;
  notes?: string;
  tags?: string[];
  isFavorite?: boolean;
}

export interface UpdateBookmarkInput {
  url?: string;
  title?: string;
  notes?: string;
  tags?: string[];
  isFavorite?: boolean;
  lastVisited?: Date;
}

export interface BookmarkQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string;
  isFavorite?: boolean;
  sortBy?: BookmarkSortField;
  sortOrder?: "asc" | "desc";
}
