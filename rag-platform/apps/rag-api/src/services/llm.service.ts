import OpenAI from 'openai';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

/**
 * LLM Service
 * Handles communication with Azure OpenAI / OpenAI
 */
export class LLMService {
    private client: OpenAI | null = null;
    private isAzure: boolean = false;

    constructor() {
        this.initializeClient();
    }

    private initializeClient(): void {
        // Prefer Azure OpenAI if configured
        if (config.azure.openai.apiKey && config.azure.openai.endpoint) {
            this.client = new OpenAI({
                apiKey: config.azure.openai.apiKey,
                baseURL: `${config.azure.openai.endpoint}/openai/deployments/${config.azure.openai.deploymentName}`,
                defaultQuery: { 'api-version': '2024-02-01' },
                defaultHeaders: { 'api-key': config.azure.openai.apiKey },
            });
            this.isAzure = true;
            logger.info('Using Azure OpenAI');
        }
        // Fall back to OpenAI
        else if (config.openai.apiKey) {
            this.client = new OpenAI({
                apiKey: config.openai.apiKey,
            });
            logger.info('Using OpenAI');
        }
        else {
            logger.warn('No LLM API key configured - LLM features will be disabled');
        }
    }

    /**
     * Generate a response using the LLM
     */
    async generate(prompt: string, options?: {
        maxTokens?: number;
        temperature?: number;
        model?: string;
    }): Promise<string> {
        if (!this.client) {
            throw new Error('LLM client not initialized');
        }

        try {
            const response = await this.client.chat.completions.create({
                model: options?.model ?? (this.isAzure ? config.azure.openai.deploymentName : 'gpt-4'),
                messages: [
                    { role: 'user', content: prompt },
                ],
                max_tokens: options?.maxTokens ?? 2000,
                temperature: options?.temperature ?? 0.7,
            });

            return response.choices[0]?.message?.content ?? '';

        } catch (error) {
            logger.error({ error }, 'LLM generation failed');
            throw error;
        }
    }

    /**
     * Generate a streaming response
     */
    async *generateStream(prompt: string, options?: {
        maxTokens?: number;
        temperature?: number;
        model?: string;
    }): AsyncGenerator<string> {
        if (!this.client) {
            throw new Error('LLM client not initialized');
        }

        try {
            const stream = await this.client.chat.completions.create({
                model: options?.model ?? (this.isAzure ? config.azure.openai.deploymentName : 'gpt-4'),
                messages: [
                    { role: 'user', content: prompt },
                ],
                max_tokens: options?.maxTokens ?? 2000,
                temperature: options?.temperature ?? 0.7,
                stream: true,
            });

            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content;
                if (content) {
                    yield content;
                }
            }

        } catch (error) {
            logger.error({ error }, 'LLM streaming failed');
            throw error;
        }
    }

    /**
     * Generate embeddings for text
     */
    async generateEmbedding(text: string): Promise<number[]> {
        if (!this.client) {
            throw new Error('LLM client not initialized');
        }

        try {
            const response = await this.client.embeddings.create({
                model: this.isAzure ? config.azure.openai.embeddingDeployment : 'text-embedding-ada-002',
                input: text,
            });

            return response.data[0]?.embedding ?? [];

        } catch (error) {
            logger.error({ error }, 'Embedding generation failed');
            throw error;
        }
    }

    /**
     * Generate embeddings for multiple texts (batch)
     */
    async generateEmbeddings(texts: string[]): Promise<number[][]> {
        if (!this.client) {
            throw new Error('LLM client not initialized');
        }

        try {
            const response = await this.client.embeddings.create({
                model: this.isAzure ? config.azure.openai.embeddingDeployment : 'text-embedding-ada-002',
                input: texts,
            });

            return response.data.map(d => d.embedding);

        } catch (error) {
            logger.error({ error }, 'Batch embedding generation failed');
            throw error;
        }
    }
}
