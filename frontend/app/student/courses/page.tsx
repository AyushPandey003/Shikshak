"use client";

import CourseCard from "@/components/ui/CourseCard";
import { Course } from "@/types/course";
import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CoursesGridSkeleton } from "@/components/dashboard/CoursesSkeleton";

type Option = "All" | "In Progress" | "Completed";

export default function StudentCoursesPage() {
  const [activeTab, setActiveTab] = useState<Option>("All");

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const { user, profile } = useAppStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();


  // useEffect(() => {
  //   if (profile?.role !== "STUDENT") {
  //     router.push("/");
  //   }
  // }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      // Logic to fetch enrolled courses based on user profile
      // MongoDB data shows 'courses' is a top-level array of strings on the user profile
      // Check role case-insensitively as backend returns lowercase 'student' but enum is uppercase
      if (!user || !profile || (profile.role as string).toUpperCase() !== 'STUDENT' || !profile.courses) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const enrolledCourseIds = profile.courses || [];
        console.log("Student Courses Debug: Profile:", profile);
        console.log("Student Courses Debug: Enrolled IDs:", enrolledCourseIds);

        // Fetch details for each enrolled course
        const fetchedCourses = await Promise.all(
          enrolledCourseIds.map(async (courseId: string) => {
            try {
              console.log(`Student Courses Debug: Fetching details for ${courseId}`);
              // Using general endpoint to allow viewing if public, bypassing strict student list check
              const response = await axios.post("http://localhost:4000/material/courses/get_course_by_id", {
                user_id: user?.id,
                user_role: profile.role,
                course_id: courseId
              }, {
                withCredentials: true
              });


              let imageUrl = "https://picsum.photos/seed/course/400/300";

              if (response.data) {
                const c: any = response.data;

                // Fetch SAS URL if thumbnail is not a full URL
                if (c.thumbnail && !c.thumbnail.startsWith("http")) {
                  try {
                    const sasRes = await axios.get(`http://localhost:4000/material/upload/${encodeURIComponent(c.thumbnail)}`, {
                      headers: user.accessToken ? { Authorization: `Bearer ${user.accessToken}` } : {},
                      withCredentials: true
                    });
                    if (sasRes.data && sasRes.data.url) {
                      imageUrl = sasRes.data.url;
                    }
                  } catch (err) {
                    console.error(`Failed to fetch SAS for ${c.thumbnail}`, err);
                  }
                } else if (c.thumbnail) {
                  imageUrl = c.thumbnail;
                }

                console.log(`Student Courses Debug: Success for ${courseId}`, response.data);

                // Map backend data to frontend Course type
                return {
                  id: c._id,
                  title: c.name,
                  instructor: {
                    id: c.teacher_details?.id || 'unknown',
                    name: c.teacher_details?.name || 'Unknown Instructor',
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.teacher_details?.name || 'Instructor')}&background=random`
                  },
                  price: c.price,
                  rating: c.rating || 0,
                  students: 0,
                  // Note: CourseCard will now render rating using the 'rating' field and stars
                  image: imageUrl,
                  subject: c.subject,
                  grade: c.grade,
                  board: c.board,
                  tags: c.pricing_category ? [c.pricing_category] : [],
                  isBundle: false,
                  type: c.visibility === 'public' ? 'Public' : 'Private'
                } as Course;
              }
              return null;
            } catch (err) {
              console.error(`Failed to fetch course ${courseId}`, err);
              return null;
            }
          })
        );

        // Filter out nulls (failed fetches)
        setCourses(fetchedCourses.filter((c): c is Course => c !== null));

      } catch (error) {
        console.error("Error fetching student courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <CoursesGridSkeleton />;
  }

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
                canReview={true}
                href={`/courses/${course.id}/learn`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}