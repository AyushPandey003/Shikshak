import React from 'react';
import { Menu } from 'lucide-react';

interface SidebarCollapsedStripProps {
    onOpen: () => void;
}

const SidebarCollapsedStrip: React.FC<SidebarCollapsedStripProps> = ({ onOpen }) => {
    return (
        <div className="hidden lg:flex flex-col w-[60px] bg-white border-r border-gray-200 z-30 shrink-0 items-center py-4 transition-all duration-300">
            <button 
                onClick={onOpen}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                title="Open Sidebar"
            >
                <Menu className="w-6 h-6" />
            </button>
        </div>
    );
};

export default SidebarCollapsedStrip;
