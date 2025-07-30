"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.PrismaClient = void 0;
const logger_1 = require("./logger");
/**
 * Placeholder for the database client.
 * Replace with actual Prisma client initialization when Prisma is added.
 */
class PrismaClient {
    static instance;
    constructor() {
        logger_1.logger.info("PrismaClient initialized (placeholder)");
    }
    static getInstance() {
        if (!PrismaClient.instance) {
            PrismaClient.instance = new PrismaClient();
        }
        return PrismaClient.instance;
    }
    async $connect() {
        logger_1.logger.debug("PrismaClient $connect called (no-op)");
    }
    async $disconnect() {
        logger_1.logger.debug("PrismaClient $disconnect called (no-op)");
    }
}
exports.PrismaClient = PrismaClient;
exports.prisma = PrismaClient.getInstance();
