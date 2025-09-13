import { Router } from "express";

const router = Router();

// Root endpoint for the API: lists the available resource collections.
router.get("/", (_req, res) => {
  res.json({
    status: "ok",
    resources: ["/bookmarks", "/tags"],
  });
});

export default router;
