import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
    {
        test_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Test",
            required: true,
        },
        user_id: {
            type: String,
            required: true,
        },
        answers: [
            {
                type: String,
            },
        ],
        marks: {
            type: Number,
            default: null,
        },
    },
    { timestamps: true }
);

export const Result = mongoose.model("Result", resultSchema);
