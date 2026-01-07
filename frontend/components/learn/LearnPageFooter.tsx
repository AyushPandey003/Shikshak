import React from 'react';
import { Menu, ArrowRight, Sparkles } from 'lucide-react';

interface LearnPageFooterProps {
    onToggleSidebar: () => void;
    isAiOpen?: boolean;
    onToggleAI?: () => void;
    onNext?: () => void;
}

const LearnPageFooter: React.FC<LearnPageFooterProps> = ({ onToggleSidebar, isAiOpen, onToggleAI, onNext }) => {
    return (
        <div className="border-t border-gray-200 bg-white z-30 shrink-0">
            <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">

                <div className="flex items-center gap-3">
                    {/* Mobile: Sidebar Toggle */}
                    <button
                        onClick={onToggleSidebar}
                        className="lg:hidden p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Course Content"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* AI Assistant Trigger (Visible on all screens) */}
                    <button
                        onClick={onToggleAI}
                        className={`
                            flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95
                            ${isAiOpen
                                ? 'bg-[#FF6B6B] text-white shadow-[#ffbaba]'
                                : 'bg-white text-[#FF6B6B] border border-[#ffbaba] hover:bg-[#fff0f0]'}
                        `}
                    >
                        <Sparkles className={`w-4 h-4 ${isAiOpen ? 'animate-pulse' : ''}`} />
                        <span className="hidden sm:inline">AI Assistant</span>
                    </button>
                </div>



                {/* Next Item Button */}
                <button
                    onClick={onNext}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#FF6B6B] text-white text-sm font-bold rounded-lg hover:bg-[#ff5252] transition-all shadow-sm active:scale-95"
                >
                    <span>Next item</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default LearnPageFooter;

