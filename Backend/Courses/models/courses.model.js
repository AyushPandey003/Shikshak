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
        teacher_details: {
            type: Object,
            required: true,
            id: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            qualification: {
                type: String,
                required: true,
            },
            class: {
                type: String,
                required: true,
            },
            experience: {
                type: String,
                required: true,
            },
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
                type: Object,
                id: {
                    type: String,
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                email: {
                    type: String,
                    required: true,
                },
            },
        ],
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
        total_earned: {
            type: Number,
            default: 0,
        },
        language: {
            type: String,
            required: true,
        },
        course_outcomes: [
            {
                type: String,
                required: true,
            },
        ]
    },
    { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
