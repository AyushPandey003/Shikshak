import { Module } from "../models/modules.model.js";
import { Video } from "../models/video.model.js";
import { Course } from "../models/courses.model.js";
import { Notes } from "../models/notes.model.js";
import { produceCourse, disconnectCourseProducer } from "../infra/course.producer.js";

export const createCourse = async (req, res) => {
    try {
        const { name, subject, teacher_details, description, price, duration, visibility, thumbnail, board, pricing_category, language, course_outcomes } = req.body;

        const newCourse = new Course({
            name,
            subject,
            teacher_details,
            description,
            price,
            duration,
            visibility,
            thumbnail,
            board,
            pricing_category,
            language,
            course_outcomes
        });

        const savedCourse = await newCourse.save();
        await produceCourse(savedCourse._id.toString(), "course_created");
        await disconnectCourseProducer();
        res.status(201).json(savedCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const editCourse = async (req, res) => {
    try {
        const { course_id, ...updateData } = req.body;
        if (!course_id) {
            return res.status(400).json({ message: "Course ID is required" });
        }
        const updatedCourse = await Course.findByIdAndUpdate(course_id, updateData, { new: true });
        if (!updatedCourse) return res.status(404).json({ message: "Course not found" });
        await produceCourse(course_id.toString(), "course_updated");
        await disconnectCourseProducer();
        res.status(200).json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteCourse = async (req, res) => {
    try {
        const { course_id } = req.body;
        if (!course_id) {
            return res.status(400).json({ message: "Course ID is required" });
        }


        const course = await Course.findById(course_id);
        if (!course) return res.status(404).json({ message: "Course not found" });

        const moduleIds = course.module_id;

        // Delete videos and notes associated with these modules
        await Video.deleteMany({ module_id: { $in: moduleIds } });
        await Notes.deleteMany({ module_id: { $in: moduleIds } });

        // Delete the modules
        await Module.deleteMany({ _id: { $in: moduleIds } });

        await Course.findByIdAndDelete(course_id);
        await produceCourse(course_id.toString(), "course_deleted");
        await disconnectCourseProducer();
        res.status(200).json({ message: "Course and associated modules deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllGeneralInfo = async (req, res) => {
    try {
        const courses = await Course.find({ visibility: "public" }).select("name subject price thumbnail board pricing_category rating visibility");
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCourseByIdGeneral = async (req, res) => {
    try {
        const { course_id } = req.body;
        if (!course_id) {
            return res.status(400).json({ message: "Course ID is required" });
        }
        const course = await Course.findOne({ _id: course_id, visibility: "public" }).select("name subject teacher_details description price duration visibility thumbnail rating board pricing_category module_id reviews language course_outcomes").populate("module_id reviews");
        if (!course) return res.status(404).json({ message: "Course not found or private" });
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllCourses = async (req, res) => {
    try {
        const { user_id , user_role } = req.body;
        
        if(!user_id || !user_role){
            return res.status(400).json({ message: "User ID and User Role are required" });
        }

        let courses;
        if(user_role === "teacher"){
            courses = await Course.find({ "teacher_details.id" : user_id }).select("name subject price thumbnail board pricing_category rating visibility");
        }else if(user_role === "student"){
            courses = await Course.find({ "students_id.id" : user_id }).select("name subject price thumbnail board pricing_category rating visibility");
        }else{
            return res.status(400).json({ message: "Invalid User Role" });
        }

        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const { course_id, user_id, user_role } = req.body;
        if (!course_id) {
            return res.status(400).json({ message: "Course ID is required" });
        }
        if(!user_id || !user_role){
            return res.status(400).json({ message: "User ID and User Role are required" });
        }

        let course;
        if(user_role === "teacher"){
            course = await Course.findOne({ _id: course_id, "teacher_details.id" : user_id }).select("name subject teacher_details description price duration visibility thumbnail rating student_count board pricing_category module_id reviews total_earned language course_outcomes").populate("module_id reviews");

        }else if(user_role === "student"){
            course = await Course.findOne({ _id: course_id, "students_id.id" : user_id }).select("name subject teacher_details description price duration visibility thumbnail rating board pricing_category module_id reviews language course_outcomes").populate("module_id reviews");

        }else{
            return res.status(400).json({ message: "Invalid User Role" });
        }

        if(!course){
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
