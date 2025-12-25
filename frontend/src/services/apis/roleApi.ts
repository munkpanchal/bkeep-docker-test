import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../axiosClient';

type RoleType = {
    id: string;
    name: string;
    displayName: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

type PaginationType = {
    page: number;
    limit: number;
    offset: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

type RolesResponseType = {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        items: RoleType[];
        pagination: PaginationType;
    };
};

export async function getRolesRequest(): Promise<RolesResponseType> {
    const response = await axiosInstance.get('/roles');
    return response.data;
}

export async function getRoleByRoleID(roleId: string): Promise<RoleType> {
    const response = await axiosInstance.get(`/roles/${roleId}`);
    return response.data;
}

export const useGetRoles = () => {
    return useQuery({
        queryKey: ['roles'],
        queryFn: getRolesRequest,
    });
};
