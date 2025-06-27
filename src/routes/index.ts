import { Router } from "express";
import bookmarksRouter from "./bookmarks";
import tagsRouter from "./tags";

const router = Router();

router.use("/bookmarks", bookmarksRouter);
router.use("/tags", tagsRouter);

export default router;
