"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, MoveRight } from 'lucide-react';
import LaptopMockup from '@/components/how-it-works/LaptopMockup';
import WorkflowSteps from '@/components/how-it-works/WorkflowSteps';
import ProcessSteps from '@/components/how-it-works/ProcessSteps';
import CTASection from '@/components/how-it-works/CTASection';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="bg-white min-h-screen font-sans selection:bg-[#FF6B6B] selection:text-white overflow-x-hidden flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
      {/* 
        =============================================
        HERO SECTION
        =============================================
      */}
      <section className="relative pt-24 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
         
         <div className="z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold tracking-wider mb-8 uppercase">
               <Zap size={14} fill="currentColor" />
               SYSTEM ARCHITECTURE
            </div>
            
            <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-gray-900 mb-8 leading-[0.9]">
               Automated <br />
               <span className="font-serif italic text-gray-800">intelligence</span> <br />
               <span className="text-gray-300 font-light">for education.</span>
            </h1>

            <p className="text-xl text-gray-500 max-w-xl leading-relaxed mb-10">
               A powerful engine that helps you stay organized and manage learning paths efficiently. Take control of your progress with our event-driven architecture.
            </p>

            <div className="flex flex-wrap gap-4">
               <Link href="/features" className="bg-[#0B0F17] text-white px-8 py-4 rounded-full font-bold tracking-wide hover:bg-gray-900 transition-colors flex items-center gap-3 shadow-xl shadow-gray-200">
                  <Zap size={18} className="text-[#FF6B6B]" fill="#FF6B6B" />
                  FEATURES
               </Link>
               <Link href="/offer" className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-full font-bold tracking-wide hover:bg-gray-50 transition-colors uppercase text-sm flex items-center justify-center">
                  WHAT WE OFFER
               </Link>
            </div>
         </div>

         {/* Right Side: High-Fidelity 3D Laptop Model */}
         <div className="hidden lg:block">
            <LaptopMockup />
         </div>

      </section>

      {/* 
        =============================================
        WORKFLOW STEPS
        =============================================
      */}
      <div id="how-it-works">
        <WorkflowSteps />
      </div>


      {/* 
        =============================================
        DETAILED STEPS (01, 02, 03)
        =============================================
      */}
      <ProcessSteps />


      {/* 
        =============================================
        CTA SECTION
        =============================================
      */}
      <CTASection />

      </main>
      
      <Footer />
    </div>
  );
}