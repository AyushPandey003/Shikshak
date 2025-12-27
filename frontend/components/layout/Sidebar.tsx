"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdClass,
  MdCalendarToday,
  MdMessage,
} from "react-icons/md";
import { IoSchool } from "react-icons/io5";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";

import { useAppStore } from "@/store/useAppStore";

const teacherNavItems = [
  { href: "/teacher/dashboard", label: "Dashboard", icon: MdDashboard },
  { href: "/teacher/courses", label: "Courses", icon: MdClass },
  { href: "/teacher/courses/create", label: "Compose", icon: AiOutlineVideoCameraAdd },
];

const studentNavItems = [
  { href: "/student/dashboard", label: "Dashboard", icon: MdDashboard },
  { href: "/student/courses", label: "Courses", icon: IoSchool },
];

export default function Sidebar() {
  const pathname = usePathname() || "/";
  const { isSidebarOpen, closeSidebar } = useAppStore();

  const isStudent = pathname.startsWith("/student");
  const navItems = isStudent ? studentNavItems : teacherNavItems;

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90] md:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside 
        className={`h-[calc(100vh-4rem)] w-64 bg-gray-50 border-r border-gray-100 flex flex-col
          fixed md:sticky top-16 left-0 z-[40]
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo removed (moved to Topbar) */}

          {/* Navigation */}
          <nav className="px-4 py-4 flex-1 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        active 
                          ? "bg-[#FF6B6B] text-white shadow-md shadow-orange-100" 
                          : "text-gray-600 hover:bg-orange-50 hover:text-[#FF6B6B]"
                      }`}
                      onClick={() => closeSidebar()} // Close on navigation (mobile)
                    >
                      <span className="text-xl">
                        <Icon />
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
