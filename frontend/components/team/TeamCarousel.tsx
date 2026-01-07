"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { TeamMember } from "./data";
import clsx from "clsx";

interface TeamCarouselProps {
  members: TeamMember[];
  onSelect: (member: TeamMember) => void;
}

export default function TeamCarousel({ members, onSelect }: TeamCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % members.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + members.length) % members.length);
  };

  // Calculate visible members for the perspective effect
  // We want to show active, +1, +2, +3
  const visibleMembers = [
    members[activeIndex],
    members[(activeIndex + 1) % members.length],
    members[(activeIndex + 2) % members.length],
    members[(activeIndex + 3) % members.length],
  ];

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center relative px-6 md:px-12 lg:px-24 scale-[0.8] origin-center">
      {/* Header / Brand (Static for now based on image) */}


      <div className="w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-12 gap-12 h-[70vh] items-center">
        {/* Left Text Section */}
        <div className="lg:col-span-4 flex flex-col justify-center z-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-8xl lg:text-9xl font-playfair leading-[0.85] tracking-tight"
          >
            MEET<br />
            <span className="italic text-[#FF6B6B] opacity-80">OUR</span><br />
            TEAM
          </motion.h1>
          
          <div className="mt-20 max-w-sm">
             <p className="text-sm text-gray-600 leading-relaxed font-sans">
                Building the future of education with passion, innovation, 
                and code. Meet the minds behind the platform.
             </p>
          </div>
        </div>

        {/* Right Carousel Section */}
        <div className="lg:col-span-8 relative h-full flex items-center perspective-1000 pl-10 z-0">
          <div className="relative w-full h-[600px] flex items-center">
             <AnimatePresence mode="popLayout" custom={direction}>
                {visibleMembers.map((member, index) => {
                    // Logic to determine visual state based on index in visibleMembers array
                    const isFirst = index === 0;
                    
                    return (
                        <motion.div
                            key={`${member.id}-${activeIndex}`} // Key changes on activeIndex change to allow shuffling
                            layoutId={isFirst ? `card-${member.id}` : undefined}
                            initial={{ 
                                x: isFirst ? 0 : 100 * index, 
                                opacity: 0,
                                scale: 0.8,
                                zIndex: 10 - index
                            }}
                            animate={{ 
                                x: index * 180, // Staggered horizontal position
                                scale: 1 - index * 0.15, // Perspective scale
                                opacity: 1 - index * 0.2,
                                zIndex: 10 - index,
                                filter: isFirst ? 'blur(0px)' : 'blur(2px)' // Blur back cards slightly
                            }}
                            exit={{ x: -200, opacity: 0 }}
                            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                            className={clsx(
                                "absolute w-[350px] md:w-[400px] aspect-[3/4] cursor-pointer",
                                 !isFirst && "pointer-events-none"
                            )}
                            onClick={() => isFirst && onSelect(member)}
                        >
                            <div className="w-full h-full relative overflow-hidden bg-gray-200 flex items-center justify-center">
                                {member.image ? (
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="text-4xl font-bold text-gray-400 font-playfair">
                                        {member.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
             </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer Navigation & Name display */}
      <div className="absolute bottom-4 w-full px-6 md:px-12 lg:px-24 flex flex-col md:flex-row justify-between items-end md:items-center z-[100]">
         {/* Center Controls aligned with the active image visually */}
         <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 translate-y-24 flex flex-col items-center gap-6">
             <div className="text-center space-y-2">
                 <motion.h3 
                   key={activeIndex}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="text-3xl font-playfair"
                 >
                    {members[activeIndex].name}
                 </motion.h3>
                 <div className="flex gap-2 justify-center">
                     {members[activeIndex].tags.map((tag) => (
                         <span key={tag} className="px-3 py-1 border border-gray-300 rounded-full text-xs tracking-wider uppercase bg-[#f4f1ea]/50">
                             {tag}
                         </span>
                     ))}
                 </div>
             </div>

             <div className="flex gap-4">
                 <button 
                    onClick={handlePrev}
                    className="w-16 h-10 border border-gray-400 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                 >
                     <ArrowLeft className="w-5 h-5" />
                 </button>
                 <button 
                    onClick={handleNext}
                    className="w-16 h-10 border border-gray-400 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                 >
                     <ArrowRight className="w-5 h-5" />
                 </button>
             </div>
         </div>

         {/* Counter */}
         <div className="hidden md:block text-5xl font-playfair ml-auto">
             {activeIndex + 1} <span className="text-2xl text-gray-400 font-sans">/ {members.length}</span>
         </div>
      </div>
    </div>
  );
}
