import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PaginationInfo, Tenant } from '../../types';
import { showErrorToast, showSuccessToast } from '../../utills/toast';
import axiosInstance from '../axiosClient';

export type TenantsQueryParams = {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
};

export type TenantsListResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        items: Tenant[];
        pagination: PaginationInfo;
    };
};

// Get user-accessible tenants (for all users)
export async function getUserTenantsRequest(
    params: TenantsQueryParams = {}
): Promise<TenantsListResponse> {
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

    const queryString = queryParams.toString();
    const url = `/tenants${queryString ? `?${queryString}` : ''}`;

    const response = await axiosInstance.get(url);
    return response.data;
}

// Get all tenants (requires admin permissions)
export async function getTenantsRequest(
    params: TenantsQueryParams = {}
): Promise<TenantsListResponse> {
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

    const queryString = queryParams.toString();
    const url = `/tenants/all${queryString ? `?${queryString}` : ''}`;

    const response = await axiosInstance.get(url);
    return response.data;
}

// Hook for getting user-accessible tenants (works for all users)
export const useUserTenants = (params: TenantsQueryParams = {}) => {
    return useQuery<TenantsListResponse, Error>({
        queryKey: ['user-tenants', params],
        queryFn: async () => {
            try {
                return await getUserTenantsRequest(params);
            } catch (error) {
                console.error('Get User Tenants Failed:', error);
                const maybeAxiosError = error as {
                    response?: {
                        status?: number;
                        data?: { message?: string };
                    };
                };
                const message =
                    maybeAxiosError.response?.data?.message ||
                    'Failed to fetch tenants';
                showErrorToast(message);
                throw error;
            }
        },
        retry: false,
    });
};

// Hook for getting all tenants (requires admin permissions)
export const useTenants = (
    params: TenantsQueryParams = {},
    options?: { showErrorToast?: boolean }
) => {
    return useQuery<TenantsListResponse, Error>({
        queryKey: ['tenants', params],
        queryFn: async () => {
            try {
                return await getTenantsRequest(params);
            } catch (error) {
                console.error('Get Tenants Failed:', error);
                const maybeAxiosError = error as {
                    response?: {
                        status?: number;
                        data?: { message?: string };
                    };
                };

                // Don't show toast for 403 errors if disabled (permission issues)
                if (
                    options?.showErrorToast !== false ||
                    maybeAxiosError.response?.status !== 403
                ) {
                    const message =
                        maybeAxiosError.response?.data?.message ||
                        'Failed to fetch tenants';
                    showErrorToast(message);
                }
                throw error;
            }
        },
        retry: false, // Don't retry on failure (especially for permission errors)
    });
};

export type CreateTenantRequest = {
    name: string;
    schemaName: string;
};

export type CreateTenantResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data: Tenant;
};

export async function createTenantRequest(
    data: CreateTenantRequest
): Promise<CreateTenantResponse> {
    const response = await axiosInstance.post('/tenants', data);
    return response.data;
}

export const useCreateTenant = () => {
    const queryClient = useQueryClient();

    return useMutation<CreateTenantResponse, Error, CreateTenantRequest>({
        mutationFn: async (data) => {
            try {
                return await createTenantRequest(data);
            } catch (error) {
                console.error('Create Tenant Failed:', error);
                const maybeAxiosError = error as {
                    response?: { data?: { message?: string } };
                };
                const message =
                    maybeAxiosError.response?.data?.message ||
                    'Failed to create tenant';
                showErrorToast(message);
                throw error;
            }
        },
        onSuccess: (data) => {
            showSuccessToast(data.message || 'Tenant created successfully');
            // Invalidate tenants query to refetch the list
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
        },
    });
};

export type SwitchTenantResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
    };
};

export async function switchTenantRequest(
    tenantId: string
): Promise<SwitchTenantResponse> {
    const response = await axiosInstance.post(
        `/tenants/${tenantId}/switch`,
        {}
    );
    return response.data;
}

export const useSwitchTenant = () => {
    return useMutation<SwitchTenantResponse, Error, string>({
        mutationFn: async (tenantId) => {
            try {
                console.log('Switching to tenant:', tenantId);
                return await switchTenantRequest(tenantId);
            } catch (error) {
                console.error('Switch Tenant Failed:', error);
                const maybeAxiosError = error as {
                    response?: { data?: { message?: string } };
                };
                const message =
                    maybeAxiosError.response?.data?.message ||
                    'Failed to switch tenant';
                showErrorToast(message);
                throw error;
            }
        },
        onSuccess: (data) => {
            showSuccessToast(data.message || 'Tenant switched successfully');
        },
    });
};
