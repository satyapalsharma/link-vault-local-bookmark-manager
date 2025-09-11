import { DatabaseSync } from "node:sqlite";
import { logger } from "./logger";

const globalForDb = globalThis as unknown as {
  db?: DatabaseSync;
};

export const db =
  globalForDb.db ?? new DatabaseSync(process.env.DATABASE_URL || "./link-vault.db");

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}

logger.info("SQLite database initialized");

export { DatabaseSync };
