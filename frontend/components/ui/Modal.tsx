import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Modal({ isOpen, onClose, children, title, size = "md" }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full h-full m-0 rounded-none",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className={`bg-white rounded-2xl shadow-xl w-full flex flex-col max-h-[90vh] ${sizeClasses[size]}`}
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-100">
           <h2 className="text-xl font-bold text-zinc-800">{title}</h2>
           <button 
             onClick={onClose}
             className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-500"
           >
             <X size={20} />
           </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-0">
          {children}
        </div>
      </div>
    </div>
  );
}
