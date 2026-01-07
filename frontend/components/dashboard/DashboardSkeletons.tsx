import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export const ProfileStatsSkeleton = () => {
    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm h-auto md:min-h-[650px] flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-7 w-24 rounded-lg" />
            </div>

            <div className="flex flex-col justify-center items-center flex-1 w-full gap-8">
                {/* Profile Info */}
                <div className="flex flex-col items-center gap-3">
                    <div className="relative w-28 h-28 mb-3">
                        <Skeleton className="w-full h-full rounded-full" />
                    </div>
                    <Skeleton className="h-8 w-48 rounded-lg" />
                </div>

                {/* Stats List */}
                <div className="flex flex-col gap-4 w-full">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex flex-row items-center gap-4 p-2 relative w-full bg-gray-50 rounded-xl">
                            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                            <div className="flex flex-col items-start gap-2 flex-1">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const CourseListSkeleton = () => {
    return (
        <div className="bg-[#FF6B6B]/10 rounded-[2rem] p-8 relative overflow-hidden h-auto md:min-h-[650px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <Skeleton className="h-8 w-40 bg-gray-300" />
                <Skeleton className="h-9 w-24 rounded-full bg-gray-300" />
            </div>

            {/* Cards List - Show fewer items to simulate list */}
            <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-[1.5rem] p-5 shadow-sm flex flex-col gap-3">
                        <div>
                            <Skeleton className="h-6 w-3/4 mb-3" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-4 h-4" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <Skeleton className="w-8 h-8 rounded-lg" />
                            <div className="flex flex-col gap-1">
                                <Skeleton className="h-2 w-12" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const LoadingDashboard = () => {
  return (
    // Replicates the DashboardLayout grid for loading state
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
          {/* Left Column (Profile) */}
          <div className="lg:col-span-4 h-full"> 
             <ProfileStatsSkeleton />
          </div>

          {/* Right Column (Courses) */}
          <div className="lg:col-span-8 h-full">
            <CourseListSkeleton />
          </div>
       </div>
    </div>
  )
}
