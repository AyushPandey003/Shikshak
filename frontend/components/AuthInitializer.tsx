'use client';
import { useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { useAppStore } from '@/store/useAppStore';
import { AuthUser } from '@/types/auth';

export default function AuthInitializer() {
    const { data: session, isPending } = authClient.useSession();
    const { setSession, setAuthLoading, clearAuth } = useAppStore();

    useEffect(() => {
        setAuthLoading(isPending);
        if (session) {
            // Map session to your AuthUser type
            const authUser: AuthUser = {
                id: session.user.id,
                email: session.user.email,
                accessToken: "", // Cookie based auth
                photoUrl: session.user.image || "",
            };
            setSession(session, authUser);
        } else if (!isPending) {
            clearAuth();
        }
    }, [session, isPending, setSession, setAuthLoading, clearAuth]);

    return null; // This component renders nothing
}
