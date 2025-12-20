'use client';

import React, { useState } from 'react';
import { AuthUser, UserProfile } from '@/types/auth';
import { AuthPage } from './login/page';
import { UserDetailsPage } from './register/page';
import { useRouter } from 'next/navigation';

import { authClient } from '@/lib/auth-client';

export default function Home() {
  const router = useRouter();
  // Auth & Data State
  // Auth & Data State
  const { data: session, isPending } = authClient.useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // 1. Auth Handler: Auth -> Details

  // 1. Auth Handler: Auth -> Details
  // Session handles this automatically

  // 2. Profile Handler: Details -> Dashboard (or next step)
  const handleProfileSubmit = async (profile: UserProfile) => {
    console.log("Saving Profile to Backend:", { user: session?.user, ...profile });

    try {
      const response = await fetch('http://localhost:4000/auth/api/user/update-profile', {
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
        setUserProfile(profile);
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

  if (isPending) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // View 1: Authentication Page (Default if no session)
  if (!session) {
    return <AuthPage />;
  }

  // View 2: User Details Setup
  // We stay here if logged in. You can add more conditions if there's a dashboard.
  // Transform session.user (Better Auth) to AuthUser (App Type)
  const authUser: AuthUser = {
    id: session.user.id,
    email: session.user.email,
    accessToken: "", // Session cookie manages access
    photoUrl: session.user.image || "",
  };

  return <UserDetailsPage authUser={authUser} onSubmit={handleProfileSubmit} />;
}