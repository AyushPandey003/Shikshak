import React, { useState } from 'react';
import { Skeleton } from './Skeleton';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  skeletonClassName?: string;
}

export const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({ 
  className, 
  skeletonClassName,
  alt,
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative ${className} overflow-hidden bg-gray-100`}>
      {/* Skeleton - Always rendered behind to prevent flash of empty background during fade */}
      {isLoading && (
         <Skeleton 
             className={`absolute inset-0 w-full h-full z-0 ${skeletonClassName || ''}`} 
        />
      )}
      
      <img
        {...props}
        alt={alt}
        className={`w-full h-full object-cover relative z-10 transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};
