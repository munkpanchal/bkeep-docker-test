import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserType, UsersListResponse } from '../../types';
import { showErrorToast, showSuccessToast } from '../../utills/toast';
import axiosInstance from '../axiosClient';

export type UsersQueryParams = {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
    isVerified?: boolean;
    isActive?: boolean;
};

export async function getUsersRequest(
    params: UsersQueryParams = {}
): Promise<UsersListResponse> {
    const queryParams = new URLSearchParams();

    if (params.page !== undefined) {
        queryParams.append('page', params.page.toString());
    }
    if (params.limit !== undefined) {
        queryParams.append('limit', params.limit.toString());
    }
    if (params.sort) {
        queryParams.append('sort', params.sort);
    }
    if (params.order) {
        queryParams.append('order', params.order);
    }
    if (params.search) {
        queryParams.append('search', params.search);
    }
    if (params.isVerified !== undefined) {
        queryParams.append('isVerified', params.isVerified.toString());
    }
    if (params.isActive !== undefined) {
        queryParams.append('isActive', params.isActive.toString());
    }

    const queryString = queryParams.toString();
    const url = `/users${queryString ? `?${queryString}` : ''}`;

    const response = await axiosInstance.get(url);
    return response.data;
}

export const useUsers = (params: UsersQueryParams = {}) => {
    return useQuery<UsersListResponse, Error>({
        queryKey: ['users', params],
        queryFn: () => getUsersRequest(params),
    });
};

// Get User Statistics
type UserStatisticsResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data?: {
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        verifiedUsers: number;
        unverifiedUsers: number;
        pendingInvitations: number;
    };
};

export async function getUserStatisticsRequest(): Promise<UserStatisticsResponse> {
    const response = await axiosInstance.get('/users/statistics');
    return response.data;
}

export const useUserStatistics = () => {
    return useQuery<UserStatisticsResponse, Error>({
        queryKey: ['users', 'statistics'],
        queryFn: getUserStatisticsRequest,
    });
};

// Get Pending Invitations
type Invitation = {
    id: string;
    email: string;
    name: string;
    roleId: string;
    role?: {
        id: string;
        name: string;
        displayName: string;
    };
    invitedBy: string;
    expiresAt: string;
    createdAt: string;
};

type InvitationsListResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data?: {
        items: Invitation[];
        pagination?: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    };
};

export async function getInvitationsRequest(): Promise<InvitationsListResponse> {
    const response = await axiosInstance.get('/users/invitations');
    return response.data;
}

export const useInvitations = () => {
    return useQuery<InvitationsListResponse, Error>({
        queryKey: ['users', 'invitations'],
        queryFn: getInvitationsRequest,
    });
};

// Get User by ID
type UserResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data?: UserType;
};

export async function getUserByIdRequest(
    userId: string
): Promise<UserResponse> {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
}

export const useUser = (userId: string) => {
    return useQuery<UserResponse, Error>({
        queryKey: ['users', userId],
        queryFn: () => getUserByIdRequest(userId),
        enabled: !!userId,
    });
};

// Delete User
type DeleteUserResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data?: {
        id: string;
    };
};

export async function deleteUserRequest(
    userId: string
): Promise<DeleteUserResponse> {
    const response = await axiosInstance.delete(`/users/${userId}`);
    return response.data;
}

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => deleteUserRequest(userId),
        onSuccess: (data) => {
            showSuccessToast(data?.message || 'User deleted successfully');
            // Invalidate users query to refresh the list
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error) => {
            console.error('Delete User Failed:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Failed to delete user';
            showErrorToast(message);
        },
    });
};

// Update Current User Profile
export type UpdateProfilePayload = {
    name?: string;
    email?: string;
    phone?: string;
};

type UpdateProfileResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data?: UserType;
};

export async function updateProfileRequest(
    payload: UpdateProfilePayload
): Promise<UpdateProfileResponse> {
    const response = await axiosInstance.put('/users/profile', payload);
    return response.data;
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateProfilePayload) =>
            updateProfileRequest(payload),
        onSuccess: (data) => {
            showSuccessToast(data?.message || 'Profile updated successfully');
            // Invalidate users query and current user data
            queryClient.invalidateQueries({ queryKey: ['users'] });
            if (data?.data?.id) {
                queryClient.invalidateQueries({
                    queryKey: ['users', data.data.id],
                });
            }
        },
        onError: (error) => {
            console.error('Update Profile Failed:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Failed to update profile';
            showErrorToast(message);
        },
    });
};

// Activate/Deactivate User
type UserActivationPayload = {
    isActive: boolean;
};

type UserActivationResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data?: {
        id: string;
        isActive: boolean;
    };
};

export async function updateUserActivationRequest(
    userId: string,
    payload: UserActivationPayload
): Promise<UserActivationResponse> {
    const response = await axiosInstance.patch(
        `/users/${userId}/activation`,
        payload
    );
    return response.data;
}

export const useUpdateUserActivation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            userId,
            isActive,
        }: {
            userId: string;
            isActive: boolean;
        }) => updateUserActivationRequest(userId, { isActive }),
        onSuccess: (data) => {
            showSuccessToast(
                data?.message ||
                    `User ${data?.data?.isActive ? 'activated' : 'deactivated'} successfully`
            );
            // Invalidate users query to refresh the list
            queryClient.invalidateQueries({ queryKey: ['users'] });
            if (data?.data?.id) {
                queryClient.invalidateQueries({
                    queryKey: ['users', data.data.id],
                });
            }
        },
        onError: (error) => {
            console.error('Update User Activation Failed:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Failed to update user activation status';
            showErrorToast(message);
        },
    });
};

// Restore Soft-Deleted User
type RestoreUserResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data?: {
        id: string;
        isActive: boolean;
    };
};

export async function restoreUserRequest(
    userId: string
): Promise<RestoreUserResponse> {
    const response = await axiosInstance.patch(`/users/${userId}/restore`);
    return response.data;
}

export const useRestoreUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => restoreUserRequest(userId),
        onSuccess: (data) => {
            showSuccessToast(data?.message || 'User restored successfully');
            // Invalidate users query to refresh the list
            queryClient.invalidateQueries({ queryKey: ['users'] });
            if (data?.data?.id) {
                queryClient.invalidateQueries({
                    queryKey: ['users', data.data.id],
                });
            }
        },
        onError: (error) => {
            console.error('Restore User Failed:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Failed to restore user';
            showErrorToast(message);
        },
    });
};

// Update User Roles
export type UpdateUserRolesPayload = {
    roleIds: string[];
};

type UpdateUserRolesResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data?: {
        id: string;
        roles: Array<{
            id: string;
            name: string;
            displayName: string;
        }>;
    };
};

export async function updateUserRolesRequest(
    userId: string,
    payload: UpdateUserRolesPayload
): Promise<UpdateUserRolesResponse> {
    const response = await axiosInstance.put(`/users/${userId}/roles`, payload);
    return response.data;
}

export const useUpdateUserRoles = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            userId,
            roleIds,
        }: {
            userId: string;
            roleIds: string[];
        }) => updateUserRolesRequest(userId, { roleIds }),
        onSuccess: (data) => {
            showSuccessToast(
                data?.message || 'User roles updated successfully'
            );
            // Invalidate users query to refresh the list
            queryClient.invalidateQueries({ queryKey: ['users'] });
            if (data?.data?.id) {
                queryClient.invalidateQueries({
                    queryKey: ['users', data.data.id],
                });
            }
        },
        onError: (error) => {
            console.error('Update User Roles Failed:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Failed to update user roles';
            showErrorToast(message);
        },
    });
};

// Revoke Invitation
type RevokeInvitationResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data?: {
        id: string;
    };
};

export async function revokeInvitationRequest(
    invitationId: string
): Promise<RevokeInvitationResponse> {
    const response = await axiosInstance.delete(
        `/users/invitations/${invitationId}`
    );
    return response.data;
}

export const useRevokeInvitation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (invitationId: string) =>
            revokeInvitationRequest(invitationId),
        onSuccess: (data) => {
            showSuccessToast(
                data?.message || 'Invitation revoked successfully'
            );
            // Invalidate invitations and users queries
            queryClient.invalidateQueries({
                queryKey: ['users', 'invitations'],
            });
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error) => {
            console.error('Revoke Invitation Failed:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Failed to revoke invitation';
            showErrorToast(message);
        },
    });
};

export type InviteUserPayload = {
    name: string;
    email: string;
    roleId: string;
};

type InviteUserResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data?: {
        id: string;
        email: string;
    };
};

export async function inviteUserRequest(
    payload: InviteUserPayload
): Promise<InviteUserResponse> {
    const response = await axiosInstance.post('/users/invitation', payload);
    return response.data;
}

export const useInviteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: InviteUserPayload) => inviteUserRequest(payload),
        onSuccess: (data) => {
            showSuccessToast(
                data?.message || 'User invitation sent successfully'
            );
            // Invalidate users query to refresh the list
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error) => {
            console.error('Invite User Failed:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Failed to send invitation';
            showErrorToast(message);
        },
    });
};

export type UpdateUserPayload = {
    userId: string;
    name: string;
    email: string;
    roleId: string;
    phone?: string;
    isActive?: boolean;
};

type UpdateUserResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data?: {
        id: string;
        name: string;
        email: string;
    };
};

export async function updateUserRequest(
    payload: UpdateUserPayload
): Promise<UpdateUserResponse> {
    const { userId, ...updateData } = payload;
    const response = await axiosInstance.patch(`/users/${userId}`, updateData);
    return response.data;
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateUserPayload) => updateUserRequest(payload),
        onSuccess: (data) => {
            showSuccessToast(data?.message || 'User updated successfully');
            // Invalidate users query to refresh the list
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error) => {
            console.error('Update User Failed:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Failed to update user';
            showErrorToast(message);
        },
    });
};

// Resend Invitation
type ResendInvitationResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data?: {
        id: string;
        email: string;
    };
};

export async function resendInvitationRequest(
    invitationId: string
): Promise<ResendInvitationResponse> {
    const response = await axiosInstance.post(
        `/users/invitations/${invitationId}/resend`
    );
    return response.data;
}

export const useResendInvitation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (invitationId: string) =>
            resendInvitationRequest(invitationId),
        onSuccess: (data) => {
            showSuccessToast(data?.message || 'Invitation resent successfully');
            // Invalidate users query to refresh the list
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error) => {
            console.error('Resend Invitation Failed:', error);
            const maybeAxiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message =
                maybeAxiosError.response?.data?.message ||
                'Failed to resend invitation';
            showErrorToast(message);
        },
    });
};
