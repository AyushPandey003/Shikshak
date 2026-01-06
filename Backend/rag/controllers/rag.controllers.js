import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load centralized environment configuration
dotenv.config({ path: path.resolve(__dirname, '../../../.config/.env') });

import axios from 'axios';
import FormData from 'form-data';
import { uploadFileToAzure, generateSasUrl } from '../utils/azureStorage.js';
import { pushIngestionJob, checkQueueHealth } from '../utils/azureQueue.js';

// Hosted RAG Service Base URL - set in .config/.env
const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL;

if (!RAG_SERVICE_URL) {
    console.error('[RAG] ERROR: RAG_SERVICE_URL is not set in environment variables');
}

/**
 * Health Check - Check the status of the RAG service
 * GET /api/rag/health
 */
export const healthCheck = async (req, res) => {
    try {
        const response = await axios.get(`${RAG_SERVICE_URL}/health`, {
            timeout: 20000
        });

        // Also check Azure Queue health
        const queueHealthy = await checkQueueHealth();

        res.status(200).json({
            status: 'healthy',
            ragService: response.data,
            proxyService: 'healthy',
            queueService: queueHealthy ? 'healthy' : 'unhealthy'
        });
    } catch (error) {
        console.error('[RAG] Health check failed:', error.message);
        res.status(503).json({
            status: 'unhealthy',
            proxyService: 'healthy',
            ragService: 'unreachable',
            error: error.message
        });
    }
};

/**
 * Ingest Document - Upload file to Azure Blob and push job to Azure Queue
 * POST /api/rag/ingest
 * 
 * This follows the async architecture:
 * 1. Upload file to Azure Blob Storage
 * 2. Generate SAS URL for the blob
 * 3. Push message to Azure Queue for the hosted worker to process
 * 4. Return jobId immediately (async processing)
 * 
 * Request: multipart/form-data with:
 * - file: The file to ingest
 * - course_id: Course identifier (required)
 * - module_id: Module identifier (required)
 * - source_type: 'pdf' | 'docx' | 'txt' | 'video' | 'notes' (required)
 * - video_id: Video ID (required if source_type is 'video')
 * - notes_id: Notes ID (required if source_type is 'notes')
 */
export const ingestDocument = async (req, res) => {
    try {
        // Validate required fields
        const { course_id, module_id, source_type, video_id, notes_id } = req.body;

        if (!course_id) {
            return res.status(400).json({ error: 'course_id is required' });
        }
        if (!module_id) {
            return res.status(400).json({ error: 'module_id is required' });
        }
        if (!source_type) {
            return res.status(400).json({ error: 'source_type is required' });
        }

        const validSourceTypes = ['pdf', 'docx', 'txt', 'video', 'notes'];
        if (!validSourceTypes.includes(source_type)) {
            return res.status(400).json({
                error: `Invalid source_type. Must be one of: ${validSourceTypes.join(', ')}`
            });
        }

        if (source_type === 'video' && !video_id) {
            return res.status(400).json({ error: 'video_id is required when source_type is video' });
        }
        if (source_type === 'notes' && !notes_id) {
            return res.status(400).json({ error: 'notes_id is required when source_type is notes' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'file is required' });
        }

        // Generate unique job ID
        const jobId = uuidv4();

        console.log(`[RAG] Starting ingestion job ${jobId} for: ${req.file.originalname}`);

        // Step 1: Upload file to Azure Blob Storage
        const uploadResult = await uploadFileToAzure(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype
        );

        console.log(`[RAG] File uploaded to blob: ${uploadResult.blobName}`);

        // Step 2: Generate SAS URL for the blob (worker needs read access)
        const sasUrl = generateSasUrl(uploadResult.blobName);

        console.log(`[RAG] SAS URL generated for worker access`);

        // Step 3: Push job to Azure Queue
        const metadata = {
            course_id,
            module_id,
            source_type,
            video_id: video_id || null,
            notes_id: notes_id || null
        };

        await pushIngestionJob(jobId, sasUrl, metadata);

        console.log(`[RAG] Job ${jobId} queued successfully`);

        // Step 4: Return immediate response with job ID
        res.status(202).json({
            job_id: jobId,
            status: 'queued',
            message: `Ingestion job queued for ${req.file.originalname}`,
            blob_name: uploadResult.blobName
        });

    } catch (error) {
        console.error('[RAG] Ingestion failed:', error.message);
        res.status(500).json({
            error: 'Failed to queue ingestion job',
            message: error.message
        });
    }
};

/**
 * Get Job Status - Check the status of an ingestion job
 * GET /api/rag/jobs/:jobId
 * 
 * Queries the hosted RAG service's Redis for job status
 */
export const getJobStatus = async (req, res) => {
    try {
        const { jobId } = req.params;

        if (!jobId) {
            return res.status(400).json({ error: 'jobId is required' });
        }

        // Try to get job status from hosted service
        // The hosted service stores job status in Redis with pattern: rag:job:{jobId}
        // Since we can't directly access their Redis, we'll provide a basic status endpoint
        // that the frontend can poll

        // For now, return a pending status - in production, you'd either:
        // 1. Have your own Redis instance that mirrors job status
        // 2. Have the hosted service expose a /jobs/{jobId} endpoint
        // 3. Use webhooks for status updates

        console.log(`[RAG] Checking status for job ${jobId}`);

        // You can optionally add Redis integration here if you have access
        // to the same Redis instance as the hosted service

        res.status(200).json({
            job_id: jobId,
            status: 'processing',
            message: 'Job status tracking requires Redis integration with the hosted service'
        });

    } catch (error) {
        console.error('[RAG] Job status check failed:', error.message);
        res.status(500).json({
            error: 'Failed to get job status',
            message: error.message
        });
    }
};

/**
 * Query RAG - Query the RAG system for answers
 * POST /api/rag/query
 * 
 * Request JSON body:
 * - query: The question to ask (required)
 * - course_id: Filter by course (optional)
 * - module_id: Filter by module (optional)
 * - notes_id: Filter by notes (optional)
 * - video_id: Filter by video (optional)
 * - top_k: Number of chunks to retrieve, default 5 (optional)
 * - full_context: If true, retrieve ALL chunks for the module (optional)
 * - include_sources: If false, don't return source chunks (optional, default true)
 */
export const queryRAG = async (req, res) => {
    try {
        const { query, course_id, module_id, notes_id, video_id, top_k, full_context, include_sources } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'query is required' });
        }

        const payload = {
            query,
            ...(course_id && { course_id }),
            ...(module_id && { module_id }),
            ...(notes_id && { notes_id }),
            ...(video_id && { video_id }),
            ...(top_k !== undefined && { top_k }),
            ...(full_context !== undefined && { full_context }),
            ...(include_sources !== undefined && { include_sources })
        };

        console.log(`[RAG] Querying: "${query}" for course ${course_id || 'all'}, module ${module_id || 'all'}`);

        const response = await axios.post(`${RAG_SERVICE_URL}/query`, payload, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 120000 // 2 minutes timeout for query
        });

        console.log(`[RAG] Query successful, answer length: ${response.data.answer?.length || 0} chars`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('[RAG] Query failed:', error.response?.data || error.message);

        if (error.response) {
            // Forward the RAG service error response
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({
                error: 'Failed to query RAG',
                message: error.message
            });
        }
    }
};

/**
 * Get Sources Only - Retrieve relevant source chunks without generating an answer
 * POST /api/rag/sources
 * 
 * This is useful when you just want to retrieve relevant documents without LLM processing.
 * Request JSON body (same as query endpoint)
 */
export const getSources = async (req, res) => {
    try {
        const { query, course_id, module_id, top_k } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'query is required' });
        }

        // Use the query endpoint with a minimal payload
        // The actual "sources only" implementation would need support from the RAG service
        const payload = {
            query,
            ...(course_id && { course_id }),
            ...(module_id && { module_id }),
            ...(top_k !== undefined && { top_k }),
            include_sources: true
        };

        console.log(`[RAG] Getting sources for: "${query}"`);

        const response = await axios.post(`${RAG_SERVICE_URL}/query`, payload, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 60000
        });

        // Return only sources from the response
        res.status(200).json({
            sources: response.data.sources || [],
            debug: response.data.debug
        });
    } catch (error) {
        console.error('[RAG] Get sources failed:', error.response?.data || error.message);

        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({
                error: 'Failed to get sources',
                message: error.message
            });
        }
    }
};

/**
 * Delete Chunks - Remove chunks from the vector database by filter
 * DELETE /api/rag/delete
 * 
 * Request JSON body:
 * - source_uri: Blob URI to filter (optional)
 * - video_id: Video ID to filter (optional)
 * - notes_id: Notes ID to filter (optional)
 * 
 * At least one filter must be provided.
 */
export const deleteChunks = async (req, res) => {
    try {
        const { source_uri, video_id, notes_id } = req.body;

        // Validate that at least one filter is provided
        if (!source_uri && !video_id && !notes_id) {
            return res.status(400).json({
                error: 'At least one filter (source_uri, video_id, or notes_id) must be provided'
            });
        }

        const payload = {
            ...(source_uri && { source_uri }),
            ...(video_id && { video_id }),
            ...(notes_id && { notes_id })
        };

        console.log(`[RAG] Deleting chunks with filters:`, payload);

        const response = await axios.delete(`${RAG_SERVICE_URL}/delete`, {
            data: payload,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 60000
        });

        console.log(`[RAG] Delete successful: ${JSON.stringify(response.data)}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('[RAG] Delete failed:', error.response?.data || error.message);

        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({
                error: 'Failed to delete chunks',
                message: error.message
            });
        }
    }
};
