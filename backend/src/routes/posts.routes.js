import { Router } from "express";
import { getPosts } from "../controllers/posts.controller.js";

const router = Router();
router.get("/", getPosts);

export default router; // default export
