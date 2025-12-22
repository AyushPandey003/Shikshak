import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Maximize, Minimize, SkipBack, SkipForward, Loader2 } from 'lucide-react';
import VideoProgressBar from './video-player/VideoProgressBar';
import VideoVolumeControl from './video-player/VideoVolumeControl';
import VideoSettingsMenu from './video-player/VideoSettingsMenu';
import VideoPlayOverlay from './video-player/VideoPlayOverlay';

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
  
  // Note: progressBarRef and isScrubbing state moved to VideoProgressBar component
  // We just need to handle updates from it.

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


  // Controls Visibility State
  const [showControls, setShowControls] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleUserActivity = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
        }, 3000);
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    // If clicking on controls, don't toggle
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;
    
    // Toggle controls on click/tap
    setShowControls(prev => !prev);
    if (!showControls) {
        // If we are showing them, set the auto-hide timer
        handleUserActivity();
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
        setShowControls(false);
    }
  };

  // Reset timer on play/pause
  useEffect(() => {
      if(isPlaying) {
          handleUserActivity();
      } else {
          setShowControls(true); // Always show when paused
          if(controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      }
  }, [isPlaying]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-black overflow-hidden shadow-2xl group ring-1 ring-white/10 ${isFullscreen ? 'rounded-none' : 'rounded-lg'}`}
      onContextMenu={(e) => e.preventDefault()}
      onMouseMove={handleUserActivity}
      onMouseLeave={handleMouseLeave}
      onClick={handleContainerClick} // Handle Tap/Click for visibility
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain cursor-pointer"
        poster={poster}
        // onClick handled by container to toggle UI
        playsInline
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <Loader2 className="w-12 h-12 text-white/50 animate-spin" />
        </div>
      )}

      {/* Big Play Button Overlay */}
      <VideoPlayOverlay 
        isPlaying={isPlaying} 
        isLoading={isLoading} 
        showControls={showControls} 
        onTogglePlay={(e) => { e.stopPropagation(); togglePlay(); }} 
      />

      {/* Controls Bar */}
      <div 
        className={`
            absolute bottom-0 left-0 right-0 p-3 sm:p-4 pt-16 bg-gradient-to-t from-black/90 via-black/60 to-transparent 
            transition-opacity duration-300 z-30
            ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={(e) => e.stopPropagation()} // Prevent container click when interacting with bar
      >
        {/* Progress Bar with Scrubbing */}
        <VideoProgressBar 
            currentTime={currentTime} 
            duration={duration} 
            videoRef={videoRef} 
            setParentCurrentTime={setCurrentTime}
        />

        <div className="flex items-center justify-between z-20 relative">
          <div className="flex items-center gap-2 sm:gap-6">
             <div className="flex items-center gap-2 sm:gap-4">
                <button 
                  onClick={() => skip(-10)} 
                  className="text-white/90 hover:text-indigo-400 transition-colors transform active:scale-95 p-1"
                  title="-10s"
                >
                  <SkipBack className="w-4 h-4 sm:w-5 sm:h-5"/>
                </button>
                
                <button 
                  onClick={togglePlay} 
                  className="text-white hover:text-indigo-400 transition-colors transform active:scale-95 p-1"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 sm:w-7 sm:h-7 fill-white"/>
                  ) : (
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white"/>
                  )}
                </button>
                
                <button 
                  onClick={() => skip(10)} 
                  className="text-white/90 hover:text-indigo-400 transition-colors transform active:scale-95 p-1"
                  title="+10s"
                >
                  <SkipForward className="w-4 h-4 sm:w-5 sm:h-5"/>
                </button>
             </div>
             
             {/* Volume Control */}
             <VideoVolumeControl 
                volume={volume} 
                isMuted={isMuted} 
                onVolumeChange={handleVolumeChange} 
                onToggleMute={toggleMute} 
             />

             <div className="flex items-center gap-1 sm:gap-2 text-white text-[10px] sm:text-sm font-medium font-mono tracking-wider ml-1 sm:ml-2 select-none">
                <span>{formatTime(currentTime)}</span>
                <span className="text-white/40">/</span>
                <span>{formatTime(duration || 0)}</span>
             </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 relative">
            
            {/* Settings Menu */}
            <VideoSettingsMenu 
                showSettings={showSettings} 
                setShowSettings={setShowSettings} 
                playbackSpeed={playbackSpeed} 
                onChangeSpeed={changeSpeed} 
                quality={quality} 
                onChangeQuality={changeQuality} 
            />

            <button onClick={toggleFullscreen} className="text-white/90 hover:text-indigo-400 transition-colors p-1">
              {isFullscreen ? <Minimize className="w-4 h-4 sm:w-5 sm:h-5"/> : <Maximize className="w-4 h-4 sm:w-5 sm:h-5"/>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
