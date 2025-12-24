import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Module } from './types';

interface EditModuleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { title: string; description: string; duration: string }) => void;
    module: Module | null;
    onDelete?: (id: string) => void;
}

export function EditModuleModal({ isOpen, onClose, onConfirm, module, onDelete }: EditModuleModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: ''
    });

    // Reset when opening with new module data
    useEffect(() => {
        if (isOpen && module) {
            setFormData({
                title: module.title || '',
                description: module.description || '',
                duration: module.duration || ''
            });
        }
    }, [isOpen, module]);

    const handleConfirm = () => {
        if (!formData.title.trim()) {
            alert('Title is required');
            return;
        }
        onConfirm(formData);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Module"
            size="md"
        >
            <div className="p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Module Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="e.g., Module 1: Introduction"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                        placeholder="Brief description of this module..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (optional)
                    </label>
                    <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="e.g., 45m, 1h 30m"
                    />
                </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 border-t">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleConfirm}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Save Changes
                </button>
            </div>
            {onDelete && module && (
                <div className="px-6 py-4 bg-red-50 border-t border-red-100 flex justify-between items-center">
                    <span className="text-sm text-red-600">Danger Zone</span>
                    <button
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this module? This action cannot be undone.")) {
                                onDelete(module.id);
                                onClose();
                            }
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Delete Module
                    </button>
                </div>
            )}
        </Modal>
    );
}
