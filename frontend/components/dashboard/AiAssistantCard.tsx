import React from 'react';
import { Send, MoreHorizontal, RefreshCw } from 'lucide-react';

const AiAssistantCard = () => {
  return (
    <div className="relative bg-pink-50 rounded-[2rem] p-6 shadow-sm h-[320px] overflow-hidden flex flex-col justify-between">
       {/* Background Decoration - mimicking the pink blob */}
       <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-white opacity-60 z-0"></div>
       <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-pink-300 rounded-full blur-3xl opacity-50 z-0"></div>
       
       {/* Header */}
       <div className="relative z-10 flex justify-end gap-2">
          <button className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 hover:bg-white">
             <RefreshCw size={12} />
             Model
          </button>
          <button className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-sm">
             <MoreHorizontal size={16} />
          </button>
       </div>

       {/* 3D Object Placeholder (using CSS for a simple glassy sphere effect) */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-48 h-48 rounded-full bg-gradient-to-tr from-pink-400 to-transparent opacity-80 z-0 blur-xl"></div>
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-40 h-40">
           {/* Abstract shape representation */}
            <div className="w-full h-full rounded-full bg-gradient-to-br from-white/40 to-pink-500/30 backdrop-blur-md shadow-inner border border-white/50 flex items-center justify-center">
                 <div className="w-2/3 h-2/3 rounded-full bg-gradient-to-tl from-pink-300 to-purple-400 mix-blend-overlay"></div>
            </div>
       </div>


       {/* Bottom Control */}
       <div className="relative z-10">
          <h2 className="text-xl font-bold mb-4">AI assistant</h2>
          
          <div className="bg-white rounded-2xl p-2 pl-4 flex items-center justify-between shadow-sm">
             <input 
                type="text" 
                placeholder="Ask something..." 
                className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400"
             />
             <button className="w-8 h-8 bg-[#FF6B6B] rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors">
                <Send size={14} className="ml-0.5" />
             </button>
          </div>
       </div>
    </div>
  );
};

export default AiAssistantCard;
