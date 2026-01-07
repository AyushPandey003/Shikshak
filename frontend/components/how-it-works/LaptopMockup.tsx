import React from 'react';
import { MoveRight } from 'lucide-react';

export default function LaptopMockup() {
  return (
    <div className="relative h-[600px] w-full flex items-center justify-center perspective-[2000px]">
             
     {/* Abstract Star/Burst Shape Behind */}
     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] pointer-events-none">
         <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#FF6B6B]/5 animate-[spin_60s_linear_infinite]">
            <path fill="currentColor" d="M42.7,-73.4C55.9,-65.1,67.7,-56.1,76.5,-45C85.3,-33.9,91.1,-20.7,90.3,-7.8C89.4,5,81.8,17.4,72.6,28.2C63.4,39,52.5,48.1,41.2,55.5C29.9,62.9,18.2,68.6,5.3,69.7C-7.6,70.9,-21.7,67.5,-34.4,60.8C-47.1,54.1,-58.4,44.1,-67.2,32.2C-76,20.2,-82.3,6.3,-81.9,-7.4C-81.5,-21.1,-74.4,-34.6,-64.1,-45.3C-53.8,-56,-40.3,-63.9,-27.1,-72.1C-13.8,-80.3,-0.8,-88.8,11.8,-86.3C24.4,-83.8,48.8,-70.3,42.7,-73.4Z" transform="translate(100 100)" />
         </svg>
     </div>

     {/* Connecting Lines */}
     <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none stroke-gray-200">
        <path d="M 200 600 L 350 500" fill="none" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M 500 250 L 400 350" fill="none" strokeWidth="1" strokeDasharray="4 4" />
     </svg>

     {/* High-Fidelity Laptop Chassis */}
     <div className="relative group perspective-[2000px] z-20 flex flex-col items-center justify-start transform translate-y-[-20px] lg:scale-[0.85] origin-center">
        
        {/* 1. Laptop Lid (Screen) */}
        <div className="relative w-[340px] md:w-[640px] h-[220px] md:h-[400px] bg-[#0B0F17] rounded-[1.2rem] md:rounded-[1.5rem] border-[4px] border-gray-800 shadow-2xl overflow-hidden transform md:rotate-x-[5deg] transition-transform duration-700 origin-bottom border-b-[8px] border-b-gray-900 z-20">
            
           {/* Notch */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-32 h-3 md:h-5 bg-black rounded-b-lg z-50 flex items-center justify-center">
               <div className="w-1 h-1 rounded-full bg-gray-800/80"></div>
           </div>

           {/* Screen Content */}
           <div className="w-full h-full bg-[#0F172A] text-white flex overflow-hidden pt-5">
              
              {/* Dashboard Sidebar */}
              <div className="w-12 md:w-48 bg-gray-900/50 border-r border-white/5 flex flex-col p-4 md:p-5">
                  <div className="flex items-center gap-2 mb-8">
                     <div className="w-6 h-6 rounded bg-[#FF6B6B] shadow-lg shadow-red-500/20"></div>
                     <span className="font-bold text-sm hidden md:block tracking-tight text-white">Shikshak</span>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="h-2 w-8 md:w-20 bg-white/10 rounded-full"></div>
                     <div className="h-2 w-6 md:w-24 bg-white/5 rounded-full"></div>
                     <div className="h-2 w-8 md:w-16 bg-white/5 rounded-full"></div>
                     <div className="h-2 w-5 md:w-20 bg-white/5 rounded-full"></div>
                  </div>

                  <div className="mt-auto flex items-center gap-3">
                     <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-white/10"></div>
                     <div className="h-2 w-16 bg-white/10 rounded-full hidden md:block"></div>
                  </div>
              </div>

              {/* Dashboard Main */}
              <div className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col relative">
                  {/* Top Nav */}
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h2 className="text-xl md:text-2xl font-medium tracking-tight text-white">Learning <span className="text-[#FF6B6B] font-serif italic">Hub</span></h2>
                     </div>
                     <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm"></div>
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm"></div>
                     </div>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full pb-4">
                     {/* Primary Card */}
                     <div className="bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E] text-white rounded-2xl p-5 relative overflow-hidden group/card shadow-xl shadow-red-900/20">
                        <div className="absolute top-3 right-3 p-1.5 bg-white/20 rounded-full backdrop-blur-md">
                           <MoveRight size={14} />
                        </div>
                        <span className="inline-block px-2 py-0.5 bg-white/20 rounded-full text-[8px] font-bold uppercase tracking-wider mb-2 border border-white/10">Priority</span>
                        <h3 className="text-lg md:text-xl font-medium leading-tight mb-1">Algorithm Analysis</h3>
                        <p className="text-white/90 text-xs mb-4 font-light">Module 4 • due Friday</p>
                        
                        {/* Progress Bar Mini */}
                        <div className="w-full bg-black/20 h-1 rounded-full overflow-hidden mb-4">
                           <div className="w-3/4 h-full bg-white/80"></div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-[10px] opacity-90 border-t border-white/20 pt-3 mt-auto">
                           <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">R</div>
                           <span className="font-medium">Assigned to You</span>
                        </div>
                     </div>

                     {/* Secondary Column */}
                     <div className="flex flex-col gap-4">
                        <div className="bg-[#1E293B]/80 backdrop-blur-xl rounded-2xl p-5 border border-white/5 flex-1 relative overflow-hidden">
                           <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
                           <h3 className="text-sm font-medium text-gray-100 mb-3">System Design</h3>
                           <div className="space-y-2">
                               <div className="flex items-center gap-2">
                                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                   <div className="h-1 w-full bg-gray-700 rounded-full"><div className="w-2/3 h-full bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div></div>
                               </div>
                               <div className="flex items-center gap-2">
                                   <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                   <div className="h-1 w-full bg-gray-700 rounded-full"><div className="w-1/3 h-full bg-purple-500 rounded-full"></div></div>
                               </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 h-24">
                           <div className="bg-[#111827] rounded-xl flex flex-col justify-center items-center border border-white/5">
                               <span className="text-2xl font-bold text-white mb-0.5">4</span>
                               <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Ongoing</span>
                           </div>
                            <div className="bg-[#111827] rounded-xl flex flex-col justify-center items-center border border-white/5 group/grade">
                               <span className="text-2xl font-bold text-emerald-400 mb-0.5 group-hover/grade:scale-110 transition-transform">A+</span>
                               <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Average</span>
                           </div>
                        </div>
                     </div>
                  </div>
              </div>
           </div>
        </div>

        {/* 2. Hinge Area */}
        <div className="relative w-[340px] md:w-[640px] h-3 bg-gray-800 z-10 flex justify-between items-center px-6 border-t border-black/50">
            <div className="w-full h-full bg-gradient-to-b from-black/80 to-transparent"></div>
        </div>

        {/* 3. Laptop Base (Keyboard Deck) */}
        <div className="relative w-[380px] md:w-[720px] h-[280px] md:h-[400px] bg-[#1a1f2c] rounded-b-[1.5rem] md:rounded-b-[2rem] shadow-2xl transform md:rotate-x-[72deg] origin-top border-t border-white/10 flex flex-col items-center justify-start py-6 md:py-8 z-0 mt-[-2px] shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
           
           {/* Keyboard Bed */}
           <div className="w-[320px] md:w-[580px] h-[100px] md:h-[200px] bg-[#11151c] rounded-lg md:rounded-xl shadow-inner border border-white/5 p-1.5 md:p-3 grid grid-rows-6 gap-0.5 md:gap-1 mb-4 md:mb-8">
              {/* Row 1 (Function Keys) */}
              <div className="grid grid-cols-[repeat(14,1fr)] gap-0.5 md:gap-1">
                   {[...Array(14)].map((_, i) => (
                       <div key={i} className="bg-[#242936] rounded-[1px] md:rounded-sm h-full shadow-sm"></div>
                   ))}
              </div>
              {/* Row 2 */}
              <div className="grid grid-cols-[repeat(14,1fr)] gap-0.5 md:gap-1">
                   {[...Array(14)].map((_, i) => (
                       <div key={i} className="bg-[#242936] rounded-[1px] md:rounded-sm h-full shadow-sm"></div>
                   ))}
              </div>
              {/* Row 3 */}
              <div className="grid grid-cols-[1.5fr_repeat(12,1fr)_1.5fr] gap-0.5 md:gap-1">
                   <div className="bg-[#242936] rounded-[1px] md:rounded-sm h-full shadow-sm"></div>
                   {[...Array(12)].map((_, i) => (
                       <div key={i} className="bg-[#242936] rounded-[1px] md:rounded-sm h-full shadow-sm"></div>
                   ))}
                   <div className="bg-[#242936] rounded-[1px] md:rounded-sm h-full shadow-sm"></div>
              </div>
              {/* Row 4 */}
               <div className="grid grid-cols-[1.8fr_repeat(11,1fr)_1.8fr] gap-0.5 md:gap-1">
                   <div className="bg-[#242936] rounded-[1px] md:rounded-sm h-full shadow-sm"></div>
                   {[...Array(11)].map((_, i) => (
                       <div key={i} className="bg-[#242936] rounded-[1px] md:rounded-sm h-full shadow-sm"></div>
                   ))}
                   <div className="bg-[#242936] rounded-[1px] md:rounded-sm h-full shadow-sm"></div>
              </div>
              {/* Row 5 */}
              <div className="grid grid-cols-[2.2fr_repeat(10,1fr)_2.2fr] gap-0.5 md:gap-1">
                   <div className="bg-[#242936] rounded-[1px] md:rounded-sm h-full shadow-sm"></div>
                   {[...Array(10)].map((_, i) => (
                       <div key={i} className="bg-[#242936] rounded-[1px] md:rounded-sm h-full shadow-sm"></div>
                   ))}
                   <div className="bg-[#242936] rounded-[1px] md:rounded-sm h-full shadow-sm"></div>
              </div>
              {/* Row 6 (Spacebar) */}
              <div className="grid grid-cols-[3fr_3fr_6fr_3fr_3fr] gap-0.5 md:gap-1">
                   <div className="bg-[#242936] rounded-[1px] md:rounded-sm h-full shadow-sm"></div>
                   <div className="bg-[#242936] rounded-[1px] md:rounded-sm h-full shadow-sm"></div>
                   <div className="bg-[#242936] rounded-[1px] md:rounded-sm h-full shadow-sm"></div> {/* Space */}
                   <div className="bg-[#242936] rounded-[1px] md:rounded-sm h-full shadow-sm"></div>
                   <div className="bg-[#242936] rounded-[1px] md:rounded-sm h-full shadow-sm"></div>
              </div>
           </div>

           {/* Trackpad & Palm Rest */}
           <div className="w-full flex justify-center relative">
              {/* Trackpad */}
              <div className="w-[100px] md:w-[220px] h-[60px] md:h-[130px] bg-[#222733] rounded-lg md:rounded-xl border border-white/5 shadow-inner"></div>
           </div>
              
           {/* Speaker Grills (Left & Right) */}
           <div className="absolute top-8 left-4 md:left-8 bottom-8 w-3 md:w-10 flex flex-col gap-0.5 md:gap-1 opacity-20">
               {[...Array(24)].map((_, i) => (
                   <div key={i} className="w-0.5 h-0.5 md:w-1 md:h-1 bg-black rounded-full mx-auto"></div>
               ))}
           </div>
           <div className="absolute top-8 right-4 md:right-8 bottom-8 w-3 md:w-10 flex flex-col gap-0.5 md:gap-1 opacity-20">
               {[...Array(24)].map((_, i) => (
                   <div key={i} className="w-0.5 h-0.5 md:w-1 md:h-1 bg-black rounded-full mx-auto"></div>
               ))}
           </div>

        </div>

        {/* Floating Elements (Re-positioned for new scale) */}
         <div className="absolute bottom-[20%] -left-[10%] bg-white p-3 rounded-2xl shadow-[0_20px_40px_-5px_rgba(0,0,0,0.3)] flex items-center gap-3 animate-[bounce_4s_infinite] z-50 max-w-[180px] border border-gray-100 hidden lg:flex">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-lg">🚀</div>
            <div>
               <p className="text-[8px] text-gray-500 font-bold uppercase">Status</p>
               <p className="text-xs font-bold text-gray-900">System Online</p>
            </div>
         </div>

         {/* Card 2: Plan */}
         <div className="absolute top-48 -right-4 bg-white p-4 rounded-2xl shadow-xl z-20 animate-[bounce_5s_infinite] animation-delay-1000 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-2 h-2 rounded-full bg-green-500"></div>
               <p className="text-xs font-bold text-gray-600">Learning Path Created</p>
            </div>
            <div className="h-1 w-32 bg-gray-100 rounded-full overflow-hidden">
               <div className="h-full w-2/3 bg-green-500"></div>
            </div>
         </div>

     </div>

  </div>
  );
}
