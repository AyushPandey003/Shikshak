import React from 'react';
import { Course } from '@/types/coursedet';

interface MobileActionProps {
    course: Course;
}

const MobileAction: React.FC<MobileActionProps> = ({ course }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 p-4 z-50 lg:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.04)] pb-[safe-area-inset-bottom]">
            <div className="flex items-center gap-4 max-w-lg mx-auto">
                <div className="flex flex-col">
                    <span className="text-2xl font-extrabold text-gray-900 leading-none">₹{course.price}</span>
                    <span className="text-xs text-gray-400 line-through mt-0.5">₹{course.originalPrice}</span>
                </div>
                <button className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-95 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200">
                    Buy now
                </button>
            </div>
        </div>
    );
}

export default MobileAction;
