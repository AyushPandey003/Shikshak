import express from "express";
import multer from "multer";
import { uploadFileToAzure, getFileUrl } from "../utils/azureStorage.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Upload a file with category-based routing
 * 
 * Categories:
 * - PUBLIC (never expire): thumbnail, preview, profile
 * - PRIVATE (SAS required):
 *   - course, video, material: 24 hours
 *   - exam: 30 minutes
 *   - certificate: 7 days
 */
router.post("/", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file provided" });
        }

        const { buffer, originalname, mimetype } = req.file;
        const category = req.body.category || "default"; // Get category from request body

        const result = await uploadFileToAzure(buffer, originalname, mimetype, category);

        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            ...result
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * Get fresh URL for a file
 * Query params: category (for determining expiry/access type)
 */
router.get("/:blobName(*)", (req, res) => {
    try {
        const { blobName } = req.params;
        const category = req.query.category || "default";

        const url = getFileUrl(blobName, category);

        res.status(200).json({ url });
    } catch (error) {
        console.error("URL Generation Error:", error);
        res.status(500).json({ error: "Could not generate file URL" });
    }
});

export default router;
