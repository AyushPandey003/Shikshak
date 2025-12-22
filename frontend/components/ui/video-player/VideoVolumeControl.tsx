import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VideoVolumeControlProps {
    volume: number;
    isMuted: boolean;
    onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onToggleMute: () => void;
}

const VideoVolumeControl: React.FC<VideoVolumeControlProps> = ({ volume, isMuted, onVolumeChange, onToggleMute }) => {
    return (
        <div className="hidden xs:flex items-center gap-2 group/vol">
            <button onClick={onToggleMute} className="text-white/90 hover:text-indigo-400 transition-colors p-1">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5"/> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5"/>}
            </button>
            <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                value={isMuted ? 0 : volume} 
                onChange={onVolumeChange}
                className="w-16 sm:w-0 overflow-hidden sm:group-hover/vol:w-20 transition-all duration-300 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
            />
        </div>
    );
};

export default VideoVolumeControl;
