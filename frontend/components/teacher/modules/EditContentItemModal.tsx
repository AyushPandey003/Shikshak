import React, { useState, useEffect } from 'react';
import { BookOpen, FileQuestion, HelpCircle, Video, FileText } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ContentItem } from './types';
import axios from 'axios';
import { API_CONFIG } from '@/lib/api-config';

const UPLOAD_URL = API_CONFIG.upload;

interface EditContentItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { title: string; type: ContentItem['type']; duration: string; file?: File }) => void;
    item: ContentItem | null;
}

export function EditContentItemModal({ isOpen, onClose, onConfirm, item }: EditContentItemModalProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState<{
        title: string;
        type: ContentItem['type'];
        duration: string;
        file?: File;
    }>({
        title: '',
        type: 'video',
        duration: ''
    });

    // Reset when opening with new item data
    useEffect(() => {
        if (isOpen && item) {
            setFormData({
                title: item.title || '',
                type: item.type,
                duration: item.duration || '',
                file: undefined
            });

            if (item.azureId) {
                // Fetch SAS URL for preview
                axios.get(`${UPLOAD_URL}/${item.azureId}`)
                    .then(res => setPreviewUrl(res.data.url))
                    .catch(err => console.error("Failed to load preview", err));
            } else {
                setPreviewUrl(null);
            }
        }
    }, [isOpen, item]);

    const handleConfirm = () => {
        if (!formData.title.trim()) {
            alert('Title is required');
            return;
        }
        onConfirm(formData);
        onClose();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, file: e.target.files[0] });
        }
    };

    const getTypeIcon = (type: ContentItem['type']) => {
        switch (type) {
            case 'video': return <Video size={20} className="text-blue-500" />;
            case 'reading': return <BookOpen size={20} className="text-emerald-500" />;
            case 'quiz': return <HelpCircle size={20} className="text-orange-500" />;
            case 'assignment': return <FileQuestion size={20} className="text-purple-500" />;
            case 'material': return <FileText size={20} className="text-pink-500" />;
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Content Item"
            size="md"
        >
            <div className="p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {(['video', 'reading', 'quiz', 'assignment', 'material'] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setFormData({ ...formData, type })}
                                className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${formData.type === type
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {getTypeIcon(type)}
                                <span className="text-xs font-medium capitalize">{type}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="e.g., Introduction to the Course"
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
                        placeholder="e.g., 5m, 15m"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Replace File (optional)
                    </label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        accept={formData.type === 'video' ? 'video/*' : formData.type === 'material' ? '.pdf,image/*' : '.md'}
                    />
                    {item?.fileName && !formData.file && (
                        <p className="mt-1 text-xs text-gray-500">Current file: {item.fileName}</p>
                    )}
                    {formData.file && (
                        <p className="mt-1 text-xs text-green-600">New file: {formData.file.name}</p>
                    )}
                </div>

                {/* Preview Section */}
                {previewUrl && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Content Preview</label>
                        {formData.type === 'video' ? (
                            <video
                                src={previewUrl}
                                controls
                                className="w-full rounded-md shadow-sm max-h-[300px] bg-black"
                            />
                        ) : (
                            <div className="flex items-center gap-2">
                                <FileText className="text-gray-500" size={20} />
                                <a
                                    href={previewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm font-medium"
                                >
                                    View Uploaded Document
                                </a>
                            </div>
                        )}
                    </div>
                )}
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
        </Modal>
    );
}
