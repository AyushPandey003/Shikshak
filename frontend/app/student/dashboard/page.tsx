'use client';
import React, { useEffect, useState } from 'react';
import { GraduationCap, BookOpen, ClipboardList, Phone } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProfileStatsCard from '@/components/dashboard/ProfileStatsCard';
import CourseListCard from '@/components/dashboard/CourseListCard';
import StudyStatsChart from '@/components/dashboard/StudyStatsChart';
import AiAssistantCard from '@/components/dashboard/AiAssistantCard';
import Footer from '@/components/layout/Footer';
import { useAppStore } from '@/store/useAppStore';
import axios from 'axios';
import { LoadingDashboard } from '@/components/dashboard/DashboardSkeletons';

// Dummy Data for Upcoming Events (Backend integration pending for events)
const upcomingEvents = {
  courses: [
    { title: 'UX Research', date: '21 Oct' },
    { title: 'Python Basics', date: '28 Oct' }
  ],
  tests: [
    { title: 'Figma Basics', date: '19 Oct' },
    { title: 'Agile Quiz', date: '24 Oct' }
  ]
};

export default function StudentDashboardPage() {
  const { user, profile } = useAppStore();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !profile) return;

      // Check role case-insensitively
      if ((profile.role as string).toUpperCase() !== 'STUDENT') return;

      try {
        setLoading(true);
        const enrolledCourseIds = profile.courses || [];

        // Fetch details for each enrolled course
        const fetchedCourses = await Promise.all(
          enrolledCourseIds.map(async (courseId: string) => {
            try {
              // Using general endpoint to allow viewing if public, bypassing strict student list check
              const response = await axios.post("http://localhost:4000/material/courses/get_course_by_id_general", {
                course_id: courseId
              }, {
                headers: user.accessToken ? { Authorization: `Bearer ${user.accessToken}` } : {},
                withCredentials: true
              });
              console.log("response", response);

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

                // Map to CourseListCard format
                return {
                  id: c._id,
                  title: c.name,
                  level: c.grade || 'General',
                  // Progress is mocked as we don't have a progress API yet
                  modulesCompleted: 0,
                  totalModules: c.module_id?.length || 0,
                  percentage: 0,
                  mentorName: c.teacher_details?.name || "Instructor",
                  color: 'white' as const
                };
              }
              return null;
            } catch (err) {
              console.error(`Failed to fetch course ${courseId}`, err);
              return null;
            }
          })
        );

        setCourses(fetchedCourses.filter(c => c !== null));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, profile]);

  if (loading || !user || !profile) {
    return <LoadingDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardLayout
        role="student"
        hideHeader={true}
        profileStats={
          <ProfileStatsCard
            name={user.name || "Student"}
            roleTag="Student"
            imageSrc={user.photoUrl || "https://ui-avatars.com/api/?name=Student&background=random"}
            stats={[
              {
                 label: "Class",
                 value: profile?.studentDetails?.classGrade || profile?.class || "N/A",
                 icon: GraduationCap,
                 className: "text-purple-600",
                 bgClassName: "bg-purple-100"
              },
              {
                 label: "Phone Number",
                 value: profile?.phoneNumber || "N/A",
                 icon: Phone,
                 className: "text-green-600",
                 bgClassName: "bg-green-100"
              }
            ]}
            activityPercentage={78}
          />
        }
        courses={
          <CourseListCard items={courses} />
        }
        studyChart={
          // <StudyStatsChart />
          null
        }
        aiWidget={
          // <AiAssistantCard />
          null
        }
      />
      <Footer />
    </div>
  );
}
