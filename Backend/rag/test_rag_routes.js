import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:4005/api/rag';
const TEST_FILE_PATH = path.join(__dirname, 'test_doc.txt');

// Helper to log steps
const logStep = (step) => console.log(`\n\n=== [TEST] ${step} ===`);

async function runTests() {
    try {
        // Create a dummy file for ingestion
        fs.writeFileSync(TEST_FILE_PATH, 'This is a test document for the RAG service integration test.');

        // 1. Health Check
        logStep('1. Health Check');
        try {
            const healthRes = await axios.get(`${BASE_URL}/health`);
            console.log('✅ Health Check Passed:', healthRes.data);
        } catch (err) {
            console.error('❌ Health Check Failed:', err.message);
        }

        // 2. Ingest Document
        logStep('2. Ingest Document');
        let videoId = 'test_vid_123'; // Dummy ID just in case we need it later, though we are using txt
        let ingestResponse;
        try {
            const form = new FormData();
            form.append('file', fs.createReadStream(TEST_FILE_PATH));
            form.append('course_id', 'TEST_COURSE_001');
            form.append('module_id', 'TEST_MODULE_001');
            form.append('source_type', 'txt');

            ingestResponse = await axios.post(`${BASE_URL}/ingest`, form, {
                headers: { ...form.getHeaders() }
            });
            console.log('✅ Ingest Passed:', ingestResponse.data);
        } catch (err) {
            console.error('❌ Ingest Failed:', err.response?.data || err.message);
        }

        // 3. Query RAG
        logStep('3. Query RAG');
        try {
            const queryRes = await axios.post(`${BASE_URL}/query`, {
                query: 'What is this document about?',
                course_id: 'TEST_COURSE_001',
                module_id: 'TEST_MODULE_001',
                top_k: 3
            });
            console.log('✅ Query Passed:', queryRes.data);
        } catch (err) {
            console.error('❌ Query Failed:', err.response?.data || err.message);
        }

        // 4. Get Sources
        logStep('4. Get Sources');
        try {
            const sourcesRes = await axios.post(`${BASE_URL}/sources`, {
                query: 'test document',
                course_id: 'TEST_COURSE_001',
                module_id: 'TEST_MODULE_001'
            });
            console.log('✅ Get Sources Passed:', sourcesRes.data);
        } catch (err) {
            console.error('❌ Get Sources Failed:', err.response?.data || err.message);
        }

        // 5. Delete Chunks (Cleanup)
        logStep('5. Delete Chunks');
        try {
            const deleteRes = await axios.delete(`${BASE_URL}/delete`, {
                data: {
                    // You might need source_uri which usually involves blob storage, 
                    // but for this test we'll try to delete by context if allowed or just mock the call.
                    // Since we don't have the exact source_uri from ingest (mocked), we might fail here 
                    // unless we use the IDs. Let's try sending course/module if supported or just a dummy video_id check.
                    // Note: The delete endpoint requires source_uri, video_id, or notes_id.
                    // Our ingest was 'txt', so it might not generate video_id.
                    // We'll skip if we don't have a valid ID, or try with a dummy ID to verify the endpoint is reachable.
                    video_id: videoId
                }
            });
            console.log('✅ Delete Endpoint Reachable:', deleteRes.data);
        } catch (err) {
            // It might fail if no chunks found, but we want to know if the endpoint works (404/200 vs 500)
            console.log('ℹ️ Delete Response:', err.response?.data || err.message);
        }

    } catch (error) {
        console.error('Unexpected Error:', error);
    } finally {
        // Cleanup test file
        if (fs.existsSync(TEST_FILE_PATH)) {
            fs.unlinkSync(TEST_FILE_PATH);
        }
    }
}

runTests();
