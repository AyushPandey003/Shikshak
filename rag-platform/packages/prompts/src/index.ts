// Export all prompts
export * from './video/summary.js';
export * from './document/summary.js';
export * from './qa/query.js';
export * from './executive/summary.js';

// Prompt versions registry
export const PROMPT_VERSIONS = {
    video: {
        summary: {
            v1: 'VIDEO_SUMMARY_V1',
            v2: 'VIDEO_SUMMARY_V2_CONCISE',
            default: 'v1',
        },
    },
    document: {
        summary: {
            v1: 'DOCUMENT_SUMMARY_V1',
            v2: 'DOCUMENT_SUMMARY_V2_ACADEMIC',
            default: 'v1',
        },
    },
    qa: {
        query: {
            v1: 'QA_PROMPT_V1',
            v2: 'QA_PROMPT_V2_EDUCATIONAL',
            v3: 'QA_PROMPT_V3_TECHNICAL',
            default: 'v1',
        },
    },
    executive: {
        summary: {
            v1: 'EXECUTIVE_SUMMARY_V1',
            v2: 'EXECUTIVE_SUMMARY_V2_WITH_RISKS',
            default: 'v1',
        },
    },
} as const;

/**
 * Fill template placeholders
 */
export function fillTemplate(
    template: string,
    variables: Record<string, string | undefined>
): string {
    let result = template;

    for (const [key, value] of Object.entries(variables)) {
        const placeholder = `{{${key}}}`;
        result = result.replaceAll(placeholder, value ?? '');
    }

    return result;
}

/**
 * Get prompt by path
 */
export function getPrompt(
    category: keyof typeof PROMPT_VERSIONS,
    type: string,
    version?: string
): string | undefined {
    const categoryConfig = PROMPT_VERSIONS[category];
    const typeConfig = categoryConfig?.[type as keyof typeof categoryConfig];

    if (!typeConfig) return undefined;

    const versionKey = version ?? typeConfig.default;
    return typeConfig[versionKey as keyof typeof typeConfig] as string;
}
