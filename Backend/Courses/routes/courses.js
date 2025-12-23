import { Router } from "express";


import { createCourse, editCourse, deleteCourse, getAllGeneralInfo, getCourseByIdGeneral, getAllCourses, getCourseById } from "../controllers/courses.controllers.js";

const router = Router();

router.post("/edit_course", editCourse);
router.post("/create_course", createCourse);
router.post("/delete_course", deleteCourse);
router.get("/get_all_general", getAllGeneralInfo);
router.post("/get_course_by_id_general", getCourseByIdGeneral);
router.post("/get_all", getAllCourses);
router.post("/get_course_by_id", getCourseById);

export default router;

