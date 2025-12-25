import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProfileStatsCard from '@/components/dashboard/ProfileStatsCard';
import CourseListCard from '@/components/dashboard/CourseListCard';
import StudyStatsChart from '@/components/dashboard/StudyStatsChart';
import AiAssistantCard from '@/components/dashboard/AiAssistantCard';

// Dummy Data for Teacher
const teacherStats = {
  inProgress: 12, // Active Classes
  upcoming: 5,   // Pending Reviews
  completed: 120 // Total Students
};

const teacherCourses = [
  {
    id: 't1',
    title: 'Advanced React Patterns',
    level: 'Expert',
    classesCompleted: 12,
    totalClasses: 12, // Fully prepared
    percentage: 100,
    mentorName: 'Sarah Connors', // Self
    color: 'white' as const
  },
  {
    id: 't2',
    title: 'UI Design Principles',
    level: 'Intermediate',
    classesCompleted: 5,
    totalClasses: 10,
    percentage: 50,
    mentorName: 'Sarah Connors',
    color: 'white' as const
  },
  {
    id: 't3',
    title: 'Web Accessibility',
    level: 'All Levels',
    classesCompleted: 2,
    totalClasses: 8,
    percentage: 25,
    mentorName: 'Sarah Connors',
    color: 'white' as const
  }
];

import Footer from '@/components/layout/Footer';

export default function TeacherDashboardPage() {
  return (
    <div className="min-h-screen">
      <DashboardLayout
        role="teacher"
        hideHeader={true}
        profileStats={
          <ProfileStatsCard 
             name="Sarah" 
             roleTag="Teacher" 
             activityPercentage={92} 
             stats={teacherStats}
             imageSrc="https://ui-avatars.com/api/?name=Sarah+Connors&background=random"
          />
        }
        courses={
          // Teacher might want to see courses they are teaching
          <CourseListCard items={teacherCourses} title="Courses Teaching" />
        }
        studyChart={
          // Reuse study chart for Student Engagement or similar for now
          <StudyStatsChart />
        }
        aiWidget={
          <AiAssistantCard />
        }
      />
      <Footer />
    </div>
  );
}