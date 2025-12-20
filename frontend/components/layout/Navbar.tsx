'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import { authClient } from '@/lib/auth-client';
import { User, LogOut, ChevronDown } from 'lucide-react'; // Added icons

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // Profile dropdown state
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';

  const { data: session } = authClient.useSession();

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
    { name: 'Courses', href: '/courses' },
    { name: 'What we offer', href: '/#offer' },
    { name: 'Support', href: '/#support' },
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b ${isSolid
          ? 'bg-white border-slate-200 shadow-sm py-2'
          : 'bg-white/50 backdrop-blur-md border-slate-200/60 shadow-sm py-4'
          }`}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">

            {/* Logo Section */}
            <div className="shrink-0">
              <Link href="/" className="flex items-center gap-2 group">
                <Logo className="h-10 transition-transform duration-300 group-hover:scale-105" />
              </Link>
            </div>

            {/* Desktop Navigation Links - Centered via justify-between */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`font-medium text-sm transition-colors relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-blue-600 after:transition-transform after:duration-300 ${isActive
                      ? 'text-blue-600 after:scale-x-100 after:origin-bottom-left'
                      : 'text-slate-600 hover:text-blue-600 after:scale-x-0 after:origin-bottom-right hover:after:scale-x-100 hover:after:origin-bottom-left'
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right Actions (Auth) */}
            <div className="hidden md:flex items-center relative z-50">
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-2 py-1.5 rounded-full transition-colors border border-slate-200 pr-4"
                  >
                    {session.user?.image ? (
                      <img src={session.user.image} alt={session.user.name || 'User'} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                        <User size={18} />
                      </div>
                    )}
                    <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">{session.user?.name || 'User'}</span>
                    <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-lg shadow-lg py-1">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User size={16} />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center cursor-pointer gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
                  className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                  Login/Signup
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-600 hover:text-blue-600 p-2 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg transition-all duration-300 ease-in-out origin-top overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="px-4 py-6 space-y-4">
            <div className="space-y-1 pt-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`block px-3 py-3 rounded-lg text-base font-medium ${isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100">
              {session ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-3">
                    {session.user?.image ? (
                      <img src={session.user.image} alt={session.user.name || 'User'} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                        <User size={20} />
                      </div>
                    )}
                    <span className="font-medium text-slate-900">{session.user?.name || 'User'}</span>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={20} />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center justify-center w-full bg-blue-600 text-white hover:bg-blue-700 px-4 py-3 rounded-lg font-medium text-base transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login/Signup
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