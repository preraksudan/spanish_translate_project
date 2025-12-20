import { Router } from "express";
import { getTranslationRecords } from "../controllers/translationRecords.controller.js";

const router = Router();
router.get("/", getTranslationRecords);

export default router; // default export