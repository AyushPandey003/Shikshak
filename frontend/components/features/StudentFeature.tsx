
import React from 'react';
import { BookOpen, Clock, Target, CheckCircle } from 'lucide-react';

export const StudentFeature = () => {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl p-8 flex flex-col justify-end">
        {/* Background Gradient/Mesh */}
        <div className="absolute inset-0 bg-[#e3d5ca] z-0">
             <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-[#d5c0b0]/50" />
             <div className="absolute top-[-20%] right-[-20%] w-[120%] h-[120%] rounded-full bg-white/20 blur-3xl" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full justify-between">
           
            {/* Main Image/Content Area - Learning Progress Mockup */}
            <div className="relative w-full h-[220px] md:h-[320px] mt-auto group">
                  {/* Floating Course Cards */}
                  <div className="absolute top-0 right-0 md:right-4 w-40 md:w-48 bg-white/90 backdrop-blur rounded-2xl p-3 md:p-4 shadow-lg rotate-3 scale-90 md:scale-100 origin-top-right transition-transform">
                       <div className="flex items-center gap-3 mb-3">
                           <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                               <BookOpen size={16} />
                           </div>
                           <div className="text-xs">
                               <p className="font-semibold text-gray-800">Physics 101</p>
                               <p className="text-gray-500">Video • 12m left</p>
                           </div>
                       </div>
                       <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                           <div className="bg-orange-400 w-[70%] h-full rounded-full" />
                       </div>
                  </div>

                  {/* Main 'App' View Mockup */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] md:w-[65%] h-[90%] md:h-[85%] bg-white rounded-t-3xl shadow-2xl p-4 flex flex-col gap-4 transition-all">
                       <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                           <h4 className="font-semibold text-sm">My Learning</h4>
                           <Target size={16} className="text-gray-400"/>
                       </div>
                       
                       {/* List of items */}
                       {[1, 2, 3].map((i) => (
                           <div key={i} className="flex items-center gap-3">
                               <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gray-100" />
                               <div className="flex-1 space-y-1">
                                   <div className="w-16 md:w-20 h-2 bg-gray-200 rounded" />
                                   <div className="w-10 md:w-12 h-2 bg-gray-100 rounded" />
                               </div>
                               <CheckCircle size={14} className={i === 1 ? "text-green-500" : "text-gray-300"} />
                           </div>
                       ))}
                  </div>
            </div>
            
            <div className="mt-4 md:mt-8 relative z-20">
                <h3 className="text-3xl font-medium text-[#1A1A1A] mb-2">Student</h3>
                <p className="text-gray-700 max-w-sm text-lg">
                    Build skills on your schedule with personalized learning paths and expert mentorship.
                </p>
            </div>
        </div>
    </div>
  );
};
