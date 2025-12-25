import { AuthStore } from './authStore';

export const useAuth = () => {
    const user = AuthStore((state) => state.user);
    const accessToken = AuthStore((state) => state.accessToken);
    const refreshToken = AuthStore((state) => state.refreshToken);
    const refreshAccessToken = AuthStore((state) => state.refreshAccessToken);
    const loading = AuthStore((state) => state.loading);
    const error = AuthStore((state) => state.error);
    const logout = AuthStore((state) => state.logout);
    const hydrateAuth = AuthStore((state) => state.hydrateAuth);
    const setAuth = AuthStore((state) => state.setAuth);
    const clearAuth = AuthStore((state) => state.clearAuth);
    const mfaEnabled = AuthStore((state) => state.mfaEnabled);
    const setMfaEnabled = AuthStore((state) => state.setMfaEnabled);

    return {
        user,
        accessToken,
        refreshToken,
        refreshAccessToken,
        loading,
        error,
        logout,
        hydrateAuth,
        setAuth,
        clearAuth,
        mfaEnabled,
        setMfaEnabled,
    };
};
