import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProfileStatsCard from '@/components/dashboard/ProfileStatsCard';
import CourseListCard from '@/components/dashboard/CourseListCard';
import StudyStatsChart from '@/components/dashboard/StudyStatsChart';
import AiAssistantCard from '@/components/dashboard/AiAssistantCard';

// Dummy Data for Teacher
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

// ... existing teacherCourses map ...

const teacherCourses = [
// ... no changes to mock data array content ...
  {
    id: 't1',
    title: 'Advanced React Patterns',
    level: 'Expert',
    modulesCompleted: 12,
    totalModules: 12, // Fully prepared
    percentage: 100,
    mentorName: 'Sarah Connors', // Self
    color: 'white' as const
  },
  {
    id: 't2',
    title: 'UI Design Principles',
    level: 'Intermediate',
    modulesCompleted: 5,
    totalModules: 10,
    percentage: 50,
    mentorName: 'Sarah Connors',
    color: 'white' as const
  },
  {
    id: 't3',
    title: 'Web Accessibility',
    level: 'All Levels',
    modulesCompleted: 2,
    totalModules: 8,
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
             imageSrc="https://ui-avatars.com/api/?name=Sarah+Connors&background=random"
             upcomingCourses={upcomingEvents.courses}
             upcomingTests={upcomingEvents.tests}
          />
        }
        courses={
          // Teacher might want to see courses they are teaching
          <CourseListCard items={teacherCourses} title="Courses Teaching" />
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