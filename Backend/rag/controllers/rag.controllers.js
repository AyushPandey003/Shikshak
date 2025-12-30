import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load centralized environment configuration
dotenv.config({ path: path.resolve(__dirname, '../../../.config/.env') });

import axios from 'axios';
import FormData from 'form-data';

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
            timeout: 10000
        });
        res.status(200).json({
            status: 'healthy',
            ragService: response.data,
            proxyService: 'healthy'
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
 * Ingest Document - Ingest a file (PDF, DOCX, TXT, or video) into the RAG system
 * POST /api/rag/ingest
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

        // Create form data to forward to RAG service
        const formData = new FormData();
        formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });
        formData.append('course_id', course_id);
        formData.append('module_id', module_id);
        formData.append('source_type', source_type);

        if (video_id) {
            formData.append('video_id', video_id);
        }
        if (notes_id) {
            formData.append('notes_id', notes_id);
        }

        console.log(`[RAG] Ingesting document: ${req.file.originalname} for course ${course_id}, module ${module_id}`);

        const response = await axios.post(`${RAG_SERVICE_URL}/ingest`, formData, {
            headers: {
                ...formData.getHeaders()
            },
            timeout: 300000, // 5 minutes timeout for large files/videos
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });

        console.log(`[RAG] Ingestion successful: ${JSON.stringify(response.data)}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('[RAG] Ingestion failed:', error.response?.data || error.message);

        if (error.response) {
            // Forward the RAG service error response
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({
                error: 'Failed to ingest document',
                message: error.message
            });
        }
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

