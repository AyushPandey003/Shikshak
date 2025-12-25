"use client";

import React from 'react';
import { Search, Bell, User } from 'lucide-react';

interface DashboardLayoutProps {
  profileStats: React.ReactNode;
  courses: React.ReactNode;
  studyChart: React.ReactNode;
  aiWidget: React.ReactNode;
  role: 'student' | 'teacher';
  hideHeader?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  profileStats,
  courses,
  studyChart,
  aiWidget,
  role,
  hideHeader = false
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans text-gray-800 no-scrollbar max-w-7xl mx-auto">
      {/* Top Navigation */}
      {!hideHeader && (
        <header className="flex items-center justify-between mb-8 relative md:static">
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 -ml-2 text-gray-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Menu</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            <span className="text-xl font-bold flex items-center gap-2">
               <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs">EL</div>
               EasyLearn
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-sm">
             <a href="#" className="text-gray-500 hover:text-black">All courses</a>
             <a href="#" className="bg-black text-white px-4 py-1.5 rounded-full flex items-center gap-2">
               <span className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                 <span className="bg-white/50 rounded-[1px]"></span>
                 <span className="bg-white/50 rounded-[1px]"></span>
                 <span className="bg-white/50 rounded-[1px]"></span>
                 <span className="bg-white/50 rounded-[1px]"></span>
               </span>
               Dashboard
             </a>
             <a href="#" className="text-gray-500 hover:text-black">Statistic</a>
             <a href="#" className="text-gray-500 hover:text-black">AI-assistant</a>
             <a href="#" className="text-gray-500 hover:text-black">Support</a>
          </nav>

          {/* Mobile Nav Overlay */}
          {isMobileMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-white shadow-lg rounded-xl p-4 flex flex-col gap-4 z-50 md:hidden border border-gray-100">
               <a href="#" className="text-gray-700 font-medium py-2">All courses</a>
               <a href="#" className="text-black font-bold py-2 bg-gray-50 px-2 rounded-lg">Dashboard</a>
               <a href="#" className="text-gray-700 font-medium py-2">Statistic</a>
               <a href="#" className="text-gray-700 font-medium py-2">AI-assistant</a>
            </div>
          )}

          <div className="flex items-center gap-2 md:gap-4">
             <button className="hidden md:block p-2 rounded-full hover:bg-gray-200">
               <span className="sr-only">Support</span>
                🎧
             </button>
             <button className="p-2 rounded-full hover:bg-gray-200 relative">
               <Bell size={20} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
             <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-gray-200">
                <img src="https://ui-avatars.com/api/?name=User&background=random" alt="User" />
             </div>
          </div>
        </header>
      )}

      {/* Main Grid Content */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile & Stats */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           {profileStats}
        </div>

        {/* Right Column: Courses, Chart, AI */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           {/* Top Row: Courses */}
           <div className="w-full">
              {courses}
           </div>

           {/* Bottom Row: Chart & AI */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex-1">
                 {studyChart}
              </div>
              <div className="flex-1">
                 {aiWidget}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
