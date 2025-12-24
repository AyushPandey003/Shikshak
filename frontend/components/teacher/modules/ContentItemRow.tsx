import React from 'react';
import { Clock, GripVertical, Trash2, PlayCircle, BookOpen, HelpCircle, FileQuestion, Pencil, FileText } from 'lucide-react';
import { ContentItem } from '../../../types/moduletypes';

interface ContentItemRowProps {
    item: ContentItem;
    moduleId: string;
    isDragging: boolean;
    editingId: string | null;
    editValue: string;
    onStartConfirmEdit: (id: string, title: string) => void;
    onEditValueChange: (val: string) => void;
    onSaveEdit: (id: string, parentId: string) => void;
    onDelete: (moduleId: string, itemId: string) => void;
    onEdit: (item: ContentItem, parentId: string) => void;
    onDragStart: (e: React.DragEvent, id: string, type: 'item', parentId: string) => void;
    onDragEnter: (e: React.DragEvent, id: string, type: 'item', parentId: string) => void;
    onDragEnd: () => void;
}

export function ContentItemRow({
    item,
    moduleId,
    isDragging,
    editingId,
    editValue,
    onStartConfirmEdit,
    onEditValueChange,
    onSaveEdit,
    onDelete,
    onEdit,
    onDragStart,
    onDragEnter,
    onDragEnd
}: ContentItemRowProps) {
    return (
        <div
            className={`p-2 md:p-4 hover:bg-gray-50 flex items-center gap-1 md:gap-4 group transition-colors ${isDragging ? 'bg-gray-100 opacity-50' : 'bg-white'}`}
            draggable
            onDragStart={(e) => onDragStart(e, item.id, 'item', moduleId)}
            onDragEnter={(e) => onDragEnter(e, item.id, 'item', moduleId)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => e.preventDefault()}
        >
            <div className="cursor-move text-gray-300 hover:text-gray-500 flex-shrink-0" title="Drag to reorder">
                <GripVertical size={14} className="md:w-4 md:h-4" />
            </div>

            <div className="text-gray-700 flex-shrink-0">
                {item.type === 'video' && <PlayCircle size={20} strokeWidth={1.5} className="text-blue-500 md:w-6 md:h-6" />}
                {item.type === 'reading' && <BookOpen size={20} strokeWidth={1.5} className="text-emerald-500 md:w-6 md:h-6" />}
                {item.type === 'quiz' && <HelpCircle size={20} strokeWidth={1.5} className="text-orange-500 md:w-6 md:h-6" />}
                {item.type === 'assignment' && <FileQuestion size={20} strokeWidth={1.5} className="text-purple-500 md:w-6 md:h-6" />}
                {item.type === 'material' && <FileText size={20} strokeWidth={1.5} className="text-pink-500 md:w-6 md:h-6" />}
            </div>

            <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-center justify-between gap-1">
                    <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex items-center gap-1 md:gap-2 flex-wrap md:flex-nowrap">
                            <span className="font-bold text-gray-500 text-[9px] md:text-xs uppercase tracking-tight md:tracking-wider flex-shrink-0">{item.type}</span>

                            {editingId === item.id ? (
                                <input
                                    autoFocus
                                    className="font-medium text-gray-900 text-xs md:text-sm bg-white border border-blue-400 rounded px-1 outline-none w-full"
                                    value={editValue}
                                    onChange={(e) => onEditValueChange(e.target.value)}
                                    onBlur={() => onSaveEdit(item.id, moduleId)}
                                    onKeyDown={(e) => e.key === 'Enter' && onSaveEdit(item.id, moduleId)}
                                />
                            ) : (
                                <span
                                    className="text-gray-900 text-xs md:text-sm truncate cursor-pointer hover:text-blue-600 hover:underline flex-1 min-w-0"
                                    onClick={() => onEdit(item, moduleId)}
                                    title="Click to edit"
                                >
                                    {item.title}
                                </span>
                            )}
                        </div>
                        {item.fileName && (
                            <div className="text-[10px] md:text-xs text-gray-400 mt-0.5 flex items-center gap-1 truncate">
                                <span className="truncate">📎 {item.fileName}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-0.5 md:gap-2 flex-shrink-0">
                        {item.duration && <span className="text-[10px] md:text-xs text-gray-500 hidden md:flex items-center gap-1"><Clock size={12} /> {item.duration}</span>}

                        <div className="flex items-center gap-0.5">
                            <button
                                onClick={() => onEdit(item, moduleId)}
                                className="text-gray-300 hover:text-blue-500 transition-colors p-0.5 md:p-1"
                                title="Edit item"
                            >
                                <Pencil size={13} className="md:w-[15px] md:h-[15px]" />
                            </button>
                            <button
                                onClick={() => onDelete(moduleId, item.id)}
                                className="text-gray-300 hover:text-red-500 transition-colors p-0.5 md:p-1"
                                title="Remove item"
                            >
                                <Trash2 size={14} className="md:w-4 md:h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
