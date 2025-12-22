import React, { useState, useEffect } from 'react';
import { Play, Heart, Share2, Info, MonitorPlay, FileText, Download } from 'lucide-react';
import { Course } from '@/types/coursedet';

interface CourseSidebarProps {
    course: Course;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({ course }) => {
    return (
        <div className="hidden lg:block w-[360px] z-20 sticky top-24 h-fit font-sans">
            <div className="bg-white shadow-2xl shadow-gray-200/50 border border-gray-100/80 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl hover:-translate-y-1">

                {/* Thumbnail */}
                <div className="relative group">
                    <img src={course.thumbnail} alt="Preview" className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>

                <div className="p-8">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <span className="text-4xl font-extrabold text-gray-900 tracking-tight">₹{course.price}</span>
                        {course.price !== course.originalPrice && (
                            <div className="flex flex-col items-start gap-0.5">
                                <span className="text-base text-gray-400 line-through decoration-gray-400 font-medium">₹{course.originalPrice}</span>
                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{Math.round((1 - course.price / course.originalPrice) * 100)}% OFF</span>
                            </div>
                        )}
                    </div>



                    <div className="space-y-3 mb-8">
                        <button className="w-full py-4 rounded-xl cursor-pointer bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
                            Buy Now
                        </button>
                        <button className="w-full py-4 rounded-xl cursor-pointer bg-white border-2 border-gray-100 text-gray-700 font-bold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                            Add to Cart
                        </button>
                    </div>

                    <div className="text-center text-xs text-gray-400 mb-8 font-medium">
                        Cerified Content
                    </div>

                    {/* This course includes */}
                    {/* <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">This course includes:</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-center gap-3">
                                <MonitorPlay className="w-5 h-5 text-gray-400 stroke-1.5" />
                                <span>{course.sections.reduce((acc, sec) => acc + sec.lectures.length, 0)} on-demand video lessons</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-gray-400 stroke-1.5" />
                                <span>35 downloadable resources</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Download className="w-5 h-5 text-gray-400 stroke-1.5" />
                                <span>Full lifetime access</span>
                            </li>
                        </ul>
                    </div> */}

                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-gray-500">
                        <button className="text-sm font-semibold hover:text-gray-900 flex items-center cursor-pointer gap-2 transition-colors">
                            <Share2 className="w-4 h-4" /> Share
                        </button>
                        <button className="text-sm font-semibold hover:text-gray-900 flex items-center   cursor-pointer gap-2 transition-colors">
                            <Heart className="w-4 h-4" /> Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseSidebar;