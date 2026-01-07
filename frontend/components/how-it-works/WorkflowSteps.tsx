import React from 'react';

export default function WorkflowSteps() {
  return (
    <section className="bg-gray-50 py-32 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto text-center mb-20">
            <div className="w-16 h-1 bg-[#FF6B6B] mx-auto mb-6 rounded-full"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How it works</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
               Our intelligent pipeline takes your content from raw video to an interactive learning experience in seconds.
            </p>
        </div>

        <div className="max-w-[1400px] mx-auto relative">
           {/* Connecting Line (SVG) - Visible on lg screens */}
           <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 hidden lg:block pointer-events-none z-0">
              <svg className="w-full h-40" preserveAspectRatio="none" viewBox="0 0 1200 100">
                <path 
                  d="M 100,50 Q 300,100 450,50 T 800,50 T 1100,50" 
                  fill="none" 
                  stroke="#E0E7FF" 
                  strokeWidth="3" 
                  strokeDasharray="8 8" 
                  className="animate-[dash_30s_linear_infinite]"
                />
              </svg>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                 <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8 w-64 h-48 flex flex-col gap-3 relative group hover:-translate-y-2 transition-transform duration-300">
                    {/* Abstract UI representation */}
                    <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                    <div className="h-2 w-1/2 bg-gray-100 rounded"></div>
                    <div className="flex-1 bg-indigo-50/50 rounded-lg mt-2 border border-indigo-100 border-dashed"></div>
                    {/* Circle badge */}
                     <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-[#FF6B6B] font-bold border border-gray-50">1</div>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Upload</h3>
                 <p className="text-center text-gray-500 text-sm">Upload lectures & notes</p>
              </div>

               {/* Step 2 */}
              <div className="flex flex-col items-center mt-12 lg:mt-0">
                 <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8 w-64 h-48 flex flex-col gap-3 relative group hover:-translate-y-2 transition-transform duration-300">
                    <div className="flex gap-2">
                       <div className="h-8 w-8 bg-green-100 rounded-lg"></div>
                       <div className="h-8 flex-1 bg-gray-50 rounded-lg"></div>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded mt-2"></div>
                     <div className="h-2 w-2/3 bg-gray-100 rounded"></div>
                    {/* Circle badge */}
                     <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-[#FF6B6B] font-bold border border-gray-50">2</div>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Analyze</h3>
                 <p className="text-center text-gray-500 text-sm">AI extracts knowledge</p>
              </div>

               {/* Step 3 */}
              <div className="flex flex-col items-center">
                 <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8 w-64 h-48 flex flex-col gap-3 relative group hover:-translate-y-2 transition-transform duration-300">
                     <div className="flex justify-between items-center mb-2">
                         <div className="h-2 w-10 bg-gray-200 rounded"></div>
                         <div className="h-2 w-4 bg-gray-200 rounded"></div>
                     </div>
                    <div className="flex-1 bg-gray-800 rounded-xl p-3 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin"></div>
                    </div>
                    {/* Circle badge */}
                     <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-[#FF6B6B] font-bold border border-gray-50">3</div>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Index</h3>
                 <p className="text-center text-gray-500 text-sm">Content becomes searchable</p>
              </div>

               {/* Step 4 */}
              <div className="flex flex-col items-center mt-12 lg:mt-0">
                 <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8 w-64 h-48 flex flex-col gap-3 relative group hover:-translate-y-2 transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">✓</div>
                        <div className="space-y-1">
                             <div className="h-2 w-20 bg-gray-100 rounded"></div>
                             <div className="h-2 w-12 bg-gray-100 rounded"></div>
                        </div>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-lg flex-1">
                        <div className="h-2 w-full bg-white/50 rounded mb-2"></div>
                        <div className="h-2 w-3/4 bg-white/50 rounded"></div>
                    </div>
                    {/* Circle badge */}
                     <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-[#FF6B6B] font-bold border border-gray-50">4</div>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Engage</h3>
                 <p className="text-center text-gray-500 text-sm">Students learn faster</p>
              </div>
           </div>
        </div>
      </section>
  );
}
