
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  index: number;
  textColor?: string; 
}

export const FeatureCard = ({ title, isActive, onClick, children, className, index, textColor = "text-white/90" }: FeatureCardProps) => {
  return (
    <motion.div
      layout
      onClick={onClick}
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-[2.5rem] transition-all duration-500 ease-in-out",
        isActive ? "flex-[3]" : "flex-1 hover:flex-[1.2]",
        className
      )}
      initial={false}
      style={{
        height: '600px', // Fixed height based on design
        minWidth: '120px'
      }}
    >
        {/* Collapsed State Content - Vertical Text */}
        <motion.div 
            className={cn(
                "absolute inset-0 flex items-center justify-center z-20 transition-opacity duration-300",
                isActive ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
        >
             <h3 className={cn("text-3xl font-medium md:-rotate-90 whitespace-nowrap tracking-wide", textColor)}>
                {title}
             </h3>
             {/* Gradient Overlay for collapsed state to dim content */}
             <div className="absolute inset-0 bg-black/10 z-[-1]" />
        </motion.div>

        {/* Expanded State Content */}
        <motion.div
             className={cn(
                 "w-full h-full transition-opacity duration-500 delay-100",
                 isActive ? "opacity-100" : "opacity-40 blur-sm scale-110" // Visual trick for collapsed content
             )}
        >
            {children}
        </motion.div>
        
        {/* Floating Action Button (only visible when expanded) */}
         <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
             transition={{ duration: 0.3, delay: 0.2 }}
            className="absolute bottom-6 right-6 z-30"
         >
             <button className="w-14 h-14 rounded-full bg-[#FF6B6B] text-white flex items-center justify-center hover:bg-[#ff8585] transition-colors">
                 <ArrowRight className="w-6 h-6" />
             </button>
         </motion.div>

    </motion.div>
  );
};
