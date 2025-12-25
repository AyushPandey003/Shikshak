'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import { authClient } from '@/lib/auth-client';
import { useAppStore } from '@/store/useAppStore';
import { User, LogOut, ChevronDown } from 'lucide-react'; // Added icons

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // Profile dropdown state
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';

  const { session } = useAppStore();
  console.log(session)

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/');
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  // Handle scroll effect for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Dashboard', href: '/student/dashboard' },
    { name: 'Courses', href: '/courses' },
    { name: 'What we offer', href: '/offer' },
    { name: 'Support', href: '/support' },
  ];

  // Determine if we should show the solid navbar style
  // Always solid if:
  // 1. Not on homepage (internal pages usually need distinct navbar)
  // 2. Scrolled down
  // 3. Mobile menu is open
  const isSolid = !isHomePage || isScrolled || isMobileMenuOpen;

  return (
    <>
      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out rounded-full ${isSolid
          ? 'bg-white border text-base border-slate-200 shadow-sm py-1.5'
          : 'bg-white/50 backdrop-blur-md border border-slate-200/60 shadow-sm py-2.5'
          }
          w-[95%] md:w-[70%] hover:md:w-[90%]
          `}
      >
        <div className="w-full px-4 sm:px-6">
          <div className="flex items-center justify-between h-12">

            {/* Logo Section */}
            <div className="shrink-0">
              <Link href="/" className="flex items-center gap-2 group">
                <Logo className="h-10 transition-transform duration-300 group-hover:scale-105" />
              </Link>
            </div>

            {/* Desktop Navigation Links - Centered via justify-between */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                      ? 'bg-[#FF6B6B] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-[#FF6B6B]'
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right Actions (Auth) */}
            <div className="hidden md:flex items-center relative z-50 gap-4">
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-3 bg-white hover:bg-gray-50 pl-2 pr-4 py-1.5 rounded-full transition-all border border-gray-200 shadow-sm hover:shadow-md"
                  >
                    {session.user?.image ? (
                      <img src={session.user.image} alt={session.user.name || 'User'} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-full flex items-center justify-center shadow-inner">
                        <User size={16} />
                      </div>
                    )}
                    <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">{session.user?.name || 'User'}</span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 overflow-hidden ring-1 ring-black/5">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-medium text-gray-900 truncate">{session.user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User size={16} />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center cursor-pointer gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="bg-[#FF6B6B] text-white hover:bg-[#ff8585] px-6 py-2.5 rounded-full font-medium text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md"
                >
                  Get Started
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div
          className={`md:hidden absolute top-full left-4 right-4 mt-2 bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl transition-all duration-300 ease-in-out origin-top overflow-hidden ${isMobileMenuOpen ? 'max-h-[500px] opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'
            }`}
        >
          <div className="px-4 py-6 space-y-4">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`block px-4 py-3 rounded-2xl text-base font-medium transition-all ${isActive
                      ? 'bg-[#FF6B6B] text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-100">
              {session ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-2 pb-2">
                     {session.user?.image ? (
                      <img src={session.user.image} alt="User" className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100" />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-full flex items-center justify-center shadow-inner">
                        <User size={20} />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{session.user?.name}</p>
                      <p className="text-xs text-gray-500">{session.user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium transition-colors"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center justify-center w-full bg-[#FF6B6B] text-white hover:bg-[#ff8585] px-4 py-3.5 rounded-2xl font-semibold text-base transition-all shadow-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          style={{ top: '64px' }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;