import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showErrorToast, showSuccessToast } from '../../utills/toast';
import axiosInstance from '../axiosClient';

export type TOTP_STATUS_RESPONSE = {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        totpEnabled: boolean;
        mfaEnabled: boolean;
        mfaType: string;
    };
};

export type MFA_TOTP_SETUP_RESPONSE = {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        secret: string;
        qrCode: string;
        backupCodes: string[];
    };
};

export type MFA_TOTP_VERIFY_RESPONSE = {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        totpEnabled: boolean;
    };
};

export type MFA_TOTP_DISABLE_RESPONSE = {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        totpEnabled: boolean;
    };
};

// API Functions
export async function getTOTPStatus(): Promise<TOTP_STATUS_RESPONSE> {
    const response = await axiosInstance.get('/authenticator/status');
    return response.data;
}

export async function setupTOTP(): Promise<MFA_TOTP_SETUP_RESPONSE> {
    const response = await axiosInstance.post('/authenticator/setup');
    return response.data;
}

export async function verifyTOTP(
    code: string
): Promise<MFA_TOTP_VERIFY_RESPONSE> {
    const response = await axiosInstance.post('/authenticator/verify', {
        code,
    });
    return response.data;
}

// TOTP Login (for MFA during login flow)
export type TOTPLoginPayload = {
    email: string;
    code: string;
    isBackupCode: boolean;
};

export type TOTPLoginResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: {
                id: string;
                name: string;
                displayName: string;
            };
            permissions: Array<{
                id: string;
                name: string;
                displayName: string;
            }>;
            tenants: Array<{
                id: string;
                name: string;
                isPrimary: boolean;
            }>;
            selectedTenantId: string;
        };
    };
};

export async function loginTOTP(
    payload: TOTPLoginPayload
): Promise<TOTPLoginResponse> {
    const response = await axiosInstance.post('/auth/totp/login', payload);
    return response.data;
}

export async function disableTOTP(): Promise<MFA_TOTP_DISABLE_RESPONSE> {
    const response = await axiosInstance.post('/authenticator/deactivate');
    return response.data;
}

// React Query Hooks
export const useTOTPStatus = () => {
    return useQuery<TOTP_STATUS_RESPONSE, Error>({
        queryKey: ['totp-status'],
        queryFn: getTOTPStatus,
    });
};

export const useSetupTOTP = () => {
    return useMutation({
        mutationFn: setupTOTP,
        onError: (error) => {
            console.error('Setup TOTP Failed:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Failed to setup TOTP authenticator';
            showErrorToast(message);
        },
    });
};

export const useVerifyTOTP = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (code: string) => verifyTOTP(code),
        onSuccess: (data) => {
            showSuccessToast(
                data?.message || 'TOTP authenticator enabled successfully'
            );
            queryClient.invalidateQueries({ queryKey: ['totp-status'] });
            queryClient.invalidateQueries({ queryKey: ['mfa-status'] });
        },
        onError: (error) => {
            console.error('Verify TOTP Failed:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Invalid code. Please try again.';
            showErrorToast(message);
        },
    });
};

export const useDisableTOTP = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: disableTOTP,
        onSuccess: (data) => {
            showSuccessToast(
                data?.message || 'TOTP authenticator disabled successfully'
            );
            queryClient.invalidateQueries({ queryKey: ['totp-status'] });
            queryClient.invalidateQueries({ queryKey: ['mfa-status'] });
        },
        onError: (error) => {
            console.error('Disable TOTP Failed:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Failed to disable TOTP authenticator';
            showErrorToast(message);
        },
    });
};

// TOTP Login Hook (for MFA login flow)
export const useTOTPLogin = () => {
    return useMutation({
        mutationFn: (payload: TOTPLoginPayload) => loginTOTP(payload),
        onError: (error) => {
            console.error('TOTP Login Failed:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Invalid code. Please try again.';
            showErrorToast(message);
        },
    });
};
