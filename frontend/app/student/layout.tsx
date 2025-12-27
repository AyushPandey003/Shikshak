import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <div className="min-h-screen w-full flex flex-col bg-white">
      {/* Topbar (Global Header) */}
      <header className="sticky top-0 z-[50] w-full bg-white">
        <Topbar />
      </header>

      {/* Main Layout Area */}
      <div className="flex flex-1 relative">
        <Sidebar />
        <main className="flex-1 w-full bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
