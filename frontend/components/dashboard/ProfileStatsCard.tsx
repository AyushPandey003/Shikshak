import React from 'react';
import { Calendar, BookOpen, FileText } from 'lucide-react';

interface ProfileStatsCardProps {
  name: string;
  roleTag: string;
  imageSrc?: string;
  upcomingCourses: Array<{ title: string; date: string }>;
  upcomingTests: Array<{ title: string; date: string }>;
}

const ProfileStatsCard: React.FC<ProfileStatsCardProps> = ({
  name,
  roleTag,
  imageSrc,
  upcomingCourses,
  upcomingTests
}) => {
  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold tracking-tight text-gray-800">Statistics</h2>
      </div>

      <div className="flex flex-col items-center mt-4 mb-8">
        <div className="relative w-28 h-28 mb-3 group">
           {/* Refined Ring */}
           <div className="absolute inset-0 rounded-full border-[3px] border-gray-100 transition-colors group-hover:border-gray-200"></div>
           <div className="absolute inset-0 rounded-full border-[3px] border-orange-500 border-t-transparent -rotate-45" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'}}></div> 
           
           <div className="absolute inset-[5px] overflow-hidden rounded-full border-[3px] border-white shadow-sm">
             <img 
               src={imageSrc || `https://ui-avatars.com/api/?name=${name}&size=128&background=random`} 
               alt={name} 
               className="w-full h-full object-cover"
             />
           </div>
           
           <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#FF6B6B] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm border-[2px] border-white uppercase tracking-wider">
             {roleTag}
           </span>
        </div>

        <h3 className="text-2xl font-bold mt-2 text-center text-gray-900">Welcome, {name.split(' ')[0]} 👋</h3>
        <p className="text-sm text-gray-400 font-medium">Have a nice day!</p>
      </div>

      <div className="flex-1 flex flex-col gap-6 overflow-y-auto thin-scrollbar pr-1">
         {/* Upcoming Courses */}
         <div>
            <div className="flex items-center gap-3 mb-3 text-gray-800">
               <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm">
                  <BookOpen size={16} />
               </div>
               <span className="font-bold text-base">No. of Courses</span>
               <span className="ml-auto bg-gray-50 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-lg border border-gray-100">{upcomingCourses.length}</span>
            </div>
            <div className="flex flex-col gap-2.5">
               {upcomingCourses.length > 0 ? upcomingCourses.map((course, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50/50 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                     <span className="font-semibold text-sm text-gray-700 truncate max-w-[140px]">{course.title}</span>
                     <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 bg-white px-2 py-1 rounded-md shadow-sm">
                        <Calendar size={12} className="text-gray-300" />
                        {course.date}
                     </span>
                  </div>
               )) : (
                  <p className="text-sm text-gray-400 italic pl-2">No upcoming courses</p>
               )}
            </div>
         </div>

         {/* Upcoming Tests */}
         <div>
            <div className="flex items-center gap-3 mb-3 text-gray-800">
               <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm">
                  <FileText size={16} />
               </div>
               <span className="font-bold text-base">No. of Tests</span>
               <span className="ml-auto bg-gray-50 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-lg border border-gray-100">{upcomingTests.length}</span>
            </div>
            <div className="flex flex-col gap-2.5">
               {upcomingTests.length > 0 ? upcomingTests.map((test, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50/50 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                     <span className="font-semibold text-sm text-gray-700 truncate max-w-[140px]">{test.title}</span>
                     <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 bg-white px-2 py-1 rounded-md shadow-sm">
                        <Calendar size={12} className="text-gray-300" />
                        {test.date}
                     </span>
                  </div>
               )) : (
                  <p className="text-sm text-gray-400 italic pl-2">No upcoming tests</p>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default ProfileStatsCard;
