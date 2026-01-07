import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, MoreVertical, BadgeCheck, Trash2 } from 'lucide-react';
import { Review } from '@/types/coursedet';
import { STATIC_REVIEWS } from '@/constants/coursedetails';
import { useAppStore } from '@/store/useAppStore';
import axios from 'axios';

interface CourseReviewsProps {
    courseTitle: string;
    reviewsList?: Review[];
}

const CourseReviews: React.FC<CourseReviewsProps> = ({ courseTitle, reviewsList }) => {
    // Use provided reviews or fallback to static
    const [reviews, setReviews] = useState<Review[]>(reviewsList && reviewsList.length > 0 ? reviewsList : []);

    useEffect(() => {
        if (reviewsList && reviewsList.length > 0) {
            setReviews(reviewsList);
        }
    }, [reviewsList]);
    const { profile } = useAppStore();

    const deleteReview = async function (reviewId: string) {
        if (!window.confirm("Are you sure you want to delete this review?")) {
            return;
        }
        try {
            await axios.post('http://localhost:4000/material/reviews/delete_review', {
                review_id: reviewId
            }, {
                withCredentials: true
            });
            setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        }
        catch (error) {
            console.error(error);
            alert("Failed to delete review");
        }
    }

    return (
        <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 font-display">Student Feedback</h2>
                    <p className="text-sm text-gray-500 font-medium">{reviews.length} ratings</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white">
                                {review.initials}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="font-bold text-gray-900 text-base">{review.author}</div>
                                    <span className="text-xs text-gray-400 font-medium">{review.timeAgo}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(review.rating) ? 'fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                                        ))}
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {review.content}
                                </p>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-gray-400 font-medium">Was this review helpful?</span>
                                        <button className="p-1.5 hover:bg-white hover:shadow-sm rounded-full transition-all text-gray-400 hover:text-gray-700"><ThumbsUp className="w-4 h-4" /></button>
                                        <button className="p-1.5 hover:bg-white hover:shadow-sm rounded-full transition-all text-gray-400 hover:text-gray-700"><ThumbsDown className="w-4 h-4" /></button>
                                    </div>
                                    {profile && review.userId && review.userId[0] === profile.id && (
                                        <button
                                            onClick={() => deleteReview(review.id)}
                                            className="p-1.5 hover:bg-red-50 hover:shadow-sm rounded-full transition-all text-gray-400 hover:text-red-500"
                                            title="Delete review"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* <button className="mt-8 px-8 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                Show all reviews
            </button> */}
        </div>
    );
};

export default CourseReviews;