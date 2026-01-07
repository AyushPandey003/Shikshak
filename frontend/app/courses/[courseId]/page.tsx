'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import CourseSidebar from '@/components/layout/CourseSidebar';
import MobileAction from '@/components/layout/MobileAction';
import CourseCurriculum from '@/components/ui/CourseCurriculum';
import CourseReviews from '@/components/ui/CourseReviews';
// import { SAMPLE_COURSE, ICONS } from '@/constants/coursedetails';
import { Star, Award, Globe, AlertCircle, Play, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { Course, Review } from '@/types/coursedet';
import { useAppStore } from '@/store/useAppStore';

const CourseDetailPage: React.FC = () => {
    const { user } = useAppStore();
    const params = useParams();
    const courseId = params.courseId as string;
    const [course, setCourse] = useState<Course | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) return;
            try {
                // Using the specific endpoint for general info
                const res = await axios.post("http://localhost:4000/material/courses/get_course_by_id_general", {
                    course_id: courseId
                }, { withCredentials: true });

                const data = res.data;
                console.log("Course details:", data);

                let thumbnailUrl = data.thumbnail;
                // If thumbnail is a blob name (doesn't start with http), fetch SAS URL
                if (data.thumbnail && !data.thumbnail.startsWith("http")) {
                    try {
                        // Use encodeURIComponent to handle spaces or special chars safe
                        const sasRes = await axios.get(`http://localhost:4000/material/upload/${encodeURIComponent(data.thumbnail)}`, {
                            headers: user?.accessToken ? { "Authorization": `Bearer ${user.accessToken}` } : {},
                            withCredentials: true
                        });
                        if (sasRes.data && sasRes.data.url) {
                            thumbnailUrl = sasRes.data.url;
                        }
                    } catch (err: any) {
                        console.error(`Failed to fetch SAS for ${data.thumbnail}:`, err);
                    }
                }

                // Map API data to UI structure
                // Note: Providing fallbacks for fields not present in general info endpoint
                const mappedCourse: Course = {
                    id: data._id,
                    title: data.name,
                    subtitle: data.description ? data.description.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..." : "Master this course with clear concepts and practice.",
                    category: [data.board || "General", data.subject || "Subject", "Class"],
                    lastUpdated: "Recently", // This field doesn't exist in backend response yet
                    language: "English",
                    rating: data.rating || 4.5,
                    totalRatings: data.reviews?.length || 0,
                    students: 0, // Not in general info
                    price: data.price,
                    originalPrice: data.price ? Math.floor(data.price * 1.3) : 0, // Mock original price
                    discountEnding: "2 days",
                    thumbnail: thumbnailUrl,
                    videoPreview: "", // Not available in API
                    whatYouWillLearn: [ // Placeholder as API doesn't return this yet
                        "Comprehensive understanding of the syllabus",
                        "Problem-solving techniques and shortcuts",
                        "Conceptual clarity through examples"
                    ],
                    requirements: ["Basic understanding of the subject"],
                    description: data.description || "<p>No description available.</p>",
                    sections: data.module_id ? data.module_id.map((m: any, index: number) => ({
                        id: m._id,
                        title: m.title,
                        lectures: [] // Videos not populated deeply yet
                    })) : [],
                    instructors: [{
                        id: data.teacher_details?.id || "inst-1",
                        name: data.teacher_details?.name || "Instructor",
                        title: data.teacher_details?.qualification || "Educator",
                        avatar: "https://ui-avatars.com/api/?name=" + (data.teacher_details?.name || "Instructor") + "&background=random",
                        rating: 4.8,
                        students: 1000,
                        courses: 5,
                        bio: data.teacher_details?.experience ? `${data.teacher_details.experience} years of experience.` : "Passionate educator dedicated to student success."
                    }]
                };

                // Fetch reviews specifically
                const reviewsRes = await axios.post("http://localhost:4000/material/reviews/get_reviews", {
                    course_id: courseId
                }, { withCredentials: true });

                const reviewsData = reviewsRes.data;

                console.log("reviewsData", reviewsData);

                const mappedReviews: Review[] = Array.isArray(reviewsData) ? reviewsData.map((r: any) => ({
                    id: r._id,
                    userId: r.user_id,
                    author: r.isAnonymous ? "Anonymous" : "Student",
                    initials: r.isAnonymous ? "A" : "S",
                    rating: r.rating || 5,
                    timeAgo: new Date(r.createdAt).toLocaleDateString(),
                    content: r.comment || ""
                })) : [];

                setCourse(mappedCourse);
                setReviews(mappedReviews);

            } catch (error) {
                console.error("Failed to fetch course", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCourse();
    }, [courseId]);


    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex items-center justify-center h-[calc(100vh-80px)]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
                    <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
                    <p className="text-gray-500 mt-2">The course you are looking for does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Navbar />

            {/* Hero Section */}
            <div className="relative bg-[#1c1d1f] text-white">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-800/80 pointer-events-none"></div>

                <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-16 lg:py-20 lg:flex lg:gap-12">
                    <div className="lg:w-[65%]">
                        {/* Breadcrumbs */}
                        <div className="text-sm font-medium text-blue-200 flex items-center gap-2 mb-6">
                            {course.category.map((cat, idx) => (
                                <span key={idx} className="flex items-center">
                                    <span className="hover:text-white cursor-pointer transition-colors hover:underline decoration-blue-200/50 underline-offset-4">{cat}</span>
                                    {idx < course.category.length - 1 && <span className="ml-2 text-gray-500 text-xs">›</span>}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-3xl lg:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
                            {course.title}
                        </h1>

                        <p className="text-lg text-gray-200 mb-8 leading-relaxed max-w-3xl">
                            {course.subtitle}
                        </p>

                        <div className="flex items-center flex-wrap gap-4 mb-8 text-sm">
                            <span className="bg-[#eceb98] text-[#3d3c0a] px-3 py-1 font-bold text-xs uppercase rounded-sm shadow-sm tracking-wide">Bestseller</span>
                            <span className="text-[#f3ca8c] font-bold flex items-center gap-1.5">
                                <span className="text-base">{course.rating}</span>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-[#f3ca8c]" />)}
                                </div>
                            </span>
                            <span className="text-blue-200 underline cursor-pointer hover:text-white decoration-blue-200/30 underline-offset-4 pointer-events-auto">({course.totalRatings.toLocaleString()} ratings)</span>
                            <span className="text-gray-300 pointer-events-none">•</span>
                            <span className="font-medium">{course.students.toLocaleString('en-IN')} students</span>
                        </div>

                        <div className="mb-8 text-sm flex items-center gap-2">
                            <span className="text-gray-300">Created by</span>
                            <span className="text-blue-200 underline cursor-pointer hover:text-white transition-colors decoration-blue-200/30 underline-offset-4 font-medium">{course.instructors[0].name}</span>
                        </div>

                        <div className="flex items-center flex-wrap gap-6 text-sm text-gray-300 font-medium">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Last updated {course.lastUpdated}
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                {course.language}
                            </div>
                        </div>

                        {/* Mobile Video Preview */}
                        <div className="mt-10 lg:hidden">
                            <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-700/50 relative group">
                                <img src={course.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                                        <Play className="w-5 h-5 text-gray-900 fill-gray-900 ml-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-6 py-12 flex lg:flex-row flex-col items-start gap-12 relative">

                <div className="flex-1 w-full lg:max-w-[65%]">

                    {/* What you'll learn */}
                    <div className="border border-gray-200 p-8 mb-12 rounded-xl bg-gray-50/50">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">What you'll learn</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            {course.whatYouWillLearn.map((item, idx) => (
                                <div key={idx} className="flex items-start text-sm text-gray-700 leading-relaxed gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-gray-900 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Curriculum */}
                    <div className="mb-14">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">Course Content</h2>
                        <CourseCurriculum sections={course.sections} />
                    </div>

                    {/* Requirements */}
                    <div className="mb-14">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">Requirements</h2>
                        <ul className="space-y-3 text-gray-700 text-sm list-inside">
                            {course.requirements.map((req, i) => (
                                <li key={i} className="flex items-start gap-3 pl-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 shrink-0" />
                                    <span className="leading-relaxed">{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Description */}
                    <div className="mb-14">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">Description</h2>
                        <div className="text-sm text-gray-700 leading-7 space-y-4" dangerouslySetInnerHTML={{ __html: course.description }}></div>
                    </div>

                    {/* Instructor */}
                    <div className="mb-14">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">Instructors</h2>
                        <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
                            <div className="text-lg font-bold text-indigo-600 underline decoration-indigo-200 underline-offset-4 mb-1">{course.instructors[0].name}</div>
                            <div className="text-gray-500 text-sm mb-6">{course.instructors[0].title}</div>

                            <div className="flex gap-6 items-start mb-6">
                                <img src={course.instructors[0].avatar} alt={course.instructors[0].name} className="w-28 h-28 rounded-full object-cover border-4 border-gray-50 shadow-inner" />
                                <ul className="text-sm text-gray-700 space-y-2 mt-2">
                                    <li className="flex items-center gap-2"><Star className="w-4 h-4 fill-gray-900 text-gray-900" /> {course.instructors[0].rating} Instructor Rating</li>
                                    <li className="flex items-center gap-2"><Award className="w-4 h-4 text-gray-700" /> {course.instructors[0].students.toLocaleString('en-IN')} Students</li>
                                    <li className="flex items-center gap-2"><Play className="w-4 h-4 text-gray-700 fill-gray-700" /> {course.instructors[0].courses} Courses</li>
                                </ul>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">{course.instructors[0].bio}</p>
                        </div>
                    </div>

                    {/* Reviews */}
                    <CourseReviews courseTitle={course.title} reviewsList={reviews} />

                </div>

                <CourseSidebar course={course} />
            </div>

            <div className="h-5"></div> {/* Spacer */}

            <MobileAction course={course} />
        </div>
    );
};

export default CourseDetailPage;