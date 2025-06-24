export interface Config {
  port: number;
  nodeEnv: "development" | "production" | "test";
  databaseUrl: string;
  logLevel: "debug" | "info" | "warn" | "error";
}

const requiredEnvVars = ["PORT", "NODE_ENV", "DATABASE_URL"] as const;

function loadEnv(): Record<string, string | undefined> {
  const env: Record<string, string | undefined> = {};
  for (const key of requiredEnvVars) {
    env[key] = process.env[key];
  }
  return env;
}

function validateEnv(env: Record<string, string | undefined>): void {
  const missing = requiredEnvVars.filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

const env = loadEnv();
validateEnv(env);

export const config: Config = {
  port: parseInt(env.PORT || "3000", 10),
  nodeEnv: (env.NODE_ENV || "development") as Config["nodeEnv"],
  databaseUrl: env.DATABASE_URL || "./link-vault.db",
  logLevel: (env.LOG_LEVEL || "info") as Config["logLevel"],
};
