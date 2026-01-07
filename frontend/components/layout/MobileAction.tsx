'use client';

import React, { useState } from 'react';
import { Course } from '@/types/coursedet';
import { useRazorpay } from '@/hooks/useRazorpay';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { CustomLoader } from '@/components/ui/CustomLoader';

interface MobileActionProps {
    course: Course;
}

const MobileAction: React.FC<MobileActionProps> = ({ course }) => {
    const router = useRouter();
    const { initiatePayment, loading, isLoggedIn } = useRazorpay();
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handleBuyNow = () => {
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
                setTimeout(() => {
                    router.push(`/courses/${course.id}/learn`);
                }, 2000);
            },
            onError: (err) => {
                console.error('Payment error:', err);
            }
        });
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 p-4 z-50 lg:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.04)] pb-[safe-area-inset-bottom]">
            <div className="flex items-center gap-4 max-w-lg mx-auto">
                <div className="flex flex-col">
                    <span className="text-2xl font-extrabold text-gray-900 leading-none">₹{course.price}</span>
                    <span className="text-xs text-gray-400 line-through mt-0.5">₹{course.originalPrice}</span>
                </div>
                <button
                    onClick={handleBuyNow}
                    disabled={loading || paymentSuccess}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-95 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <CustomLoader size={16} className="text-white" color="white" />
                            Processing...
                        </>
                    ) : paymentSuccess ? (
                        <>
                            <CheckCircle className="w-4 h-4" />
                            Enrolled!
                        </>
                    ) : (
                        'Buy now'
                    )}
                </button>
            </div>
        </div>
    );
}

export default MobileAction;
