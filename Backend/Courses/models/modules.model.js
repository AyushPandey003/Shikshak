import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
    {
        course_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        video_id: {
            type: String,
        },
        notes_id: {
            type: String,
        },
        description: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const Module = mongoose.model("Module", moduleSchema);
