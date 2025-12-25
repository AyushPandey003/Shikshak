"use client";

import CourseCard from "@/components/ui/CourseCard";
import { EditCourseModal } from "@/components/teacher/courses/EditCourseModal";
import { Course } from "@/types/course";
import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import axios from "axios";

type Option = "All" | "Public" | "Private" | "Draft";

export default function Page() {
  const [activeTab, setActiveTab] = useState<Option>("Public");

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const { user } = useAppStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsEditModalOpen(true);
  };

  const handleSaveCourse = async (updatedCourse: Partial<Course>) => {
    // Dummy update for frontend only as requested
    setCourses(prev => prev.map(c => c.id === updatedCourse.id ? { ...c, ...updatedCourse } : c));
    // In real app: await axios.post(...)
  };

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;
      try {
        setLoading(true);
        // Using "teacher" role hardcoded as this is the teacher dashboard
        const headers: Record<string, string> = {};
        if (user?.accessToken) {
          headers["Authorization"] = `Bearer ${user.accessToken}`;
        }

        const response = await axios.post("http://localhost:4000/material/courses/get_all", {
          user_id: user.id,
          user_role: "teacher"
        }, {
          headers,
          withCredentials: true
        });

        if (response.data) {
          const mappedCourses = await Promise.all(response.data.map(async (c: any) => {
            let imageUrl = "https://picsum.photos/seed/course/400/300";

            // If thumbnail is a blob name (doesn't start with http), fetch SAS URL
            if (c.thumbnail && !c.thumbnail.startsWith("http")) {
              try {
                // Use encodeURIComponent to handle spaces or special chars safe
                const sasRes = await axios.get(`http://localhost:4000/material/upload/${encodeURIComponent(c.thumbnail)}`, {
                  headers: user?.accessToken ? { "Authorization": `Bearer ${user.accessToken}` } : {},
                  withCredentials: true
                });
                if (sasRes.data && sasRes.data.url) {
                  imageUrl = sasRes.data.url;
                }
              } catch (err: any) {
                console.error(`Failed to fetch SAS for ${c.thumbnail}:`, err.response?.status, err.response?.data || err.message);
              }
            } else if (c.thumbnail) {
              imageUrl = c.thumbnail;
            }

            return {
              id: c._id,
              title: c.name,
              instructor: {
                id: c.teacher_details?.id || user.id,
                name: c.teacher_details?.name || user.email?.split('@')[0] || "Instructor",
                avatar: c.teacher_details?.avatar || user.photoUrl || "https://picsum.photos/seed/instructor/50/50"
              },
              price: c.price,
              rating: c.rating || 0,
              students: c.student_count || 0,
              image: imageUrl,
              subject: c.subject,
              grade: "10th Class", // Placeholder
              board: c.board,
              tags: [c.pricing_category],
              isBundle: false,
              type: c.visibility === 'public' ? 'Public' : (c.visibility === 'private' ? 'Private' : 'Draft'),
            };
          }));
          setCourses(mappedCourses);
        }
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  const myCourse: Course[] = courses;

  const tabs: Option[] = ["All", "Public", "Private", "Draft"];
  const filteredCourses =
    activeTab === "All"
      ? myCourse
      : myCourse.filter((c) => c.type === activeTab);

  return (
    <div className="w-full h-full pt-2 px-5">
      <div className="w-full h-full flex flex-col ">
        <div className="pb-5 w-full">
          <h1 className="text-3xl font-bold pb-2">My courses</h1>
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
                  {tab == "All" ? "All" : tab}
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
            No courses in {activeTab} tab.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
            {/* cards */}
            {filteredCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                isTeacher={true} 
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      <EditCourseModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        course={editingCourse}
        onSave={handleSaveCourse}
      />
    </div>
  );
}
