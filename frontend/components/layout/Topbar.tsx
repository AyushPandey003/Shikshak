
"use client"
import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BiBell } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import Logo from "../ui/Logo";


interface TopbarProps {
  showSearch?: boolean;
}

export default function Topbar({ showSearch = true }: TopbarProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  return (
    <div className="h-20 w-full flex items-center px-3 md:px-6 justify-between">
      <div className="md:hidden flex items-center">
        <Logo />
      </div>
      
      {/* search */}
      {showSearch && (
        <div className="w-full lg:max-w-lg md:max-w-3xs hidden md:flex">
            <form onSubmit={(e) => e.preventDefault()} className="relative w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xl"><CiSearch /></div>
            <input
                aria-label="Search"
                placeholder="Search here"
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none"
                type="text"
            />
            </form>
        </div>
      )}

      <div className="flex items-center">
        <div className="flex items-center text-indigo-600 text-2xl"><BiBell/></div>
        {/* profile */}
        <div className="ml-6 relative" ref={menuRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-md p-1 hover:bg-gray-100 focus:outline-none"
            aria-expanded={open}
            aria-haspopup="menu"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">TN</div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-medium">Teacher Name</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.65a.75.75 0 01-1.09 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
            </svg>
          </button>

          <div className={`absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-md z-10 ${open ? "block" : "hidden"}`} role="menu">
            <a href="#" className="block px-4 py-2 hover:bg-gray-100" role="menuitem">Profile</a>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100" role="menuitem">Settings</a>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100" role="menuitem">Logout</button>
          </div>
        </div>
        <div className="text-sm flex md:hidden"><Menu/></div>
      </div>
    </div>
  );
}
