/**
 * Seed Qdrant Script
 * Creates the collection and adds sample data for testing
 */

import { QdrantClient } from '@qdrant/js-client-rest';

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const COLLECTION_NAME = process.env.QDRANT_COLLECTION_NAME || 'rag-chunks';
const VECTOR_SIZE = 1536; // OpenAI text-embedding-ada-002

async function main() {
    console.log('🔧 Seeding Qdrant...');

    const client = new QdrantClient({ url: QDRANT_URL });

    // Check if collection exists
    const collections = await client.getCollections();
    const exists = collections.collections.some(c => c.name === COLLECTION_NAME);

    if (exists) {
        console.log(`📦 Collection "${COLLECTION_NAME}" already exists`);

        // Ask user if they want to recreate
        const recreate = process.argv.includes('--recreate');

        if (recreate) {
            console.log('🗑️  Deleting existing collection...');
            await client.deleteCollection(COLLECTION_NAME);
        } else {
            console.log('ℹ️  Use --recreate to delete and recreate the collection');
            return;
        }
    }

    // Create collection
    console.log('📦 Creating collection...');
    await client.createCollection(COLLECTION_NAME, {
        vectors: {
            size: VECTOR_SIZE,
            distance: 'Cosine',
        },
    });

    // Create payload index for efficient filtering
    console.log('🏷️  Creating payload indexes...');
    await client.createPayloadIndex(COLLECTION_NAME, {
        field_name: 'jobId',
        field_schema: 'keyword',
    });

    await client.createPayloadIndex(COLLECTION_NAME, {
        field_name: 'modality',
        field_schema: 'keyword',
    });

    await client.createPayloadIndex(COLLECTION_NAME, {
        field_name: 'courseId',
        field_schema: 'keyword',
    });

    // Add sample data
    console.log('📝 Adding sample data...');

    const sampleChunks = [
        {
            id: 'sample-1',
            text: 'Introduction to Machine Learning: Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience.',
            modality: 'video',
            jobId: 'sample-job-1',
        },
        {
            id: 'sample-2',
            text: 'Supervised learning uses labeled data to train models. Common algorithms include linear regression, decision trees, and neural networks.',
            modality: 'video',
            jobId: 'sample-job-1',
        },
        {
            id: 'sample-3',
            text: 'This document covers the basics of Python programming, including variables, data types, and control structures.',
            modality: 'document',
            jobId: 'sample-job-2',
        },
    ];

    const points = sampleChunks.map(chunk => ({
        id: chunk.id,
        vector: Array.from({ length: VECTOR_SIZE }, () => Math.random() * 2 - 1),
        payload: {
            text: chunk.text,
            modality: chunk.modality,
            jobId: chunk.jobId,
            createdAt: new Date().toISOString(),
        },
    }));

    await client.upsert(COLLECTION_NAME, { points });

    console.log('✅ Seeding complete!');
    console.log(`   Collection: ${COLLECTION_NAME}`);
    console.log(`   Vectors: ${points.length}`);

    // Verify
    const info = await client.getCollection(COLLECTION_NAME);
    console.log(`   Total points: ${info.points_count}`);
}

main().catch(console.error);
