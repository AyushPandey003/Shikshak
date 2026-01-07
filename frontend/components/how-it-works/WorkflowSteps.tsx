import React from 'react';
import { 
  Cloud, Upload, FileVideo, FileText, 
  Brain, Sparkles, Scan, 
  Database, Search, Server, 
  MessageSquare, PlayCircle, User 
} from 'lucide-react';

export default function WorkflowSteps() {
  return (
    <section className="bg-gray-50 pt-12 pb-32 px-6 md:px-12 relative overflow-hidden">
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
              
              {/* Step 1: Upload */}
              <div className="flex flex-col items-center">
                 <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-indigo-50/50 mb-8 w-72 h-56 flex flex-col items-center justify-center gap-4 relative group hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
                    <div className="w-full h-full border-[3px] border-dashed border-indigo-50 rounded-2xl flex flex-col items-center justify-center bg-indigo-50/20 group-hover:border-indigo-100 transition-colors duration-500">
                        <div className="relative">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500">
                                <Cloud className="w-8 h-8 text-indigo-400" />
                            </div>
                            <Upload className="w-4 h-4 text-indigo-600 absolute bottom-2 right-[-6px] bg-white rounded-full p-0.5 shadow-sm" />
                        </div>
                        <span className="text-sm font-semibold text-indigo-900/40 mt-3 group-hover:text-indigo-500 transition-colors">Drag & Drop</span>
                        
                        {/* Floating elements */}
                        <div className="absolute top-6 right-6 bg-white p-2 rounded-xl shadow-[0_4px_12px_rgb(0,0,0,0.05)] border border-gray-50 transform rotate-12 group-hover:rotate-[20deg] transition-transform duration-500">
                            <FileVideo size={18} className="text-[#FF6B6B]" />
                        </div>
                        <div className="absolute bottom-6 left-6 bg-white p-2 rounded-xl shadow-[0_4px_12px_rgb(0,0,0,0.05)] border border-gray-50 transform -rotate-6 group-hover:rotate-[-12deg] transition-transform duration-500">
                            <FileText size={18} className="text-blue-400" />
                        </div>
                    </div>
                    {/* Circle badge */}
                     <div className="absolute -bottom-5 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-[#FF6B6B] font-bold text-lg border-2 border-white z-10">1</div>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Upload Resources</h3>
                 <p className="text-center text-gray-500 text-sm leading-relaxed max-w-[240px]">Seamlessly upload videos, PDFs, and notes. We handle the processing.</p>
              </div>

               {/* Step 2: Analyze */}
              <div className="flex flex-col items-center mt-12 lg:mt-24">
                 <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-indigo-50/50 mb-8 w-72 h-56 flex flex-col items-center justify-center relative group hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden">
                    <div className="relative z-10 flex flex-col items-center">
                       <div className="relative mb-6">
                          <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors duration-500">
                              <Brain className="w-10 h-10 text-gray-400 group-hover:text-indigo-500 transition-colors duration-500" />
                          </div>
                          <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
                       </div>
                       <div className="w-full max-w-[140px] space-y-2">
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                             <div className="h-full bg-[#FF6B6B] w-2/3 rounded-full animate-[progress_2s_ease-in-out_infinite]"></div>
                          </div>
                          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              <span>Processing</span>
                              <span>67%</span>
                          </div>
                       </div>
                    </div>
                    
                    {/* Scanning effect */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-indigo-500/[0.03] to-transparent bg-[length:100%_200%] animate-[scan_3s_linear_infinite]"></div>
                    
                    {/* Circle badge */}
                     <div className="absolute -bottom-5 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-[#FF6B6B] font-bold text-lg border-2 border-white z-20">2</div>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">AI Processing</h3>
                 <p className="text-center text-gray-500 text-sm leading-relaxed max-w-[240px]">Deep analysis to extract topics, transcriptions, and key concepts.</p>
              </div>

               {/* Step 3: Index */}
              <div className="flex flex-col items-center">
                 <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-indigo-50/50 mb-8 w-72 h-56 flex flex-col gap-4 relative group hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
                     <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                         <div className="flex gap-2">
                             <div className="w-2.5 h-2.5 rounded-full bg-red-300"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-yellow-300"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-green-300"></div>
                         </div>
                         <div className="bg-gray-50 px-2 py-1 rounded text-[10px] text-gray-400 font-mono">index_db</div>
                     </div>
                    <div className="flex-1 space-y-3 pt-1">
                        <div className="flex items-center gap-3 p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-50 group-hover:border-indigo-200 transition-colors">
                            <div className="bg-white p-1.5 rounded-lg shadow-sm"><Database size={14} className="text-indigo-500" /></div>
                            <div className="h-2 w-20 bg-indigo-200/50 rounded-full"></div>
                        </div>
                        <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-50">
                             <div className="bg-white p-1.5 rounded-lg shadow-sm"><Server size={14} className="text-gray-400" /></div>
                            <div className="h-2 w-16 bg-gray-200 rounded-full"></div>
                        </div>
                         <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-50">
                             <div className="bg-white p-1.5 rounded-lg shadow-sm"><Server size={14} className="text-gray-400" /></div>
                            <div className="h-2 w-24 bg-gray-200 rounded-full"></div>
                        </div>
                    </div>
                    {/* Circle badge */}
                     <div className="absolute -bottom-5 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-[#FF6B6B] font-bold text-lg border-2 border-white z-10">3</div>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Indexing</h3>
                 <p className="text-center text-gray-500 text-sm leading-relaxed max-w-[240px]">Every word is indexed. Search through hours of content in milliseconds.</p>
              </div>

               {/* Step 4: Engage */}
              <div className="flex flex-col items-center mt-12 lg:mt-24">
                 <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-indigo-50/50 mb-8 w-72 h-56 flex flex-col relative group hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex-shrink-0 flex items-center justify-center">
                            <User size={18} className="text-indigo-600" />
                        </div>
                        <div className="bg-gray-50 px-4 py-3 rounded-2xl rounded-tl-sm text-xs text-gray-500 max-w-[140px] shadow-sm">
                            Summarize this lecture...
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3 flex-row-reverse self-end mb-2">
                         <div className="w-10 h-10 rounded-2xl bg-[#FF6B6B] flex-shrink-0 flex items-center justify-center shadow-lg shadow-red-200">
                            <Sparkles size={18} className="text-white" />
                        </div>
                        <div className="bg-indigo-600 px-4 py-3 rounded-2xl rounded-tr-sm text-xs text-white shadow-md shadow-indigo-200 max-w-[150px]">
                            Here is the key takeaway...
                        </div>
                    </div>
                    
                    <div className="mt-auto border-t border-gray-50 pt-3 flex justify-between items-center px-1">
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                        </div>
                         <PlayCircle size={20} className="text-[#FF6B6B] group-hover:scale-110 transition-transform" />
                    </div>

                    {/* Circle badge */}
                     <div className="absolute -bottom-5 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-[#FF6B6B] font-bold text-lg border-2 border-white z-10">4</div>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive Learning</h3>
                 <p className="text-center text-gray-500 text-sm leading-relaxed max-w-[240px]">Turn passive viewing into active learning with AI chat and quizzes.</p>
              </div>
           </div>
        </div>
    </section>
  );
}
