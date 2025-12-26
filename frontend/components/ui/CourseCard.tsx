import React from 'react';
import { Heart, ShoppingCart, User, BookOpen, GraduationCap, Pencil, Trash2 } from 'lucide-react';
import { Course } from '@/types/course';
import Link from 'next/link';

interface CourseCardProps {
  course: Course;
  isTeacher?: boolean;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, isTeacher, onEdit, onDelete }) => {
  const course_id = course.id;
  return (
    <Link href={`/courses/${course_id}`} className="group bg-white rounded-xl shadow-sm border cursor-pointer border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full relative">

      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Board Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-brand-900 text-xs font-bold px-2 py-1 rounded shadow-sm">
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
          <div className="absolute top-0 right-4 bg-brand-500 text-white text-[10px] font-bold py-1 px-1.5 rounded-b-md shadow-md z-10 uppercase tracking-wide writing-mode-vertical">
            Best Seller
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Meta Info: Class & Subject */}
        <div className="flex items-center gap-2 mb-2 text-xs font-medium text-brand-600 uppercase tracking-wide">
          <span className="bg-brand-50 px-2 py-0.5 rounded">{course.grade}</span>
          <span className="text-gray-300">•</span>
          <span>{course.subject}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-lg leading-snug mb-2 line-clamp-2 min-h-[3.5rem]">
          {course.title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-3">
          <img
            src={course.instructor?.avatar}
            alt={course.instructor?.name}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-sm text-gray-500">{course.instructor?.name}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-2"></div>

        {/* Footer Stats & Price */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div>
            {isTeacher && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/teacher/modules?courseId=${course_id}`;
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors text-xs font-semibold"
              >
                <BookOpen size={14} />
                Add Contents
              </button>
            )}
          </div>

          <div className="flex items-end gap-3">
            {isTeacher && (
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
            )}
            <div className="flex flex-col items-end">
              <span className="text-xl font-bold text-brand-500">
                {course.price === 0 ? 'Free' : `₹${course.price}`}
              </span>
              {course.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{course.originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;