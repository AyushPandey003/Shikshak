import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export const CoursesGridSkeleton = () => {
    return (
        <div className="w-full h-full pt-2 px-5 space-y-5">
            {/* Header Skeleton */}
            <div className="pb-5 w-full">
                <Skeleton className="h-9 w-48 mb-2" /> {/* Title */}
                <div className="flex items-center justify-between w-full bg-white pr-5 py-1">
                     <div className="flex items-center gap-1">
                        {[1, 2, 3, 4].map((i) => (
                             <Skeleton key={i} className="h-9 w-24 rounded-md bg-gray-100" />
                        ))}
                     </div>
                     <Skeleton className="h-5 w-24" />
                </div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[350px]">
                        {/* Image */}
                        <Skeleton className="w-full h-48 bg-gray-200" />
                        
                        {/* Content */}
                        <div className="p-4 flex flex-col justify-between flex-1">
                           <div className="space-y-2">
                               <div className="flex justify-between">
                                  <Skeleton className="h-3 w-16 rounded-full" />
                                  <Skeleton className="h-3 w-16 rounded-full" />
                               </div>
                               <Skeleton className="h-6 w-3/4" />
                               <div className="flex items-center gap-2">
                                  <Skeleton className="w-6 h-6 rounded-full" />
                                  <Skeleton className="h-3 w-24" />
                               </div>
                           </div>
                           
                           <div className="flex justify-between items-center mt-4">
                               <Skeleton className="h-6 w-20 bg-gray-200" />
                               <Skeleton className="h-8 w-8 rounded-full" />
                           </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
