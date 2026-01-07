"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowLeft, Linkedin } from "lucide-react"; // Using ArrowLeft for back
import Image from "next/image";
import { TeamMember } from "./data";

interface TeamMemberDetailProps {
  member: TeamMember;
  onBack: () => void;
}

export default function TeamMemberDetail({ member, onBack }: TeamMemberDetailProps) {
  return (
    <div className="h-screen w-full relative flex flex-col md:flex-row bg-[#dcdcd4] scale-[0.9] origin-center">
      
      {/* Header - Back Button */}
      <div className="absolute top-8 left-8 z-30">
        <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm tracking-widest hover:opacity-70"
        >
            <ArrowLeft className="w-4 h-4" /> BACK
        </button>
      </div>



      {/* Top Title Section */}
      <div className="absolute top-20 w-full text-center z-20">
          <div className="flex justify-center gap-4 mb-4">
             {member.tags.map(tag => (
                 <span key={tag} className="border border-slate-300 px-4 py-1 rounded-full text-xs uppercase tracking-wider text-slate-600 font-medium">{tag}</span>
             ))}
          </div>
          <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-6xl md:text-8xl font-playfair"
          >
              <span className="italic text-gray-400 font-light mr-4">{member.name.split(" ")[0]}</span>
              {member.name.split(" ").slice(1).join(" ")}
          </motion.h1>
      </div>

      {/* Main Content Split */}
      <div className="w-full h-full flex flex-col md:flex-row pt-40">
        {/* Left Image Section */}
        <div className="w-full md:w-1/2 h-full relative p-12 flex items-end justify-center">
             <motion.div 
                layoutId={`card-${member.id}`}
                className="relative w-full max-w-md aspect-[3/4] shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden"
             >
                 {member.image ? (
                     <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                     />
                 ) : (
                     <span className="text-9xl font-playfair text-gray-300 font-bold opacity-50">
                        {member.name.split(' ').map(n => n[0]).join('')}
                     </span>
                 )}
             </motion.div>
        </div>

        {/* Right Info Section */}
        <div className="w-full md:w-1/2 h-full bg-[#b8bea4] relative p-12 flex flex-col justify-center">
             {/* Sticker Badge */}
             {/* LinkedIn Button */}
             <motion.a 
               href="#" // Placeholder link
               initial={{ scale: 0, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.95 }}
               transition={{ delay: 0.4, type: "spring" }}
               className="absolute top-12 right-12 w-16 h-16 bg-[#0077B5] rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer z-40 group"
             >
                <Linkedin className="w-6 h-6 group-hover:hidden transition-all" />
                <ArrowUpRight className="w-6 h-6 hidden group-hover:block transition-all" />
             </motion.a>

             <div className="max-w-lg mt-20">
                 <motion.p 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 0.3 }}
                   className="text-lg leading-relaxed text-gray-800"
                 >
                    {member.bio}
                 </motion.p>
                 
                 <div className="mt-16 flex gap-20">
                     <div className="flex flex-col">
                         <span className="text-6xl font-playfair">{member.stats.yearsInPractice}</span>
                         <span className="text-sm mt-2 text-gray-700">Years Exp</span>
                     </div>
                      <div className="flex flex-col">
                         <span className="text-6xl font-playfair">{member.stats.rating}</span>
                         <span className="text-sm mt-2 text-gray-700 underline cursor-pointer">Projects Delivered</span>
                     </div>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
}
