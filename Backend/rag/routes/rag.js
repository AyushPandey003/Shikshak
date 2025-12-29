import express from 'express';
import multer from 'multer';
import {
    healthCheck,
    ingestDocument,
    queryRAG,
    getSources
} from '../controllers/rag.controllers.js';

const router = express.Router();

// Configure multer for file uploads - store in memory for proxying
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB limit for videos
    },
    fileFilter: (req, file, cb) => {
        // Allow specific file types
        const allowedMimes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
            'text/plain',
            'video/mp4',
            'video/quicktime', // mov
            'video/x-msvideo', // avi
            'video/webm'
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
        }
    }
});

/**
 * @route   GET /api/rag/health
 * @desc    Health check for RAG service
 * @access  Public
 */
router.get('/health', healthCheck);

/**
 * @route   POST /api/rag/ingest
 * @desc    Ingest a document (PDF, DOCX, TXT, or video) into the RAG system
 * @access  Protected (for authenticated users - teachers/admins)
 * 
 * Body (multipart/form-data):
 * - file: File to upload
 * - course_id: Course ID (required)
 * - module_id: Module ID (required)
 * - source_type: 'pdf' | 'docx' | 'txt' | 'video' | 'notes' (required)
 * - video_id: Video ID (required if source_type is 'video')
 * - notes_id: Notes ID (required if source_type is 'notes')
 */
router.post('/ingest', upload.single('file'), ingestDocument);

/**
 * @route   POST /api/rag/query
 * @desc    Query the RAG system for answers
 * @access  Protected (for authenticated users - students/teachers)
 * 
 * Body (JSON):
 * - query: The question to ask (required)
 * - course_id: Filter by course (optional)
 * - module_id: Filter by module (optional)
 * - top_k: Number of chunks to retrieve (optional, default 5)
 * - full_context: Retrieve all chunks for module (optional, default false)
 * - include_sources: Include source chunks in response (optional, default true)
 */
router.post('/query', queryRAG);

/**
 * @route   POST /api/rag/sources
 * @desc    Get only source chunks without generating an answer
 * @access  Protected (for authenticated users)
 * 
 * Body (JSON): Same as /query endpoint
 */
router.post('/sources', getSources);

export default router;
