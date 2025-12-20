import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function TeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
