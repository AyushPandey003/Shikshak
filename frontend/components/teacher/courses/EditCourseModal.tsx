import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Upload } from 'lucide-react';
import { CustomLoader } from '@/components/ui/CustomLoader';
import Image from 'next/image';
import { Course } from '@/types/course';
import { useAppStore } from '@/store/useAppStore';
import { API_CONFIG } from '@/lib/api-config';

// Local extension to avoid modifying global types

interface EditCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    course: Course | null;
    onSave: (updatedCourse: Partial<Course>) => Promise<void>;
}

export const EditCourseModal: React.FC<EditCourseModalProps> = ({ isOpen, onClose, course, onSave }) => {
    const { user } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: course?.title || '',
        price: course?.price || 0,
        grade: course?.grade || '',
        subject: course?.subject || '',
        image: course?.image || '',
        description: course?.description || '', // New
        course_outcomes: course?.course_outcomes || '', // New
        language: course?.language || 'English', // New
        duration: course?.duration || '', // New
        visibility: course?.type === 'Public' ? 'public' : 'private', // New (mapped)
    });

    // Reset form when course changes
    async function handleThumbnail(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append("file", file);

        try {
            const headers: Record<string, string> = {};
            if (user?.accessToken) {
                headers["Authorization"] = `Bearer ${user.accessToken}`;
            }

            const res = await axios.post(`${API_CONFIG.upload}`, formData, {
                headers,
                withCredentials: true
            });
            console.log("Upload response:", res.data);
            if (res.data && res.data.blobName) {
                setThumbnailUrl(res.data.blobName);
            }
        } catch (error: any) {
            console.error("Error uploading thumbnail:", error);
            alert(`Failed to upload thumbnail: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
        }
    }

    useEffect(() => {
        if (course) {
            setFormData({
                title: course.title,
                price: course.price,
                grade: course.grade,
                subject: course.subject,
                image: course.image,
                description: course.description || '',
                course_outcomes: course.course_outcomes || '',
                language: course.language || 'English',
                duration: course.duration || '',
                visibility: course.type === 'Public' ? 'public' : 'private',
            });
        }
    }, [course]);

    if (!isOpen || !course) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                course_id: course.id,
                name: formData.title,
                subject: formData.subject,
                price: formData.price,
                description: formData.description,
                duration: formData.duration,
                visibility: formData.visibility,
                thumbnail: thumbnailUrl,
                language: formData.language,
                course_outcomes: formData.course_outcomes.split('\n').filter(line => line.trim() !== ''),
                grade: formData.grade // Sending grade just in case
            };

            await axios.post(
                `${API_CONFIG.courses}/edit_course`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${user?.accessToken}`
                    },
                    withCredentials: true
                }
            );

            await onSave({
                ...course,
                ...formData,
                type: formData.visibility === 'public' ? 'Public' : 'Private' // Map back
            });
            onClose();
        } catch (error) {
            console.error("Failed to update course", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">Edit Course Details</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                    <form id="edit-course-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* Thumbnail Preview */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Course Thumbnail <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-4 w-full">
                                <label className="cursor-pointer w-full border border-dashed rounded-lg px-4 py-6 text-sm text-zinc-500 hover:border-black">
                                    Upload Image
                                    <input type="file" accept="image/*" onChange={handleThumbnail} className="hidden" />
                                </label>
                                {preview && (
                                    <div className="relative w-32 h-20 rounded overflow-hidden border">
                                        <Image src={preview} alt="Thumbnail preview" fill className="object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Basic Info Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Grade/Class</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    value={formData.grade}
                                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                >
                                    <option value="9th Class">9th Class</option>
                                    <option value="10th Class">10th Class</option>
                                    <option value="11th Class">11th Class</option>
                                    <option value="12th Class">12th Class</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    value={formData.language}
                                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                rows={4}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe what students will learn..."
                            />
                        </div>

                        {/* Outcomes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Course Outcomes (Per line)</label>
                            <textarea
                                rows={3}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                value={formData.course_outcomes}
                                onChange={(e) => setFormData({ ...formData, course_outcomes: e.target.value })}
                                placeholder="Students will learn..."
                            />
                        </div>

                        {/* Price & Duration */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    value={formData.visibility}
                                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Private (Draft)</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="flex-shrink-0 p-6 border-t border-gray-100 bg-white flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="edit-course-form"
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? <CustomLoader size={20} className="text-white" color="white" /> : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};
