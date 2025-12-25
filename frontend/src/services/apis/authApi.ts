/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AuthenticationResponseJSON } from '@simplewebauthn/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useAuth } from '../../stores/auth/authSelectore';
import { useTenant } from '../../stores/tenant/tenantSelectore';
import { LoginResponse, Tenant } from '../../types';
import { storePasskeyUser } from '../../utills/passkey';
import { showErrorToast, showSuccessToast } from '../../utills/toast';
import axiosInstance from '../axiosClient';

type LoginPayload = {
    email: string;
    password: string;
};

type ResetPasswordPayload = {
    token: string;
    email: string;
    password: string;
};

type VerifyMfaPayload = {
    email: string;
    code: string;
};

type MfaStatusResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data?: {
        mfaEnabled: boolean;
    };
};

// Passkey Types
type PasskeyLoginInitPayload = {
    email: string;
};

type PasskeyLoginInitResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        options: {
            challenge: string;
            allowCredentials: {
                id: string;
                type: 'public-key';
                transports?: AuthenticatorTransport[];
            }[];
            timeout: number;
            userVerification: UserVerificationRequirement;
            rpId: string;
        };
    };
};

type PasskeyLoginVerifyPayload = {
    email: string;
    credential: AuthenticationResponseJSON;
};

type PasskeyLoginVerifyResponse = LoginResponse;

export async function getMfaStatusRequest(): Promise<MfaStatusResponse> {
    const response = await axiosInstance.get('/auth/mfa/status');
    return response.data;
}

// Passkey API functions
export async function passkeyLoginInitRequest(
    payload: PasskeyLoginInitPayload
): Promise<PasskeyLoginInitResponse> {
    const response = await axiosInstance.post('/auth/passkey/login/options', {
        email: payload.email,
    });
    return response.data;
}

export async function passkeyLoginVerifyRequest(
    payload: PasskeyLoginVerifyPayload
): Promise<PasskeyLoginVerifyResponse> {
    const response = await axiosInstance.post(
        '/auth/passkey/login/verify',
        payload
    );
    return response.data;
}

export async function loginRequest({
    email,
    password,
}: LoginPayload): Promise<LoginResponse> {
    console.log({ email, password });
    const response = await axiosInstance.post('/auth/login', {
        email,
        password,
    });
    console.log(response);
    return response.data;
}

export async function logoutRequest(): Promise<void> {
    await axiosInstance.post('/auth/logout');
}

export async function forgotPasswordRequest(
    email: string
): Promise<{ message: string }> {
    const response = await axiosInstance.post('/auth/forgot-password', {
        email,
    });
    return response.data;
}

export async function resetPasswordRequest(
    payload: ResetPasswordPayload
): Promise<{ message: string }> {
    const response = await axiosInstance.post('/auth/reset-password', {
        email: payload.email,
        token: payload.token,
        password: payload.password,
    });
    return response.data;
}

export async function verifyMfaRequest(
    payload: VerifyMfaPayload
): Promise<LoginResponse> {
    const response = await axiosInstance.post('/auth/mfa/verify', payload);
    return response.data;
}

type MFASettingsResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        mfaEnabled: boolean;
    };
};

export async function enableMFA(): Promise<MFASettingsResponse> {
    const response = await axiosInstance.post('/auth/mfa/enable');
    return response.data;
}

export async function disableMFA(): Promise<MFASettingsResponse> {
    const response = await axiosInstance.post('/auth/mfa/disable');
    return response.data;
}

export const useMfaStatus = () => {
    return useQuery<MfaStatusResponse, Error>({
        queryKey: ['mfa-status'],
        queryFn: getMfaStatusRequest,
    });
};

export const useEnableMFA = () => {
    const { setMfaEnabled } = useAuth();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: enableMFA,
        onSuccess: (data) => {
            setMfaEnabled(true);
            showSuccessToast(
                data?.message || 'Two-factor authentication enabled'
            );
            queryClient.invalidateQueries({ queryKey: ['mfa-status'] });
        },
        onError: (error) => {
            console.error('Enable MFA Failed:', error);
            showErrorToast('Enable MFA Failed: ' + error.message);
        },
    });
};

export const useDisableMFA = () => {
    const { setMfaEnabled } = useAuth();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: disableMFA,
        onSuccess: (data) => {
            setMfaEnabled(false);
            showSuccessToast(
                data?.message || 'Two-factor authentication disabled'
            );
            queryClient.invalidateQueries({ queryKey: ['mfa-status'] });
        },
        onError: (error) => {
            console.error('Disable MFA Failed:', error);
            showErrorToast('Disable MFA Failed: ' + error.message);
        },
    });
};

export const useLogout = () => {
    const { clearAuth } = useAuth();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: logoutRequest,
        onSuccess: () => {
            clearAuth();
            navigate('/login');
        },
        onError: (error) => {
            showErrorToast('Logout Failed: ' + error.message);
        },
    });
};

export const useLogin = () => {
    const { setAuth } = useAuth();
    const { setTenants } = useTenant();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (payload: LoginPayload) => loginRequest(payload),

        onSuccess: (data) => {
            const payload = data?.data;

            // If backend says MFA is required, route to OTP page
            if (payload?.requiresMfa) {
                showSuccessToast(
                    data?.message ||
                        'Verification code sent. Please enter the code to continue.'
                );
                navigate('/enter-otp', {
                    state: {
                        email: payload.email,
                        mfaType: payload.mfaType,
                    },
                });
                return;
            }

            // Normal login flow with tokens + user
            if (
                payload?.user &&
                payload?.accessToken &&
                payload?.refreshToken
            ) {
                setAuth(
                    payload.user,
                    payload.accessToken,
                    payload.refreshToken
                );

                const tenants = buildTenantsFromLogin(payload.user.tenants);
                setTenants(tenants, {
                    selectTenantId: payload.user.selectedTenantId,
                });

                // Store user email for passkey login
                storePasskeyUser(payload.user.email);

                navigate('/dashboard');
                console.log('Login Successful: Store Updated');
            }
        },
        onError: (error) => {
            console.error('Login Failed:', error);
        },
    });
};

const buildTenantsFromLogin = (tenantsFromApi?: Tenant[]): Tenant[] => {
    if (!tenantsFromApi) return [];

    const uniqueTenants = new Map<string, Tenant>();
    tenantsFromApi.forEach((tenant) => {
        if (tenant && tenant.id) {
            uniqueTenants.set(tenant.id, tenant);
        }
    });

    return Array.from(uniqueTenants.values());
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (email: string) => forgotPasswordRequest(email),
        onSuccess: () => {
            // Success is handled in the component
        },
        onError: (error) => {
            console.error('Forgot Password Failed:', error);
        },
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: (payload: ResetPasswordPayload) =>
            resetPasswordRequest(payload),
        onSuccess: () => {
            // Success is handled in the component
        },
        onError: (error) => {
            console.error('Reset Password Failed:', error);
        },
    });
};

export const useVerifyMfa = () => {
    const { setAuth } = useAuth();
    const { setTenants } = useTenant();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (payload: VerifyMfaPayload) => verifyMfaRequest(payload),
        onSuccess: (data) => {
            const payload = data?.data;

            if (
                payload?.user &&
                payload?.accessToken &&
                payload?.refreshToken
            ) {
                setAuth(
                    payload.user,
                    payload.accessToken,
                    payload.refreshToken
                );

                const tenants = buildTenantsFromLogin(payload.user.tenants);
                setTenants(tenants, {
                    selectTenantId: payload.user.selectedTenantId,
                });

                // Store user email for passkey login
                storePasskeyUser(payload.user.email);

                showSuccessToast(
                    data?.message || 'Successfully verified. Welcome back!'
                );
                navigate('/dashboard');
            } else {
                showErrorToast('Verification failed. Please try again.');
            }
        },
        onError: (error) => {
            console.error('Verify MFA Failed:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Invalid or expired code. Please try again.';
            showErrorToast(message);
        },
    });
};

type ChangePasswordPayload = {
    currentPassword: string;
    newPassword: string;
};

export async function changePasswordRequest(
    payload: ChangePasswordPayload
): Promise<{ message: string }> {
    const response = await axiosInstance.post('/auth/change-password', payload);
    return response.data;
}

export const useChangePassword = () => {
    return useMutation({
        mutationFn: (payload: ChangePasswordPayload) =>
            changePasswordRequest(payload),
        onSuccess: (data) => {
            showSuccessToast(data?.message || 'Password changed successfully');
        },
        onError: (error) => {
            console.error('Change Password Failed:', error);
        },
    });
};

// Passkey Login Hooks
export const usePasskeyLoginInit = () => {
    return useMutation({
        mutationFn: (payload: PasskeyLoginInitPayload) =>
            passkeyLoginInitRequest(payload),
        onError: (error) => {
            console.error('Passkey Login Init Failed:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Failed to initialize passkey login';
            showErrorToast(message);
        },
    });
};

export const usePasskeyLoginVerify = () => {
    const { setAuth } = useAuth();
    const { setTenants } = useTenant();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (payload: PasskeyLoginVerifyPayload) =>
            passkeyLoginVerifyRequest(payload),
        onSuccess: (data) => {
            const payload = data?.data;

            if (
                payload?.user &&
                payload?.accessToken &&
                payload?.refreshToken
            ) {
                setAuth(
                    payload.user,
                    payload.accessToken,
                    payload.refreshToken
                );

                const tenants = buildTenantsFromLogin(payload.user.tenants);
                setTenants(tenants, {
                    selectTenantId: payload.user.selectedTenantId,
                });

                showSuccessToast(
                    data?.message || 'Passkey authentication successful!'
                );
                navigate('/dashboard');
            } else {
                showErrorToast(
                    'Passkey verification failed. Please try again.'
                );
            }
        },
        onError: (error) => {
            console.error('Passkey Login Verify Failed:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Passkey authentication failed. Please try again.';
            showErrorToast(message);
        },
    });
};

// Invitation Types
type VerifyInvitationResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data?: {
        requiresPassword: boolean;
        email: string;
        name: string;
        tenantName: string;
        role?: {
            id: string;
            name: string;
            displayName: string;
        };
        tenant?: {
            id: string;
            name: string;
        };
        expiresAt?: string;
    };
};

type AcceptInvitationPayload = {
    token: string;
    password?: string;
};

type AcceptInvitationResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data?: {
        user: {
            id: string;
            email: string;
            name: string;
            role?: {
                id: string;
                name: string;
                displayName: string;
            };
            roles?: Array<{
                id: string;
                name: string;
                displayName: string;
            }>;
            permissions?: Array<{
                id: string;
                name: string;
                displayName: string;
            }>;
            tenants?: Array<{
                id: string;
                name: string;
                isPrimary: boolean;
                isActive?: boolean;
                createdAt?: string;
                updatedAt?: string;
            }>;
            selectedTenantId?: string;
        };
        accessToken: string;
        refreshToken: string;
    };
};

// Verify Invitation Token
export async function verifyInvitationRequest(
    token: string
): Promise<VerifyInvitationResponse> {
    const response = await axiosInstance.get(
        `/auth/verify-invitation?token=${token}`
    );
    return response.data;
}

export const useVerifyInvitation = (token: string) => {
    return useQuery<VerifyInvitationResponse, Error>({
        queryKey: ['verify-invitation', token],
        queryFn: () => verifyInvitationRequest(token),
        enabled: !!token,
        retry: false,
    });
};

// Accept Invitation
export async function acceptInvitationRequest(
    payload: AcceptInvitationPayload
): Promise<AcceptInvitationResponse> {
    const response = await axiosInstance.post(
        '/auth/accept-invitation',
        payload
    );
    return response.data;
}

export const useAcceptInvitation = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    return useMutation({
        mutationFn: (payload: AcceptInvitationPayload) =>
            acceptInvitationRequest(payload),
        onSuccess: (data) => {
            showSuccessToast(
                data?.message || 'Invitation accepted successfully!'
            );

            if (data?.data) {
                // Transform user data to match UserType
                const userData = {
                    ...data.data.user,
                    roles:
                        data.data.user.roles ||
                        (data.data.user.role ? [data.data.user.role] : []),
                    role: data.data.user.role || {
                        id: '',
                        name: '',
                        displayName: '',
                    },
                    permissions: data.data.user.permissions || [],
                    tenants: (data.data.user.tenants || []).map(
                        (tenant: any) => ({
                            ...tenant,
                            isActive: tenant.isActive ?? true,
                            createdAt:
                                tenant.createdAt || new Date().toISOString(),
                            updatedAt:
                                tenant.updatedAt || new Date().toISOString(),
                        })
                    ),
                    selectedTenantId: data.data.user.selectedTenantId || '',
                };

                // Set auth data
                setAuth(
                    userData,
                    data.data.accessToken,
                    data.data.refreshToken
                );

                // Navigate to dashboard
                navigate('/dashboard');
            }
        },
        onError: (error) => {
            console.error('Accept Invitation Failed:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Failed to accept invitation. Please try again.';
            showErrorToast(message);
        },
    });
};
