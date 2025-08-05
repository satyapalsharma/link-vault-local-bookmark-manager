"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookmarks_1 = __importDefault(require("./bookmarks"));
const tags_1 = __importDefault(require("./tags"));
const router = (0, express_1.Router)();
router.use("/bookmarks", bookmarks_1.default);
router.use("/tags", tags_1.default);
exports.default = router;
