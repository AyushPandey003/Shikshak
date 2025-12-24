"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Menu, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { ModuleList } from '@/components/teacher/modules/ModuleList';
import { EditModuleModal } from '@/components/teacher/modules/EditModuleModal';
import { AddItemModal } from '@/components/teacher/modules/AddItemModal';
import { EditContentItemModal } from '@/components/teacher/modules/EditContentItemModal';
import { CreationSidebar } from '@/components/teacher/modules/CreationSidebar';
import { Module, ContentItem, GuidedStep, SidebarRecommendation } from '@/components/teacher/modules/types';

const API_URL = "http://localhost:4000/material/module";
const UPLOAD_URL = "http://localhost:4000/material/upload";
const COURSE_API_URL = "http://localhost:4000/material/courses";

// Configure axios defaults to send credentials
axios.defaults.withCredentials = true;

function ModulesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    // Default to a fallback if no ID provided, or handle error. 
    // Ideally we should redirect if no ID.
    const COURSE_ID = searchParams.get('courseId') || "694b63a3f3db0f50ded6f3e7"; 
    
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    // Modal states
    const [editModuleModalOpen, setEditModuleModalOpen] = useState(false);
    const [addItemModalOpen, setAddItemModalOpen] = useState(false);
    const [editItemModalOpen, setEditItemModalOpen] = useState(false);
    const [deleteCourseModalOpen, setDeleteCourseModalOpen] = useState(false);
    
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


    // Fetch modules on load
    useEffect(() => {
        if (COURSE_ID) {
            fetchModules();
        }
    }, [COURSE_ID]);

    const fetchModules = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`${API_URL}/get_all_module`, {
                course_id: COURSE_ID
            });

            if (response.data) {
                // Map backend data to frontend Module type
                const mappedModules: Module[] = response.data.map((m: any) => ({
                    id: m._id,
                    title: m.title,
                    description: '', // Backend doesn't support description yet
                    duration: '', // Backend doesn't support duration yet
                    isExpanded: false,
                    items: [
                        ...(m.video_id || []).map((v: any) => ({
                            id: v._id,
                            type: 'video',
                            title: v.title,
                            duration: '10m', // Placeholder
                            azureId: v.azure_id
                        })),
                        ...(m.notes_id || []).map((n: any) => ({
                            id: n._id,
                            type: 'reading',
                            title: 'Module Notes', // Notes don't have titles in backend
                            duration: '5m', // Placeholder
                            azureId: n.azure_id
                        }))
                    ],
                    learningObjectives: []
                }));
                setModules(mappedModules);
            }
        } catch (error) {
            console.error("Error fetching modules:", error);
            // alert("Failed to fetch modules");
        } finally {
            setLoading(false);
        }
    };

    // Course operations
    const handleDeleteCourseInit = () => {
        setDeleteCourseModalOpen(true);
    };

    const handleConfirmDeleteCourse = async () => {
        try {
            await axios.post(`${COURSE_API_URL}/delete_course`, {
                course_id: COURSE_ID
            });
            router.push('/teacher/courses');
        } catch (error) {
            console.error("Error deleting course:", error);
            alert("Failed to delete course");
            setDeleteCourseModalOpen(false);
        }
    };

    const handleSaveCourse = () => {
        // Since changes are auto-saved, we can just notify and redirect
        // alert("Course saved successfully!");
        router.push('/teacher/courses');
    };

    // Module operations
    const handleToggleModule = (id: string) => {
        setModules(modules.map(m => m.id === id ? { ...m, isExpanded: !m.isExpanded } : m));
    };

    const handleCollapseAll = () => {
        const allCollapsed = modules.every(m => !m.isExpanded);
        setModules(modules.map(m => ({ ...m, isExpanded: allCollapsed })));
    };

    const handleAddModule = async () => {
        try {
            const tempTitle = `Module ${modules.length + 1}`;
            const response = await axios.post(`${API_URL}/create_module`, {
                course_id: COURSE_ID,
                title: tempTitle
            });

            if (response.data) {
                const newModule: Module = {
                    id: response.data._id,
                    title: response.data.title,
                    description: '',
                    duration: '',
                    items: [],
                    isExpanded: true,
                    learningObjectives: []
                };
                setModules([...modules, newModule]);
            }
        } catch (error: any) {
            console.error("Error creating module:", error);
            alert(`Failed to create module: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleDeleteModule = async (id: string) => {
        if (confirm('Are you sure you want to delete this module?')) {
            try {
                await axios.post(`${API_URL}/delete_module`, {
                    module_id: id
                });
                setModules(modules.filter(m => m.id !== id));
            } catch (error) {
                console.error("Error deleting module:", error);
                alert("Failed to delete module");
            }
        }
    };

    const handleEditModule = (module: Module) => {
        setCurrentModule(module);
        setEditModuleModalOpen(true);
    };

    const handleSaveModuleEdit = async (data: { title: string; description: string; duration: string }) => {
        if (currentModule) {
            try {
                await axios.post(`${API_URL}/edit_module`, {
                    module_id: currentModule.id,
                    title: data.title
                });

                setModules(modules.map(m =>
                    m.id === currentModule.id
                        ? { ...m, title: data.title, description: data.description, duration: data.duration }
                        : m
                ));
            } catch (error) {
                console.error("Error editing module:", error);
                alert("Failed to edit module");
            }
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


    const handleConfirmAddItem = async (data: { title: string; type: ContentItem['type']; duration: string; file?: File }) => {
        if (!currentModuleForItem) return;

        try {
            let azureId = '';

            // 1. Upload File if present
            if (data.file) {
                const formData = new FormData();
                formData.append('file', data.file);

                // Assuming gateway forwards /material/upload to /api/upload
                const uploadResponse = await axios.post(UPLOAD_URL, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (uploadResponse.data && uploadResponse.data.blobName) {
                    azureId = uploadResponse.data.blobName;
                } else {
                    throw new Error("Upload failed: No blob name received");
                }
            }

            // 2. Call specific API based on type
            let newItem: ContentItem | null = null;

            if (data.type === 'video') {
                if (!azureId) {
                    alert("A video file is required");
                    return;
                }
                const response = await axios.post(`${API_URL}/add_video`, {
                    module_id: currentModuleForItem,
                    azure_id: azureId,
                    title: data.title
                });

                // Map backend video to frontend item
                newItem = {
                    id: response.data._id,
                    type: 'video',
                    title: response.data.title,
                    duration: data.duration || '0m', // Backend doesn't store duration yet
                    fileName: data.file?.name,
                    azureId: azureId
                };

            } else if (data.type === 'reading') { // Notes
                if (!azureId) {
                    alert("A document file is required for notes");
                    return;
                }
                const response = await axios.post(`${API_URL}/add_notes`, {
                    module_id: currentModuleForItem,
                    azure_id: azureId
                });

                newItem = {
                    id: response.data._id,
                    type: 'reading',
                    title: data.title, // Backend doesn't store title for notes, but we keep it in UI
                    duration: data.duration || '5m',
                    fileName: data.file?.name,
                    azureId: azureId
                };
            } else {
                // Fallback for other types (Quiz/Assignment) - Local only for now as no API
                newItem = {
                    id: `item-${Date.now()}`,
                    type: data.type,
                    title: data.title,
                    duration: data.duration,
                    fileName: data.file?.name
                };
            }

            if (newItem) {
                const itemToAdd = newItem; // Capture for closure if needed, though clean here
                setModules(modules.map(m =>
                    m.id === currentModuleForItem
                        ? { ...m, items: [...m.items, itemToAdd] }
                        : m
                ));
            }

        } catch (error: any) {
            console.error("Error adding item:", error);
            alert(`Failed to add item: ${error.response?.data?.message || error.message}`);
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

    const handleSaveEdit = async (id: string, type: 'module' | 'item', parentId?: string) => {
        if (!editValue.trim()) {
            setEditingId(null);
            return;
        }

        if (type === 'module') {
            try {
                await axios.post(`${API_URL}/edit_module`, {
                    module_id: id,
                    title: editValue
                });
                setModules(modules.map(m =>
                    m.id === id ? { ...m, title: editValue } : m
                ));
            } catch (error) {
                console.error("Error editing module inline:", error);
                alert("Failed to update module name");
            }
        } else if (type === 'item' && parentId) {
            // TODO: Implement item edit API (e.g. edit video title) if available
            // For now, only local update
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
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {!sidebarVisible && (
                    <button
                        onClick={() => setSidebarVisible(true)}
                        className="absolute top-4 left-4 z-20 bg-white border border-gray-200 shadow-sm p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-all flex items-center gap-2"
                        title="Open Guide"
                    >
                        <Menu size={20} />
                        <span className="text-sm font-medium hidden md:inline">Open Guide</span>
                    </button>
                )}
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
                    onDeleteCourse={handleDeleteCourseInit}
                    onSaveCourse={handleSaveCourse}
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

            {/* Delete Course Warning Modal */}
            {deleteCourseModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all scale-100 opacity-100">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Course?</h3>
                            <p className="text-gray-500 mb-6 text-sm">
                                Are you sure you want to delete this course? This action cannot be undone and all modules/content will be lost.
                            </p>
                            <div className="flex items-center gap-3 w-full">
                                <button
                                    onClick={() => setDeleteCourseModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDeleteCourse}
                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                                >
                                    Delete Course
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ModulesPage() {
    return (
        <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
            <ModulesContent />
        </Suspense>
    );
}
