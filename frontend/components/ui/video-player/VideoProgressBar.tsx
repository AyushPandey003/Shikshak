import React, { useRef, useState, useEffect } from 'react';

interface VideoProgressBarProps {
    currentTime: number;
    duration: number;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    setParentCurrentTime: (time: number) => void;
    isScrubbing: boolean;
    setIsScrubbing: (isScrubbing: boolean) => void;
}

const VideoProgressBar: React.FC<VideoProgressBarProps> = ({ currentTime, duration, videoRef, setParentCurrentTime, isScrubbing, setIsScrubbing }) => {
    const progressBarRef = useRef<HTMLDivElement>(null);
    // Local state removed, using props


    const handleSeek = (clientX: number) => {
        if (!progressBarRef.current || !videoRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const newTime = pos * duration;
        
        if (!isScrubbing) {
            videoRef.current.currentTime = newTime;
        }
        setParentCurrentTime(newTime);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsScrubbing(true);
        handleSeek(e.clientX);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isScrubbing && progressBarRef.current && videoRef.current) {
                const rect = progressBarRef.current.getBoundingClientRect();
                const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                const newTime = pos * duration;
                setParentCurrentTime(newTime);
                videoRef.current.currentTime = newTime; // Live scrubbing
            }
        };

        const handleMouseUp = (e: MouseEvent) => {
            if (isScrubbing && videoRef.current && progressBarRef.current) {
                setIsScrubbing(false);
                const rect = progressBarRef.current.getBoundingClientRect();
                const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                const newTime = pos * duration;
                videoRef.current.currentTime = newTime;
                setParentCurrentTime(newTime);
            }
        };

        if (isScrubbing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isScrubbing, duration, videoRef, setParentCurrentTime]);

    return (
        <div 
          ref={progressBarRef}
          className="relative w-full h-1 sm:h-1.5 bg-white/30 rounded-full mb-3 sm:mb-4 cursor-pointer hover:h-2 sm:hover:h-2.5 transition-all group/progress"
          onMouseDown={handleMouseDown}
        >
          <div 
            className="h-full bg-indigo-500 rounded-full relative"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          >
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full shadow-lg ${isScrubbing ? 'scale-100' : 'scale-0 group-hover/progress:scale-100'} transition-transform duration-200`} />
          </div>
        </div>
    );
};

export default VideoProgressBar;
