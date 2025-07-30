"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const requiredEnvVars = ["PORT", "NODE_ENV", "DATABASE_URL"];
function loadEnv() {
    const env = {};
    for (const key of requiredEnvVars) {
        env[key] = process.env[key];
    }
    return env;
}
function validateEnv(env) {
    const missing = requiredEnvVars.filter((key) => !env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }
}
const env = loadEnv();
validateEnv(env);
exports.config = {
    port: parseInt(env.PORT || "3000", 10),
    nodeEnv: (env.NODE_ENV || "development"),
    databaseUrl: env.DATABASE_URL || "./link-vault.db",
    logLevel: (env.LOG_LEVEL || "info"),
};
