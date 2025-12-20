'use client';
import React, { useState, useCallback } from 'react';
import { AuthUser } from '@/types/auth';
import { authClient } from '@/lib/auth-client';
import { GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AuthPageProps {
    onLoginSuccess?: (user: AuthUser) => void;
}

const AuthPageComponent: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "http://localhost:4000/auth", // Ensure redirect goes to Frontend port 3001
            });
            // The redirect happens automatically, so we might not reach here unless error or staying on page
        } catch (err) {
            console.error("Login failed", err);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-white font-sans">

            {/* Left Side: Brand & Visuals */}
            <div className="hidden lg:flex w-1/2 bg-blue-200 relative overflow-hidden flex-col justify-between p-16 text-black">
                <div className="relative top-20 z-10 max-w-lg">
                    <h1 className="text-5xl font-bold leading-tight mb-6">Register to start your  <span className="text-pretty">शिक्षक/शिष्य</span> journey today.  </h1>
                    <p className="text-brand-100 text-lg leading-relaxed mb-8">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, libero!
                    </p>
                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex-1">
                            <div className="text-3xl font-bold mb-1">10</div>
                            <div className="text-brand-100 text-sm">Active Students</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex-1">
                            <div className="text-3xl font-bold mb-1">5+</div>
                            <div className="text-brand-100 text-sm">Expert Mentors</div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-sm text-brand-200">
                    © 2025 Tanishk rights reserved
                </div>
            </div>

            {/* Right Side: Authentication Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 relative">
                {/* Mobile Header */}


                <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">Welcome Back</h2>
                        <p className="text-slate-500">Please enter your details to sign in.</p>
                    </div>

                    <div className="space-y-6">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full flex cursor-pointer items-center justify-center gap-3 bg-white border border-slate-200 hover:border-brand-300 hover:bg-slate-50 text-slate-700 font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md group"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
                                    <span className="group-hover:text-brand-600 transition-colors">Sign in with Google</span>
                                </>
                            )}
                        </button>

                        <div className="relative flex items-center justify-center">
                            <div className="border-t border-slate-200 w-full absolute"></div>
                            <span className="bg-white px-4 text-xs text-slate-400 relative z-10 font-medium uppercase tracking-wider">Secure Access</span>
                        </div>

                        {/* Fake Email Form for Visual Completeness */}
                        <div className="opacity-50 pointer-events-none filter blur-[1px]">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                    <input type="email" disabled className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="name@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                    <input type="password" disabled className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="••••••••" />
                                </div>
                                <button className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl">Sign In</button>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-brand-600 font-medium bg-brand-50 inline-block px-3 py-1 rounded-full">
                                Currently, only Google Login is supported.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-sm">
                        <ShieldCheck size={16} />
                        <span>Your data is encrypted and secure.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AuthPage = AuthPageComponent;
export default AuthPageComponent;