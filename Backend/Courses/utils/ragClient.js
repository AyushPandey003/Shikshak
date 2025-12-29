import axios from 'axios';
import FormData from 'form-data';
import { generateSasUrl } from './azureStorage.js';

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:4005';

/**
 * Ingests a video into the RAG system.
 * @param {Object} params - Ingestion parameters.
 * @param {string} params.course_id - Course ID.
 * @param {string} params.module_id - Module ID.
 * @param {string} params.video_id - Video ID (from database).
 * @param {string} params.blob_name - Azure Blob Name (azure_id).
 */
export const ingestVideoToRag = async ({ course_id, module_id, video_id, blob_name }) => {
    try {
        console.log(`[RAG-CLIENT] Starting ingestion for video ${video_id}`);

        // 1. Generate SAS URL to download the video
        const sasUrl = generateSasUrl(blob_name);
        console.log(`[RAG-CLIENT] Generated SAS URL for blob: ${blob_name}`);

        // 2. Download the video as a stream
        const response = await axios.get(sasUrl, { responseType: 'stream' });
        const videoStream = response.data;

        // 3. Prepare Form Data for RAG Service
        const form = new FormData();
        form.append('file', videoStream, { filename: `${blob_name}` }); // RAG needs a filename
        form.append('course_id', course_id.toString());
        form.append('module_id', module_id.toString());
        form.append('source_type', 'video');
        form.append('video_id', video_id.toString());
        const baseUrl = RAG_SERVICE_URL.replace(/\/$/, "");
        const ingestUrl = `${baseUrl}/api/rag/ingest`;

        console.log(`[RAG-CLIENT] Sending to RAG Service: ${ingestUrl}`);

        const ragResponse = await axios.post(ingestUrl, form, {
            headers: {
                ...form.getHeaders(),
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        console.log(`[RAG-CLIENT] Ingestion successful:`, ragResponse.data);
        return ragResponse.data;

    } catch (error) {
        console.error(`[RAG-CLIENT] Error ingesting video:`, error.message);
        if (error.response) {
            console.error(`[RAG-CLIENT] RAG Service responded with:`, error.response.data);
        }
        throw error;
    }
};
