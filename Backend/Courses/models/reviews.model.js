import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        rating: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            max: 5,
        },
        comment: {
            type: String,
        },
        course_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        user_id: [{
            type: String,
            required: true,
        }]
    },
    { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);
