import { Module } from "../models/modules.model.js";
import { Course } from "../models/courses.model.js";
import { Video } from "../models/video.model.js";
import { Notes } from "../models/notes.model.js";

// Create Module
export const createModule = async (req, res) => {
    try {
        const { course_id, title } = req.body;

        if (!course_id || !title) {
            return res.status(400).json({ message: "Course ID and Title are required" });
        }

        const course = await Course.findById(course_id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const newModule = new Module({
            course_id,
            title,
        });

        const savedModule = await newModule.save();

        // Add module to course
        course.module_id.push(savedModule._id);
        await course.save();

        res.status(201).json(savedModule);
    } catch (error) {
        console.error("Error creating module:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Edit Module
export const editModule = async (req, res) => {
    try {
        const { module_id, title } = req.body;

        if (!module_id) {
            return res.status(400).json({ message: "Module ID is required" });
        }

        const updatedModule = await Module.findByIdAndUpdate(
            module_id,
            { title },
            { new: true }
        );

        if (!updatedModule) {
            return res.status(404).json({ message: "Module not found" });
        }

        res.status(200).json(updatedModule);
    } catch (error) {
        console.error("Error editing module:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get All Modules
export const getAllModules = async (req, res) => {
    try {
        const { course_id } = req.body;

        if (!course_id) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        const modules = await Module.find({ course_id })
            .populate("video_id")
            .populate("notes_id");

        res.status(200).json(modules);
    } catch (error) {
        console.error("Error fetching modules:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Module
export const deleteModule = async (req, res) => {
    try {
        const { module_id } = req.body;

        if (!module_id) {
            return res.status(400).json({ message: "Module ID is required" });
        }

        const moduleToDelete = await Module.findById(module_id);
        if (!moduleToDelete) {
            return res.status(404).json({ message: "Module not found" });
        }

        // Cleanup videos and notes based on module_id reference
        await Video.deleteMany({ module_id: module_id });
        await Notes.deleteMany({ module_id: module_id });

        // Remove module from course
        await Course.findByIdAndUpdate(moduleToDelete.course_id, {
            $pull: { module_id: module_id }
        });

        await Module.findByIdAndDelete(module_id);

        res.status(200).json({ message: "Module deleted successfully" });
    } catch (error) {
        console.error("Error deleting module:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Add Video
export const addVideo = async (req, res) => {
    try {
        const { module_id, azure_id, title } = req.body;

        if (!module_id || !azure_id || !title) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const module = await Module.findById(module_id);
        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }

        const series_number = module.video_id.length + module.notes_id.length + 1;

        const newVideo = new Video({
            module_id,
            azure_id,
            title,
            series_number,
        });

        const savedVideo = await newVideo.save();

        module.video_id.push(savedVideo._id);
        await module.save();

        res.status(201).json(savedVideo);
    } catch (error) {
        console.error("Error adding video:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Add Notes
export const addNotes = async (req, res) => {
    try {
        const { module_id, azure_id } = req.body;

        if (!module_id || !azure_id) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const module = await Module.findById(module_id);
        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }

        const series_number = module.video_id.length + module.notes_id.length + 1;

        const newNotes = new Notes({
            module_id,
            azure_id,
            series_number,
        });

        const savedNotes = await newNotes.save();

        module.notes_id.push(savedNotes._id);
        await module.save();

        res.status(201).json(savedNotes);
    } catch (error) {
        console.error("Error adding notes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


