import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, ArrowUpRight } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-900 pt-16 md:pt-24 pb-8 md:pb-12 px-6 md:px-12 relative overflow-hidden border-t border-gray-100">
      {/* Background Gradient Effect - Subtle glow */}
      <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-50/80 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col justify-between min-h-auto md:min-h-[600px]">
        {/* Top Section: CTA */}
        <div className="max-w-4xl">
           <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Contact Us</span>
           </div>
           
           <h2 className="text-3xl md:text-6xl font-medium leading-tight mb-8 text-gray-900">
             Interested in working together, <span className="text-gray-400">trying our platform or simply learning more?</span>
           </h2>
        </div>

        {/* Middle Section: Links & Email */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-12 mt-8 md:mt-12 mb-16 md:mb-24">
           {/* Email */}
           <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-500">Contact us at:</span>
              <a href="mailto:hello@shikshak.com" className="text-xl md:text-2xl font-medium text-gray-900 hover:text-indigo-600 transition-colors flex items-center gap-2 group">
                 hello@shikshak.com
                 <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600" />
              </a>
           </div>

           {/* Navigation */}
           <nav className="flex flex-wrap gap-x-8 gap-y-4 md:gap-12 text-lg font-medium text-gray-500">
              <a href="/how-it-works" className="hover:text-black transition-colors">How It Works</a>
              <a href="#" className="hover:text-black transition-colors">Benefits</a>
              <a href="#" className="hover:text-black transition-colors">Features</a>
              <a href="#" className="hover:text-black transition-colors">Team</a>
           </nav>
        </div>

        {/* Bottom Section: Logo & Socials */}
        <div className="border-t border-gray-100 pt-8 md:pt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            {/* Big Logo */}
            <div className="flex-1 w-full md:w-auto">
               <div className="scale-100 md:scale-150 origin-left">
                  <Logo className="h-10 md:h-12 w-auto text-black" />
               </div>
            </div>

            <div className="flex flex-col-reverse md:flex-row items-start md:items-center gap-6 md:gap-8 w-full md:w-auto justify-between md:justify-end">
                <span className="text-sm text-gray-500">© 2024 Shikshak. All rights reserved.</span>
                
                <div className="flex items-center gap-6 text-gray-400">
                   <a href="#" className="hover:text-black transition-colors">LinkedIn</a>
                   <a href="#" className="hover:text-black transition-colors">Facebook</a>
                   <a href="#" className="hover:text-black transition-colors">Twitter</a>
                </div>
            </div>
        </div>

        {/* Giant Text Logo Effect (Datawizz style) - Optional overlay at bottom */}
         <div className="absolute bottom-0 md:bottom-[-20px] left-0 right-0 flex justify-center pointer-events-none select-none overflow-hidden">
            <span className="text-[17vw] md:text-[16rem] font-bold leading-none tracking-tighter text-[#E05252] opacity-30 md:opacity-15 whitespace-nowrap">
              SHIKSHAK
            </span>
         </div>
      </div>
    </footer>
  );
};

export default Footer;
