"use client";

import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, User, BookOpen, GraduationCap, Pencil, Trash2, MessageSquarePlus, Star } from 'lucide-react';
import { Course } from '@/types/course';
import Link from 'next/link';
import ReviewModal from './ReviewModal';
import axios from 'axios';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';

interface CourseCardProps {
  course: Course;
  isTeacher?: boolean;
  canReview?: boolean;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  href?: string;
}



const CourseCard: React.FC<CourseCardProps> = ({ course, isTeacher, canReview, onEdit, onDelete, href }) => {
  const course_id = course.id;
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { user } = useAppStore();
  const [ratingData, setRatingData] = useState({ rating: course.rating || 0, count: course.totalRatings || 0 });

  const router = useRouter();
  useEffect(() => {
    // Fetch reviews to get real-time rating
    const fetchReviews = async () => {
      try {
        const response = await axios.post("http://localhost:4000/material/reviews/get_reviews", {
          course_id: course_id
        }, { withCredentials: true });

        const reviews = response.data;
        if (Array.isArray(reviews) && reviews.length > 0) {
          const total = reviews.reduce((acc: number, curr: any) => acc + (curr.rating || 0), 0);
          const avg = total / reviews.length;
          setRatingData({
            rating: avg,
            count: reviews.length
          });
        } else {
          setRatingData({
            rating: 0,
            count: 0
          });
        }
      } catch (error) {
        console.error("Failed to fetch reviews for card:", error);
      }
    };

    fetchReviews();
  }, [course_id]);


  /* eslint-disable @typescript-eslint/no-explicit-any */
  const handleReviewSubmit = async (data: { rating: number; description: string; isAnonymous: boolean }) => {
    if (!user) {
      alert("Please login to submit a review");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/material/reviews/create_review", {
        rating: data.rating,
        comment: data.description,
        course_id: course.id,
        user_id: user.id,
      }, {
        withCredentials: true
      });
      console.log("Review saved:", response.data);
      // alert("Review submitted successfully!");
    } catch (error: any) {
      console.error("Failed to submit review:", error);
      alert(error.response?.data?.message || "Failed to submit review.");
    }

  };

  const createTestHandler = (course_id: string) => {
    const params = new URLSearchParams();
    params.append('course_id', course_id);
    if (user?.id) {
      params.append('user_id', user.id);
    }

    console.log(params.toString());
    router.push(`/aitest/create?${params.toString()}`);
  }

  const startTestHandler = (course_id: string, test_id: string) => {
    const params = new URLSearchParams();
    params.append('course_id', course_id);
    params.append('test_id', test_id);
    if (user?.id) {
      params.append('user_id', user.id);
    }

    console.log(params.toString());
    router.push(`/aitest/start?${params.toString()}`);
  }
  return (
    <>
      <Link href={href || `/courses/${course_id}`} className="group bg-white rounded-xl shadow-sm border cursor-pointer border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full relative">

        {/* Image Container */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-200">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Board Badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-indigo-900 text-xs font-bold px-2 py-1 rounded shadow-sm">
            {course.board}
          </div>

          {/* Edit Button for Teachers */}
          {isTeacher && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onEdit) {
                  onEdit(course);
                }
              }}
              className="absolute top-3 right-3 z-20 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
              title="Edit Course Details"
            >
              <Pencil size={16} className="text-gray-700" />
            </button>
          )}

          {/* Badge: Best Seller */}
          {!isTeacher && course.tags?.includes('Best Seller') && (
            <div className="absolute top-0 right-4 bg-indigo-500 text-white text-[10px] font-bold py-1 px-1.5 rounded-b-md shadow-md z-10 uppercase tracking-wide writing-mode-vertical">
              Best Seller
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Meta Info: Class & Subject */}
          <div className="flex items-center gap-2 mb-2 text-xs font-medium text-indigo-600 uppercase tracking-wide">
            <span className="bg-indigo-50 px-2 py-0.5 rounded">{course.grade || "General"}</span>
            <span className="text-gray-300">•</span>
            <span>{course.subject || "Subject"}</span>
          </div>



          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-lg leading-snug mb-2 line-clamp-2 min-h-[3.5rem]">
            {course.title}
          </h3>

          {/* Instructor */}
          <div className="flex items-center gap-2 mb-3">
            <img
              src={course.instructor?.avatar || "https://ui-avatars.com/api/?name=Instructor"}
              alt={course.instructor?.name || "Instructor"}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm text-gray-500">{course.instructor?.name || "Instructor"}</span>
          </div>

          {[
            // Rating
            <div key="rating" className="flex items-center gap-1.5 mb-2.5">
              <span className="font-bold text-gray-900 text-sm">{ratingData.rating.toFixed(1)}</span>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={`${star <= Math.round(ratingData.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                      }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">({ratingData.count})</span>
            </div>
          ]}

          {/* Divider */}
          <div className="border-t border-gray-100 my-2"></div>

          {/* Footer Stats & Price */}
          <div className="flex flex-wrap items-center justify-between mt-auto pt-1 gap-y-2">
            <div className="flex gap-1.5 flex-wrap sm:flex-nowrap">
              {isTeacher && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.location.href = `/teacher/modules?courseId=${course_id}`;
                    }}
                    className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors text-[11px] font-bold whitespace-nowrap flex-1 sm:flex-none"
                  >
                    <BookOpen size={13} />
                    Add Contents
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      createTestHandler(course.id);
                    }}
                    className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors text-[11px] font-bold whitespace-nowrap flex-1 sm:flex-none"
                  >
                    Create Test
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onDelete) onDelete(course);
                    }}
                    className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete Course"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
              {!isTeacher && canReview && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsReviewModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 transition-colors text-xs font-semibold"
                >
                  <MessageSquarePlus size={14} />
                  Add Review
                </button>
              )}
            </div>

            <div className="flex items-end gap-3 mx-auto">
              <div className="flex flex-col items-end">
                <span className="text-xl font-bold text-indigo-500">
                  {course.price === 0 ? 'Free' : `₹${course.price}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </>
  );
};

export default CourseCard;
