import React from 'react';
import { Play, Pause, Volume2, Maximize, SkipBack, SkipForward, Settings } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster }) => {
  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden shadow-2xl group ring-1 ring-white/10">
      {/* Placeholder for actual video tag */}
      <img 
        src={poster || "/api/placeholder/800/450"} 
        alt="Video poster" 
        className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
      />
      
      {/* Overlay - Play Button (Center) */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors duration-300">
        <button className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-indigo-600/90 group-hover:w-24 group-hover:h-24 shadow-2xl ring-1 ring-white/20 hover:ring-indigo-400">
           <Play className="w-8 h-8 text-white fill-white ml-1.5 transition-transform duration-300 group-hover:scale-110" />
        </button>
      </div>

      {/* Controls Bar (Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/20 rounded-full mb-5 cursor-pointer hover:h-2 transition-all group/progress">
          <div className="w-1/3 h-full bg-indigo-500 rounded-full relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform duration-200"></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-4">
                <button className="text-white/90 hover:text-indigo-400 transition-colors transform hover:scale-110"><SkipBack className="w-5 h-5"/></button>
                <button className="text-white hover:text-indigo-400 transition-colors transform hover:scale-110"><Pause className="w-7 h-7 fill-white"/></button>
                <button className="text-white/90 hover:text-indigo-400 transition-colors transform hover:scale-110"><SkipForward className="w-5 h-5"/></button>
             </div>
             
             <div className="flex items-center gap-2 text-white text-sm font-medium font-mono tracking-wider ml-2">
                <span>12:30</span>
                <span className="text-white/40">/</span>
                <span>45:00</span>
             </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="text-white/90 hover:text-indigo-400 transition-colors"><Volume2 className="w-5 h-5"/></button>
            <button className="text-white/90 hover:text-indigo-400 transition-colors"><Settings className="w-5 h-5"/></button>
            <button className="text-white/90 hover:text-indigo-400 transition-colors"><Maximize className="w-5 h-5"/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
