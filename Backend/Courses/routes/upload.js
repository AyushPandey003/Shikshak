import express from "express";
import multer from "multer";
import { uploadFileToAzure, generateSasUrl, deleteBlobFromAzure } from "../utils/azureStorage.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file provided" });
        }

        const { buffer, originalname, mimetype } = req.file;
        const { blobName } = await uploadFileToAzure(buffer, originalname, mimetype);

        // Generate SAS URL immediately for instant usage
        const sasUrl = generateSasUrl(blobName);

        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            blobName: blobName,
            url: sasUrl
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/:blobName", (req, res) => {
    try {
        const { blobName } = req.params;
        const sasUrl = generateSasUrl(blobName);
        res.status(200).json({ url: sasUrl });
    } catch (error) {
        console.error("SAS Generation Error:", error);
        res.status(500).json({ error: "Could not generate file URL" });
    }
});

router.delete("/:blobName", async (req, res) => {
    try {
        const { blobName } = req.params;

        if (!blobName) {
            return res.status(400).json({ error: "Blob name is required" });
        }

        const result = await deleteBlobFromAzure(blobName);

        if (!result.success) {
            return res.status(404).json({ error: result.message });
        }

        res.status(200).json({
            success: true,
            message: result.message,
            blobName: blobName
        });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ error: "Failed to delete blob" });
    }
});

export default router;

