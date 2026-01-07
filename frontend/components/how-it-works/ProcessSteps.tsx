import React from 'react';

export default function ProcessSteps() {
  return (
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
  );
}
