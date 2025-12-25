import { create } from 'zustand';
import { AuthUser, UserProfile } from '@/types/auth';

// --- Slice 1: Authentication State ---
interface AuthSlice {
    user: AuthUser | null;
    session: any | null;
    profile: UserProfile | null;
    isAuthLoading: boolean;

    setSession: (session: any, user: AuthUser) => void;
    setProfile: (profile: UserProfile) => void;
    clearAuth: () => void;
    setAuthLoading: (loading: boolean) => void;
    
    // UI State
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
}



// --- Combined Store Type ---
type AppState = AuthSlice;

export const useAppStore = create<AppState>((set) => ({
    // ... Auth Initial State
    user: null,
    session: null,
    profile: null,
    isAuthLoading: true,

    // ... Auth Actions
    setSession: (session, user) => set({ session, user }),
    setProfile: (profile) => set({ profile }),
    clearAuth: () => set({ user: null, session: null, profile: null }),
    setAuthLoading: (loading) => set({ isAuthLoading: loading }),

    // --- Slice 2: UI State ---
    isSidebarOpen: false,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    closeSidebar: () => set({ isSidebarOpen: false }),
}));
