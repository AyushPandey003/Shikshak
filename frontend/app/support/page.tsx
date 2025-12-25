"use client";

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Mail, MapPin, Phone, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { CONTACT_INFO } from '@/types/contact';

export default function SupportPage() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col relative">
      
      {/* Orange Top Background Section with Unique Design */}
      <div className="absolute top-0 left-0 right-0 h-[75vh] overflow-hidden z-0 pointer-events-none">
        {/* Base curved shape */}
        <div className="absolute top-[-10%] left-[-25%] w-[150%] h-[100%] bg-[#FF6B6B] rounded-b-[100%] shadow-inner"></div>
        
        {/* Decorative Floating Circles - Enhanced */}
        <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[20%] left-[10%] w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-[40%] left-[30%] w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        
        {/* Geometric Grid Pattern */}
        <svg className="absolute top-20 left-10 w-32 h-32 opacity-10" viewBox="0 0 100 100">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
        
        {/* Organic Wave Pattern */}
        <svg className="absolute bottom-0 left-0 w-full h-24 opacity-20" preserveAspectRatio="none" viewBox="0 0 1440 100">
          <path d="M0,50 Q360,10 720,50 T1440,50 L1440,100 L0,100 Z" fill="white"/>
        </svg>
        
        {/* Floating Geometric Shapes */}
        <svg className="absolute top-[15%] right-[25%] w-20 h-20 opacity-20" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="2"/>
          <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="1.5"/>
          <circle cx="50" cy="50" r="15" fill="none" stroke="white" strokeWidth="1"/>
        </svg>
        
        <svg className="absolute top-[50%] right-[15%] w-16 h-16 opacity-15" viewBox="0 0 100 100">
          <rect x="25" y="25" width="50" height="50" fill="none" stroke="white" strokeWidth="2" transform="rotate(45 50 50)"/>
        </svg>
        
        <svg className="absolute bottom-[30%] right-[35%] w-24 h-24 opacity-10" viewBox="0 0 100 100">
          <path d="M50,10 L90,90 L10,90 Z" fill="none" stroke="white" strokeWidth="2"/>
          <path d="M50,30 L70,70 L30,70 Z" fill="none" stroke="white" strokeWidth="1.5"/>
        </svg>
        
        {/* Dotted Pattern Accent */}
        <div className="absolute top-[25%] left-[15%] opacity-10">
          <svg width="80" height="80" viewBox="0 0 80 80">
            {[...Array(5)].map((_, i) => 
              [...Array(5)].map((_, j) => (
                <circle key={`${i}-${j}`} cx={i * 20 + 10} cy={j * 20 + 10} r="2" fill="white"/>
              ))
            )}
          </svg>
        </div>
        
        {/* Gradient Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>
      </div>

      {/* Navbar Container - Z-Index to stay on top */}
      <div className="h-[80px] relative z-50">
        <Navbar />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center pt-8 pb-24 px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Floating Card */}
        <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          
          {/* Left Column: Form */}
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Get In Touch</h1>
            <p className="text-gray-500 mb-10">We are here for you! How can we help?</p>

            {isSubmitted ? (
               <div className="flex flex-col items-center text-center py-12 animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-[#FF6B6B] mb-6 shadow-sm animate-bounce">
                      <CheckCircle2 size={40} strokeWidth={3} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 text-lg">We have received your message.</p>
                  <p className="text-[#FF6B6B] font-medium mt-2">Please check your mail!</p>
                  
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 text-gray-400 hover:text-gray-600 text-sm font-medium underline underline-offset-4"
                  >
                    Send another message
                  </button>
               </div>
            ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="name" className="sr-only">Name</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Enter your name"
                      className="w-full px-6 py-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500/20 text-gray-700 placeholder-gray-400 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email address"
                      className="w-full px-6 py-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500/20 text-gray-700 placeholder-gray-400 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="sr-only">Message</label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Go ahead, we are listening..."
                      className="w-full px-6 py-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500/20 text-gray-700 placeholder-gray-400 outline-none transition-all resize-none"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-xl bg-[#FF6B6B] text-white font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 active:scale-[0.98] transform duration-100"
                  >
                    Submit
                  </button>
                </form>
            )}
          </div>

          {/* Right Column: Illustration & Info */}
          <div className="bg-orange-50/30 p-8 md:p-12 lg:p-16 flex flex-col justify-center items-center lg:items-start border-l border-gray-50">
            
            {/* Illustration Placeholder */}
            <div className="w-full flex justify-center mb-12 relative">
               <div className="w-64 h-64 relative">
                  <div className="absolute inset-0 bg-orange-100 rounded-full opacity-50 blur-xl animate-pulse"></div>
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                      <MessageSquare size={120} className="text-orange-500/20 rotate-[-10deg]" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl shadow-lg rotate-[5deg]">
                         <Send size={40} className="text-[#FF6B6B]" />
                      </div>
                  </div>
               </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-8 w-full">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border-2 border-orange-100 flex items-center justify-center shrink-0 text-[#FF6B6B] group-hover:bg-[#FF6B6B] group-hover:text-white group-hover:border-[#FF6B6B] transition-all duration-300">
                  <MapPin size={22} />
                </div>
                <div>
                   <p className="font-semibold text-gray-900 text-sm md:text-base">{CONTACT_INFO.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border-2 border-orange-100 flex items-center justify-center shrink-0 text-[#FF6B6B] group-hover:bg-[#FF6B6B] group-hover:text-white group-hover:border-[#FF6B6B] transition-all duration-300">
                  <Phone size={22} />
                </div>
                <div>
                   <p className="font-semibold text-gray-900 text-sm md:text-base">{CONTACT_INFO.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border-2 border-orange-100 flex items-center justify-center shrink-0 text-[#FF6B6B] group-hover:bg-[#FF6B6B] group-hover:text-white group-hover:border-[#FF6B6B] transition-all duration-300">
                  <Mail size={22} />
                </div>
                <div>
                   <p className="font-semibold text-gray-900 text-sm md:text-base">{CONTACT_INFO.email}</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
