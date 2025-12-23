/**
 * Summary Response
 */
export interface Summary {
    status: 'completed' | 'pending' | 'failed';
    title?: string;
    executiveSummary?: string;
    detailedSummary?: string;
    keyPoints?: string[];
    topics?: string[];
    timeline?: Array<{
        timestamp: string;
        title: string;
        description: string;
    }>;
    metadata?: Record<string, unknown>;
    generatedAt: string;
    error?: string;
}

/**
 * Summary Generation Options
 */
export interface SummaryOptions {
    style?: 'concise' | 'detailed' | 'academic' | 'casual';
    maxLength?: number;
    focusAreas?: string[];
    language?: string;
    includeTimeline?: boolean;
}

/**
 * Video Summary
 */
export interface VideoSummary extends Summary {
    duration?: string;
    speakers?: string[];
    slides?: Array<{
        timestamp: string;
        content: string;
    }>;
}

/**
 * Document Summary
 */
export interface DocumentSummary extends Summary {
    pageCount?: number;
    structure?: Array<{
        title: string;
        level: number;
        page: number;
    }>;
}
