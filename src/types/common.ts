/** Unique identifier type for resources. */
export type Id = string;

/** Common timestamp fields for created and updated dates. */
export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

/** Generic paginated response wrapper. */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Sort direction for ordered results. */
export type SortOrder = "asc" | "desc";

/** Fields available for sorting bookmarks. */
export type BookmarkSortField = "createdAt" | "updatedAt" | "title" | "lastVisited" | "url";

/** Fields available for sorting tags. */
export type TagSortField = "name" | "createdAt" | "updatedAt";
