import React from 'react';
import { ChevronDown, Clock, GripVertical, Plus, Sparkles, Trash2, Pencil } from 'lucide-react';
import { Module, ContentItem } from './types';
import { ContentItemRow } from './ContentItemRow';

interface ModuleCardProps {
    module: Module;
    index: number;
    isDragging: boolean;
    dragItemId: string | null; // ID of item currently being dragged to check if it's inside this module
    editingId: string | null;
    editValue: string;
    onToggle: (id: string) => void;
    onStartConfirmEdit: (id: string, title: string) => void;
    onEditValueChange: (val: string) => void;
    onSaveEdit: (id: string, type: 'module' | 'item', parentId?: string) => void;
    onDeleteModule: (id: string) => void;
    onDeleteItem: (moduleId: string, itemId: string) => void;
    onAddItem: (moduleId: string) => void;
    onDescriptionChange: (id: string, description: string) => void;
    onEditModule: (module: Module) => void;
    onEditItem: (item: ContentItem, parentId: string) => void;
    onDragStart: (e: React.DragEvent, id: string, type: 'module' | 'item', parentId?: string) => void;
    onDragEnter: (e: React.DragEvent, id: string, type: 'module' | 'item', parentId?: string) => void;
    onDragEnd: () => void;
}

export function ModuleCard({
    module,
    index,
    isDragging,
    dragItemId,
    editingId,
    editValue,
    onToggle,
    onStartConfirmEdit,
    onEditValueChange,
    onSaveEdit,
    onDeleteModule,
    onDeleteItem,
    onAddItem,
    onDescriptionChange,
    onEditModule,
    onEditItem,
    onDragStart,
    onDragEnter,
    onDragEnd
}: ModuleCardProps) {
  return (
    <div 
        className={`border transition-all rounded-lg overflow-hidden bg-white ${isDragging ? 'opacity-50 border-dashed border-blue-400' : 'border-gray-200 shadow-sm'}`}
        draggable
        onDragStart={(e) => onDragStart(e, module.id, 'module')}
        onDragEnter={(e) => onDragEnter(e, module.id, 'module')}
        onDragEnd={onDragEnd}
        onDragOver={(e) => e.preventDefault()}
    >
        {/* Module Header */}
        <div className="bg-gray-50/50 p-2 md:p-4 border-b border-gray-100 flex items-start gap-1 md:gap-3 group cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="mt-1 cursor-move text-gray-400 hover:text-gray-600 flex-shrink-0" title="Drag to reorder">
                <GripVertical size={18} className="md:w-5 md:h-5" />
            </div>
            
            <button onClick={() => onToggle(module.id)} className="mt-1 text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0">
                {module.isExpanded ? <ChevronDown size={18} className="md:w-5 md:h-5" /> : <ChevronDown size={18} className="-rotate-90 md:w-5 md:h-5" />}
            </button>
            
            <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
                        <span className="font-bold text-gray-500 text-sm md:text-base flex-shrink-0">{index + 1}</span>
                        
                        {editingId === module.id ? (
                            <input 
                                autoFocus
                                className="font-bold text-gray-900 text-sm md:text-base bg-white border border-blue-400 rounded px-1 outline-none w-full"
                                value={editValue}
                                onChange={(e) => onEditValueChange(e.target.value)}
                                onBlur={() => onSaveEdit(module.id, 'module')}
                                onKeyDown={(e) => e.key === 'Enter' && onSaveEdit(module.id, 'module')}
                            />
                        ) : (
                            <h3 
                                className="font-bold text-gray-900 text-sm md:text-base hover:text-blue-600 cursor-text border border-transparent hover:border-gray-200 rounded px-1 transition-colors truncate flex-1 min-w-0"
                                onClick={(e) => { e.stopPropagation(); onStartConfirmEdit(module.id, module.title); }}
                                title="Click to edit title"
                            >
                                {module.title}
                            </h3>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-0.5 md:gap-2 text-gray-400 flex-shrink-0">
                            <span className="text-xs hidden md:flex items-center gap-1"><Clock size={14} /> 45m</span>
                            <div className="flex items-center gap-0.5 md:gap-1">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onEditModule(module); }}
                                    className="p-1 md:p-1.5 hover:bg-blue-50 hover:text-blue-500 rounded text-gray-400 transition-colors"
                                    title="Edit module"
                                >
                                    <Pencil size={14} className="md:w-4 md:h-4" />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onDeleteModule(module.id); }}
                                    className="p-1 md:p-1.5 hover:bg-red-50 hover:text-red-500 rounded text-gray-400 transition-colors"
                                    title="Delete module"
                                >
                                    <Trash2 size={14} className="md:w-4 md:h-4" />
                                </button>
                            </div>
                    </div>
                </div>
                <div className="text-xs text-gray-500 truncate">{module.description || "No description added"}</div>
            </div>
        </div>

        {/* Module Content */}
        {module.isExpanded && (
            <div className="p-2 md:p-4 bg-white">
                
                {/* Module Description Input */}
                <div className="mb-6">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Module Description</label>
                    <textarea 
                        className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none bg-gray-50 focus:bg-white"
                        rows={2}
                        placeholder="Add a brief description of what this module covers..."
                        value={module.description || ''}
                        onChange={(e) => onDescriptionChange(module.id, e.target.value)}
                    />
                </div>

                {/* Learning Objectives Example */}
                {module.learningObjectives && module.learningObjectives.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-3 mb-4 bg-gray-50/30 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-2 font-medium text-sm text-gray-700">
                            <Sparkles size={16} className="text-yellow-500" />
                            Learning objectives ({module.learningObjectives.length})
                        </div>
                    </div>
                )}

                <div className="space-y-0 divide-y divide-gray-100 border border-gray-200 rounded-lg">
                    {module.items.map((item) => (
                        <ContentItemRow
                            key={item.id}
                            item={item}
                            moduleId={module.id}
                            isDragging={dragItemId === item.id}
                            editingId={editingId}
                            editValue={editValue}
                            onStartConfirmEdit={onStartConfirmEdit}
                            onEditValueChange={onEditValueChange}
                            onSaveEdit={(id, parentId) => onSaveEdit(id, 'item', parentId)}
                            onDelete={onDeleteItem}
                            onEdit={onEditItem}
                            onDragStart={onDragStart}
                            onDragEnter={onDragEnter}
                            onDragEnd={onDragEnd}
                        />
                    ))}
                    
                    {module.items.length === 0 && (
                        <div className="p-8 text-center border-2 border-dashed border-gray-100 m-2 rounded-lg">
                            <p className="text-sm text-gray-400 mb-2">This module is empty.</p>
                            <button onClick={() => onAddItem(module.id)} className="text-sm text-blue-600 font-medium hover:underline">
                                Add your first item
                            </button>
                        </div>
                    )}
                </div>

                {/* Add Item Actions */}
                <div className="mt-4 flex items-center justify-center relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative">
                        <button 
                            onClick={() => onAddItem(module.id)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-blue-600 transition-all hover:border-blue-300"
                        >
                            <Plus size={16} />
                            Add item
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}
