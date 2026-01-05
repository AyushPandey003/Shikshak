'use client';

import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { useAppStore } from "@/store/useAppStore";
import { UserRole } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { profile, isAuthLoading } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading) {
      if (!profile || profile.role !== UserRole.STUDENT) {
        router.push("/");
      }
    }
  }, [profile, isAuthLoading, router]);

  if (isAuthLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!profile || profile.role !== UserRole.STUDENT) {
    return null;
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      {/* Topbar (Global Header) */}
      <header className="sticky top-0 z-50 w-full bg-white">
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
