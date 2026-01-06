import React from 'react';
import { Calendar, BookOpen, FileText, CheckCircle, Play, Award, Clock } from 'lucide-react';

interface StatItem {
  label: string;
  value: string | number;
  icon: React.ElementType;
  className: string; // For text color
  bgClassName: string; // For background color
}

interface ProfileStatsCardProps {
  name: string;
  roleTag: string;
  imageSrc?: string;
  stats: StatItem[];
  activityPercentage: number;
}

const ProfileStatsCard: React.FC<ProfileStatsCardProps> = ({
  name,
  roleTag,
  imageSrc,
  stats,
  activityPercentage
}) => {
  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm h-auto md:min-h-[650px] flex flex-col justify-between relative overflow-hidden">
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

      <div className="mt-4 mb-6"></div>

      {/* Bottom Stats List */}
      <div className="flex flex-col gap-4 mt-auto">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="flex flex-row items-center gap-4 p-2 relative w-full bg-gray-50 rounded-xl">
               <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${stat.bgClassName}`}>
                  <Icon size={16} className={stat.className} />
               </div>
               <div className="flex flex-col items-start overflow-hidden flex-1">
                 <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">{stat.label}</span>
                 <span className={`font-bold text-gray-800 break-words leading-tight ${typeof stat.value === 'string' && stat.value.length > 20 ? 'text-xs' : 'text-sm'}`}>
                   {stat.value}
                 </span>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileStatsCard;
