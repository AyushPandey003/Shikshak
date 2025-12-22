import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
    {
        azure_id: {
            type: String,
            required: true,
        },
        series_number: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        module_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Module",
            required: true,
        },
    },
    { timestamps: true }
);

export const Video = mongoose.model("Video", videoSchema);
