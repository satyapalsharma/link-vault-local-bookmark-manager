import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "@/config";
import { logger } from "@/lib/logger";
import { errorHandler } from "@/middleware/errorHandler";
import apiRoutes from "./routes/index";
import bookmarksRouter from "./routes/bookmarks";
import tagsRouter from "./routes/tags";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (_req, res) => res.json({ status: "ok", service: "Link Vault" }));

app.use("/api/v1", apiRoutes);
app.use("/api/v1/bookmarks", bookmarksRouter);
app.use("/api/v1/tags", tagsRouter);

app.use(errorHandler);

const server = app.listen(config.port, () => {
  logger.info(`Server running on :${config.port} in ${config.nodeEnv} mode`);
});

export default app;
