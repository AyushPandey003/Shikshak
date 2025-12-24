import React from 'react';
import { ArrowLeft, BookOpen, CheckCircle2, Pencil, Plus, X } from 'lucide-react';
import { SidebarRecommendation } from './types';

interface GuidedStep {
    id: number;
    title: string;
    completed: boolean;
    active: boolean;
}

interface CreationSidebarProps {
    onBack: () => void;
    guidedSteps: GuidedStep[];
    recommendations: SidebarRecommendation[];
    onAddRecommendation: (recId: string) => void;
    className?: string;
    onClose?: () => void;
    courseTitle?: string;
}

export function CreationSidebar({ 
    onBack, 
    guidedSteps, 
    recommendations, 
    onAddRecommendation,
    className = '',
    onClose,
    courseTitle
}: CreationSidebarProps) {
  return (
    <div className={`w-full md:w-[360px] flex-shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col overflow-y-auto h-full ${className}`}>
        {/* Header */}
        <div className="p-6 pb-2">
            <div className="flex items-center justify-between mb-6">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                    <X size={20} />
                    <span className="text-sm font-medium">Close Guide</span>
                </button>
                {/* Mobile Close Button */}
                <button 
                    onClick={onClose}
                    className="md:hidden p-2 -mr-2 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>
            </div>
            <div className="flex items-center gap-3 mb-1">
                 <div className="w-8 h-8 bg-blue-100 rounded md-1 overflow-hidden flex items-center justify-center text-blue-600">
                    <BookOpen size={16} />
                 </div>
                 <div>
                     <h2 className="font-semibold text-gray-900 text-sm">{courseTitle || 'Untitled Course'}</h2>
                     <span className="text-xs bg-yellow-600 text-white px-1.5 py-0.5 rounded text-[10px] font-medium">Draft</span>
                 </div>
            </div>
        </div>

        <div className="px-6 py-4">
            <h3 className="font-bold text-gray-900 mb-6">Course Builder Guide</h3>

            <div className="space-y-6">
                
                {/* Step 1 */}
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                    <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">Create Structure</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Start by adding <strong>Modules</strong> to organize your course into sections or weeks.
                        </p>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                    <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">Upload Content</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Click <strong>Add Item</strong> inside a module to upload:
                        </p>
                        <ul className="mt-2 space-y-1">
                            <li className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Videos (.mp4)
                            </li>
                            <li className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span> Study Materials (PDF/Img)
                            </li>
                            <li className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Readings/Quizzes (.md)
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                    <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">Refine & Organize</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            <strong>Drag and drop</strong> to reorder items. Click the <Pencil size={12} className="inline text-blue-500"/> icon to edit titles.
                        </p>
                    </div>
                </div>

            </div>

             {/* Recommendations Section (kept small if needed, offering quick adds) */}
             {recommendations.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-4">Suggested Modules</h4>
                     <div className="space-y-3">
                        {recommendations.map(rec => (
                            <div 
                                key={rec.id} 
                                className="bg-white border border-gray-200 rounded p-2.5 relative group hover:border-blue-300 transition-colors cursor-pointer shadow-sm"
                                onClick={() => onAddRecommendation(rec.id)}
                            >
                                <div className="absolute top-2 right-2 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-opacity">
                                    <Plus size={16} />
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-4 h-4 bg-purple-100 rounded text-[8px] flex items-center justify-center">📦</div>
                                    <span className="text-[10px] font-medium text-gray-500 uppercase">{rec.source}</span>
                                </div>
                                <p className="font-medium text-gray-800 text-xs mb-1 line-clamp-1">{rec.title}</p>
                                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                    <span className="text-yellow-500 font-bold">★ {rec.rating}</span>
                                    <span>({rec.reviews})</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className="mt-auto p-4 border-t border-gray-200">
            <button onClick={onBack} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors text-center">
                Exit guide to continue authoring
            </button>
        </div>
    </div>
  );
}
