import { uploadFileToAzure, generateSasUrl } from "../utils/azureStorage.js";
import { enqueueIngestionJob } from "../utils/azureQueue.js";
import { v4 as uuidv4 } from 'uuid';

export const ingestFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file provided" });
        }

        const { course_id, module_id, source_type, video_id, notes_id } = req.body;

        // 1. Upload to Azure Blob Storage
        const { buffer, originalname, mimetype } = req.file;
        const { blobName, url: rawUrl } = await uploadFileToAzure(buffer, originalname, mimetype);

        // 2. Generate SAS URL (worker needs access)
        const sasUrl = generateSasUrl(blobName);

        // 3. Prepare Job Data
        const jobId = uuidv4();
        const jobData = {
            jobId: jobId,
            blobUrl: sasUrl,
            metadata: {
                courseId: course_id,
                moduleId: module_id,
                sourceType: source_type,
                videoId: video_id,
                notesId: notes_id,
                originalName: originalname
            }
        };

        // 4. Send to Queue
        await enqueueIngestionJob(jobData);

        // 5. Respond immediately
        res.status(202).json({
            success: true,
            message: "Ingestion accepted and queued",
            blob_name: blobName, // Frontend expects lowercase snake_case for azure_id mapping
            blobName: blobName, // Backup
            job_id: jobId,
            status: "queued"
        });

    } catch (error) {
        console.error("Ingest Error:", error);
        res.status(500).json({ error: "Ingestion failed", details: error.message });
    }
};
