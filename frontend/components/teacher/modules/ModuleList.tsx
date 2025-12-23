import React, { useRef } from 'react';
import { ModuleCard } from './ModuleCard';
import { Module } from './types';
import { CheckCircle2, ChevronUp, Clock, Plus } from 'lucide-react';

interface ModuleListProps {
    modules: Module[];
    editingId: string | null;
    editValue: string;
    onToggleModule: (id: string) => void;
    onStartEdit: (id: string, title: string) => void;
    onEditValueChange: (val: string) => void;
    onSaveEdit: (id: string, type: 'module' | 'item', parentId?: string) => void;
    onDeleteModule: (id: string) => void;
    onDeleteItem: (moduleId: string, itemId: string) => void;
    onAddItem: (moduleId: string) => void;
    onAddModule: () => void;
    onCollapseAll: () => void;
    onReorderModules: (modules: Module[]) => void;
    onDescriptionChange: (id: string, description: string) => void;
}

export function ModuleList({
    modules,
    editingId,
    editValue,
    onToggleModule,
    onStartEdit,
    onEditValueChange,
    onSaveEdit,
    onDeleteModule,
    onDeleteItem,
    onAddItem,
    onAddModule,
    onCollapseAll,
    onReorderModules,
    onDescriptionChange
}: ModuleListProps) {

    // Drag and Drop State
    const [draggingId, setDraggingId] = React.useState<string | null>(null);
    const dragItem = useRef<{ id: string, type: 'module' | 'item', parentId?: string } | null>(null);
    const dragOverItem = useRef<{ id: string, type: 'module' | 'item', parentId?: string } | null>(null);

    const handleDragStart = (e: React.DragEvent, id: string, type: 'module' | 'item', parentId?: string) => {
        dragItem.current = { id, type, parentId };
        setDraggingId(id);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnter = (e: React.DragEvent, id: string, type: 'module' | 'item', parentId?: string) => {
        dragOverItem.current = { id, type, parentId };
    };

    const handleDragEnd = () => {
        setDraggingId(null);
        if (!dragItem.current || !dragOverItem.current) {
            dragItem.current = null;
            dragOverItem.current = null;
            return;
        }

        // 1. Reordering Modules
        if (dragItem.current.type === 'module' && dragOverItem.current.type === 'module') {
            const modulesCopy = [...modules];
            const dragIndex = modulesCopy.findIndex(m => m.id === dragItem.current?.id);
            const hoverIndex = modulesCopy.findIndex(m => m.id === dragOverItem.current?.id);
            
            const [movedModule] = modulesCopy.splice(dragIndex, 1);
            modulesCopy.splice(hoverIndex, 0, movedModule);
            
            onReorderModules(modulesCopy);
        }
        
        // 2. Reordering Items within the SAME Module
        if (dragItem.current.type === 'item' && dragOverItem.current.type === 'item') {
            if (dragItem.current.parentId === dragOverItem.current.parentId) {
                const moduleId = dragItem.current.parentId;
                const updatedModules = modules.map(m => {
                    if (m.id === moduleId) {
                        const itemsCopy = [...m.items];
                        const dragIndex = itemsCopy.findIndex(i => i.id === dragItem.current?.id);
                        const hoverIndex = itemsCopy.findIndex(i => i.id === dragOverItem.current?.id);
                        
                        const [movedItem] = itemsCopy.splice(dragIndex, 1);
                        itemsCopy.splice(hoverIndex, 0, movedItem);
                        
                        return { ...m, items: itemsCopy };
                    }
                    return m;
                });
                onReorderModules(updatedModules);
            }
        }

        // Reset
        dragItem.current = null;
        dragOverItem.current = null;
    };

    return (
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 md:p-8 w-full min-w-0">
            <div className="w-full max-w-4xl mx-auto min-w-0">
                <div className="flex items-center justify-between mb-4 md:mb-8">
                    <h1 className="text-xl md:text-2xl font-bold md:font-bold text-gray-900 hidden md:block">Recommended course content</h1>
                    <h1 className="text-xl font-semibold text-gray-900 md:hidden">Course Modules</h1>
                    <div className="flex gap-2">
                    {/* Empty for now, maybe save button */}
                    </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <button 
                        onClick={onCollapseAll}
                        className="text-blue-600 text-xs md:text-sm font-medium flex items-center gap-1 hover:underline transition-colors"
                    >
                        <ChevronUp size={14} className="md:w-4 md:h-4" /> 
                        {modules.every(m => !m.isExpanded) ? 'Expand all' : 'Collapse all'}
                    </button>

                    <div className="flex flex-col md:flex-row items-end md:items-center gap-0.5 md:gap-4 text-[10px] md:text-sm text-gray-500">
                        <span className="flex items-center gap-1 text-green-600"><CheckCircle2 size={10} className="md:w-3 md:h-3"/> Saved</span>
                        <span className="flex items-center gap-1"><Clock size={10} className="md:w-3 md:h-3"/> Total: {modules.length * 45}m (est)</span>
                    </div>
                </div>

                {/* Modules List */}
                <div className="space-y-6 pb-20"> 
                    {modules.map((module, index) => (
                        <ModuleCard
                            key={module.id}
                            module={module}
                            index={index}
                            isDragging={draggingId === module.id}
                            dragItemId={draggingId}
                            editingId={editingId}
                            editValue={editValue}
                            onToggle={onToggleModule}
                            onStartConfirmEdit={onStartEdit}
                            onEditValueChange={onEditValueChange}
                            onSaveEdit={onSaveEdit}
                            onDeleteModule={onDeleteModule}
                            onDeleteItem={onDeleteItem}
                            onAddItem={onAddItem}
                            onDescriptionChange={onDescriptionChange}
                            onDragStart={handleDragStart}
                            onDragEnter={handleDragEnter}
                            onDragEnd={handleDragEnd}
                        />
                    ))}
                    
                    {/* Add Module Button */}
                    <button 
                        onClick={onAddModule}
                        className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/20 transition-all group"
                    >
                        <div className="bg-gray-100 group-hover:bg-blue-100 p-3 rounded-full transition-colors">
                            <Plus size={24} />
                        </div>
                        <span className="font-medium">Create new module</span>
                    </button>

                </div>
            </div>
        </div>
    );
}
