'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SAMPLE_COURSE } from '@/constants/coursedetails';
import VideoPlayer from '@/components/ui/VideoPlayer';
import ModuleSidebar from '@/components/layout/ModuleSidebar';
import { ArrowLeft, Menu, X, ThumbsUp, ThumbsDown, Flag, ArrowRight, FileText, Download, BookOpen } from 'lucide-react';
import Navbar from '@/components/layout/Navbar'; 

export default function ModulePage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.courseId;

    const course = SAMPLE_COURSE;
    
    const [activeLectureId, setActiveLectureId] = useState(course.sections[0]?.lectures[0]?.id);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState<'description' | 'transcript' | 'notes' | 'downloads'>('description');

    const activeLecture = course.sections
        .flatMap(s => s.lectures)
        .find(l => l.id === activeLectureId);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) setSidebarOpen(false);
            else setSidebarOpen(true);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen flex-col bg-gray-50 font-sans text-slate-900">
            {/* Using the standard Navbar at the top (white background usually) */}
            <div className="z-40 shadow-sm relative">
                 <Navbar />
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                
                {/* Left Sidebar (Coursera style) */}
                <div 
                    className={`
                        absolute inset-y-0 left-0 w-[350px] bg-white z-30 transform transition-transform duration-300 ease-in-out border-r border-gray-200
                        lg:relative lg:translate-x-0 lg:w-[350px] lg:shadow-none
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}
                >
                    <ModuleSidebar 
                        sections={course.sections} 
                        activeLectureId={activeLectureId}
                        courseTitle={course.title}
                        onClose={() => setSidebarOpen(false)}
                        onLectureSelect={(id) => {
                            setActiveLectureId(id);
                            if (isMobile) setSidebarOpen(false);
                        }}
                    />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col w-full relative overflow-hidden bg-white">
                    
                    {/* Content Scrollable Area */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                        <div className="p-0 sm:p-6 lg:p-8 max-w-[1200px] mx-auto w-full">
                            
                            {/* Toggle Sidebar Button (if closed or mobile) */}
                            {!isSidebarOpen && (
                                <button 
                                    onClick={() => setSidebarOpen(true)}
                                    className="absolute left-4 top-4 z-20 p-2 bg-white shadow-md rounded-full border border-gray-200 hover:bg-gray-50 lg:block hidden"
                                    title="Open Sidebar"
                                >
                                    <Menu className="w-5 h-5 text-gray-700" />
                                </button>
                            )}
                            
                            {/* Video Player Container */}
                            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-black mb-8">
                                <div className="aspect-video w-full">
                                    <VideoPlayer src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" poster={course.thumbnail} />
                                </div>
                            </div>

                            {/* Title & Actions */}
                            <div className="mb-6">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                                    {activeLecture?.title}
                                </h1>
                                
                            {/* Tabs Interface */}
                            <div className="mb-6">
                                <div className="border-b border-gray-200 flex items-center gap-8 text-sm font-bold text-gray-600 mb-6 overflow-x-auto scrollbar-hide">
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
                                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                                About this lesson
                                            </h3>
                                            <p className="mb-4 text-base leading-relaxed">
                                                {activeLecture?.description || "No description available for this lesson."}
                                            </p>
                                        </div>
                                    )}
                                    {activeTab === 'transcript' && (
                                        <div className="space-y-4">
                                            <div className="flex gap-4">
                                                <span className="text-xs text-blue-600 font-bold min-w-[30px] pt-1">0:00</span>
                                                <p>Welcome to this lecture on {activeLecture?.title}. In this session, we will explore the fundamental concepts that form the building blocks of our module.</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <span className="text-xs text-blue-600 font-bold min-w-[30px] pt-1">0:30</span>
                                                <p>Often, students find this topic challenging because of the abstract nature. However, by using real-world examples, we simplify the understanding.</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <span className="text-xs text-blue-600 font-bold min-w-[30px] pt-1">1:15</span>
                                                <p>Let's look at the first example displayed on the screen. Notice the pattern here?</p>
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === 'notes' && (
                                        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
                                            <div className="flex items-center gap-2 font-bold text-gray-800 mb-3">
                                                <BookOpen className="w-5 h-5 text-yellow-600" />
                                                <span>Your Notes</span>
                                            </div>
                                            <p className="text-gray-600 italic">You haven't added any notes for this lecture yet. Click "Save note" to add one.</p>
                                        </div>
                                    )}
                                     {activeTab === 'downloads' && (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                                        <FileText className="w-5 h-5 text-red-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Lecture Slides.pdf</p>
                                                        <p className="text-xs text-gray-500">2.4 MB • PDF Document</p>
                                                    </div>
                                                </div>
                                                <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                                    <Download className="w-4 h-4 text-gray-500" />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors">
                                                <div className="flex items-center gap-4">
                                                     <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                                        <FileText className="w-5 h-5 text-blue-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Source Code.zip</p>
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
                            </div>
                        </div>
                    </div>


                    {/* Footer Actions */}
                    <div className="border-t border-gray-200 px-6 py-4 bg-white flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-6">
                            <button className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                                <ThumbsUp className="w-4 h-4" /> Like
                            </button>
                            <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">
                                <ThumbsDown className="w-4 h-4" /> Dislike
                            </button>
                            <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">
                                <Flag className="w-4 h-4" /> Report an issue
                            </button>
                        </div>
                        
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                            Go to next item <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                </div>

                {/* Mobile Sidebar Overlay */}
                 {isMobile && isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </div>

            {/* Mobile Sidebar Toggle Button */}
            {!isSidebarOpen && isMobile && (
                <button
                    onClick={toggleSidebar}
                    className="fixed bottom-6 right-6 lg:hidden z-50 p-4 bg-blue-600 text-white rounded-full shadow-lg"
                >
                    <Menu className="w-6 h-6"/>
                </button>
            )}
        </div>
    );
}
