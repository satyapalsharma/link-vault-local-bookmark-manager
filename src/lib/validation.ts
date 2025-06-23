import { BadRequestError } from "./errors";

export function validateUrl(url: string): void {
  try {
    new URL(url);
  } catch {
    throw new BadRequestError("Invalid URL format");
  }
}

export function validateRequired<T>(obj: T, fields: (keyof T)[]): void {
  const missing = fields.filter((field) => obj[field] === undefined || obj[field] === null || obj[field] === "");
  if (missing.length > 0) {
    throw new BadRequestError(`Missing required fields: ${missing.join(", ")}`);
  }
}

export function sanitizeString(str: string): string {
  return str.trim().replace(/[<>]/g, "");
}
