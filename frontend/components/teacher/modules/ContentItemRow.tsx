import React from 'react';
import { Clock, GripVertical, Trash2, PlayCircle, BookOpen, HelpCircle, FileQuestion, Pencil, FileText } from 'lucide-react';
import { ContentItem } from './types';

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
    onDragStart,
    onDragEnter,
    onDragEnd
}: ContentItemRowProps) {
    return (
        <div 
            className={`p-3 md:p-4 hover:bg-gray-50 flex items-center gap-4 group transition-colors ${isDragging ? 'bg-gray-100 opacity-50' : 'bg-white'}`}
            draggable
            onDragStart={(e) => onDragStart(e, item.id, 'item', moduleId)}
            onDragEnter={(e) => onDragEnter(e, item.id, 'item', moduleId)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => e.preventDefault()}
        >
            <div className="cursor-move text-gray-300 hover:text-gray-500" title="Drag to reorder">
                <GripVertical size={16} />
            </div>

            <div className="text-gray-700">
                {item.type === 'video' && <PlayCircle size={24} strokeWidth={1.5} className="text-blue-500" />}
                {item.type === 'reading' && <BookOpen size={24} strokeWidth={1.5} className="text-emerald-500" />}
                {item.type === 'quiz' && <HelpCircle size={24} strokeWidth={1.5} className="text-orange-500" />}
                {item.type === 'assignment' && <FileQuestion size={24} strokeWidth={1.5} className="text-purple-500" />}
                {item.type === 'material' && <FileText size={24} strokeWidth={1.5} className="text-pink-500" />}
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-500 text-xs uppercase tracking-wider">{item.type}</span>
                        
                        {editingId === item.id ? (
                                <input 
                                autoFocus
                                className="font-medium text-gray-900 text-sm bg-white border border-blue-400 rounded px-1 outline-none w-full max-w-xs"
                                value={editValue}
                                onChange={(e) => onEditValueChange(e.target.value)}
                                onBlur={() => onSaveEdit(item.id, moduleId)}
                                onKeyDown={(e) => e.key === 'Enter' && onSaveEdit(item.id, moduleId)}
                                />
                        ) : (
                            <span 
                                className="text-gray-900 text-sm truncate cursor-pointer hover:text-blue-600 hover:underline"
                                onClick={() => onStartConfirmEdit(item.id, item.title)}
                                title="Click to edit"
                            >
                                {item.title}
                            </span>
                        )}
                        </div>
                        {item.fileName && (
                            <div className="text-xs text-gray-400 mt-0.5 ml-14 flex items-center gap-1">
                                <span className="truncate max-w-[200px]">📎 {item.fileName}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {item.duration && <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12}/> {item.duration}</span>}
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                            onClick={() => onStartConfirmEdit(item.id, item.title)}
                            className="text-gray-300 hover:text-blue-500 transition-colors p-1"
                            title="Edit item title"
                            >
                                <Pencil size={15} />
                            </button>
                            <button 
                            onClick={() => onDelete(moduleId, item.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                            title="Remove item"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
