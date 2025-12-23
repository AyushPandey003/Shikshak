/**
 * Supported file extensions by modality
 */
export const SUPPORTED_EXTENSIONS = {
    video: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv'],
    audio: ['mp3', 'wav', 'm4a', 'flac', 'ogg', 'aac', 'wma'],
    document: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'md', 'rtf'],
    image: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'tiff'],
} as const;

/**
 * MIME type mappings
 */
export const MIME_MAPPINGS = {
    'video/mp4': 'video',
    'video/quicktime': 'video',
    'video/x-msvideo': 'video',
    'video/x-matroska': 'video',
    'video/webm': 'video',
    'audio/mpeg': 'audio',
    'audio/wav': 'audio',
    'audio/x-m4a': 'audio',
    'audio/flac': 'audio',
    'audio/ogg': 'audio',
    'application/pdf': 'document',
    'application/msword': 'document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document',
    'application/vnd.ms-powerpoint': 'document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'document',
    'text/plain': 'document',
    'text/markdown': 'document',
    'image/png': 'image',
    'image/jpeg': 'image',
    'image/gif': 'image',
    'image/webp': 'image',
} as const;

/**
 * Default chunk sizes by modality
 */
export const CHUNK_SIZES = {
    video: 500, // tokens per transcript segment
    audio: 500,
    document: 800,
    image: 300,
} as const;

/**
 * Processing timeouts (in ms)
 */
export const PROCESSING_TIMEOUTS = {
    video: 30 * 60 * 1000, // 30 minutes
    audio: 15 * 60 * 1000, // 15 minutes
    document: 5 * 60 * 1000, // 5 minutes
    image: 60 * 1000, // 1 minute
} as const;

/**
 * Azure Storage Container Names
 */
export const STORAGE_CONTAINERS = {
    raw: 'raw-videos',
    processed: 'processed',
    transcripts: 'transcripts',
    summaries: 'summaries',
    embeddings: 'embeddings',
} as const;

/**
 * Job Queue Names
 */
export const QUEUE_NAMES = {
    video: 'video-jobs',
    audio: 'audio-jobs',
    document: 'document-jobs',
    image: 'image-jobs',
} as const;
