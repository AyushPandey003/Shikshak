
import axios from 'axios';

const BASE_URL = 'http://localhost:4002/api/tests';

// Test Cases
const testCases = [
    {
        name: 'Generate from Raw Text (Madam Rides the Bus chunk)',
        payload: {
            // Using the user's provided text as a query to generate questions
            query: `Generate 3 questions based on this text: 
            "BEFORE YOU READ In this sensitive story, an eight-year old girl’s first bus journey into the world outside her village..."`,
            number_of_questions: 3
        }
    },
    {
        name: 'Generate from Module Context (Mock ID)',
        payload: {
            module_id: '9',
            course_id: '15',
            number_of_questions: 2
        }
    }
];

async function runTests() {
    console.log('🧪 Starting AI Question Generation Tests...\n');

    for (const test of testCases) {
        console.log(`=== Test: ${test.name} ===`);
        try {
            const response = await axios.post(`${BASE_URL}/aitest`, test.payload);
            console.log('✅ Success!');
            console.log('Response:', JSON.stringify(response.data.questions, null, 2));
            if (response.data.sources) {
                console.log('Sources:', response.data.sources.length);
            }
        } catch (error) {
            console.error('❌ Failed:', error.response?.data || error.message);
        }
        console.log('\n');
    }
}

runTests();
