'use client';

import React from 'react';
import { AuthUser, UserProfile } from '@/types/auth';
import { AuthPage } from './login/page';
import { UserDetailsPage } from './register/page';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

export default function Home() {
  const router = useRouter();

  // Global State
  const { session, isAuthLoading, user, setProfile, profile } = useAppStore();

  React.useEffect(() => {
    if (session && profile) {
      router.push('/');
    }
  }, [session, profile, router]);

  // 2. Profile Handler: Details -> Dashboard (or next step)
  const handleProfileSubmit = async (profile: UserProfile) => {
    console.log("Saving Profile to Backend:", { user: session?.user, ...profile });

    try {
      const response = await fetch('http://localhost:4000/authentication/user_detail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.name,
          role: profile.role,
          phoneNumber: profile.phoneNumber,
          ...profile.teacherDetails,
          ...profile.studentDetails,
          ...profile.parentDetails,
        }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Profile updated:", data);

        // Update global store
        setProfile(profile);

        // Navigate to home
        router.push('/');
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // ----- RENDER LOGIC -----

  if (isAuthLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // View 1: Authentication Page (Default if no session)
  if (!session) {
    return <AuthPage />;
  }

  // View 2: User Details Setup
  // Using user from store if available, otherwise fallback (though session implies user)
  const authUser: AuthUser = user || {
    id: session.user.id,
    email: session.user.email,
    accessToken: "",
    photoUrl: session.user.image || "",
  };

  return <UserDetailsPage authUser={authUser} onSubmit={handleProfileSubmit} />;
}