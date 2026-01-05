'use client';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProfileStatsCard from '@/components/dashboard/ProfileStatsCard';
import CourseListCard from '@/components/dashboard/CourseListCard';
import StudyStatsChart from '@/components/dashboard/StudyStatsChart';
import AiAssistantCard from '@/components/dashboard/AiAssistantCard';
import Footer from '@/components/layout/Footer';
import { useAppStore } from '@/store/useAppStore';
import axios from 'axios';

// Dummy Data for Teacher (Events still dummy as no backend for them yet)
const upcomingEvents = {
  courses: [
    { title: 'React Performance', date: '20 Oct' },
    { title: 'System Design', date: '25 Oct' }
  ],
  tests: [
    { title: 'JS Advanced Quiz', date: '18 Oct' },
    { title: 'CSS Mastery', date: '22 Oct' }
  ]
};

export default function TeacherDashboardPage() {
  const { user } = useAppStore();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        console.log(response.data);

        if (response.data) {
          // Filter for PUBLIC courses only and map to UI format
          const mappedCourses = response.data
            .filter((c: any) => c.visibility === 'public')
            .map((c: any) => ({
              id: c._id,
              title: c.name,
              level: c.grade || 'General',
              modulesCompleted: c.module_id?.length || 0, // In teacher view, we show total modules as "completed/created"
              totalModules: c.module_id?.length || 0,
              percentage: 100, // Teacher has completed creating these (or is in progress, but for this view we show full)
              mentorName: c.teacher_details?.name || user.name || "Me",
              color: 'white' as const
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

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardLayout
        role="teacher"
        hideHeader={true}
        profileStats={
          <ProfileStatsCard
            name={user.name || "Teacher"}
            roleTag="Teacher"
            imageSrc={user.photoUrl || "https://ui-avatars.com/api/?name=Teacher&background=random"}
            upcomingCourses={upcomingEvents.courses}
            upcomingTests={upcomingEvents.tests}
            activityPercentage={92}
          />
        }
        courses={
          <CourseListCard items={courses} title="Courses Teaching" />
        }
        studyChart={
          // Reuse study chart for Student Engagement or similar for now
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