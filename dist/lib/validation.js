"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUrl = validateUrl;
exports.validateRequired = validateRequired;
exports.sanitizeString = sanitizeString;
const errors_1 = require("./errors");
function validateUrl(url) {
    try {
        new URL(url);
    }
    catch {
        throw new errors_1.BadRequestError("Invalid URL format");
    }
}
function validateRequired(obj, fields) {
    const missing = fields.filter((field) => obj[field] === undefined || obj[field] === null || obj[field] === "");
    if (missing.length > 0) {
        throw new errors_1.BadRequestError(`Missing required fields: ${missing.join(", ")}`);
    }
}
function sanitizeString(str) {
    return str.trim().replace(/[<>]/g, "");
}
