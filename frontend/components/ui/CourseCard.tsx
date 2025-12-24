import React from 'react';
import { Heart, ShoppingCart, User, BookOpen, GraduationCap } from 'lucide-react';
import { Course } from '@/types/course';
import Link from 'next/link';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Link href={`/courses/${course.id}`} className="group bg-white rounded-xl shadow-sm border cursor-pointer border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full relative">

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

        {/* Badge: Best Seller */}
        {course.tags?.includes('Best Seller') && (
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
          <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
            <div className="flex items-center gap-1">
              <Heart size={12} className="fill-gray-300 text-gray-300" />
              <span>{course.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <User size={12} className="fill-gray-300 text-gray-300" />
              <span>{course.students}</span>
            </div>
          </div>

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
    </Link>
  );
};

export default CourseCard;