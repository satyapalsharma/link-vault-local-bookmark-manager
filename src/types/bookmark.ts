import { Id, Timestamps, BookmarkSortField } from "./common";

/** Represents a bookmark resource with timestamps. */
export interface Bookmark extends Timestamps {
  id: Id;
  url: string;
  title: string;
  notes?: string;
  tags: string[];
  isFavorite: boolean;
  lastVisited?: Date;
}

/** Input for creating a new bookmark. */
export interface CreateBookmarkInput {
  url: string;
  title: string;
  notes?: string;
  tags?: string[];
  isFavorite?: boolean;
}

/** Input for updating an existing bookmark. */
export interface UpdateBookmarkInput {
  url?: string;
  title?: string;
  notes?: string;
  tags?: string[];
  isFavorite?: boolean;
  lastVisited?: Date;
}

/** Query parameters for filtering, sorting, and paginating bookmarks. */
export interface BookmarkQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string;
  isFavorite?: boolean;
  sort?: BookmarkSortField;
}
