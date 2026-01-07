
import React from 'react';
import { FeaturesAccordion } from '@/components/features/FeaturesAccordion';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col pt-20"> 
       <Navbar /> 
        <main className="flex-grow bg-[#FDFDFD] pb-12">
            <div className="max-w-7xl mx-auto px-8 mb-16 pt-8">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
                    <div className="max-w-2xl">
                        <h4 className="text-[#6B8E5F] font-semibold tracking-wide uppercase text-sm mb-4">
                            Digital Learning
                        </h4>
                        <h1 className="text-6xl font-medium text-[#1A1A1A] leading-[1.1] tracking-tight">
                            Discover the freedom <br />
                            of learning on your terms
                            <span className="relative inline-block ml-4">
                                {/* Decorative underline/scribble could go here */}
                                <svg className="absolute -bottom-2 w-full left-0 h-3 text-[#9ab592]" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.5" />
                                </svg>
                            </span>
                        </h1>
                    </div>

                    <div className="flex flex-col items-start gap-6">
                        <p className="text-gray-600 max-w-sm text-lg leading-relaxed">
                            Empowering students, teachers, and institutions with cutting-edge tools and resources.
                        </p>
                        
                        <button className="group flex items-center gap-4 bg-[#FF6B6B] text-white pl-6 pr-2 py-2 rounded-full hover:bg-[#ff8585] transition-colors">
                            <span className="font-medium">Start Learning</span>
                            <div className="bg-white text-black rounded-full p-2 group-hover:bg-gray-200 transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </button>
                    </div>
                </div>

            </div>

            <FeaturesAccordion />
        </main>
      <Footer />
    </div>
  );
}
