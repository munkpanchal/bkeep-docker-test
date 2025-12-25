import { create } from 'zustand';
import axiosInstance from '../../services/axiosClient';
import { AuthState, UserType } from '../../types';
import { TenantStore } from '../tenant/tenantStore';

// Helper to get initial state from localStorage (synchronous)
const getInitialAuthState = () => {
    try {
        const userStr = localStorage.getItem('user');
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const mfaEnabledStr = localStorage.getItem('mfaEnabled');
        const mfaEnabled =
            mfaEnabledStr !== null ? JSON.parse(mfaEnabledStr) : false;

        if (userStr && accessToken && refreshToken) {
            return {
                user: JSON.parse(userStr),
                accessToken,
                refreshToken,
                isAuthenticated: true,
                mfaEnabled,
            };
        }
    } catch (e) {
        console.error('Failed to get initial auth state', e);
    }
    return {
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        mfaEnabled: false,
    };
};

const initialState = getInitialAuthState();

export const AuthStore = create<AuthState>((set, get) => ({
    // 1. Initial State - hydrated from localStorage synchronously
    user: initialState.user,
    accessToken: initialState.accessToken,
    refreshToken: initialState.refreshToken,
    isAuthenticated: initialState.isAuthenticated,
    loading: false,
    error: null,
    mfaEnabled: initialState.mfaEnabled,

    // 2. Actions

    setAuth: (user: UserType, accessToken: string, refreshToken: string) => {
        // Persist to localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem(
            'mfaEnabled',
            JSON.stringify(Boolean(user?.mfaEnabled))
        );

        set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            mfaEnabled: Boolean(user?.mfaEnabled),
            error: null,
        });
    },

    // --- Clear Auth (Internal Helper) ---
    clearAuth: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('mfaEnabled');
        TenantStore.getState().clearTenants();

        set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            mfaEnabled: false,
            error: null,
        });
    },

    // --- Logout Action ---
    logout: async () => {
        set({ loading: true });
        try {
            // Optional: Call server to invalidate token
            // await axiosInstance.post('/auth/logout');
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            get().clearAuth();
            set({ loading: false });
        }
    },

    // --- Hydrate (Restore session on refresh) ---
    hydrateAuth: () => {
        try {
            const userStr = localStorage.getItem('user');
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            const mfaEnabledStr = localStorage.getItem('mfaEnabled');
            const mfaEnabled =
                mfaEnabledStr !== null ? JSON.parse(mfaEnabledStr) : false;

            if (userStr && accessToken && refreshToken) {
                set({
                    user: JSON.parse(userStr),
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                    mfaEnabled,
                });
            }
            TenantStore.getState().hydrateTenant();
        } catch (e) {
            console.error('Failed to hydrate auth', e);
            get().clearAuth();
        }
    },

    // --- Refresh Token ---
    refreshAccessToken: async () => {
        const currentRefreshToken = get().refreshToken;
        if (!currentRefreshToken) return false;

        try {
            const response = await axiosInstance.post('/auth/refresh-token', {
                refreshToken: currentRefreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } =
                response.data;

            // Update state and local storage
            const currentUser = get().user!; // User should exist if we are refreshing
            get().setAuth(currentUser, accessToken, newRefreshToken);

            return true;
        } catch (error) {
            console.error('Token refresh failed', error);
            get().clearAuth(); // If refresh fails, force logout
            return false;
        }
    },

    setMfaEnabled: (enabled: boolean) => {
        localStorage.setItem('mfaEnabled', JSON.stringify(enabled));
        set({ mfaEnabled: enabled });
    },
}));
