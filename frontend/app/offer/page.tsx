"use client";

import React, { useRef, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { OFFER_STATS, LEARNING_PATHS } from '@/types/offer';

export default function OfferPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [line1, setLine1] = React.useState('');
  const [line2, setLine2] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const fullLine1 = "Passionate";
  const fullLine2 = "and capable.";

  const handleNewsletterSubmit = () => {
    setIsSubmitted(true);
  };

  // Video Autoplay Side Effect
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video play failed:", error);
      });
    }
  }, []);

  // Typewriter Animation Loop
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const wait = (ms: number) => new Promise(resolve => {
      timeoutId = setTimeout(resolve, ms);
    });

    const loopAnimation = async () => {
      while (isMounted) {
        // Type Line 1
        for (let i = 0; i <= fullLine1.length; i++) {
          if (!isMounted) break;
          setLine1(fullLine1.substring(0, i));
          await wait(100);
        }

        if (!isMounted) break;
        await wait(200);

        // Type Line 2
        for (let i = 0; i <= fullLine2.length; i++) {
          if (!isMounted) break;
          setLine2(fullLine2.substring(0, i));
          await wait(100);
        }

        if (!isMounted) break;
        await wait(2000); // Hold full text

        // Delete Line 2
        for (let i = fullLine2.length; i >= 0; i--) {
          if (!isMounted) break;
          setLine2(fullLine2.substring(0, i));
          await wait(50);
        }

        if (!isMounted) break;
        await wait(100);

        // Delete Line 1
        for (let i = fullLine1.length; i >= 0; i--) {
          if (!isMounted) break;
          setLine1(fullLine1.substring(0, i));
          await wait(50);
        }

        if (!isMounted) break;
        await wait(500); // Pause before restarting
      }
    };

    loopAnimation();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navbar - Fixed & Transparent */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Hero Section */}
      <div className="relative h-[85vh] w-full overflow-hidden">
         {/* Background Image */}
         <div 
           className="absolute inset-0 bg-cover bg-center"
           style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop")' }} // Library/Students Image
         >
           <div className="absolute inset-0 bg-black/30"></div> {/* Overlay */}
         </div>

         {/* Professional Layered Wave Design */}
         <div className="absolute bottom-0 left-0 w-full pointer-events-none">
           <svg className="w-full h-24 md:h-32" preserveAspectRatio="none" viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
             {/* Back wave - subtle */}
             <path 
               d="M0,60 C240,90 480,30 720,50 C960,70 1200,40 1440,60 L1440,120 L0,120 Z" 
               fill="white" 
               fillOpacity="0.3"
             />
             {/* Middle wave */}
             <path 
               d="M0,75 C240,45 480,85 720,65 C960,45 1200,75 1440,55 L1440,120 L0,120 Z" 
               fill="white" 
               fillOpacity="0.5"
             />
             {/* Front wave - solid white */}
             <path 
               d="M0,85 C240,55 480,95 720,75 C960,55 1200,85 1440,65 L1440,120 L0,120 Z" 
               fill="white" 
               fillOpacity="1"
             />
           </svg>
         </div>

         {/* Hero Text */}
         <div className="absolute bottom-20 left-4 md:left-20 max-w-4xl text-white z-10">
            <p className="text-sm md:text-base tracking-widest uppercase mb-4 opacity-90 font-medium">About Us</p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight h-[3.5em] md:h-[2.5em]">
               {line1} <br />
               <span className="text-white/90">
                  {line2.substring(0, 4)}
                  <span className="text-[#FF6B6B]">{line2.substring(4)}</span>
               </span>
               <span className="animate-pulse">|</span>
            </h1>
         </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
         
         {/* Left Column: Text Content */}
         <div className="lg:col-span-7 space-y-16">
            <div className="space-y-8">
               <h2 className="text-3xl md:text-5xl font-medium leading-tight text-gray-900">
                  We are proud to offer a wide range of educational resources, <span className="text-gray-400">including specialized courses, expert mentorship, and career guidance.</span>
               </h2>
               <div className="w-24 h-1 bg-[#FF6B6B]"></div>
            </div>

            {/* Video/Image Card */}
            <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl bg-gray-900">
               <video 
                  ref={videoRef}
                  poster="https://images.unsplash.com/photo-1571260899304-425eee046168?q=80&w=2070&auto=format&fit=crop"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover"
               >
                 <source src="video.mp4" type="video/mp4" />
                 Your browser does not support the video tag.
               </video>
                
                <div className="absolute bottom-8 left-8 text-white max-w-xs pointer-events-none z-10">
                   <h3 className="text-3xl font-medium leading-tight mb-4 drop-shadow-md">
                      What education can make <span className="text-[#FF6B6B]">changes.</span>
                   </h3>
                </div>
            </div>
         </div>

         {/* Right Column: Text & Stats */}
         <div className="lg:col-span-5 flex flex-col justify-between space-y-16">
             <div className="space-y-6 text-gray-500 leading-relaxed text-lg">
                <p>
                   Our commitment to excellence is at the heart of everything we do. We believe that quality education is the key to a more sustainable future, and we are dedicated to making it accessible to everyone.
                </p>
                <p>
                   That's why we offer competitive pricing and flexible learning options to help make skill development more affordable for our students.
                </p>
             </div>

             {/* Stats Grid */}
             <div className="space-y-12">
                 <h4 className="text-[#FF6B6B] font-medium text-xl">Numbers</h4>
                 
                 <div className="grid grid-cols-2 gap-y-12 gap-x-8">
                     {OFFER_STATS.map((stat, index) => (
                         <div key={index}>
                            <p className="text-sm text-gray-500 mb-2 font-medium">{stat.label}</p>
                            <p className="text-5xl font-bold text-[#FF6B6B]">{stat.value}</p>
                         </div>
                     ))}
                 </div>
             </div>

             {/* Solutions Links */}
             <div className="space-y-8">
                 <h4 className="text-[#FF6B6B] font-medium text-xl">Our learning paths</h4>
                 
                 <div className="space-y-0 border-t border-gray-200">
                     {LEARNING_PATHS.map((path) => (
                         <div key={path.id} className="group flex items-center justify-between py-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                            <span className="text-xl font-medium flex items-center gap-4">
                               <span className="text-xs font-bold text-gray-400">{path.id}</span>
                               {path.title}
                            </span>
                            <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-[#FF6B6B] group-hover:text-[#FF6B6B] transition-colors">
                               <ArrowRight size={18} />
                            </div>
                         </div>
                     ))}
                 </div>
             </div>
         </div>

      </div>

      {/* Orange Newsletter Section with Unique Design */}
      <div className="relative bg-[#FF6B6B] text-white py-24 px-4 md:px-12 mx-4 md:mx-8 lg:mx-12 mb-8 rounded-[3rem] overflow-hidden">
          {/* Decorative Floating Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Large floating circle - top right */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
            
            {/* Medium floating circle - bottom left */}
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5 blur-2xl"></div>
            
            {/* Geometric accent shapes */}
            <svg className="absolute top-10 right-[15%] w-24 h-24 opacity-20" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="2"/>
              <circle cx="50" cy="50" r="25" fill="none" stroke="white" strokeWidth="1.5"/>
            </svg>
            
            <svg className="absolute bottom-16 left-[20%] w-20 h-20 opacity-15 hidden md:block" viewBox="0 0 100 100">
              <polygon points="50,10 90,90 10,90" fill="none" stroke="white" strokeWidth="2"/>
            </svg>
            
            {/* Subtle gradient mesh overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
              <div className="lg:col-span-6">
                 <h2 className="text-5xl font-medium leading-none mb-6">
                    Stay up to date 
                    on the latest <br />
                    Shikshak news
                 </h2>
                 <p className="text-lg text-black leading-relaxed max-w-sm">
                    For any enquiries, questions or comments please fill out the following form.
                 </p>
              </div>

              <div className="lg:col-span-4 lg:col-start-9 flex flex-col justify-end">
                  {isSubmitted ? (
                      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-8 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#FF6B6B] mb-4 shadow-lg animate-bounce">
                              <CheckCircle2 size={32} strokeWidth={3} />
                          </div>
                          <h3 className="text-2xl font-bold mb-2">Subscribed!</h3>
                          <p className="text-white/90">Thank you for joining our newsletter.</p>
                          <p className="text-white/80 text-sm mt-2 font-medium">Please check your mail!</p>
                      </div>
                  ) : (
                      <div className="space-y-4">
                        <input 
                            type="email" 
                            placeholder="Email address" 
                            className="w-full bg-white/10 backdrop-blur-sm border border-white/30 rounded-full px-6 py-4 placeholder-white/70 text-white focus:outline-none focus:border-white focus:bg-white/20 transition-all"
                        />
                        <button 
                            onClick={handleNewsletterSubmit}
                            className="w-full bg-white text-[#FF6B6B] font-bold text-sm tracking-widest uppercase py-4 flex items-center justify-between px-6 hover:bg-gray-100 hover:shadow-xl transition-all rounded-full group"
                        >
                            Submit
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                  )}
              </div>
          </div>
      </div>

      <Footer />
    </div>
  );
}
