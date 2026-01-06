import React from 'react';
import { FileText, Clock, HelpCircle, X, ChevronRight } from 'lucide-react';
import { Test } from '@/types/test';

interface TestSidebarProps {
    tests: Test[];
    onTestSelect: (test: Test) => void;
    courseTitle: string;
    onClose?: () => void;
}

const TestSidebar: React.FC<TestSidebarProps> = ({ tests, onTestSelect, courseTitle, onClose }) => {
    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-[2px_0_5px_rgba(0,0,0,0.03)] font-sans">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 flex items-start justify-between bg-white shrink-0">
                <h2 className="font-bold text-gray-900 text-lg leading-snug line-clamp-2 mr-2">
                    {courseTitle}
                </h2>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Test List */}
             <div className="flex-1 overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <div className="p-2">
                    {tests.map((test, idx) => (
                        <div 
                            key={test.id}
                            onClick={() => onTestSelect(test)}
                            className="group flex items-start gap-4 p-4 rounded-xl cursor-pointer hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all mb-2 relative overflow-hidden"
                        >
                            {/* Icon Container */}
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                                <FileText className="w-5 h-5 text-indigo-600" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Test {idx + 1}</p>
                                <h3 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-indigo-700 transition-colors">
                                    {test.title}
                                </h3>
                                
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {test.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <HelpCircle className="w-3 h-3" />
                                        {test.questions} Qs
                                    </span>
                                </div>
                            </div>

                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestSidebar;
