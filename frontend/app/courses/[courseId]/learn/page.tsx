'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SAMPLE_COURSE } from '@/constants/coursedetails';
import VideoPlayer from '@/components/ui/VideoPlayer';
import ModuleSidebar from '@/components/layout/ModuleSidebar';
import Navbar from '@/components/layout/Navbar';
import SidebarCollapsedStrip from '@/components/learn/SidebarCollapsedStrip';
import CourseInfoTabs from '@/components/learn/CourseInfoTabs';
import LearnPageFooter from '@/components/learn/LearnPageFooter';
import { Menu } from 'lucide-react'; // Retaining Menu for mobile button if needed, though Footer handles it

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
            <div className="z-50 shadow-sm relative h-[100px]">
                <Navbar />
            </div>

            <div className="flex flex-1 overflow-hidden relative">

                {/* Left Sidebar Logic */}
                {/* Desktop: Collapsed State (Thin Strip) */}
                {!isSidebarOpen && !isMobile && (
                    <SidebarCollapsedStrip onOpen={() => setSidebarOpen(true)} />
                )}

                {/* Actual Sidebar Content */}
                <div
                    className={`
                        absolute inset-y-0 left-0 w-[350px] bg-white z-50 transform transition-transform duration-300 ease-in-out border-r border-gray-200
                        lg:relative lg:shadow-none
                        ${isSidebarOpen ? 'translate-x-0 lg:w-[350px]' : '-translate-x-full lg:hidden'}
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
                        <div className="p-4 pt-0 sm:p-6 sm:pt-0 lg:p-8 lg:pt-0 max-w-[1200px] mx-auto w-full">

                            {/* Video Player Container */}
                            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-black mb-6 sm:mb-8">
                                <div className="aspect-video w-full">
                                    <VideoPlayer src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" poster={course.thumbnail} />
                                </div>
                            </div>

                            {/* Title & Actions */}
                            <div className="mb-6">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                                    {activeLecture?.title}
                                </h1>

                                <CourseInfoTabs
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                    activeLecture={activeLecture}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <LearnPageFooter onToggleSidebar={toggleSidebar} />

                </div>

                {/* Mobile Sidebar Overlay */}
                {isMobile && isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </div>

            {/* Mobile Sidebar Toggle Button (Floating) - Ensuring it's removed if redundant, checking page.tsx logic previously.. 
                 Wait, I removed the floating button in previous steps but added it back in one edit? 
                 In the current page.tsx content (lines 209-245), the toggle is in the Footer. 
                 There is no floating button in the main content area anymore except the one I removed.
                 BUT, checking line 217 in previous view... yes, footer has it.
                 So I don't need to add any extra floating button here.
             */}
        </div>
    );
}
