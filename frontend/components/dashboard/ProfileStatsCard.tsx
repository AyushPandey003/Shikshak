import React from 'react';
import { Play, Calendar, Users, Briefcase } from 'lucide-react';

interface ProfileStatsCardProps {
  name: string;
  roleTag: string;
  activityPercentage: number;
  stats: {
    inProgress: number;
    upcoming: number;
    completed: number;
  };
  imageSrc?: string;
}

const ProfileStatsCard: React.FC<ProfileStatsCardProps> = ({
  name,
  roleTag,
  activityPercentage,
  stats,
  imageSrc
}) => {
  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm h-full flex flex-col justify-between relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Statistic</h2>
        <button className="text-sm font-medium bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-full transition-colors">
          View all
        </button>
      </div>

      <div className="flex flex-col items-center mt-4">
        <div className="relative w-32 h-32 mb-4">
           {/* Progress Ring Placeholder - simpler CSS border approach */}
           <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
           <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent -rotate-45" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'}}></div> 
           
           <div className="absolute inset-2 overflow-hidden rounded-full border-4 border-white shadow-sm">
             <img 
               src={imageSrc || `https://ui-avatars.com/api/?name=${name}&size=128&background=random`} 
               alt={name} 
               className="w-full h-full object-cover"
             />
           </div>
           
           <span className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 bg-coral-500 bg-[#FF6B6B] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-white">
             {roleTag}
           </span>
        </div>

        <h3 className="text-2xl font-bold mt-4 text-center">Welcome, {name.split(' ')[0]} 👋</h3>
      </div>

      <div className="mt-8 mb-8">
         <div className="flex items-end gap-2 mb-2">
            <span className="text-5xl font-medium text-gray-800">{activityPercentage}%</span>
            <span className="text-gray-400 mb-2 font-medium">Total month<br/>activity</span>
         </div>
         {/* Simple Progress Bar */}
         <div className="flex h-2 w-full rounded-full overflow-hidden gap-1">
            <div className="bg-purple-300 w-[42%]"></div>
            <div className="bg-yellow-300 w-[15%]"></div>
            <div className="bg-orange-400 flex-1"></div>
         </div>
         <div className="flex justify-between text-xs font-bold mt-2 text-gray-700">
             <span>42%</span>
             <span>15%</span>
             <span>56%</span>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-auto">
        <div className="flex flex-col items-center gap-2 p-2">
           <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Play size={16} fill="currentColor" />
           </div>
           <span className="text-xl font-bold">{stats.inProgress}</span>
           <span className="text-xs text-gray-400 text-center">In progress</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-2">
           <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
              <Calendar size={16} />
           </div>
           <span className="text-xl font-bold">{stats.upcoming}</span>
           <span className="text-xs text-gray-400 text-center">Upcoming</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-2">
           <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
               <Briefcase size={16} />
           </div>
           <span className="text-xl font-bold">{stats.completed}</span>
           <span className="text-xs text-gray-400 text-center">Completed</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileStatsCard;
