import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  level: string;
  classesCompleted: number;
  totalClasses: number;
  percentage: number;
  mentorName: string;
  mentorImage?: string;
  color: 'white' | 'orange' | 'purple'; // Just distinct styles if needed
}

const CourseListCard: React.FC<{ items: Course[]; title?: string }> = ({ 
  items,
  title = "Your courses"
}) => {
  return (
    <div className="bg-[#FF6B6B] rounded-[2rem] p-8 text-white relative overflow-hidden">
       {/* Header */}
       <div className="flex items-center justify-between mb-8 relative z-10">
          <h2 className="text-3xl font-medium">{title}</h2>
          
          <div className="flex items-center gap-4">
             <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                   <ChevronLeft size={16} />
                </button>
                <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#FF6B6B] hover:bg-gray-100 transition-colors">
                   <ChevronRight size={16} />
                </button>
             </div>
             <button className="bg-white text-[#FF6B6B] px-5 py-2 rounded-full font-medium text-sm hover:bg-gray-50 transition-colors">
                View all
             </button>
          </div>
       </div>

       {/* Cards List */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {items.map((course) => (
             <div key={course.id} className="bg-white rounded-[1.5rem] p-5 text-gray-800 shadow-sm flex flex-col justify-between h-[220px]">
                <div>
                  <h3 className="text-xl font-bold mb-3">{course.title}</h3>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-6">
                     <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded-md border border-orange-100">
                        {course.level}
                     </span>
                     <span>{course.classesCompleted}/{course.totalClasses} classes</span>
                  </div>
                </div>

                <div>
                   <div className="flex items-center justify-between text-sm font-bold mb-1">
                      <span>{course.percentage}% completed</span>
                   </div>
                   <div className="h-1.5 w-full bg-gray-100 rounded-full mb-4">
                      {/* Random color for variety based on id/index not passed, hardcoding orange */}
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: `${course.percentage}%` }}></div>
                   </div>

                   <div className="flex items-center gap-2">
                      <img 
                        src={course.mentorImage || `https://ui-avatars.com/api/?name=${course.mentorName}`} 
                        alt="Mentor" 
                        className="w-8 h-8 rounded-lg object-cover" 
                      />
                      <div className="flex flex-col leading-tight">
                         <span className="text-[10px] text-gray-400 font-semibold uppercase">Mentor</span>
                         <span className="text-xs font-bold">{course.mentorName}</span>
                      </div>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

export default CourseListCard;
