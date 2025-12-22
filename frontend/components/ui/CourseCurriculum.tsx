import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play, FileText } from 'lucide-react';
import { Section } from '@/types/coursedet';

interface CourseCurriculumProps {
    sections: Section[];
}

const CourseCurriculum: React.FC<CourseCurriculumProps> = ({ sections }) => {
    const [expandedAll, setExpandedAll] = useState(false);
    const [openSections, setOpenSections] = useState<string[]>(sections.slice(0, 1).map(s => s.id)); // Open first by default

    const toggleSection = (id: string) => {
        if (openSections.includes(id)) {
            setOpenSections(openSections.filter(sid => sid !== id));
        } else {
            setOpenSections([...openSections, id]);
        }
    };

    const toggleAll = () => {
        if (expandedAll) {
            setOpenSections([]);
        } else {
            setOpenSections(sections.map(s => s.id));
        }
        setExpandedAll(!expandedAll);
    };

    const totalLectures = sections.reduce((acc, s) => acc + s.lectures.length, 0);

    return (
        <div className="mb-12">


            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div>{sections.length} sections • {totalLectures} lectures </div>
                <button onClick={toggleAll} className="text-blue-700 font-bold cursor-pointer hover:text-blue-800">
                    {expandedAll ? 'Collapse all sections' : 'Expand all sections'}
                </button>
            </div>

            <div className="border border-gray-200 rounded-sm">
                {sections.map((section, idx) => (
                    <div key={section.id} className="border-b border-gray-200 last:border-none">
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full cursor-pointer flex items-center justify-between px-4 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                        >
                            <div className="flex items-center gap-4">
                                {openSections.includes(section.id) ? (
                                    <ChevronUp className="w-4 h-4 text-gray-700" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-700" />
                                )}
                                <span className="font-bold text-gray-800">{section.title}</span>
                            </div>
                            <span className="text-sm text-gray-500 hidden sm:block">
                                {section.lectures.length} lectures • {section.lectures.length * 15}min
                            </span>
                        </button>

                        {openSections.includes(section.id) && (
                            <div className="bg-white">
                                {section.lectures.map((lecture) => (
                                    <div key={lecture.id} className="flex items-center justify-between px-8 py-3 hover:bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            {lecture.type === 'video' ? (
                                                <Play className="w-3.5 h-3.5 text-gray-500 fill-gray-500" />
                                            ) : (
                                                <FileText className="w-3.5 h-3.5 text-gray-500" />
                                            )}
                                            <span className="text-sm text-gray-700 hover:underline cursor-pointer decoration-blue-700 hover:text-blue-700">
                                                {lecture.title}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            {lecture.isPreview && (
                                                <span className="text-blue-700 underline cursor-pointer">Preview</span>
                                            )}
                                            <span className="w-10 text-right">{lecture.duration}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseCurriculum;