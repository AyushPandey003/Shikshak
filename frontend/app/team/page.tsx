"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import TeamCarousel from "../../components/team/TeamCarousel";
import TeamMemberDetail from "../../components/team/TeamMemberDetail";
import { TeamMember, teamMembers } from "../../components/team/data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <main className="min-h-screen w-full bg-[#f4f1ea] text-[#1a1a1a] overflow-hidden font-sans">
      <Navbar />
      <AnimatePresence mode="wait">
        {selectedMember ? (
          <TeamMemberDetail
            key="detail"
            member={selectedMember}
            onBack={() => setSelectedMember(null)}
          />
        ) : (
          <TeamCarousel
            key="carousel"
            members={teamMembers}
            onSelect={setSelectedMember}
          />
        )}
      </AnimatePresence>
      <div className="bg-white">
        <Footer />
      </div>
    </main>
  );
}
