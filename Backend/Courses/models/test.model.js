import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
    {
        questions: [
            {
                type: String,
                required: true,
            },
        ],
        course_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        user_id: {
            type: String,
            required: true,
        },
        valid_until: {
            type: Date,
            required: true,
        },
        title: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

export const Test = mongoose.model("Test", testSchema);
