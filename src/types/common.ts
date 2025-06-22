export type Id = string;

export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type SortOrder = "asc" | "desc";

export type BookmarkSortField = "createdAt" | "updatedAt" | "title" | "lastVisited" | "url";

export type TagSortField = "name" | "createdAt" | "updatedAt";
