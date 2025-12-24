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

const navItems = [
  { href: "/teacher/dashboard", label: "Dashboard", icon: MdDashboard },
  { href: "/teacher/courses", label: "Courses", icon: MdClass },
  { href: "/teacher/courses/create", label: "Compose", icon: AiOutlineVideoCameraAdd },
];

export default function Sidebar() {
  const pathname = usePathname() || "/";

  return (
    <aside className="h-screen w-48 bg-white sticky left-0 top-0">
      <div className="h-full flex flex-col">
        {/* Logo / Brand */}
        <div className="px-6 py-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold">
            <IoSchool />
          </div>
          <div>
            <div className="text-lg font-semibold">Shishak</div>
            <div className="text-xs text-zinc-400">Teacher portal</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-2 py-4 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium hover:bg-zinc-50 ${
                      active ? "bg-indigo-50 text-indigo-600" : "text-zinc-700"
                    }`}
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
  );
}
