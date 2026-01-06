import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
    {
        test_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Test",
            required: true,
        },
        user_id: {
            type: Object({
                name: String,
                _id: String,
            }),
            required: true,
        },
        answers: [
            {
                type: String,
            },
        ],
        questions: [
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
