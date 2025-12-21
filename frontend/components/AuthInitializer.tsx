'use client';
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useAppStore } from '@/store/useAppStore';
import { AuthUser } from '@/types/auth';
import axios from 'axios';


export default function AuthInitializer() {
    const { data: session, isPending } = authClient.useSession();
    const { setSession, setAuthLoading, clearAuth, setProfile } = useAppStore();
    const [userFetched, setUserFetched] = useState(false);

    const fetchUserDetails = async () => {
        try {
            const res = await axios.get('http://localhost:4000/authentication/get_user', {
                withCredentials: true, // Include cookies for session auth
            });

            const userData = res.data;
            const authUser: AuthUser = {
                id: userData._id || userData.id,
                email: userData.email,
                accessToken: "", // Cookie based auth
                photoUrl: userData.image || "",
            };

            if (session) {
                setSession(session, authUser);

                // If user has role and phone number, they are considered to have a profile
                if (userData.role && userData.phoneNumber) {
                    const profile: any = {
                        name: userData.name,
                        phoneNumber: userData.phoneNumber,
                        role: userData.role,
                        teacherDetails: userData.role === 'teacher' ? {
                            subjects: userData.subjects || [],
                            qualifications: userData.qualifications || [],
                            experiences: userData.experiences || "",
                            classes: userData.classes || []
                        } : undefined,
                        studentDetails: userData.role === 'student' ? {
                            classGrade: userData.class || "",
                            coursesEnrolled: [] // Assuming this comes from somewhere else or empty for now
                        } : undefined,
                        parentDetails: userData.role === 'parent' ? {
                            referId: userData.referId || ""
                        } : undefined
                    };
                    setProfile(profile);
                }
            }
            setUserFetched(true);
        } catch (error) {
            console.error('Failed to fetch user details:', error);
            setUserFetched(true);
        }
    };

    useEffect(() => {
        setAuthLoading(isPending);

        if (session) {
            // 1. Set basic session from hook immediately
            const authUser: AuthUser = {
                id: session.user.id,
                email: session.user.email,
                accessToken: "",
                photoUrl: session.user.image || "",
            };
            setSession(session, authUser);

            // 2. Fetch latest details from backend (in background)
            if (!userFetched) {
                fetchUserDetails();
            }
        } else if (!isPending) {
            clearAuth();
        }
    }, [session, isPending, setSession, setAuthLoading, clearAuth, userFetched]);

    return null; // This component renders nothing
}
