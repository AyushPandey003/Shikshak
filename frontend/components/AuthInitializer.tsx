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
            // console.log("getting", res);
            const userData = res.data;
            const authUser: AuthUser = {
                id: userData._id || userData.id,
                email: userData.email,
                name: userData.name,
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
                        role: userData.role?.toLowerCase(),
                        id: userData._id,
                        // New flattened fields
                        courses: userData.courses || [],
                        class: userData.class,

                        teacherDetails: userData.role === 'teacher' ? {
                            subjects: userData.subjects || [],
                            qualifications: userData.qualifications || [],
                            experiences: userData.experiences || "",
                            classes: userData.classes || []
                        } : undefined,
                        studentDetails: userData.role === 'student' ? {
                            classGrade: userData.class || "",
                            coursesEnrolled: userData.courses || []
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
        // If the session hook is still working, we are definitely loading.
        if (isPending) {
            setAuthLoading(true);
            return;
        }

        if (session) {
            // 1. Set basic session from hook immediately
            const authUser: AuthUser = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                accessToken: "",
                photoUrl: session.user.image || "",
            };
            setSession(session, authUser);

            // 2. Fetch latest details from backend
            if (!userFetched) {
                // Keep loading true while fetching user details
                setAuthLoading(true);
                fetchUserDetails();
            } else {
                // Session is there, and user details are fetched -> Loading Done
                setAuthLoading(false);
            }
        } else {
            // No session and not pending -> User is logged out -> Loading Done
            clearAuth();
            setAuthLoading(false);
        }
    }, [session, isPending, setSession, setAuthLoading, clearAuth, userFetched]);

    return null; // This component renders nothing
}
