'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import VideoPlayer from '@/components/ui/VideoPlayer';
import ModuleSidebar from '@/components/layout/ModuleSidebar';
import TestSidebar from '@/components/layout/TestSidebar';
import { dummyTests, Test } from '@/types/test';
import Navbar from '@/components/layout/Navbar';
import SidebarCollapsedStrip from '@/components/learn/SidebarCollapsedStrip';
import CourseInfoTabs from '@/components/learn/CourseInfoTabs';
import LearnPageFooter from '@/components/learn/LearnPageFooter';
import AIAssistant from '@/components/learn/AIAssistant';
import TestView from '@/components/learn/TestView';
import axios from 'axios';
import { useAppStore } from '@/store/useAppStore';

export default function ModulePage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.courseId as string;
    const { user } = useAppStore();

    // State for course data
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const [course, setCourse] = useState<any>(null); // Using any temporarily to bridge types, ideally match Section interface
    const [loading, setLoading] = useState(true);

    const [activeLectureId, setActiveLectureId] = useState<string | null>(null);
    const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("");

    // UI State
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [sidebarView, setSidebarView] = useState<'modules' | 'tests'>('modules');
    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState<'description' | 'transcript' | 'notes' | 'downloads'>('description');
    const [isAiOpen, setIsAiOpen] = useState(false);

    // Test View State
    const [activeView, setActiveView] = useState<'lecture' | 'test'>('lecture');
    const [activeTest, setActiveTest] = useState<Test | null>(null);

    // Fetch Course & Modules
    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);

                // 1. Fetch Basic Course Info
                // Using general endpoint for metadata
                const courseRes = await axios.post("http://localhost:4000/material/courses/get_course_by_id_general", {
                    course_id: courseId
                }, { withCredentials: true });

                const courseData = courseRes.data;

                // 2. Fetch Modules (Sections)
                const modulesRes = await axios.post("http://localhost:4000/material/module/get_all_module", {
                    course_id: courseId
                }, { withCredentials: true });

                const modulesData = modulesRes.data;

                // 3. Map to Frontend Structure
                const mappedSections = modulesData.map((mod: any) => ({
                    id: mod._id,
                    title: mod.title,
                    lectures: [
                        ...(mod.video_id || []).map((vid: any) => ({
                            id: vid._id,
                            title: vid.title,
                            duration: '10:00', // Default or fetch real duration if available
                            type: 'video',
                            contentUrl: vid.azure_id, // Store blob name here
                            isPreview: false
                        })),
                        ...(mod.notes_id || []).map((note: any) => ({
                            id: note._id,
                            title: note.title || "Notes",
                            type: 'article',
                            contentUrl: Array.isArray(note.azure_id) ? note.azure_id[0] : note.azure_id,
                            isPreview: false
                        }))
                    ]
                }));

                // Fetch thumbnail SAS if needed
                let thumbnail = courseData.thumbnail;
                if (thumbnail && !thumbnail.startsWith("http")) {
                    try {
                        const sasRes = await axios.get(`http://localhost:4000/material/upload/${encodeURIComponent(thumbnail)}`, { withCredentials: true });
                        if (sasRes.data?.url) thumbnail = sasRes.data.url;
                    } catch (e) {
                        console.error("Thumbnail fetch error", e);
                    }
                }

                setCourse({
                    ...courseData,
                    title: courseData.name, // Backend uses 'name', frontend uses 'title'
                    sections: mappedSections,
                    thumbnail: thumbnail
                });

                // Set initial active lecture
                if (mappedSections.length > 0 && mappedSections[0].lectures.length > 0) {
                    setActiveLectureId(mappedSections[0].lectures[0].id);
                }

            } catch (error) {
                console.error("Failed to fetch course data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCourseData();
        }
    }, [courseId]);

    // Handle Active Lecture Change (Video URL Fetching)
    const activeLecture = course?.sections
        ?.flatMap((s: any) => s.lectures)
        .find((l: any) => l.id === activeLectureId);

    useEffect(() => {
        const fetchVideoUrl = async () => {
            if (!activeLecture) return;

            if (activeLecture.type === 'video' && activeLecture.contentUrl) {
                // If it's already a full URL, use it
                if (activeLecture.contentUrl.startsWith("http")) {
                    setCurrentVideoUrl(activeLecture.contentUrl);
                } else {
                    // It's a blob name, fetch SAS
                    try {
                        const sasRes = await axios.get(`http://localhost:4000/material/upload/${encodeURIComponent(activeLecture.contentUrl)}`, {
                            withCredentials: true
                        });
                        if (sasRes.data?.url) {
                            setCurrentVideoUrl(sasRes.data.url);
                        }
                    } catch (err) {
                        console.error("Failed to fetch video URL", err);
                    }
                }
            } else {
                setCurrentVideoUrl("");
            }
        };

        fetchVideoUrl();
    }, [activeLectureId, activeLecture]);


    // Resize Logic
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

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading Course Content...</div>;
    }

    if (!course) {
        return <div className="flex h-screen items-center justify-center">Course not found.</div>;
    }

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
                    <div className="flex flex-col h-full bg-white">
                        {/* Sidebar View Switcher */}
                        <div className="flex items-center p-2 gap-2 border-b border-gray-200 shrink-0">
                            <button
                                onClick={() => {
                                    setSidebarView('modules');
                                    // Switch back to lecture view when modules tab is clicked
                                    setActiveView('lecture');
                                }}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                                    sidebarView === 'modules' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                Modules
                            </button>
                            <button
                                onClick={() => {
                                    setSidebarView('tests');
                                    // Switch to test view when tests tab is clicked
                                    setActiveView('test');
                                }}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                                    sidebarView === 'tests' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                Tests
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-hidden">
                            {sidebarView === 'modules' ? (
                                <ModuleSidebar
                                    sections={course.sections}
                                    activeLectureId={activeLectureId || undefined}
                                    courseTitle={course.title}
                                    onClose={() => setSidebarOpen(false)}
                                    onLectureSelect={(id) => {
                                        setActiveLectureId(id);
                                        setActiveView('lecture');
                                        if (isMobile) setSidebarOpen(false);
                                    }}
                                    onOpenAI={() => {
                                        setIsAiOpen(true);
                                        if (isMobile) setSidebarOpen(false);
                                    }}
                                />
                            ) : (
                                <TestSidebar
                                    tests={dummyTests}
                                    courseTitle={course.title}
                                    onTestSelect={(test) => {
                                        console.log('Selected test:', test);
                                        setActiveTest(test);
                                        setActiveView('test');
                                        if (isMobile) setSidebarOpen(false);
                                    }}
                                    onClose={() => setSidebarOpen(false)}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col w-full relative overflow-hidden bg-white">

                    {/* Content Scrollable Area */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                        <div className="p-4 pt-0 sm:p-6 sm:pt-0 lg:p-8 lg:pt-0 max-w-[1200px] mx-auto w-full">

                            {/* Content Display Area */}
                            {activeView === 'lecture' ? (
                                <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-black mb-6 sm:mb-8">
                                    <div className="aspect-video w-full">
                                        {activeLecture?.type === 'video' ? (
                                            currentVideoUrl ? (
                                                <VideoPlayer src={currentVideoUrl} poster={course.thumbnail} />
                                            ) : (
                                                <div className="flex items-center justify-center h-full bg-black text-white">
                                                    Loading Video...
                                                </div>
                                            )
                                        ) : (
                                            <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                                                {activeLecture?.type === 'article' ? "Reading Material" : "Content Placeholder"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white mb-6 sm:mb-8 min-h-[400px]">
                                    {activeTest ? (
                                        <TestView test={activeTest} />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400 p-8">
                                            Select a test to view details
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Title & Actions */}
                            {activeView === 'lecture' && (
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
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <LearnPageFooter
                        onToggleSidebar={toggleSidebar}
                        isAiOpen={isAiOpen}
                        onToggleAI={() => setIsAiOpen(!isAiOpen)}
                    />

                </div>

                {/* Mobile Sidebar Overlay */}
                {isMobile && isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </div>

            {/* AI Assistant Window (Global) */}
            <AIAssistant
                courseId={courseId}
                modules={course.sections}
                isOpen={isAiOpen}
                onClose={() => setIsAiOpen(false)}
            />
        </div>
    );
}
