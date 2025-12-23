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
  // Check if we are on the module creation page
  // Adjust the check string as needed to match the actual route
  const isModulePage = pathname?.includes('/modules');

  if (isModulePage) {
     return <div className="h-screen w-full bg-white">{children}</div>;
  }

  return (
    <div className="min-h-screen w-full flex bg-zinc-100">
      <aside className="hidden md:block">
        <Sidebar />
      </aside>
      <div className="flex flex-col flex-1 h-full">
        <header className="">
          <Topbar />
        </header>
        <main className="">{children}</main>
      </div>
    </div>
  );
}
