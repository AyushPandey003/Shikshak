import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
    {
        course_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        video_id: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
        }],
        notes_id: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notes",
        }]
    },
    { timestamps: true }
);

export const Module = mongoose.model("Module", moduleSchema);
