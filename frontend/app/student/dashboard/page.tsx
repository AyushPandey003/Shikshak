import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProfileStatsCard from '@/components/dashboard/ProfileStatsCard';
import CourseListCard from '@/components/dashboard/CourseListCard';
import StudyStatsChart from '@/components/dashboard/StudyStatsChart';
import AiAssistantCard from '@/components/dashboard/AiAssistantCard';

// Dummy Data for Student
const studentStats = {
  inProgress: 9,
  upcoming: 4,
  completed: 15
};

const studentCourses = [
  {
    id: '1',
    title: 'Design thinking',
    level: 'Advanced',
    classesCompleted: 4,
    totalClasses: 12,
    percentage: 46,
    mentorName: 'Tomas Luis',
    color: 'white' as const
  },
  {
    id: '2',
    title: 'Leadership',
    level: 'Beginner',
    classesCompleted: 8,
    totalClasses: 14,
    percentage: 72,
    mentorName: 'Nelly Roven',
    color: 'orange' as const
  },
  {
    id: '3',
    title: 'IT English',
    level: 'Advanced',
    classesCompleted: 6,
    totalClasses: 10,
    percentage: 56,
    mentorName: 'Stefan Colman',
    color: 'white' as const
  }
];

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function StudentDashboardPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="pt-32 md:pt-36"> {/* Increased padding for gap between navbar and dashboard */}
        <DashboardLayout
          role="student"
          hideHeader={true}
          profileStats={
        <ProfileStatsCard 
           name="Tim" 
           roleTag="Student" 
           activityPercentage={78} 
           stats={studentStats}
        />
      }
      courses={
        <CourseListCard items={studentCourses} />
      }
      studyChart={
        <StudyStatsChart />
      }
      aiWidget={
        <AiAssistantCard />
      }
    />
      </div>
      <Footer />
    </div>
  );
}
