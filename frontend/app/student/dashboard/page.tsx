import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProfileStatsCard from '@/components/dashboard/ProfileStatsCard';
import CourseListCard from '@/components/dashboard/CourseListCard';
import StudyStatsChart from '@/components/dashboard/StudyStatsChart';
import AiAssistantCard from '@/components/dashboard/AiAssistantCard';

// Dummy Data for Student
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

// ... existing studentCourses map ...

const studentCourses = [
  {
    id: '1',
    title: 'Design thinking',
    level: 'Advanced',
    modulesCompleted: 4,
    totalModules: 12,
    percentage: 46,
    mentorName: 'Tomas Luis',
    color: 'white' as const
  },
  {
    id: '2',
    title: 'Leadership',
    level: 'Beginner',
    modulesCompleted: 8,
    totalModules: 14,
    percentage: 72,
    mentorName: 'Nelly Roven',
    color: 'orange' as const
  },
  {
    id: '3',
    title: 'IT English',
    level: 'Advanced',
    modulesCompleted: 6,
    totalModules: 10,
    percentage: 56,
    mentorName: 'Stefan Colman',
    color: 'white' as const
  }
];

import Footer from '@/components/layout/Footer';

export default function StudentDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardLayout
        role="student"
        hideHeader={true}
        profileStats={
          <ProfileStatsCard 
             name="Tim" 
             roleTag="Student" 
             upcomingCourses={upcomingEvents.courses}
             upcomingTests={upcomingEvents.tests}
             activityPercentage={78}
          />
        }
        courses={
          <CourseListCard items={studentCourses} />
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
