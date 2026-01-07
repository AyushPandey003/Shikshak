
import React from 'react';
import { Building2, GraduationCap, BarChart3 } from 'lucide-react';

export const InstitutionFeature = () => {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl p-8">
         {/* Background */}
        <div className="absolute inset-0 bg-[#E89E25] z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E89E25] to-[#B87A10]" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
            <div className="mb-8">
                <h3 className="text-4xl font-medium text-white mb-4">Institution</h3>
                <p className="text-white/90 max-w-md text-lg">
                    Scale your educational impact with advanced management tools for schools and universities.
                </p>
            </div>

            {/* Dashboard UI Cards Mockup */}
            <div className="flex gap-4 mt-auto overflow-hidden">
                {/* Main Stats Card */}
                <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 flex-1 shadow-xl">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                <BarChart3 size={16} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Enrollment</p>
                                <p className="text-xs text-gray-300">Annual ▼</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Bar Chart Mockup */}
                    <div className="flex items-end gap-2 h-32 justify-between px-2">
                         {[60, 75, 50, 85, 95, 80].map((h, i) => (
                             <div key={i} className="w-full bg-[#E89E25]/60 rounded-t-sm relative group" style={{ height: `${h}%` }}>
                                {h === 95 && (
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white shadow-md px-2 py-1 rounded text-[10px] whitespace-nowrap font-medium text-orange-600">
                                        +24%
                                    </div>
                                )}
                             </div>
                         ))}
                    </div>
                </div>

                {/* Department List Card */}
                <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 w-72 flex flex-col gap-4 text-white">
                     <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                 <Building2 size={14} />
                             </div>
                             <div>
                                 <p className="text-sm font-medium">Science Dept</p>
                                 <p className="text-[10px] opacity-70">450 Students</p>
                             </div>
                         </div>
                         <span className="text-sm font-bold">98%</span>
                     </div>

                     <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                 <GraduationCap size={14} />
                             </div>
                             <div>
                                 <p className="text-sm font-medium">Engineering</p>
                                 <p className="text-[10px] opacity-70">1.2k Students</p>
                             </div>
                         </div>
                         <span className="text-sm font-bold">92%</span>
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
};
