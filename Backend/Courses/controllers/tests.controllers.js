import { Test } from "../models/test.model.js";
import { Result } from "../models/result.model.js";
import { Course } from "../models/courses.model.js";

// Create a new test
export const createTest = async (req, res) => {
    try {
        const { questions, course_id, user_id, valid_until } = req.body;

        if (!questions || !course_id || !user_id || !valid_until) {
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
        const { test_id } = req.body;

        if (!test_id) {
            return res.status(400).json({ error: "Test ID is required" });
        }

        const test = await Test.findById(test_id);
        if (!test) {
            return res.status(404).json({ error: "Test not found" });
        }

        // Check if test is still valid
        if (new Date() > test.valid_until) {
            return res.status(400).json({ error: "Test has expired" });
        }

        res.status(200).json({
            success: true,
            test_id: test._id,
            questions: test.questions,
            valid_until: test.valid_until,
        });
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Save student result (answers)
export const saveResult = async (req, res) => {
    try {
        const { test_id, user_id, answers } = req.body;

        if (!test_id || !user_id || !answers) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Verify test exists
        const test = await Test.findById(test_id);
        if (!test) {
            return res.status(404).json({ error: "Test not found" });
        }

        // Check if test is still valid
        if (new Date() > test.valid_until) {
            return res.status(400).json({ error: "Test has expired" });
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
