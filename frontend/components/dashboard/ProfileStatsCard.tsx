import React from 'react';
import { Calendar, BookOpen, FileText, CheckCircle, Play } from 'lucide-react';

interface ProfileStatsCardProps {
  name: string;
  roleTag: string;
  imageSrc?: string;
  upcomingCourses: Array<{ title: string; date: string }>;
  upcomingTests: Array<{ title: string; date: string }>;
  activityPercentage: number;
}

const ProfileStatsCard: React.FC<ProfileStatsCardProps> = ({
  name,
  roleTag,
  imageSrc,
  upcomingCourses,
  upcomingTests,
  activityPercentage
}) => {
  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm h-auto md:h-[550px] flex flex-col justify-between relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold tracking-tight text-gray-800">Statistic</h2>
      </div>

      <div className="flex flex-col items-center my-auto">
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
        {/* <p className="text-sm text-gray-400 font-medium">Have a nice day!</p> */}
      </div>

      {/* Activity Progress Section Removed */}
      {/* 
      <div className="mt-4 mb-6">
         <div className="flex items-end gap-2 mb-2">
            <span className="text-5xl font-medium text-gray-800">{activityPercentage}%</span>
            <span className="text-gray-400 mb-2 font-medium leading-tight text-sm">Total month{/* <br/> * /} activity</span>
         </div>
         <div className="flex h-2 w-full rounded-full overflow-hidden gap-1 bg-gray-100">
            <div className="bg-purple-300 w-[42%] h-full rounded-full"></div>
            <div className="bg-yellow-300 w-[15%] h-full rounded-full"></div>
            <div className="bg-orange-400 flex-1 h-full rounded-full"></div>
         </div>
         <div className="flex justify-between text-xs font-bold mt-2 text-gray-400">
             <span>42%</span>
             <span>15%</span>
             <span>56%</span>
         </div>
      </div> 
      */}
      <div className="mt-4 mb-6"></div>

      {/* Bottom Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mt-auto">
        <div className="flex flex-col items-center gap-2 p-2 relative">
           <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <BookOpen size={16} fill="currentColor" className="text-purple-600" />
           </div>
           <span className="text-xl font-bold text-gray-800">{upcomingCourses.length}</span>
           <span className="text-[10px] uppercase font-bold text-gray-400 text-center tracking-wide">No. of Courses</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-2 relative">
           <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <FileText size={16} className="text-orange-600" />
           </div>
           <span className="text-xl font-bold text-gray-800">{upcomingTests.length}</span>
           <span className="text-[10px] uppercase font-bold text-gray-400 text-center tracking-wide">No. of Tests</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileStatsCard;
