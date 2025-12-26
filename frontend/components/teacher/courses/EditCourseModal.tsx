import React, { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { Course } from '@/types/course';

// Local extension to avoid modifying global types
interface ExtendedCourse extends Course {
    description?: string;
    course_outcomes?: string;
    language?: string;
    duration?: string;
    visibility?: string;
}

interface EditCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    course: Course | null;
    onSave: (updatedCourse: Partial<Course>) => Promise<void>;
}

export const EditCourseModal: React.FC<EditCourseModalProps> = ({ isOpen, onClose, course, onSave }) => {
    const extendedCourse = course as ExtendedCourse;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: course?.title || '',
        price: course?.price || 0,
        grade: course?.grade || '',
        subject: course?.subject || '',
        image: course?.image || '',
        description: extendedCourse?.description || '', // New
        course_outcomes: extendedCourse?.course_outcomes || '', // New
        language: extendedCourse?.language || 'English', // New
        duration: extendedCourse?.duration || '', // New
        visibility: extendedCourse?.type === 'Public' ? 'public' : 'private', // New (mapped)
    });

    // Reset form when course changes
    React.useEffect(() => {
        if (course) {
            const extCourse = course as ExtendedCourse;
            setFormData({
                title: course.title,
                price: course.price,
                grade: course.grade,
                subject: course.subject,
                image: course.image,
                description: extCourse.description || '',
                course_outcomes: extCourse.course_outcomes || '', 
                language: extCourse.language || 'English',
                duration: extCourse.duration || '',
                visibility: extCourse.type === 'Public' ? 'public' : 'private',
            });
        }
    }, [course]);

    if (!isOpen || !course) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
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
                        <div className="flex justify-center">
                            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center group cursor-pointer hover:border-blue-500 transition-colors">
                                {formData.image ? (
                                    <img src={formData.image} alt="Course Thumbnail" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <Upload className="mx-auto mb-2 opacity-50" />
                                        <span className="text-sm">Upload Thumbnail</span>
                                    </div>
                                )}
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="text-white text-sm font-medium">Change Image</span>
                                </div>
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
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Grade/Class</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    value={formData.grade}
                                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
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
                                    onChange={(e) => setFormData({...formData, language: e.target.value})}
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
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                                onChange={(e) => setFormData({...formData, course_outcomes: e.target.value})}
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
                                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    value={formData.visibility}
                                    onChange={(e) => setFormData({...formData, visibility: e.target.value})}
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
                        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};
