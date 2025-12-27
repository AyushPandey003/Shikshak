"use client";

import CourseCard from "@/components/ui/CourseCard";
import { Course } from "@/types/course";
import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import axios from "axios";

type Option = "All" | "In Progress" | "Completed";

export default function StudentCoursesPage() {
  const [activeTab, setActiveTab] = useState<Option>("All");

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const { user } = useAppStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // In a real app we might fetch enrolled courses. 
  // For now using the same endpoint but logic assumes backend filters for student
  // or checks "enrolled" courses. Since we don't have a dedicated "get_enrolled" yet,
  // we'll attempt to use the same logic but expect student view.
  // NOTE: Based on previous context, we might need to adjust this endpoint later.

  useEffect(() => {
    const fetchCourses = async () => {
      // In a real implementation this would fetch *enrolled* courses
      // For now we will mock it or reuse the detailed structure if available
      // But keeping it simple to just show UI structure as requested
      
      // Mock Data for demonstration since backend might not support "student" role fetch yet
      const mockCourses: Course[] = [
        {
          id: "c1",
          title: "Advanced React Patterns",
          instructor: { id: "i1", name: "Sarah Connors", avatar: "https://ui-avatars.com/api/?name=Sarah+Connors" },
          price: 49,
          rating: 4.8,
          students: 120,
          image: "https://picsum.photos/seed/react/400/300",
          subject: "Programming",
          grade: "Professional",
          board: "Tech",
          tags: ["Web Dev"],
          isBundle: false,
          type: "Public"
        },
        {
          id: "c2",
          title: "UI Design Principles",
          instructor: { id: "i2", name: "John Doe", avatar: "https://ui-avatars.com/api/?name=John+Doe" },
          price: 39,
          rating: 4.5,
          students: 80,
          image: "https://picsum.photos/seed/ui/400/300",
          subject: "Design",
          grade: "Beginner",
          board: "Creative",
          tags: ["Design"],
          isBundle: false,
          type: "Public"
        }
      ];
      
      setCourses(mockCourses);
      setLoading(false);
    };

    fetchCourses();
  }, [user]);

  const tabs: Option[] = ["All", "In Progress", "Completed"];
  
  // Simple filter logic for mock purposes
  const filteredCourses = activeTab === "All" ? courses : courses.slice(0, 1); // Mock filtering

  return (
    <div className="w-full h-full pt-2 px-5">
      <div className="w-full h-full flex flex-col ">
        <div className="pb-5 w-full">
          <h1 className="text-3xl font-bold pb-2">My Enrolled Courses</h1>
          <div className="flex items-center justify-between w-full bg-white pr-5 py-1">
            <div className="flex items-center gap-1 sm:w-auto overflow-x-auto no-scrollbar sm:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap w-fit ${activeTab === tab
                    ? "text-indigo-600 bg-white shadow-md"
                    : "text-gray-500 hover:text-brand-500 hover:bg-gray-50"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div>
              <div className="text-sm text-indigo-600 font-semibold">{filteredCourses.length} Results</div>
            </div>
          </div>
        </div>
        {filteredCourses.length === 0 ? (
          <div className="w-full py-10 text-center text-gray-500">
            No courses found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
            {/* cards */}
            {filteredCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                isTeacher={false} // Student view
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
