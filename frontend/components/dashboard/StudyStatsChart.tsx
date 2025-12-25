import React from 'react';
import { ChevronDown } from 'lucide-react';

const StudyStatsChart = () => {
    // Simple mock data for bars
    const data = [
        { label: 'Engage', val: 66, color: 'bg-gray-200' },
        { label: 'Grow', val: 40, color: 'bg-gray-200' },
        { label: 'Skills', val: 87, color: 'bg-[#FF6B6B] text-white' }, // Highlighted column
        { label: 'Rate', val: 56, color: 'bg-gray-200' },
    ];

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm h-[320px] flex flex-col">
       <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Study process</h2>
          <button className="flex items-center gap-1 text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-full text-gray-600">
             Week <ChevronDown size={14} />
          </button>
       </div>

       <div className="flex-1 flex items-end justify-between gap-4 px-2">
          {data.map((item, i) => (
             <div key={i} className="flex-1 flex flex-col justify-end items-center h-full group">
                 {/* Tooltip bubble mock */}
                 <div className={`mb-2 px-2 py-1 rounded-lg text-xs font-bold transition-all ${item.val > 50 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} ${item.val === 87 ? 'bg-black text-white' : 'bg-[#FF6B6B] text-white'}`}>
                    {item.val}%
                 </div>
                 
                 {/* Bar */}
                 <div 
                    className={`w-full max-w-[60px] rounded-2xl transition-all duration-500 ${item.val === 87 ? 'bg-[#FF6B6B]' : 'bg-gray-200 hover:bg-gray-300'}`}
                    style={{ height: `${item.val}%` }}
                 ></div>

                 <span className="mt-3 text-sm font-semibold text-gray-500">{item.label}</span>
             </div>
          ))}
       </div>
    </div>
  );
};

export default StudyStatsChart;
