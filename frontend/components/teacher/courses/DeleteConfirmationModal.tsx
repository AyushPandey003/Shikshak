import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import axios from 'axios';
import { useAppStore } from '@/store/useAppStore';
import { API_CONFIG } from '@/lib/api-config';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  courseTitle: string;
  courseId: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  courseTitle,
  courseId
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAppStore();

  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await axios.post(API_CONFIG.material.courses.deleteCourse, {
        course_id: courseId
      }, {
        headers: {
          "Authorization": `Bearer ${user?.accessToken}`
        },
        withCredentials: true
      });
      onConfirm();
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert("Failed to delete course. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Course?
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete <span className="font-semibold text-gray-900">"{courseTitle}"</span>? This action cannot be undone.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting ? 'Deleting...' : 'Delete Course'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
