import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        teacher_id: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            default: 0,
            required: true,
        },
        duration: {
            type: String,
            required: true,
        },
        visibility: {
            type: String,
            enum: ["public", "private"],
            default: "public",
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            default: 0,
        },
        student_count: {
            type: Number,
            default: 0,
        },
        board: {
            type: String,
            required: true,
        },
        pricing_category: {
            type: String,
            enum: ["paid", "free"],
            default: "free",
            required: true,
        },
        module_id: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Module",
            },
        ],
        students_id: [
            {
                type: String,
            },
        ],
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
    },
    { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
