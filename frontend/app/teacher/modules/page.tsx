"use client";

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { ModuleList } from '@/components/teacher/modules/ModuleList';
import { EditModuleModal } from '@/components/teacher/modules/EditModuleModal';
import { AddItemModal } from '@/components/teacher/modules/AddItemModal';
import { EditContentItemModal } from '@/components/teacher/modules/EditContentItemModal';
import { CreationSidebar } from '@/components/teacher/modules/CreationSidebar';
import { Module, ContentItem, GuidedStep, SidebarRecommendation } from '@/components/teacher/modules/types';

export default function ModulesPage() {
    const [modules, setModules] = useState<Module[]>([
        {
            id: '1',
            title: 'Introduction to the Course',
            description: 'Get started with the basics and course overview',
            duration: '45m',
            items: [
                {
                    id: '1-1',
                    type: 'video',
                    title: 'Welcome Video',
                    duration: '10m',
                    fileName: 'welcome.mp4'
                },
                {
                    id: '1-2',
                    type: 'reading',
                    title: 'Course Syllabus',
                    duration: '5m',
                    fileName: 'syllabus.md'
                }
            ],
            isExpanded: true,
            learningObjectives: ['Understand course structure', 'Set learning goals']
        },
        {
            id: '2',
            title: 'Core Concepts',
            description: 'Deep dive into fundamental concepts',
            duration: '90m',
            items: [
                {
                    id: '2-1',
                    type: 'video',
                    title: 'Concept Overview',
                    duration: '30m',
                    fileName: 'concepts.mp4'
                },
                {
                    id: '2-2',
                    type: 'quiz',
                    title: 'Comprehension Quiz',
                    duration: '15m'
                }
            ],
            isExpanded: false
        }
    ]);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    
    // Modal states
    const [editModuleModalOpen, setEditModuleModalOpen] = useState(false);
    const [addItemModalOpen, setAddItemModalOpen] = useState(false);
    const [editItemModalOpen, setEditItemModalOpen] = useState(false);
    const [currentModule, setCurrentModule] = useState<Module | null>(null);
    const [currentItem, setCurrentItem] = useState<{ item: ContentItem; parentId: string } | null>(null);
    const [currentModuleForItem, setCurrentModuleForItem] = useState<string | null>(null);

    // Sidebar state
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile
    const [guidedSteps] = useState<GuidedStep[]>([
        { id: 1, title: 'Create Structure', completed: true, active: false },
        { id: 2, title: 'Upload Content', completed: false, active: true },
        { id: 3, title: 'Refine & Organize', completed: false, active: false }
    ]);
    const [recommendations] = useState<SidebarRecommendation[]>([
        {
            id: 'rec-1',
            title: 'Introduction to Programming',
            source: 'Coursera',
            rating: 4.8,
            reviews: '1.2k',
            modules: []
        },
        {
            id: 'rec-2',
            title: 'Web Development Bootcamp',
            source: 'Udemy',
            rating: 4.9,
            reviews: '2.5k',
            modules: []
        }
    ]);

    // Module operations
    const handleToggleModule = (id: string) => {
        setModules(modules.map(m => m.id === id ? { ...m, isExpanded: !m.isExpanded } : m));
    };

    const handleCollapseAll = () => {
        const allCollapsed = modules.every(m => !m.isExpanded);
        setModules(modules.map(m => ({ ...m, isExpanded: allCollapsed })));
    };

    const handleAddModule = () => {
        const newModule: Module = {
            id: `module-${Date.now()}`,
            title: `Module ${modules.length + 1}`,
            description: '',
            duration: '45m',
            items: [],
            isExpanded: true,
            learningObjectives: []
        };
        setModules([...modules, newModule]);
    };

    const handleDeleteModule = (id: string) => {
        if (confirm('Are you sure you want to delete this module?')) {
            setModules(modules.filter(m => m.id !== id));
        }
    };

    const handleEditModule = (module: Module) => {
        setCurrentModule(module);
        setEditModuleModalOpen(true);
    };

    const handleSaveModuleEdit = (data: { title: string; description: string; duration: string }) => {
        if (currentModule) {
            setModules(modules.map(m => 
                m.id === currentModule.id 
                    ? { ...m, title: data.title, description: data.description, duration: data.duration }
                    : m
            ));
        }
        setEditModuleModalOpen(false);
        setCurrentModule(null);
    };

    const handleDescriptionChange = (id: string, description: string) => {
        setModules(modules.map(m => m.id === id ? { ...m, description } : m));
    };

    // Item operations
    const handleAddItem = (moduleId: string) => {
        setCurrentModuleForItem(moduleId);
        setAddItemModalOpen(true);
    };

    const handleConfirmAddItem = (data: { title: string; type: ContentItem['type']; duration: string; file?: File }) => {
        if (currentModuleForItem) {
            const newItem: ContentItem = {
                id: `item-${Date.now()}`,
                type: data.type,
                title: data.title,
                duration: data.duration,
                fileName: data.file?.name
            };
            
            setModules(modules.map(m => 
                m.id === currentModuleForItem 
                    ? { ...m, items: [...m.items, newItem] }
                    : m
            ));
        }
        setAddItemModalOpen(false);
        setCurrentModuleForItem(null);
    };

    const handleDeleteItem = (moduleId: string, itemId: string) => {
        if (confirm('Are you sure you want to delete this item?')) {
            setModules(modules.map(m => 
                m.id === moduleId 
                    ? { ...m, items: m.items.filter(i => i.id !== itemId) }
                    : m
            ));
        }
    };

    const handleEditItem = (item: ContentItem, parentId: string) => {
        setCurrentItem({ item, parentId });
        setEditItemModalOpen(true);
    };

    const handleSaveItemEdit = (data: { title: string; type: ContentItem['type']; duration: string; file?: File }) => {
        if (currentItem) {
            setModules(modules.map(m => 
                m.id === currentItem.parentId 
                    ? {
                        ...m,
                        items: m.items.map(i => 
                            i.id === currentItem.item.id
                                ? { 
                                    ...i, 
                                    title: data.title, 
                                    type: data.type, 
                                    duration: data.duration,
                                    fileName: data.file?.name || i.fileName
                                }
                                : i
                        )
                    }
                    : m
            ));
        }
        setEditItemModalOpen(false);
        setCurrentItem(null);
    };

    // Inline editing
    const handleStartEdit = (id: string, title: string) => {
        setEditingId(id);
        setEditValue(title);
    };

    const handleSaveEdit = (id: string, type: 'module' | 'item', parentId?: string) => {
        if (!editValue.trim()) {
            setEditingId(null);
            return;
        }

        if (type === 'module') {
            setModules(modules.map(m => 
                m.id === id ? { ...m, title: editValue } : m
            ));
        } else if (type === 'item' && parentId) {
            setModules(modules.map(m => 
                m.id === parentId 
                    ? {
                        ...m,
                        items: m.items.map(i => 
                            i.id === id ? { ...i, title: editValue } : i
                        )
                    }
                    : m
            ));
        }
        setEditingId(null);
        setEditValue('');
    };

    const handleReorderModules = (newModules: Module[]) => {
        setModules(newModules);
    };

    // Sidebar handlers
    const handleCloseSidebar = () => {
        setSidebarVisible(false);
    };

    const handleAddRecommendation = (recId: string) => {
        const recommendation = recommendations.find(r => r.id === recId);
        if (recommendation) {
            alert(`Adding recommendation: ${recommendation.title}`);
            // In a real app, this would add the recommendation's modules to the current course
        }
    };

    return (
        <div className="flex h-full w-full overflow-hidden bg-white">
            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Hidden on mobile by default, shown when toggled */}
            {sidebarVisible && (
                <CreationSidebar
                    className={`fixed inset-y-0 left-0 z-50 w-[85vw] md:w-[360px] md:relative transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
                    onBack={() => setSidebarVisible(false)}
                    guidedSteps={guidedSteps}
                    recommendations={recommendations}
                    onAddRecommendation={handleAddRecommendation}
                    onClose={() => setIsSidebarOpen(false)}
                    courseTitle="My New Course"
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <ModuleList
                    modules={modules}
                    editingId={editingId}
                    editValue={editValue}
                    onToggleModule={handleToggleModule}
                    onStartEdit={handleStartEdit}
                    onEditValueChange={setEditValue}
                    onSaveEdit={handleSaveEdit}
                    onDeleteModule={handleDeleteModule}
                    onDeleteItem={handleDeleteItem}
                    onAddItem={handleAddItem}
                    onAddModule={handleAddModule}
                    onCollapseAll={handleCollapseAll}
                    onReorderModules={handleReorderModules}
                    onDescriptionChange={handleDescriptionChange}
                    onEditModule={handleEditModule}
                    onEditItem={handleEditItem}
                />

                {/* Mobile Footer Navbar */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex items-center justify-end z-30">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                    >
                        <span className="text-sm font-medium">Tools</span>
                        <Menu size={20} />
                    </button>
                </div>
            </div>

            {/* Modals */}
            <EditModuleModal
                isOpen={editModuleModalOpen}
                onClose={() => {
                    setEditModuleModalOpen(false);
                    setCurrentModule(null);
                }}
                onConfirm={handleSaveModuleEdit}
                module={currentModule}
            />

            <AddItemModal
                isOpen={addItemModalOpen}
                onClose={() => {
                    setAddItemModalOpen(false);
                    setCurrentModuleForItem(null);
                }}
                onConfirm={handleConfirmAddItem}
            />

            <EditContentItemModal
                isOpen={editItemModalOpen}
                onClose={() => {
                    setEditItemModalOpen(false);
                    setCurrentItem(null);
                }}
                onConfirm={handleSaveItemEdit}
                item={currentItem?.item || null}
            />
        </div>
    );
}
