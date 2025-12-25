import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showErrorToast, showSuccessToast } from '../../utills/toast';
import axiosInstance from '../axiosClient';

// ============= Types =============

/**
 * Response structure for passkey registration options
 */
export type PasskeyRegistrationOptionsResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        options: {
            challenge: string;
            rp: {
                name: string;
                id: string;
            };
            user: {
                id: string;
                name: string;
                displayName: string;
            };
            pubKeyCredParams: Array<{
                alg: number;
                type: string;
            }>;
            timeout: number;
            attestation: string;
            excludeCredentials: Array<{
                id: string;
                type: string;
                transports?: AuthenticatorTransport[];
            }>;
            authenticatorSelection: {
                userVerification: UserVerificationRequirement;
                residentKey?: ResidentKeyRequirement;
                requireResidentKey?: boolean;
            };
            extensions?: {
                credProps?: boolean;
            };
            hints?: string[];
        };
    };
};

/**
 * Payload to verify and register a new passkey
 * Uses SimpleWebAuthn credential format
 */
export type PasskeyRegistrationVerifyPayload = {
    name: string; // Friendly name for the passkey
    credential: {
        id: string;
        rawId: string;
        response: {
            attestationObject: string;
            clientDataJSON: string;
            transports?: AuthenticatorTransport[];
        };
        type: string;
        clientExtensionResults: Record<string, unknown>;
        authenticatorAttachment?: string;
    };
};

/**
 * Response for passkey registration verification
 */
export type PasskeyRegistrationVerifyResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        passkeyId: string;
        credentialId: string;
        friendlyName: string;
        createdAt: string;
    };
};

/**
 * Single passkey data structure (matches backend response)
 */
export type Passkey = {
    id: string;
    name: string;
    credentialType: 'platform' | 'roaming';
    transports: AuthenticatorTransport[];
    isActive: boolean;
    lastUsedAt: string | null;
    backupEligible: boolean;
    backupState: boolean;
    createdAt: string;
    updatedAt: string;
};

/**
 * Response for listing all passkeys
 */
export type PasskeysListResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        passkeys: Passkey[];
        total: number;
    };
};

/**
 * Response for passkey statistics
 */
export type PasskeyStatsResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        stats: {
            total: number;
            active: number;
            platform: number;
            roaming: number;
        };
    };
};

/**
 * Response for single passkey details
 */
export type PasskeyDetailsResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        passkey: Passkey;
    };
};

/**
 * Payload to rename a passkey
 */
export type PasskeyRenamePayload = {
    passkeyId: string;
    name: string; // Backend uses 'name' instead of 'friendlyName'
};

/**
 * Response for passkey operations (delete, rename, enable, disable)
 */
export type PasskeyOperationResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data?: {
        passkey?: Passkey;
    };
};

// ============= API Functions =============

/**
 * Get passkey registration options from the server
 */
export async function getPasskeyRegistrationOptions(): Promise<PasskeyRegistrationOptionsResponse> {
    const response = await axiosInstance.post('/passkey/register/options');
    return response.data;
}

/**
 * Verify and register a new passkey
 */
export async function verifyPasskeyRegistration(
    payload: PasskeyRegistrationVerifyPayload
): Promise<PasskeyRegistrationVerifyResponse> {
    const response = await axiosInstance.post(
        '/passkey/register/verify',
        payload
    );
    return response.data;
}

/**
 * Get list of all passkeys for authenticated user
 */
export async function getPasskeysList(): Promise<PasskeysListResponse> {
    const response = await axiosInstance.get('/passkey');
    return response.data;
}

/**
 * Get passkey statistics
 */
export async function getPasskeyStats(): Promise<PasskeyStatsResponse> {
    const response = await axiosInstance.get('/passkey/stats');
    return response.data;
}

/**
 * Get a single passkey by ID
 */
export async function getPasskeyById(
    passkeyId: string
): Promise<PasskeyDetailsResponse> {
    const response = await axiosInstance.get(`/passkey/${passkeyId}`);
    return response.data;
}

/**
 * Delete a passkey
 */
export async function deletePasskey(
    passkeyId: string
): Promise<PasskeyOperationResponse> {
    const response = await axiosInstance.delete(`/passkey/${passkeyId}`);
    return response.data;
}

/**
 * Rename a passkey
 */
export async function renamePasskey(
    payload: PasskeyRenamePayload
): Promise<PasskeyOperationResponse> {
    const response = await axiosInstance.patch(
        `/passkey/${payload.passkeyId}/rename`,
        {
            name: payload.name,
        }
    );
    return response.data;
}

/**
 * Toggle passkey enabled/disabled status
 */
export async function togglePasskey(
    passkeyId: string
): Promise<PasskeyOperationResponse> {
    const response = await axiosInstance.patch(`/passkey/${passkeyId}/toggle`);
    return response.data;
}

/**
 * Enable a passkey (wrapper for toggle)
 */
export async function enablePasskey(
    passkeyId: string
): Promise<PasskeyOperationResponse> {
    return togglePasskey(passkeyId);
}

/**
 * Disable a passkey (wrapper for toggle)
 */
export async function disablePasskey(
    passkeyId: string
): Promise<PasskeyOperationResponse> {
    return togglePasskey(passkeyId);
}

// ============= React Query Hooks =============

/**
 * Hook to get passkey registration options
 */
export const usePasskeyRegistrationOptions = () => {
    return useMutation({
        mutationFn: getPasskeyRegistrationOptions,
        onError: (error) => {
            console.error('Failed to get passkey registration options:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Failed to initialize passkey registration';
            showErrorToast(message);
        },
    });
};

/**
 * Hook to verify and register a new passkey
 */
export const usePasskeyRegistrationVerify = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: PasskeyRegistrationVerifyPayload) =>
            verifyPasskeyRegistration(payload),
        onSuccess: (data) => {
            showSuccessToast(
                data?.message || 'Passkey registered successfully!'
            );
            // Invalidate passkeys list to refresh
            queryClient.invalidateQueries({ queryKey: ['passkeys'] });
            queryClient.invalidateQueries({ queryKey: ['passkey-stats'] });
        },
        onError: (error) => {
            console.error('Failed to register passkey:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Failed to register passkey. Please try again.';
            showErrorToast(message);
        },
    });
};

/**
 * Hook to get list of all passkeys
 */
export const usePasskeysList = () => {
    return useQuery<PasskeysListResponse, Error>({
        queryKey: ['passkeys'],
        queryFn: getPasskeysList,
    });
};

/**
 * Hook to get passkey statistics
 */
export const usePasskeyStats = () => {
    return useQuery<PasskeyStatsResponse, Error>({
        queryKey: ['passkey-stats'],
        queryFn: getPasskeyStats,
    });
};

/**
 * Hook to get a single passkey by ID
 */
export const usePasskeyById = (passkeyId: string) => {
    return useQuery<PasskeyDetailsResponse, Error>({
        queryKey: ['passkey', passkeyId],
        queryFn: () => getPasskeyById(passkeyId),
        enabled: !!passkeyId,
    });
};

/**
 * Hook to delete a passkey
 */
export const useDeletePasskey = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (passkeyId: string) => deletePasskey(passkeyId),
        onSuccess: (data) => {
            showSuccessToast(data?.message || 'Passkey deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['passkeys'] });
            queryClient.invalidateQueries({ queryKey: ['passkey-stats'] });
        },
        onError: (error) => {
            console.error('Failed to delete passkey:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Failed to delete passkey';
            showErrorToast(message);
        },
    });
};

/**
 * Hook to toggle passkey status
 */
export const useTogglePasskey = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (passkeyId: string) => togglePasskey(passkeyId),
        onSuccess: (data) => {
            showSuccessToast(
                data?.message || 'Passkey status updated successfully'
            );
            queryClient.invalidateQueries({ queryKey: ['passkeys'] });
            queryClient.invalidateQueries({ queryKey: ['passkey-stats'] });
        },
        onError: (error) => {
            console.error('Failed to toggle passkey:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Failed to update passkey status';
            showErrorToast(message);
        },
    });
};

/**
 * Hook to rename a passkey
 */
export const useRenamePasskey = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: PasskeyRenamePayload) => renamePasskey(payload),
        onSuccess: (data) => {
            showSuccessToast(data?.message || 'Passkey renamed successfully');
            queryClient.invalidateQueries({ queryKey: ['passkeys'] });
        },
        onError: (error) => {
            console.error('Failed to rename passkey:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Failed to rename passkey';
            showErrorToast(message);
        },
    });
};

/**
 * Hook to enable a passkey
 */
export const useEnablePasskey = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (passkeyId: string) => enablePasskey(passkeyId),
        onSuccess: (data) => {
            showSuccessToast(data?.message || 'Passkey enabled successfully');
            queryClient.invalidateQueries({ queryKey: ['passkeys'] });
            queryClient.invalidateQueries({ queryKey: ['passkey-stats'] });
        },
        onError: (error) => {
            console.error('Failed to enable passkey:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Failed to enable passkey';
            showErrorToast(message);
        },
    });
};

/**
 * Hook to disable a passkey
 */
export const useDisablePasskey = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (passkeyId: string) => disablePasskey(passkeyId),
        onSuccess: (data) => {
            showSuccessToast(data?.message || 'Passkey disabled successfully');
            queryClient.invalidateQueries({ queryKey: ['passkeys'] });
            queryClient.invalidateQueries({ queryKey: ['passkey-stats'] });
        },
        onError: (error) => {
            console.error('Failed to disable passkey:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Failed to disable passkey';
            showErrorToast(message);
        },
    });
};
