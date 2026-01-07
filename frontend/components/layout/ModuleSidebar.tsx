import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play, FileText, CheckCircle2, Circle, X, Check, HelpCircle, ClipboardList, Sparkles } from 'lucide-react'; // Added icons
import { Section } from '@/types/coursedet';

interface ModuleSidebarProps {
    sections: Section[];
    activeLectureId?: string;
    onLectureSelect: (lectureId: string) => void;
    courseTitle: string;
    onClose?: () => void;
    onOpenAI?: () => void;
}

const ModuleSidebar: React.FC<ModuleSidebarProps> = ({ sections, activeLectureId, onLectureSelect, courseTitle, onClose, onOpenAI }) => {
    // Open all sections by default or just the active one
    const getActiveSectionId = () => {
        if (!activeLectureId) return sections[0]?.id;
        const section = sections.find(s => s.lectures.some(l => l.id === activeLectureId));
        return section ? section.id : sections[0]?.id;
    };

    const [openSections, setOpenSections] = useState<string[]>([getActiveSectionId()]);

    const toggleSection = (id: string) => {
        if (openSections.includes(id)) {
            setOpenSections(openSections.filter(sid => sid !== id));
        } else {
            setOpenSections([...openSections, id]);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'video':
                return <Play className="w-3 h-3 fill-gray-500" />;
            case 'reading':
            case 'article':
                return <FileText className="w-3 h-3" />;
            case 'quiz':
                return <HelpCircle className="w-3 h-3" />;
            case 'assignment':
                return <ClipboardList className="w-3 h-3" />;
            default:
                return <FileText className="w-3 h-3" />;
        }
    };

    const getLabel = (type: string) => {
        switch (type) {
            case 'video': return 'Video';
            case 'article': return 'Reading';
            case 'reading': return 'Reading';
            case 'quiz': return 'Quiz';
            case 'assignment': return 'Assignment';
            default: return 'Item';
        }
    };

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-[2px_0_5px_rgba(0,0,0,0.03)] font-sans">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 flex items-start justify-between bg-white shrink-0">
                <h2 className="font-bold text-gray-900 text-lg leading-snug line-clamp-2 mr-2">
                    {courseTitle}
                </h2>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {sections.map((section, idx) => (
                    <div key={section.id} className="border-b border-gray-100 last:border-none">

                        {/* Section Header */}
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full cursor-pointer flex items-center justify-between px-4 py-4 bg-[#fcfcfc] hover:bg-gray-100 transition-colors text-left group border-l-4 border-transparent"
                        >
                            <div className="flex-1">
                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Module {idx + 1}</span>
                                <span className="font-bold text-[15px] text-gray-800 leading-tight group-hover:text-[#FF6B6B] transition-colors">
                                    {section.title}
                                </span>
                            </div>
                            {openSections.includes(section.id) ? (
                                <ChevronUp className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                            )}
                        </button>

                        {/* Lectures List */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections.includes(section.id) ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="py-1">
                                {section.lectures.map((lecture, lIdx) => {
                                    const isActive = lecture.id === activeLectureId;
                                    const isCompleted = true; // logic would go here

                                    return (
                                        <div
                                            key={lecture.id}
                                            onClick={() => onLectureSelect(lecture.id)}
                                            className={`
                                                relative flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors
                                                ${isActive ? 'bg-[#fff0f0] border-l-4 border-[#FF6B6B]' : 'hover:bg-gray-50 border-l-4 border-transparent'}
                                            `}
                                        >
                                            <div className="mt-1 flex items-center justify-center flex-shrink-0">
                                                {isCompleted ? (
                                                    <div className="w-5 h-5 rounded-full bg-[#1f7b44] flex items-center justify-center">
                                                        <Check className="w-3 h-3 text-white stroke-[3]" />
                                                    </div>
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className={`text-[14px] font-medium mb-1 leading-snug ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                                                    {lecture.title}
                                                </p>
                                                <div className="flex items-center gap-2 text-[12px] text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        {getIcon(lecture.type)}
                                                        {getLabel(lecture.type)} • {lecture.duration}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Assistant Button (Mobile Sidebar) */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 lg:hidden">
                <button
                    onClick={onOpenAI}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#FF6B6B] to-[#ff8f8f] text-white rounded-xl shadow-md active:scale-95 transition-all font-bold"
                >
                    <Sparkles className="w-5 h-5" />
                    <span>Ask AI Assistant</span>
                </button>
            </div>
        </div>
    );
};

export default ModuleSidebar;
