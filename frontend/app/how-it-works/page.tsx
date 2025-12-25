"use client";

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowRight, MoveRight } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-[#FF6B6B] selection:text-white">
      <Navbar />

      {/* 1. Hero Section: Light Professional Design */}
      <section className="relative pt-24 lg:pt-32 pb-24 overflow-hidden bg-white text-gray-900">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF6B6B]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 contrast-125 brightness-100"></div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* Left: Typography & Social Proof */}
          <div className="flex flex-col justify-center">
             <div className="flex items-center gap-2 mb-8">
                <span className="flex h-2 w-2 rounded-full bg-[#FF6B6B]"></span>
                <span className="text-sm font-bold tracking-widest uppercase text-gray-500">
                   System Architecture
                </span>
             </div>

             <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.05] tracking-tight mb-8 text-gray-900">
               Automated <br />
               intelligence <br />
               <span className="text-gray-400 italic font-light">for education.</span>
             </h1>

             <p className="text-lg md:text-xl text-gray-500 max-w-lg leading-relaxed mb-10">
               A powerful engine that helps you stay organized and manage learning paths efficiently. Take control of your progress with our event-driven architecture.
             </p>

             {/* Action Buttons */}
             <div className="flex flex-wrap gap-4 mb-20 scroll-px-10">
                 <button className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-all flex items-center gap-3 shadow-xl shadow-gray-200">
                    <span className="text-xl">⚡</span> Get Early Access
                 </button>
                 <button className="border border-gray-200 px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-gray-50 transition-all text-gray-900 hover:border-gray-300">
                    View Documentation
                 </button>
             </div>

             {/* Social Proof (Bottom Left) */}
             <div className="flex items-center gap-6">
                <div className="flex -space-x-4">
                   <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" className="w-full h-full object-cover" alt="User" />
                   </div>
                   <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                      <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" className="w-full h-full object-cover" alt="User" />
                   </div>
                   <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 overflow-hidden flex items-center justify-center text-xs font-bold text-white relative shadow-sm">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" className="w-full h-full object-cover opacity-80" alt="User" />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">+2k</span>
                   </div>
                </div>
                <div>
                   <p className="text-4xl font-bold text-gray-900">1.2M</p>
                   <p className="text-sm text-gray-500">Users already learning</p>
                </div>
                
                {/* Arrow Circle */}
                <div className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center ml-4 group cursor-pointer hover:bg-black hover:text-white transition-all shadow-sm">
                   <ArrowRight className="w-6 h-6 transform group-hover:-rotate-45 transition-transform duration-300" />
                </div>
             </div>
          </div>

          {/* Right: Phone Mockup & Floating Cards */}
          <div className="relative h-[800px] w-full flex items-center justify-center perspective-[2000px]">
             
             {/* Abstract Star/Burst Shape Behind */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] pointer-events-none">
                 <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#FF6B6B]/5 animate-[spin_60s_linear_infinite]">
                    <path fill="currentColor" d="M42.7,-73.4C55.9,-65.1,67.7,-56.1,76.5,-45C85.3,-33.9,91.1,-20.7,90.3,-7.8C89.4,5,81.8,17.4,72.6,28.2C63.4,39,52.5,48.1,41.2,55.5C29.9,62.9,18.2,68.6,5.3,69.7C-7.6,70.9,-21.7,67.5,-34.4,60.8C-47.1,54.1,-58.4,44.1,-67.2,32.2C-76,20.2,-82.3,6.3,-81.9,-7.4C-81.5,-21.1,-74.4,-34.6,-64.1,-45.3C-53.8,-56,-40.3,-63.9,-27.1,-72.1C-13.8,-80.3,-0.8,-88.8,11.8,-86.3C24.4,-83.8,48.8,-70.3,42.7,-73.4Z" transform="translate(100 100)" />
                 </svg>
             </div>

             {/* Connecting Lines */}
             <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none stroke-gray-200">
                <path d="M 200 600 L 350 500" fill="none" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M 500 250 L 400 350" fill="none" strokeWidth="1" strokeDasharray="4 4" />
             </svg>

             {/* Phone Chassis */}
             <div className="relative w-[340px] h-[680px] bg-[#0B0F17] rounded-[3.5rem] border-[10px] border-gray-900 shadow-2xl z-10 overflow-hidden transform rotate-[-6deg] hover:rotate-0 transition-transform duration-700 shadow-xl shadow-gray-200">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>
                
                {/* Phone Screen */}
                <div className="w-full h-full bg-[#0F172A] text-white p-6 pt-12 overflow-hidden flex flex-col relative">
                   <div className="flex justify-between items-center mb-10">
                       <h2 className="text-2xl font-medium tracking-tight">Manage <br /><span className="text-[#FF6B6B] font-serif italic">your learning</span> ✏️</h2>
                       <div className="w-8 h-8 rounded-full bg-gray-800 bg-[url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop')] bg-cover"></div>
                   </div>

                   {/* Activity Card (Highlighted) */}
                   <div className="bg-[#FF6B6B] text-white rounded-3xl p-6 mb-4 relative overflow-hidden group">
                      <div className="absolute top-2 right-2 p-2 bg-white/20 rounded-full hover:bg-white/30 cursor-pointer">
                         <MoveRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                      <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">High Priority</span>
                      <h3 className="text-xl font-medium leading-tight mb-2">Algorithm Design & Analysis</h3>
                      <p className="text-white/80 text-sm mb-4">Complete Module 4 by Friday</p>
                      
                      <div className="flex items-center gap-3 text-xs opacity-90 border-t border-white/20 pt-4">
                         <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">R</div>
                         <span>Assigned to Rikik</span>
                         <span className="ml-auto">Due 24 Feb</span>
                      </div>
                   </div>

                   {/* Secondary Card */}
                   <div className="bg-[#1E293B] rounded-3xl p-6 mb-4 relative border border-white/5">
                      <span className="inline-block px-3 py-1 bg-gray-700/50 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Medium</span>
                      <h3 className="text-lg font-medium leading-tight mb-2 text-gray-200">System Design Video</h3>
                      <p className="text-gray-500 text-sm mb-4">Watch the lecture on Kafka</p>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                         <span>📹 45 mins</span>
                      </div>
                   </div>

                   {/* Fab Button */}
                   <div className="mt-auto flex justify-center mb-4">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black shadow-lg hover:scale-110 transition-transform cursor-pointer">
                         <span className="text-2xl font-light">+</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Floating External Cards (Connected Nodes) */}
             
             {/* Card 1: Assigned To */}
             <div className="absolute bottom-32 -left-12 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-[bounce_4s_infinite] z-20 max-w-[200px] border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-xl">🚀</div>
                <div>
                   <p className="text-[10px] text-gray-500 font-bold uppercase">Status</p>
                   <p className="text-sm font-bold text-gray-900">Course Enrolled</p>
                </div>
             </div>

             {/* Card 2: Plan */}
             <div className="absolute top-48 -right-4 bg-white p-4 rounded-2xl shadow-xl z-20 animate-[bounce_5s_infinite] animation-delay-1000 border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-2 h-2 rounded-full bg-green-500"></div>
                   <p className="text-xs font-bold text-gray-600">Learning Path Created</p>
                </div>
                <div className="h-1 w-32 bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full w-2/3 bg-green-500"></div>
                </div>
             </div>

          </div>

        </div>
      </section>

      {/* 2. Workflow Section (Replaced Dark Section) */}
      <section className="bg-gray-50 py-32 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto text-center mb-20">
            <div className="w-16 h-1 bg-[#FF6B6B] mx-auto mb-6 rounded-full"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How it works</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
               Our event-driven pipeline ensures that from the moment you interact, our system scales instantly to meet demand.
            </p>
        </div>

        <div className="max-w-[1400px] mx-auto relative">
           {/* Connecting Line (SVG) - Visible on lg screens */}
           <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 hidden lg:block pointer-events-none z-0">
              <svg className="w-full h-40" preserveAspectRatio="none" viewBox="0 0 1200 100">
                <path 
                  d="M 100,50 Q 300,100 450,50 T 800,50 T 1100,50" 
                  fill="none" 
                  stroke="#E0E7FF" 
                  strokeWidth="3" 
                  strokeDasharray="8 8" 
                  className="animate-[dash_30s_linear_infinite]"
                />
              </svg>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                 <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8 w-64 h-48 flex flex-col gap-3 relative group hover:-translate-y-2 transition-transform duration-300">
                    {/* Abstract UI representation */}
                    <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                    <div className="h-2 w-1/2 bg-gray-100 rounded"></div>
                    <div className="flex-1 bg-indigo-50/50 rounded-lg mt-2 border border-indigo-100 border-dashed"></div>
                    {/* Circle badge */}
                     <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-[#FF6B6B] font-bold border border-gray-50">1</div>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">User Action</h3>
                 <p className="text-center text-gray-500 text-sm">Upload video or enroll</p>
              </div>

               {/* Step 2 */}
              <div className="flex flex-col items-center mt-12 lg:mt-0">
                 <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8 w-64 h-48 flex flex-col gap-3 relative group hover:-translate-y-2 transition-transform duration-300">
                    <div className="flex gap-2">
                       <div className="h-8 w-8 bg-green-100 rounded-lg"></div>
                       <div className="h-8 flex-1 bg-gray-50 rounded-lg"></div>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded mt-2"></div>
                     <div className="h-2 w-2/3 bg-gray-100 rounded"></div>
                    {/* Circle badge */}
                     <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-[#FF6B6B] font-bold border border-gray-50">2</div>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Event Queue</h3>
                 <p className="text-center text-gray-500 text-sm">Kafka creates message</p>
              </div>

               {/* Step 3 */}
              <div className="flex flex-col items-center">
                 <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8 w-64 h-48 flex flex-col gap-3 relative group hover:-translate-y-2 transition-transform duration-300">
                     <div className="flex justify-between items-center mb-2">
                         <div className="h-2 w-10 bg-gray-200 rounded"></div>
                         <div className="h-2 w-4 bg-gray-200 rounded"></div>
                     </div>
                    <div className="flex-1 bg-gray-800 rounded-xl p-3 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin"></div>
                    </div>
                    {/* Circle badge */}
                     <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-[#FF6B6B] font-bold border border-gray-50">3</div>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Processing</h3>
                 <p className="text-center text-gray-500 text-sm">AI analysis & Vectorizing</p>
              </div>

               {/* Step 4 */}
              <div className="flex flex-col items-center mt-12 lg:mt-0">
                 <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8 w-64 h-48 flex flex-col gap-3 relative group hover:-translate-y-2 transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">✓</div>
                        <div className="space-y-1">
                             <div className="h-2 w-20 bg-gray-100 rounded"></div>
                             <div className="h-2 w-12 bg-gray-100 rounded"></div>
                        </div>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-lg flex-1">
                        <div className="h-2 w-full bg-white/50 rounded mb-2"></div>
                        <div className="h-2 w-3/4 bg-white/50 rounded"></div>
                    </div>
                    {/* Circle badge */}
                     <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-[#FF6B6B] font-bold border border-gray-50">4</div>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Delivery</h3>
                 <p className="text-center text-gray-500 text-sm">Instant access & RAG</p>
              </div>
           </div>
        </div>
      </section>

      {/* 3. Numbered Steps Section (The "01, 02, 03" Layout) */}
      <section className="py-32 px-6 md:px-12 bg-white max-w-[1600px] mx-auto">
         
         {/* Step 01 */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32 items-center">
            <div className="lg:col-span-2 hidden lg:block">
               <span className="text-sm font-bold tracking-widest text-[#FF6B6B] -rotate-90 block whitespace-nowrap origin-center translate-y-24">
                  INGESTION + AUTH
               </span>
            </div>
            
            <div className="lg:col-span-4">
               <span className="text-7xl md:text-9xl font-light text-indigo-100 block -ml-2 mb-4">01</span>
               <h3 className="text-4xl font-medium mb-6">Secure Entry Point</h3>
               <p className="text-lg text-gray-500 leading-relaxed mb-8">
                  The API Gateway handles all incoming traffic, routing requests to specific microservices. Identity is verified instantly via our Auth Service using JWT and OAuth protocols.
               </p>
               <ul className="space-y-2 text-sm font-bold text-gray-800">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full"></div>Load Balancing</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full"></div>Rate Limiting</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full"></div>Role-Based Access</li>
               </ul>
            </div>

            <div className="lg:col-span-6 flex justify-center lg:justify-end">
               <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
                   <div className="absolute inset-0 bg-gray-100 rounded-[3rem] overflow-hidden shadow-2xl">
                      <img src="https://images.unsplash.com/photo-1558494949-ef526b01201b?q=80&w=2600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Secure Server" />
                   </div>
               </div>
            </div>
         </div>

         {/* Step 02 */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32 items-center">
             <div className="lg:col-span-6 order-2 lg:order-1 flex justify-center lg:justify-start">
               <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
                   <div className="absolute inset-0 bg-gray-100 rounded-[3rem] overflow-hidden shadow-2xl">
                      <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Kafka Streams" />
                   </div>
               </div>
            </div>

            <div className="lg:col-span-4 order-1 lg:order-2">
               <span className="text-7xl md:text-9xl font-light text-indigo-100 block -ml-2 mb-4">02</span>
               <h3 className="text-4xl font-medium mb-6">We do the leg work</h3>
               <p className="text-lg text-gray-500 leading-relaxed mb-8">
                  Our event-driven core uses Apache Kafka to process tasks asynchronously. When you upload a video or enroll in a course, the system reacts instantly without making you wait.
               </p>
                <ul className="space-y-2 text-sm font-bold text-gray-800">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full"></div>Async Processing</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full"></div>Kafka Consumers</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full"></div>Redis Caching</li>
               </ul>
            </div>

            <div className="lg:col-span-2 hidden lg:block order-3 relative">
               <span className="absolute top-0 right-0 text-sm font-bold tracking-widest text-[#FF6B6B] rotate-90 whitespace-nowrap origin-center translate-y-24">
                  EVENTS + QUEUES
               </span>
            </div>
         </div>

         {/* Step 03 */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-2 hidden lg:block">
               <span className="text-sm font-bold tracking-widest text-[#FF6B6B] -rotate-90 block whitespace-nowrap origin-center translate-y-24">
                  AI + TRANSFORMS
               </span>
            </div>
            
            <div className="lg:col-span-4">
               <span className="text-7xl md:text-9xl font-light text-indigo-100 block -ml-2 mb-4">03</span>
               <h3 className="text-4xl font-medium mb-6">We recommend what's best</h3>
               <p className="text-lg text-gray-500 leading-relaxed mb-8">
                  Our AI engine takes over to transform raw content into searchable knowledge. Using Whisper for transcription and Vector DBs for semantic understanding, we make every second of video searchable.
               </p>
               <ul className="space-y-2 text-sm font-bold text-gray-800">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full"></div>Whisper AI</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full"></div>Vector Embeddings</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full"></div>RAG Pipeline</li>
               </ul>
            </div>

            <div className="lg:col-span-6 flex justify-center lg:justify-end">
               <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
                  <div className="absolute inset-0 bg-gray-100 rounded-[4rem] overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-700">
                     <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop" className="w-full h-full object-cover" alt="AI Intelligence" />
                  </div>
               </div>
            </div>
         </div>

      </section>

      {/* 4. Orange CTA Section (The bottom part of the design) */}
      {/* 4. Orange CTA Section (The bottom part of the design) */}
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

      <Footer />
    </div>
  );
}
