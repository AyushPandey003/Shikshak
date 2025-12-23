import React from 'react';
import { Play } from 'lucide-react';

interface VideoPlayOverlayProps {
    isPlaying: boolean;
    isLoading: boolean;
    showControls: boolean;
    onTogglePlay: (e: React.MouseEvent) => void;
}

const VideoPlayOverlay: React.FC<VideoPlayOverlayProps> = ({ isPlaying, isLoading, showControls, onTogglePlay }) => {
    if (isPlaying || isLoading || !showControls) return null;

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-20 pointer-events-none">
            <button 
                onClick={onTogglePlay}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-indigo-600/90 shadow-2xl ring-1 ring-white/20 pointer-events-auto"
            >
                <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-white ml-2" />
            </button>
        </div>
    );
};

export default VideoPlayOverlay;
