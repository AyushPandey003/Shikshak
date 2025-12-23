'use client';

import React, { useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Menu } from 'lucide-react';

import { Module, SidebarRecommendation, ContentItem } from '@/components/teacher/modules/types';
import { CreationSidebar } from '@/components/teacher/modules/CreationSidebar';
import { ModuleList } from '@/components/teacher/modules/ModuleList';
import { AddItemModal } from '@/components/teacher/modules/AddItemModal';
import { EditModuleModal } from '@/components/teacher/modules/EditModuleModal';
import { EditContentItemModal } from '@/components/teacher/modules/EditContentItemModal';

// --- Mock Data ---
const MOCK_RECOMMENDATIONS: SidebarRecommendation[] = [
    { 
        id: 'r1', 
        title: 'Course Kickoff Kit', 
        source: 'Shikshak Templates', 
        rating: 5.0, 
        reviews: 'Featured',
        modules: [
            {
                id: 'm-r1-1', title: 'Getting Started', duration: '30m', isExpanded: true, 
                items: [
                   { id: 'i-r1-1', type: 'video', title: 'Welcome & Instructor Intro', duration: '5m', fileName: 'welcome.mp4', source: 'Template' },
                   { id: 'i-r1-2', type: 'reading', title: 'Course Syllabus & Policies', duration: '15m', fileName: 'syllabus_template.md', source: 'Template' },
                   { id: 'i-r1-3', type: 'quiz', title: 'Prerequisite Check', duration: '10m', fileName: 'pre_quiz.md', source: 'Template' }
                ]
            }
        ]
    },
    { 
        id: 'r2', 
        title: 'Final Assessment Pack', 
        source: 'Shikshak Templates', 
        rating: 4.9, 
        reviews: 'Popular',
        modules: [
             {
                id: 'm-r2-1', title: 'End of Term Assessment', duration: '2h', isExpanded: true, 
                items: [
                   { id: 'i-r2-1', type: 'assignment', title: 'Final Capstone Project', duration: '1h 30m', fileName: 'project_brief.pdf', source: 'Template' },
                   { id: 'i-r2-2', type: 'quiz', title: 'Comprehensive Final Exam', duration: '30m', fileName: 'final_exam.md', source: 'Template' },
                   { id: 'i-r2-3', type: 'video', title: 'Closing Remarks & Next Steps', duration: '5m', fileName: 'closing.mp4', source: 'Template' }
                ]
            }
        ]
    },
];

const INITIAL_MODULES: Module[] = [
  {
    id: 'm1',
    title: 'Module 1: Introduction to GenAI',
    description: 'A comprehensive overview of Generative AI, its history, and current landscape.',
    duration: '45m',
    isExpanded: true,
    items: [
      { id: 'i1', type: 'video', title: 'Welcome to the Course', duration: '5m', fileName: 'intro_video.mp4', source: 'Uploaded' },
      { id: 'i2', type: 'reading', title: 'Course Syllabus', duration: '10m', fileName: 'syllabus.md', source: 'Uploaded' },
      { id: 'i3', type: 'material', title: 'Lecture Slides', fileName: 'week1_slides.pdf', source: 'Uploaded' }
    ]
  },
  {
    id: 'm2',
    title: 'Module 2: Neural Networks Basics',
    description: 'Understanding the building blocks of deep learning: neurons, layers, and activation functions.',
    duration: '1h 20m',
    isExpanded: false,
    items: [
      { id: 'i4', type: 'video', title: 'What is a Perceptron?', duration: '15m', fileName: 'perceptron_explainer.mov', source: 'Uploaded' },
      { id: 'i5', type: 'quiz', title: 'Activation Functions Quiz', duration: '15m', fileName: 'quiz_v1.md', source: 'Uploaded' },
      { id: 'i6', type: 'assignment', title: 'First Implementation', duration: '45m', fileName: 'starter_code_instructions.md', source: 'Uploaded' }
    ]
  }
];

export default function CreateModulePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseTitle = searchParams.get('title');
  
  // --- State ---
  const [modules, setModules] = useState<Module[]>(INITIAL_MODULES);

  const [guidedSteps, setGuidedSteps] = useState([
    { id: 1, title: 'Generate course outline', completed: true, active: false },
    { id: 2, title: 'Refine search criteria', completed: true, active: false },
    { id: 3, title: 'Review recommended content', completed: false, active: true },
  ]);

  const [recommendations, setRecommendations] = useState(MOCK_RECOMMENDATIONS);
  
  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState<string | null>(null);
  
  // Edit Modal State
  const [isEditModuleModalOpen, setIsEditModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [editingItemParentId, setEditingItemParentId] = useState<string | null>(null);

  // --- Handlers ---

  const handleToggleModule = (id: string) => {
    setModules(modules.map(m => m.id === id ? { ...m, isExpanded: !m.isExpanded } : m));
  };

  const handleCollapseAll = () => {
      const allCollapsed = modules.every(m => !m.isExpanded);
      setModules(modules.map(m => ({ ...m, isExpanded: allCollapsed ? true : false })));
  };

  const handleDeleteModule = (id: string) => {
      if(confirm('Are you sure you want to delete this module?')) {
          setModules(modules.filter(m => m.id !== id));
      }
  };

  const handleDeleteItem = (moduleId: string, itemId: string) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return { ...m, items: m.items.filter(i => i.id !== itemId) };
      }
      return m;
    }));
  };

  const handleAddModule = (newModule?: Module) => {
      const moduleToAdd = newModule || { 
          id: Date.now().toString(), 
          title: "New Module", 
          duration: "0m", 
          items: [], 
          isExpanded: true 
      };
      setModules([...modules, moduleToAdd]);
  };

  const startEditing = (id: string, currentTitle: string) => {
      setEditingId(id);
      setEditValue(currentTitle);
  };

  const saveEdit = (id: string, type: 'module' | 'item', parentId?: string) => {
      if (type === 'module') {
          setModules(modules.map(m => m.id === id ? { ...m, title: editValue } : m));
      } else if (type === 'item' && parentId) {
          setModules(modules.map(m => {
              if (m.id === parentId) {
                  return { ...m, items: m.items.map(i => i.id === id ? { ...i, title: editValue } : i) };
              }
              return m;
          }));
      }
      setEditingId(null);
  };

  const openAddItemModal = (moduleId: string) => {
      setTargetModuleId(moduleId);
      setIsModalOpen(true);
  };

  const handleConfirmAddItem = (data: { title: string; type: ContentItem['type']; duration: string; file?: File }) => {
      if (!targetModuleId) return;
      
      const newItem: ContentItem = {
          id: Date.now().toString(),
          title: data.title,
          type: data.type,
          duration: data.duration || '5m',
          file: data.file,
          fileName: data.file?.name,
          source: data.file ? 'Uploaded' : undefined
      };

      setModules(modules.map(m => {
          if (m.id === targetModuleId) {
              return { ...m, items: [...m.items, newItem] };
          }
          return m;
      }));

      setIsModalOpen(false);
  };

  const handleAddRecommendation = (recId: string) => {
      const rec = recommendations.find(r => r.id === recId);
      if (rec) {
          const newModules = rec.modules.map(m => ({
              ...m,
              id: `imported-${Date.now()}-${m.id}`,
              items: m.items.map(i => ({ ...i, id: `imported-${Date.now()}-${i.id}` }))
          }));
          
          setModules([...modules, ...newModules]);
          setRecommendations(recommendations.filter(r => r.id !== recId));
      }
  };

  // Mobile Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleDescriptionChange = (id: string, description: string) => {
      setModules(modules.map(m => m.id === id ? { ...m, description } : m));
  };

  // Edit Modal Handlers
  const openEditModuleModal = (module: Module) => {
      setEditingModule(module);
      setIsEditModuleModalOpen(true);
  };

  const handleConfirmEditModule = (data: { title: string; description: string; duration: string }) => {
      if (!editingModule) return;
      setModules(modules.map(m => 
          m.id === editingModule.id 
              ? { ...m, title: data.title, description: data.description, duration: data.duration }
              : m
      ));
      setIsEditModuleModalOpen(false);
      setEditingModule(null);
  };

  const openEditItemModal = (item: ContentItem, parentId: string) => {
      setEditingItem(item);
      setEditingItemParentId(parentId);
      setIsEditItemModalOpen(true);
  };

  const handleConfirmEditItem = (data: { title: string; type: ContentItem['type']; duration: string; file?: File }) => {
      if (!editingItem || !editingItemParentId) return;
      setModules(modules.map(m => {
          if (m.id === editingItemParentId) {
              return {
                  ...m,
                  items: m.items.map(i => 
                      i.id === editingItem.id
                          ? { ...i, title: data.title, type: data.type, duration: data.duration, file: data.file, fileName: data.file?.name || i.fileName }
                          : i
                  )
              };
          }
          return m;
      }));
      setIsEditItemModalOpen(false);
      setEditingItem(null);
      setEditingItemParentId(null);
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

      <CreationSidebar 
        className={`fixed inset-y-0 left-0 z-50 w-[85vw] md:w-[360px] md:relative transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        onBack={() => router.back()}
        guidedSteps={guidedSteps}
        recommendations={recommendations}
        onAddRecommendation={handleAddRecommendation}
        onClose={() => setIsSidebarOpen(false)}
        courseTitle={courseTitle || undefined}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          
          <ModuleList 
            modules={modules}
            editingId={editingId}
            editValue={editValue}
            onToggleModule={handleToggleModule}
            onStartEdit={startEditing}
            onEditValueChange={setEditValue}
            onSaveEdit={saveEdit}
            onDeleteModule={handleDeleteModule}
            onDeleteItem={handleDeleteItem}
            onAddItem={openAddItemModal}
            onAddModule={() => handleAddModule()}
            onCollapseAll={handleCollapseAll}
            onReorderModules={setModules}
            onDescriptionChange={handleDescriptionChange}
            onEditModule={openEditModuleModal}
            onEditItem={openEditItemModal}
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

      <AddItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAddItem}
      />

      <EditModuleModal
        isOpen={isEditModuleModalOpen}
        onClose={() => setIsEditModuleModalOpen(false)}
        onConfirm={handleConfirmEditModule}
        module={editingModule}
      />

      <EditContentItemModal
        isOpen={isEditItemModalOpen}
        onClose={() => setIsEditItemModalOpen(false)}
        onConfirm={handleConfirmEditItem}
        item={editingItem}
      />

    </div>
  );
}
