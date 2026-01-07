import React from 'react';
import { MoveRight } from 'lucide-react';

export default function CTASection() {
  return (
    <div className="relative z-10">
         {/* Top Wave */}
         <div className="w-full leading-[0] text-[#FF6B6B] bg-white translate-y-1">
             <svg className="w-full h-12 md:h-24 block" preserveAspectRatio="none" viewBox="0 0 1440 320">
                <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
             </svg>
         </div>

         <section className="bg-[#FF6B6B] text-white py-12 md:py-24 px-6 md:px-12 relative overflow-hidden">
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] border-[40px] border-white/20 rounded-full translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-900/10 rounded-full -translate-x-1/2 translate-y-1/3 blur-3xl"></div>

            <div className="max-w-[1600px] mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
               <div className="max-w-2xl">
                  <h2 className="text-5xl md:text-7xl font-medium leading-tight mb-8">
                     Get in touch and <br />
                     learn more
                  </h2>
                  <p className="text-xl text-white/80 max-w-lg">
                     Interested in the technical details? Our team is always ready to discuss our architecture and future roadmap.
                  </p>
               </div>
               
               <button className="group flex items-center gap-4 text-xl font-bold tracking-wide uppercase hover:underline underline-offset-8 transition-all">
                  Contact Us
                  <MoveRight className="group-hover:translate-x-2 transition-transform" />
               </button>
            </div>
         </section>

         {/* Bottom Wave */}
         <div className="w-full leading-[0] text-[#FF6B6B] bg-white rotate-180 -translate-y-1">
             <svg className="w-full h-12 md:h-24 block" preserveAspectRatio="none" viewBox="0 0 1440 320">
                <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
             </svg>
         </div>
      </div>
  );
}
