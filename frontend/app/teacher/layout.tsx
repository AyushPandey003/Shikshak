'use client';

import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { usePathname } from "next/navigation";

export default function TeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideSearch = pathname?.includes('/modules') || pathname?.includes('/courses/create');

  return (
    <div className="min-h-screen w-full flex bg-zinc-100">
      <aside className="hidden md:block">
        <Sidebar />
      </aside>
      <div className="flex flex-col flex-1 min-w-0 h-full w-full">
        <header className="w-full">
          <Topbar showSearch={!hideSearch} />
        </header>
        <main className="flex-1 overflow-hidden h-full w-full min-w-0">
            {children}
        </main>
      </div>
    </div>
  );
}
