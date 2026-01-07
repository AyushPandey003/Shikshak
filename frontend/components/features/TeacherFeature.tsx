
import React from 'react';
import { Users, Star, Wallet, ArrowUpRight } from 'lucide-react';

export const TeacherFeature = () => {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl p-8">
        {/* Background */}
        <div className="absolute inset-0 bg-[#4A6741] z-0">
             <div className="absolute inset-0 bg-gradient-to-br from-[#4A6741] to-[#2E4529]" />
             <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl translate-y-1/3 translate-x-1/4" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
            <div className="mb-8">
                <h3 className="text-4xl font-medium text-white mb-4">Teacher</h3>
                <p className="text-white/80 max-w-md text-lg">
                    Share your expertise, grow your audience, and earn directly from your students.
                </p>
            </div>

            {/* Cards Mockup */}
            <div className="flex gap-6 mt-auto items-end">
                {/* Earnings Card */}
                <div className="bg-white rounded-3xl p-6 shadow-xl w-64 shrink-0">
                    <p className="text-xs text-gray-400 mb-1">Total Earnings</p>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-bold text-[#4A6741]">₹54,840</span>
                        <span className="text-xs text-gray-400">INR</span>
                    </div>
                    
                    <div className="flex justify-between mt-4 border-t border-gray-100 pt-4">
                        <div className="text-center">
                            <p className="text-lg font-bold text-gray-800">128</p>
                            <p className="text-[10px] text-gray-400 uppercase">Students</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-gray-800">12</p>
                            <p className="text-[10px] text-gray-400 uppercase">Courses</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-gray-800 flex items-center gap-0.5">4.9 <Star size={10} fill="currentColor" className="text-yellow-400" /></p>
                            <p className="text-[10px] text-gray-400 uppercase">Rating</p>
                        </div>
                    </div>
                </div>

                {/* Performance Card */}
                <div className="bg-white/20 backdrop-blur-lg border border-white/10 rounded-3xl p-6 flex-1 text-white shadow-xl h-56 flex flex-col justify-between relative overflow-hidden">
                     <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-white/20">
                                <Wallet className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium">Payouts</span>
                         </div>
                         <ArrowUpRight className="w-4 h-4 text-white/70" />
                     </div>

                     <div className="space-y-4">
                         <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 rounded-full bg-blue-400/30" />
                                 <span className="text-sm">Web Dev Bootcamp</span>
                             </div>
                             <span className="font-medium">+ ₹12,400</span>
                         </div>
                         <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 rounded-full bg-purple-400/30" />
                                 <span className="text-sm">React Masterclass</span>
                             </div>
                             <span className="font-medium">+ ₹8,250</span>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
};
