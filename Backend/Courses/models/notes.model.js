import mongoose from "mongoose";

const NotesSchema = new mongoose.Schema(
    {
        azure_id: [
            {
                type: String,
                required: true,
            }
        ],
        module_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Module",
            required: true,
        },
        series_number: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export const Notes = mongoose.model("Notes", NotesSchema);
