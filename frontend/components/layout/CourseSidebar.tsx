'use client';

import React, { useState } from 'react';
import { Heart, Share2, Loader2, CheckCircle } from 'lucide-react';
import { Course } from '@/types/coursedet';
import { useRazorpay } from '@/hooks/useRazorpay';
import { useRouter } from 'next/navigation';

interface CourseSidebarProps {
    course: Course;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({ course }) => {
    const router = useRouter();
    const { initiatePayment, loading, isLoggedIn } = useRazorpay();
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleBuyNow = () => {
        setError(null);

        if (!isLoggedIn) {
            router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
            return;
        }

        initiatePayment({
            courseId: course.id,
            courseName: course.title,
            onSuccess: (data) => {
                console.log('Payment successful:', data);
                setPaymentSuccess(true);
                // Redirect to course page or dashboard after a delay
                setTimeout(() => {
                    router.push(`/courses/${course.id}/learn`);
                }, 2000);
            },
            onError: (err) => {
                console.error('Payment error:', err);
                setError(err.message || 'Payment failed. Please try again.');
            }
        });
    };

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

                    {/* Success Message */}
                    {paymentSuccess && (
                        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                            <div>
                                <p className="text-sm font-semibold text-emerald-800">Enrollment Successful!</p>
                                <p className="text-xs text-emerald-600">Redirecting to your course...</p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <div className="space-y-3 mb-8">
                        <button
                            onClick={handleBuyNow}
                            disabled={loading || paymentSuccess}
                            className="w-full py-4 rounded-xl cursor-pointer bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : paymentSuccess ? (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Enrolled!
                                </>
                            ) : (
                                'Buy Now'
                            )}
                        </button>
                        <button className="w-full py-4 rounded-xl cursor-pointer bg-white border-2 border-gray-100 text-gray-700 font-bold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                            Add to Cart
                        </button>
                    </div>

                    <div className="text-center text-xs text-gray-400 mb-8 font-medium">
                        Secure Payment via Razorpay
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-gray-500">
                        <button className="text-sm font-semibold hover:text-gray-900 flex items-center cursor-pointer gap-2 transition-colors">
                            <Share2 className="w-4 h-4" /> Share
                        </button>
                        <button className="text-sm font-semibold hover:text-gray-900 flex items-center cursor-pointer gap-2 transition-colors">
                            <Heart className="w-4 h-4" /> Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseSidebar;