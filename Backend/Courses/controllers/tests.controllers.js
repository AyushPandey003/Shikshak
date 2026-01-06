import { Test } from "../models/test.model.js";
import { Result } from "../models/result.model.js";
import { Course } from "../models/courses.model.js";
import axios from "axios";

// Create a new test
export const createTest = async (req, res) => {
    try {
        const { questions, course_id, user_id, valid_until, title } = req.body;

        if (!questions || !course_id || !user_id || !valid_until || !title) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Verify course exists
        const course = await Course.findById(course_id);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        // Create the test
        const test = new Test({
            questions,
            course_id,
            user_id,
            valid_until: new Date(valid_until),
            title
        });

        await test.save();

        // Add test_id to the course
        await Course.findByIdAndUpdate(course_id, {
            $push: { test_id: test._id },
        });

        res.status(201).json({
            success: true,
            message: "Test created successfully",
            test,
        });
    } catch (error) {
        console.error("Error creating test:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Fetch questions for a test
export const fetchQuestions = async (req, res) => {
    try {
        const { course_id, test_id } = req.body;
        console.log(course_id, test_id);
        if (!course_id || !test_id) {
            return res.status(400).json({ error: "Course ID and Test ID are required" });
        }

        const course = await Course.findOne({ _id: course_id });
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }
        const test = await Test.findOne({ _id: test_id });
        console.log(test);
        if (!test) {
            return res.status(404).json({ error: "Test not found" });
        }
        res.status(200).json({
            success: true,
            questions: test.questions,
        });
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Save student result (answers)
export const saveResult = async (req, res) => {
    try {
        const { test_id, user_id, answers, questions } = req.body;

        if (!test_id || !user_id || !answers || !questions) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Verify test exists
        const test = await Test.findById(test_id);
        if (!test) {
            return res.status(404).json({ error: "Test not found" });
        }

        // Check if student already submitted
        const existingResult = await Result.findOne({ test_id, user_id });
        if (existingResult) {
            return res.status(400).json({ error: "Result already submitted" });
        }

        // Create the result
        const result = new Result({
            test_id,
            user_id,
            answers,
            questions,
            marks: null,
        });

        await result.save();

        res.status(201).json({
            success: true,
            message: "Result saved successfully",
            result,
        });
    } catch (error) {
        console.error("Error saving result:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all results for a test (teacher view)
export const getResults = async (req, res) => {
    try {
        const { test_id } = req.body;

        if (!test_id) {
            return res.status(400).json({ error: "Test ID is required" });
        }

        const results = await Result.find({ test_id });

        res.status(200).json({
            success: true,
            count: results.length,
            results,
        });
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Give marks to a result
export const giveMarks = async (req, res) => {
    try {
        const { result_id, marks } = req.body;

        if (!result_id || marks === undefined) {
            return res.status(400).json({ error: "Result ID and marks are required" });
        }

        const result = await Result.findByIdAndUpdate(
            result_id,
            { marks },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ error: "Result not found" });
        }

        res.status(200).json({
            success: true,
            message: "Marks updated successfully",
            result,
        });
    } catch (error) {
        console.error("Error giving marks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get student result for a specific test
export const getStudentResult = async (req, res) => {
    try {
        const { test_id, user_id } = req.body;

        if (!test_id || !user_id) {
            return res.status(400).json({ error: "Test ID and User ID are required" });
        }

        const result = await Result.findOne({ test_id, user_id });

        if (!result) {
            return res.status(404).json({ error: "Result not found" });
        }

        res.status(200).json({
            success: true,
            result,
        });
    } catch (error) {
        console.error("Error fetching student result:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Generate AI questions using RAG
export const generateAiQuestions = async (req, res) => {
    try {
        const { course_id, number_of_questions = 5, query } = req.body;

        if (!course_id && !query) {
            return res.status(400).json({ error: "Course ID, or Query is required" });
        }

        const ragServiceUrl = process.env.RAG_PROXY_URL || 'http://localhost:4005';

        // Construct the prompt for the RAG service
        // If a specific query/text is provided by the user (like the chunk in the prompt), we use that.
        // Otherwise, we ask RAG to generate questions based on the module/course context.
        // let ragQuery = query;

        // if (!ragQuery) {
        //     ragQuery = `Generate ${number_of_questions} multiple choice questions (with 4 options and the correct answer indicated) based on the content of ${'course ' + course_id}. 
        //     Format strictly as a JSON array of objects with keys: question, options (array of strings), answer (string).`;
        // }
        let ragQuery = `Generate ${number_of_questions} questions based on the content of ${'course ' + course_id} and query ${query}. Only just return questions in a JSON nothing else.`;

        // Call the RAG service query endpoint
        // logic: RAG service takes "query" and finds relevant chunks.
        // If we want questions *covering* the module, we might need "full_context: true" or just rely on semantic search.
        const response = await axios.post(`${ragServiceUrl}/api/rag/query`, {
            query: ragQuery,
            ...(course_id && { course_id }),
            top_k: 5, // Get enough context
            full_context: false // or true if we want comprehensive coverage, but it might be slow
        });

        // The RAG service returns { answer: "...", sources: [...] }
        const generatedText = response.data.answer;

        // Try to parse JSON if the model followed instructions, otherwise return text
        let questions;
        try {
            // Find JSON in the response (it might be wrapped in ```json ... ```)
            const jsonMatch = generatedText.match(/\[.*\]/s);
            if (jsonMatch) {
                questions = JSON.parse(jsonMatch[0]);
            } else {
                questions = generatedText;
            }
        } catch (e) {
            questions = generatedText;
        }

        res.status(200).json({
            success: true,
            questions: questions,
            sources: response.data.sources
        });

    } catch (error) {
        console.error("Error generating AI questions:", error.response?.data || error.message);
        res.status(500).json({
            error: "Failed to generate questions",
            details: error.response?.data || error.message
        });
    }
};
