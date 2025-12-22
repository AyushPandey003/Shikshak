import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, Settings, Loader2 } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [quality, setQuality] = useState('1080p'); // Mock quality state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Scrubbing State
  const [isScrubbing, setIsScrubbing] = useState(false);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)); // Clamp between 0 and 1
    const newTime = pos * duration;
    
    // Only update video time if we are clicking, or if we are scrubbing
    if (!isScrubbing) {
        videoRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  // Handle Dragging/Scrubbing
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsScrubbing(true);
    handleSeek(e); // Update immediately on click
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isScrubbing && progressBarRef.current && videoRef.current) {
        const rect = progressBarRef.current.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newTime = pos * duration;
        setCurrentTime(newTime); // Visual update only while dragging
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isScrubbing && videoRef.current) {
        setIsScrubbing(false);
        // Commit the change on mouse up
        if(progressBarRef.current) {
            const rect = progressBarRef.current.getBoundingClientRect();
            const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const newTime = pos * duration;
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
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
  }, [isScrubbing, duration]);

  // Update time from video ONLY if not scrubbing
  useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const onTimeUpdate = () => {
          if (!isScrubbing) {
              setCurrentTime(video.currentTime);
          }
      };
      video.addEventListener('timeupdate', onTimeUpdate);
      return () => video.removeEventListener('timeupdate', onTimeUpdate);
  }, [isScrubbing]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      videoRef.current.muted = newMutedState;
      if (!newMutedState && volume === 0) {
        setVolume(0.5);
        videoRef.current.volume = 0.5;
      }
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const changeSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSettings(false);
    }
  };

  const changeQuality = (q: string) => {
    setQuality(q);
    // In a real app, this would switch sources and resume playback at current time
    setShowSettings(false);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-black overflow-hidden shadow-2xl group ring-1 ring-white/10 ${isFullscreen ? 'rounded-none' : 'rounded-lg'}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain cursor-pointer"
        poster={poster}
        onClick={togglePlay}
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Loader2 className="w-12 h-12 text-white/50 animate-spin" />
        </div>
      )}

      {/* Big Play Button Overlay */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
          <button 
            onClick={togglePlay}
            className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-indigo-600/90 shadow-2xl ring-1 ring-white/20"
          >
             <Play className="w-8 h-8 text-white fill-white ml-2" />
          </button>
        </div>
      )}

      {/* Controls Bar */}
      <div className={`
        absolute bottom-0 left-0 right-0 p-4 pt-16 bg-gradient-to-t from-black/90 via-black/60 to-transparent 
        transition-opacity duration-300
        ${!isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
      `}>
        {/* Progress Bar with Scrubbing */}
        <div 
          ref={progressBarRef}
          className="relative w-full h-1.5 bg-white/30 rounded-full mb-4 cursor-pointer hover:h-2.5 transition-all group/progress"
          onMouseDown={handleMouseDown}
        >
          <div 
            className="h-full bg-indigo-500 rounded-full relative"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          >
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg ${isScrubbing ? 'scale-100' : 'scale-0 group-hover/progress:scale-100'} transition-transform duration-200`} />
          </div>
        </div>

        <div className="flex items-center justify-between z-20 relative">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-4">
                <button 
                  onClick={() => skip(-10)} 
                  className="text-white/90 hover:text-indigo-400 transition-colors transform hover:scale-110"
                  title="-10s"
                >
                  <SkipBack className="w-5 h-5"/>
                </button>
                
                <button 
                  onClick={togglePlay} 
                  className="text-white hover:text-indigo-400 transition-colors transform hover:scale-110"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-white"/>
                  ) : (
                    <Play className="w-7 h-7 fill-white"/>
                  )}
                </button>
                
                <button 
                  onClick={() => skip(10)} 
                  className="text-white/90 hover:text-indigo-400 transition-colors transform hover:scale-110"
                  title="+10s"
                >
                  <SkipForward className="w-5 h-5"/>
                </button>
             </div>
             
             {/* Volume Control */}
             <div className="flex items-center gap-2 group/vol">
                <button onClick={toggleMute} className="text-white/90 hover:text-indigo-400 transition-colors">
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5"/> : <Volume2 className="w-5 h-5"/>}
                </button>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={isMuted ? 0 : volume} 
                  onChange={handleVolumeChange}
                  className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-300 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                />
             </div>

             <div className="flex items-center gap-2 text-white text-sm font-medium font-mono tracking-wider ml-2 select-none">
                <span>{formatTime(currentTime)}</span>
                <span className="text-white/40">/</span>
                <span>{formatTime(duration || 0)}</span>
             </div>
          </div>

          <div className="flex items-center gap-4 relative">
            
            {/* Settings Menu Trigger */}
            <div className="relative">
              <button 
                onClick={() => setShowSettings(!showSettings)} 
                className={`text-white/90 hover:text-indigo-400 transition-colors transform ${showSettings ? 'rotate-90 text-indigo-400' : ''}`}
              >
                <Settings className="w-5 h-5"/>
              </button>
              
              {/* Settings Menu - White Theme */}
              {showSettings && (
                <div className="absolute bottom-12 right-0 bg-white rounded-xl p-3 w-56 shadow-2xl border border-gray-100 text-sm animate-in fade-in slide-in-from-bottom-2 z-50">
                   {/* Speed Section */}
                   <div className="pb-3 border-b border-gray-100 mb-3">
                      <div className="px-2 py-1 text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Speed</div>
                      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                        {[0.5, 1, 1.5, 2].map(s => (
                          <button 
                            key={s}
                            onClick={() => changeSpeed(s)}
                            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${playbackSpeed === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>
                   </div>
                   
                   {/* Quality Section (Mock) */}
                   <div>
                      <div className="px-2 py-1 text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Quality</div>
                      <div className="space-y-0.5">
                        {['1080p', '720p', '480p'].map(q => (
                           <button 
                            key={q} 
                            onClick={() => changeQuality(q)}
                            className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${quality === q ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                           >
                              <span>{q}</span>
                              {quality === q && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                           </button>
                        ))}
                      </div>
                   </div>
                </div>
              )}
            </div>

            <button onClick={toggleFullscreen} className="text-white/90 hover:text-indigo-400 transition-colors">
              {isFullscreen ? <Minimize className="w-5 h-5"/> : <Maximize className="w-5 h-5"/>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
