import React from 'react';
import { Menu, ThumbsUp, ThumbsDown, Flag, ArrowRight } from 'lucide-react';

interface LearnPageFooterProps {
    onToggleSidebar: () => void;
}

const LearnPageFooter: React.FC<LearnPageFooterProps> = ({ onToggleSidebar }) => {
    return (
        <div className="border-t border-gray-200 bg-white z-30 shrink-0">
             <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
                
                {/* Mobile: Sidebar Toggle */}
                <button 
                    onClick={onToggleSidebar}
                    className="lg:hidden p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Course Content"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Desktop: Like/Dislike Actions */}
                <div className="hidden lg:flex items-center gap-6">
                    <button className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                        <ThumbsUp className="w-4 h-4" /> Like
                    </button>
                    <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">
                        <ThumbsDown className="w-4 h-4" /> Dislike
                    </button>
                    <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">
                        <Flag className="w-4 h-4" /> Report
                    </button>
                </div>
                
                {/* Next Item Button */}
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all shadow-sm active:scale-95">
                    <span>Next item</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default LearnPageFooter;
