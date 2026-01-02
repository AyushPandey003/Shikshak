import { Router } from "express";
import {
    createTest,
    fetchQuestions,
    saveResult,
    getResults,
    giveMarks,
    getStudentResult,
    generateAiQuestions,
} from "../controllers/tests.controllers.js";

const router = Router();

router.post("/test-create", createTest);
router.post("/fetch-questions", fetchQuestions);
router.post("/save-result", saveResult);
router.post("/get-results", getResults);
router.post("/give-marks", giveMarks);
router.post("/get-student-result", getStudentResult);
router.post("/aitest", generateAiQuestions);

export default router;
