import React from 'react';
import { FileText, Download, BookOpen } from 'lucide-react';
import { Lecture } from '@/types/coursedet'; // Assuming types are here or I'll use any for now if not sure

interface CourseInfoTabsProps {
    activeTab: 'description' | 'transcript' | 'notes' | 'downloads';
    setActiveTab: (tab: 'description' | 'transcript' | 'notes' | 'downloads') => void;
    activeLecture?: any; // strict typing would be better but keeping it simple for refactor first
}

const CourseInfoTabs: React.FC<CourseInfoTabsProps> = ({ activeTab, setActiveTab, activeLecture }) => {
    return (
        <div className="mb-6">
            <div className="border-b border-gray-200 flex items-center gap-6 sm:gap-8 text-sm font-bold text-gray-600 mb-6 overflow-x-auto scrollbar-hide pb-1">
                <button 
                    onClick={() => setActiveTab('description')}
                    className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'description' ? 'border-blue-600 text-blue-700' : 'border-transparent hover:text-gray-900'}`}
                >
                    Description
                </button>
                <button 
                    onClick={() => setActiveTab('transcript')}
                    className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'transcript' ? 'border-blue-600 text-blue-700' : 'border-transparent hover:text-gray-900'}`}
                >
                    Transcript
                </button>
                <button 
                    onClick={() => setActiveTab('notes')}
                    className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'notes' ? 'border-blue-600 text-blue-700' : 'border-transparent hover:text-gray-900'}`}
                >
                    Notes
                </button>
                <button 
                    onClick={() => setActiveTab('downloads')}
                    className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'downloads' ? 'border-blue-600 text-blue-700' : 'border-transparent hover:text-gray-900'}`}
                >
                    Downloads
                </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px] text-gray-700 leading-relaxed text-[15px]">
                {activeTab === 'description' && (
                    <div className="prose prose-indigo prose-lg max-w-none text-gray-600">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                            About this lesson
                        </h3>
                        <p className="mb-4 text-[15px] sm:text-base leading-relaxed">
                            {activeLecture?.description || "No description available for this lesson."}
                        </p>
                    </div>
                )}
                
                {activeTab === 'transcript' && (
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <span className="text-xs text-blue-600 font-bold min-w-[30px] pt-1">0:00</span>
                            <p className="text-sm sm:text-base">Welcome to this lecture on {activeLecture?.title}. In this session, we will explore the fundamental concepts that form the building blocks of our module.</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-xs text-blue-600 font-bold min-w-[30px] pt-1">0:30</span>
                            <p className="text-sm sm:text-base">Often, students find this topic challenging because of the abstract nature. However, by using real-world examples, we simplify the understanding.</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-xs text-blue-600 font-bold min-w-[30px] pt-1">1:15</span>
                            <p className="text-sm sm:text-base">Let's look at the first example displayed on the screen. Notice the pattern here?</p>
                        </div>
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
                        <div className="flex items-center gap-2 font-bold text-gray-800 mb-3">
                            <BookOpen className="w-5 h-5 text-yellow-600" />
                            <span>Your Notes</span>
                        </div>
                        <p className="text-gray-600 italic text-sm sm:text-base">You haven't added any notes for this lecture yet. Click "Save note" to add one.</p>
                    </div>
                )}

                 {activeTab === 'downloads' && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                    <FileText className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm sm:text-base">Lecture Slides.pdf</p>
                                    <p className="text-xs text-gray-500">2.4 MB • PDF Document</p>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <Download className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors">
                            <div className="flex items-center gap-3 sm:gap-4">
                                 <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                    <FileText className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm sm:text-base">Source Code.zip</p>
                                     <p className="text-xs text-gray-500">156 KB • ZIP Archive</p>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                 <Download className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseInfoTabs;
