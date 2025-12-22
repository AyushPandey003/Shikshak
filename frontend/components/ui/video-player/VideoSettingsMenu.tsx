import React from 'react';
import { Settings } from 'lucide-react';

interface VideoSettingsMenuProps {
    showSettings: boolean;
    setShowSettings: (show: boolean) => void;
    playbackSpeed: number;
    onChangeSpeed: (speed: number) => void;
    quality: string;
    onChangeQuality: (quality: string) => void;
}

const VideoSettingsMenu: React.FC<VideoSettingsMenuProps> = ({ 
    showSettings, setShowSettings, playbackSpeed, onChangeSpeed, quality, onChangeQuality 
}) => {
    return (
        <div className="relative">
            <button 
                onClick={() => setShowSettings(!showSettings)} 
                className={`text-white/90 hover:text-indigo-400 transition-colors transform p-1 ${showSettings ? 'rotate-90 text-indigo-400' : ''}`}
            >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5"/>
            </button>
            
            {/* Settings Menu */}
            {showSettings && (
                <div className="absolute bottom-10 right-0 bg-white rounded-xl p-3 w-48 sm:w-56 shadow-2xl border border-gray-100 text-sm animate-in fade-in slide-in-from-bottom-2 z-50">
                    {/* Speed Section */}
                    <div className="pb-3 border-b border-gray-100 mb-3">
                        <div className="px-2 py-1 text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Speed</div>
                        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                        {[0.5, 1, 1.5, 2].map(s => (
                            <button 
                                key={s}
                                onClick={() => onChangeSpeed(s)}
                                className={`flex-1 py-1.5 rounded-md text-[10px] sm:text-xs font-bold transition-all ${playbackSpeed === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
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
                                onClick={() => onChangeQuality(q)}
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
    );
};

export default VideoSettingsMenu;
