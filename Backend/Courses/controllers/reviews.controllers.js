import { Review } from "../models/reviews.model.js";
import { Course } from "../models/courses.model.js";

export const createReview = async (req, res) => {
    try {
        const { rating, comment, course_id, user_id } = req.body;

        if (!rating || !course_id || !user_id) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const course = await Course.findById(course_id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const newReview = new Review({
            rating,
            comment,
            course_id,
            user_id,
        });

        const savedReview = await newReview.save();

        const currentRating = course.rating || 0;
        const currentReviewCount = course.reviews.length;

        // Calculate new average: ((Old Rating * Old Count) + New Rating) / New Count
        // Ensure rating is a number
        const ratingValue = Number(rating);
        const newRating = ((currentRating * currentReviewCount) + ratingValue) / (currentReviewCount + 1);

        course.rating = newRating;
        course.reviews.push(savedReview._id);

        await course.save();

        res.status(201).json(savedReview);
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { review_id } = req.body; // or req.params depending on route, assuming body based on user route names

        if (!review_id) {
            return res.status(400).json({ message: "Review ID is required" });
        }

        const review = await Review.findById(review_id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        const courseId = review.course_id;

        const course = await Course.findById(courseId);

        if (course) {
            const currentRating = course.rating || 0;
            const currentReviewCount = course.reviews.length;
            const reviewRating = review.rating;

            let newRating = 0;
            if (currentReviewCount > 1) {
                const totalRating = currentRating * currentReviewCount;
                newRating = (totalRating - reviewRating) / (currentReviewCount - 1);
            }

            course.rating = newRating;
            // Filter out the review_id from the reviews array
            course.reviews = course.reviews.filter(id => id.toString() !== review_id.toString());
            await course.save();
        }

        await Review.findByIdAndDelete(review_id);

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getReviews = async (req, res) => {
    try {
        const { course_id } = req.body; // Assuming body for now based on route pattern

        if (!course_id) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        const reviews = await Review.find({ course_id }).sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
