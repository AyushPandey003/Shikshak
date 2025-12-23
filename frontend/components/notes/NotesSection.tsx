"use client";

import React, { useState } from 'react';
import { Note } from '@/types/note';
import { NoteCard } from './NoteCard';
import { NoteEditor } from './NoteEditor';
import { Modal } from '@/components/ui/Modal';
import { Plus, Search, Filter } from 'lucide-react';

const MOCK_NOTES: Note[] = [
  {
    id: '1',
    title: 'Computer Science Lecture 1',
    subject: 'Computer Science',
    category: 'Computer Science',
    priority: 'high',
    color: 'blue',
    fontSize: 'Medium (16px)',
    content: 'Introduction to algorithms and data structures. Big O notation explains time complexity and helps us analyze algorithm efficiency. Arrays provide constant-time access...',
    tags: ['#algorithms', '#data-structures', '#big-o'],
    date: '2024-01-20',
    wordCount: 45,
    materialsCount: 1
  },
  {
    id: '2',
    title: 'Mathematics - Calculus Notes',
    subject: 'Mathematics',
    category: 'Mathematics',
    priority: 'medium',
    color: 'green',
    fontSize: 'Medium (16px)',
    content: 'Derivatives and integrals form the foundation of calculus. The fundamental theorem of calculus connects these two concepts...',
    tags: ['#calculus', '#derivatives', '#integrals'],
    date: '2024-01-19',
    wordCount: 42,
    materialsCount: 0
  }
];

export function NotesSection() {
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateNote = () => {
    setEditingNote(undefined);
    setIsModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleSaveNote = (noteData: Partial<Note>) => {
    if (editingNote) {
      // Update existing
      setNotes(prev => prev.map(n => n.id === editingNote.id ? { ...n, ...noteData } as Note : n));
    } else {
      // Create new
      const newNote: Note = {
        id: Math.random().toString(36).substr(2, 9),
        title: noteData.title || 'Untitled Note',
        content: noteData.content || '',
        subject: noteData.subject || 'General',
        category: noteData.category || 'General',
        priority: noteData.priority || 'medium',
        color: noteData.color || 'white',
        fontSize: noteData.fontSize || 'Medium (16px)',
        tags: noteData.tags || [],
        date: new Date().toISOString(),
        wordCount: noteData.wordCount || 0,
        materialsCount: 0
      };
      setNotes(prev => [newNote, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteNote = () => {
    if (editingNote) {
      if (confirm('Are you sure you want to delete this note?')) {
        setNotes(prev => prev.filter(n => n.id !== editingNote.id));
        setIsModalOpen(false);
      }
    }
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Notes</h1>
          <p className="text-slate-500 mt-1">Manage and organize your learning materials</p>
        </div>
        <button 
          onClick={handleCreateNote}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          Create New Note
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search notes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors font-medium">
          <Filter size={20} />
          Filters
        </button>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map(note => (
          <div key={note.id} className="h-full">
            <NoteCard note={note} onClick={handleEditNote} />
          </div>
        ))}
        {filteredNotes.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400">
            <div className="mb-4 bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Search size={32} className="opacity-50" />
            </div>
            <p className="text-lg font-medium">No notes found</p>
            <p className="text-sm">Try changing your search terms or create a new note.</p>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="" size="xl">
        <NoteEditor 
          initialNote={editingNote || {}} 
          onSave={handleSaveNote}
          onClose={() => setIsModalOpen(false)}
          onDelete={editingNote ? handleDeleteNote : undefined}
        />
      </Modal>
    </div>
  );
}
