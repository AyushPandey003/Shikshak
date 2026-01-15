import express from "express";
import multer from "multer";
import { ingestFile } from "../controllers/ingest.controller.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/ingest
router.post("/", upload.single("file"), ingestFile);

export default router;
