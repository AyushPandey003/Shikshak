import { logger } from '../utils/logger.js';

/**
 * Prompt Service
 * Manages and versions prompts for different RAG operations
 */
export class PromptService {

    /**
     * Get the query/Q&A prompt
     */
    getQueryPrompt(question: string, context: string): string {
        return `You are a helpful AI assistant that answers questions based on the provided context.

## Context
${context}

## Instructions
1. Answer the question based ONLY on the context provided above
2. If the context doesn't contain enough information, say so honestly
3. Cite specific parts of the context when making claims
4. Be concise but comprehensive
5. If there are multiple perspectives in the context, present them fairly

## Question
${question}

## Answer`;
    }

    /**
     * Get the summarization prompt
     */
    getSummaryPrompt(content: string, options?: {
        style?: 'concise' | 'detailed' | 'academic' | 'casual';
        maxLength?: number;
        focusAreas?: string[];
    }): string {
        const style = options?.style ?? 'detailed';
        const styleInstructions = this.getStyleInstructions(style);

        return `You are an expert at creating insightful summaries of content.

## Content to Summarize
${content}

## Style
${styleInstructions}

${options?.focusAreas ? `## Focus Areas\nPay special attention to: ${options.focusAreas.join(', ')}` : ''}

## Instructions
1. Create an executive summary (2-3 sentences)
2. List the key points (bullet points)
3. Provide a detailed summary organized by topic
4. Extract main themes and concepts
5. Note any action items or recommendations if present

## Summary`;
    }

    /**
     * Get the video summarization prompt (multimodal)
     */
    getVideoSummaryPrompt(transcript: string, visualContext: string, options?: {
        duration?: string;
        includeTimestamps?: boolean;
    }): string {
        return `You are an expert at summarizing video content using both spoken and visual information.

## Transcript
${transcript}

## Visual Context (Scene descriptions, slides, text on screen)
${visualContext}

## Instructions
1. Create an executive summary combining audio and visual content
2. Identify key topics and when they appear
3. Note important visual elements (diagrams, slides, demonstrations)
4. Extract main points from the speaker
5. Highlight any text, code, or formulas shown on screen
${options?.includeTimestamps ? '6. Include timestamps for major sections' : ''}

## Video Summary`;
    }

    /**
     * Get the document summarization prompt
     */
    getDocumentSummaryPrompt(content: string, metadata?: {
        title?: string;
        author?: string;
        type?: string;
    }): string {
        return `You are an expert at analyzing and summarizing documents.

${metadata?.title ? `## Document: ${metadata.title}` : ''}
${metadata?.author ? `## Author: ${metadata.author}` : ''}
${metadata?.type ? `## Type: ${metadata.type}` : ''}

## Content
${content}

## Instructions
1. Provide an executive summary
2. Outline the document structure
3. Extract key arguments and findings
4. Note any conclusions or recommendations
5. Identify supporting evidence and examples

## Document Summary`;
    }

    /**
     * Get the chunk extraction prompt
     */
    getChunkExtractionPrompt(rawText: string, modality: string): string {
        return `You are an expert at extracting meaningful semantic chunks from ${modality} content.

## Raw Content
${rawText}

## Instructions
1. Identify natural semantic boundaries
2. Preserve context at chunk boundaries
3. Keep related information together
4. Note important metadata (timestamps, page numbers, etc.)
5. Flag key concepts and entities

## Extracted Chunks (JSON format)`;
    }

    /**
     * Get the suggested questions prompt
     */
    getSuggestedQuestionsPrompt(summary: string, count: number): string {
        return `Based on the following content summary, generate ${count} insightful questions that a learner might ask.

## Content Summary
${summary}

## Instructions
1. Generate questions that test understanding
2. Include both factual and analytical questions
3. Vary difficulty levels
4. Make questions specific and actionable

## Suggested Questions (one per line)`;
    }

    /**
     * Get the visual description prompt (for images/frames)
     */
    getVisualDescriptionPrompt(): string {
        return `Describe this image in detail, focusing on:
1. Any text, code, or written content visible
2. Diagrams, charts, or visual representations
3. Key visual elements and their relationships
4. Context that would help understanding the content

Be specific and factual. This description will be used for search and Q&A.`;
    }

    // Private helper methods

    private getStyleInstructions(style: string): string {
        switch (style) {
            case 'concise':
                return 'Be brief and to the point. Focus only on the most critical information.';
            case 'detailed':
                return 'Provide comprehensive coverage. Include supporting details and examples.';
            case 'academic':
                return 'Use formal academic language. Structure with clear sections and cite sources.';
            case 'casual':
                return 'Use conversational language. Make it accessible and easy to understand.';
            default:
                return 'Provide a balanced summary with appropriate detail.';
        }
    }
}
