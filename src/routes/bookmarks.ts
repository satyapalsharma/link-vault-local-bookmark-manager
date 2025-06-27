import { Router } from "express";
import { BookmarkController } from "@/controllers/bookmark.controller";

const router = Router();

router.get("/", BookmarkController.getAll);
router.get("/:id", BookmarkController.getById);
router.post("/", BookmarkController.create);
router.put("/:id", BookmarkController.update);
router.delete("/:id", BookmarkController.delete);

export default router;
