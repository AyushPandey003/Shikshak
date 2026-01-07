import React from 'react';

export default function ProcessSteps() {
  return (
    <section className="py-32 px-6 md:px-12 bg-white max-w-[1600px] mx-auto">
         
         {/* Step 01 */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32 items-center">
            <div className="lg:col-span-2 hidden lg:block">
               <span className="text-sm font-bold tracking-widest text-[#FF6B6B] -rotate-90 block whitespace-nowrap origin-center translate-y-24">
                  UPLOAD + ORGANIZE
               </span>
            </div>
            
            <div className="lg:col-span-4">
               <span className="text-7xl md:text-9xl font-light text-indigo-100 block -ml-2 mb-4">01</span>
               <h3 className="text-4xl font-medium mb-6">Smart Ingestion</h3>
               <p className="text-lg text-gray-500 leading-relaxed mb-8">
                  Upload your course videos, documents, and notes effortlessly. Our system securely organizes your content and prepares it for intelligent processing, supporting various formats instantly.
               </p>
               <ul className="space-y-2 text-sm font-bold text-gray-800">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full"></div>Multi-format Support</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full"></div>Secure Cloud Storage</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full"></div>Instant Organization</li>
               </ul>
            </div>

            <div className="lg:col-span-6 flex justify-center lg:justify-end">
               <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
                   <div className="absolute inset-0 bg-gray-100 rounded-[3rem] overflow-hidden shadow-2xl">
                      <img src="/images/home/step_1_ingestion.png" className="w-full h-full object-cover" alt="Smart Ingestion" />
                   </div>
               </div>
            </div>
         </div>

         {/* Step 02 */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32 items-center">
             <div className="lg:col-span-6 order-2 lg:order-1 flex justify-center lg:justify-start">
               <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
                   <div className="absolute inset-0 bg-gray-100 rounded-[3rem] overflow-hidden shadow-2xl">
                      <img src="/images/home/step_2_ai_processing.png" className="w-full h-full object-cover" alt="AI Transformation" />
                   </div>
               </div>
            </div>

            <div className="lg:col-span-4 order-1 lg:order-2">
               <span className="text-7xl md:text-9xl font-light text-indigo-100 block -ml-2 mb-4">02</span>
               <h3 className="text-4xl font-medium mb-6">AI Transformation</h3>
               <p className="text-lg text-gray-500 leading-relaxed mb-8">
                  Our advanced AI engine analyzes your content frame-by-frame. It transcribes audio, extracts key topics, and creates deep semantic connections to make everything searchable.
               </p>
                <ul className="space-y-2 text-sm font-bold text-gray-800">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full"></div>Audio Transcription</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full"></div>Topic Extraction</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full"></div>Semantic Indexing</li>
               </ul>
            </div>

            <div className="lg:col-span-2 hidden lg:block order-3 relative">
               <span className="absolute top-0 right-0 text-sm font-bold tracking-widest text-[#FF6B6B] rotate-90 whitespace-nowrap origin-center translate-y-24">
                  ANALYZE + INDEX
               </span>
            </div>
         </div>

         {/* Step 03 */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-2 hidden lg:block">
               <span className="text-sm font-bold tracking-widest text-[#FF6B6B] -rotate-90 block whitespace-nowrap origin-center translate-y-24">
                  LEARN + INTERACT
               </span>
            </div>
            
            <div className="lg:col-span-4">
               <span className="text-7xl md:text-9xl font-light text-indigo-100 block -ml-2 mb-4">03</span>
               <h3 className="text-4xl font-medium mb-6">Interactive Learning</h3>
               <p className="text-lg text-gray-500 leading-relaxed mb-8">
                  Students don't just watch—they interact. Ask questions to the video, find exact answers instantly, and get personalized summaries to master any subject faster.
               </p>
               <ul className="space-y-2 text-sm font-bold text-gray-800">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full"></div>Chat with Video</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full"></div>Smart Summaries</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full"></div>Contextual Q&A</li>
               </ul>
            </div>

            <div className="lg:col-span-6 flex justify-center lg:justify-end">
               <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
                  <div className="absolute inset-0 bg-gray-100 rounded-[4rem] overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-700">
                     <img src="/images/home/step_3_interactive_learning.png" className="w-full h-full object-cover" alt="Interactive Learning" />
                  </div>
               </div>
            </div>
         </div>

         {/* Step 04 */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20 items-center">
             <div className="lg:col-span-6 order-2 lg:order-1 flex justify-center lg:justify-start">
               <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
                   <div className="absolute inset-0 bg-gray-100 rounded-[3rem] overflow-hidden shadow-2xl">
                      <img src="/images/home/step_4_ai_proctoring.png" className="w-full h-full object-cover" alt="AI Proctoring" />
                   </div>
               </div>
            </div>

            <div className="lg:col-span-4 order-1 lg:order-2">
               <span className="text-7xl md:text-9xl font-light text-indigo-100 block -ml-2 mb-4">04</span>
               <h3 className="text-4xl font-medium mb-6">Secure Assessment</h3>
               <p className="text-lg text-gray-500 leading-relaxed mb-8">
                  Conduct fair exams with real-time AI proctoring. Our system monitors the environment using MediaPipe & TensorFlow.js to ensure integrity without human intervention.
               </p>
                <ul className="space-y-2 text-sm font-bold text-gray-800">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full"></div>Real-time Face Shield</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full"></div>Environment Analysis</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full"></div>Anti-Cheat Alerts</li>
               </ul>
            </div>

            <div className="lg:col-span-2 hidden lg:block order-3 relative">
               <span className="absolute top-0 right-0 text-sm font-bold tracking-widest text-[#FF6B6B] rotate-90 whitespace-nowrap origin-center translate-y-24">
                  PROCTOR + VERIFY
               </span>
            </div>
         </div>

      </section>
  );
}
