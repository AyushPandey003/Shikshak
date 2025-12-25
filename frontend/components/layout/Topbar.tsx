
"use client"
import Link from "next/link";
import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BiBell } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import Logo from "../ui/Logo";


import { useAppStore } from "@/store/useAppStore";
import { authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { SearchBar } from "../ui/SearchBar";

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { user, clearAuth, toggleSidebar } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    clearAuth();
    router.push("/auth");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const formattedDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="h-16 flex items-center px-4 md:px-6 justify-between border-b border-slate-200 bg-white">
      {/* Left: Menu Toggle + Logo */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Logo - Visible on All Screens */}
        <div className="flex items-center gap-2">
           <Logo />
        </div>
        
        {/* Desktop Divider & Greeting */}
        <div className="hidden md:flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
             <h2 className="text-sm font-bold text-gray-800 tracking-tight">
               {getGreeting()}, <span className="text-[#FF6B6B]">{user?.name || user?.email?.split('@')[0] || "Educator"}</span> 👋
             </h2>
             <div className="h-4 w-px bg-gray-300 rounded-full"></div>
             <p className="text-xs text-gray-500 font-medium">
               {formattedDate}
             </p>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex flex-1 items-center justify-center gap-6 px-4">
        {pathname === '/teacher/courses' && (
          <div className="w-64">
             <SearchBar placeholder="Search courses..." />
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-500 hover:bg-[#FF6B6B] hover:text-white transition-all duration-300">
             <BiBell className="text-xl" />
        </button>
        
        {/* Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full border border-transparent hover:bg-gray-50 hover:border-gray-200 transition-all focus:outline-none"
            aria-expanded={open}
          >
            {user?.photoUrl ? (
              <img src={user.photoUrl} alt="Profile" className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6B6B] to-red-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {user?.email?.charAt(0).toUpperCase() || "T"}
              </div>
            )}
            <div className="hidden md:flex flex-col text-left">
               <span className="text-xs font-bold text-gray-700 leading-tight">{user?.email?.split('@')[0] || "Teacher"}</span>
               <span className="text-[10px] text-gray-400 font-medium">Instructor</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.65a.75.75 0 01-1.09 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          <div className={`absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden transition-all duration-200 origin-top-right ${open ? "transform scale-100 opacity-100" : "transform scale-95 opacity-0 pointer-events-none"}`}>
            <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
               <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || "Teacher"}</p>
               <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <div className="p-1">
                <a href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"><span>Profile</span></a>
                <a href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"><span>Settings</span></a>
            </div>
            <div className="h-px bg-gray-100 my-1 mx-3" />
            <div className="p-1">
                <button
                onClick={handleLogout}
                className="flex items-center w-full gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                Sign Out
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
