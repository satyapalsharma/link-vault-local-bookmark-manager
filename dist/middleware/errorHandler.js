"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const errors_1 = require("@/lib/errors");
const logger_1 = require("@/lib/logger");
function errorHandler(err, _req, res, _next) {
    if (err instanceof errors_1.AppError) {
        logger_1.logger.warn(`Handled error: ${err.message}`, { statusCode: err.statusCode });
        res.status(err.statusCode).json({
            status: "error",
            message: err.message,
        });
        return;
    }
    logger_1.logger.error("Unhandled error", err);
    res.status(500).json({
        status: "error",
        message: "Internal server error",
    });
}
