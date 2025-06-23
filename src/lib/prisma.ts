import { logger } from "./logger";

/**
 * Placeholder for the database client.
 * Replace with actual Prisma client initialization when Prisma is added.
 */
export class PrismaClient {
  private static instance: PrismaClient;

  private constructor() {
    logger.info("PrismaClient initialized (placeholder)");
  }

  static getInstance(): PrismaClient {
    if (!PrismaClient.instance) {
      PrismaClient.instance = new PrismaClient();
    }
    return PrismaClient.instance;
  }

  async $connect() {
    logger.debug("PrismaClient $connect called (no-op)");
  }

  async $disconnect() {
    logger.debug("PrismaClient $disconnect called (no-op)");
  }
}

export const prisma = PrismaClient.getInstance();
