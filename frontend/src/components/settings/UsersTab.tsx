import { useEffect, useState } from 'react';
import {
    FaEdit,
    FaPaperPlane,
    FaPlus,
    FaSearch,
    FaTimes,
    FaUsers,
} from 'react-icons/fa';
import { useGetRoles } from '../../services/apis/roleApi';
import {
    useResendInvitation,
    useUsers,
    type UsersQueryParams,
} from '../../services/apis/usersApi';

import { UserType } from '../../types';
import Button from '../typography/Button';
import Chips from '../typography/Chips';
import { InputField } from '../typography/InputFields';
import EditUserModal from './EditUserModal';
import InviteUserModal from './InviteUserModal';

const UsersTab = () => {
    const [search, setSearch] = useState('');
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [filters, setFilters] = useState<UsersQueryParams>({
        page: 1,
        limit: 20,
        sort: 'createdAt',
        order: 'asc',
    });

    const { data, isLoading, isError } = useUsers(filters);

    const { data: rolesData } = useGetRoles();
    const roles = rolesData?.data?.items || [];

    const { mutateAsync: resendInvitation, isPending: isResendingInvitation } =
        useResendInvitation();

    // Sync search input with filters.search
    useEffect(() => {
        if (filters.search !== undefined) {
            setSearch(filters.search);
        }
    }, [filters.search]);

    const handleEditUser = (user: UserType) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters((prev) => ({
            ...prev,
            search: search.trim() || undefined,
            page: 1, // Reset to first page on new search
        }));
    };

    const handleClearSearch = () => {
        setSearch('');
        setFilters((prev) => ({
            ...prev,
            search: undefined,
            page: 1,
        }));
    };

    const handleResendInvitation = async (userId: string) => {
        try {
            await resendInvitation(userId);
        } catch (error) {
            // Error is handled by the mutation's onError
            console.error('Resend invitation error:', error);
        }
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({
            ...prev,
            page: newPage,
        }));
    };

    const handleFilterChange = (
        key: keyof UsersQueryParams,
        value: boolean | undefined
    ) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            page: 1, // Reset to first page on filter change
        }));
    };

    const users = data?.data?.items || [];
    const pagination = data?.data?.pagination;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary">
                    Users Management
                </h3>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-primary-50">
                        <FaUsers className="w-4 h-4" />
                        <span>
                            {pagination?.total || 0} user
                            {pagination?.total !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setIsInviteModalOpen(true)}
                    >
                        <FaPlus className="mr-2" />
                        Invite User
                    </Button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="flex-1 relative">
                        <InputField
                            id="user-search"
                            placeholder="Search users by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            icon={<FaSearch className="w-4 h-4" />}
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-primary-50 hover:text-primary transition-colors"
                                aria-label="Clear search"
                            >
                                <FaTimes className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <Button type="submit" variant="primary">
                        Search
                    </Button>
                </form>

                {/* Filter Toggles */}
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.isVerified === true}
                            onChange={(e) =>
                                handleFilterChange(
                                    'isVerified',
                                    e.target.checked ? true : undefined
                                )
                            }
                            className="w-4 h-4 text-primary border-primary-10 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-primary">
                            Verified Only
                        </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.isActive === true}
                            onChange={(e) =>
                                handleFilterChange(
                                    'isActive',
                                    e.target.checked ? true : undefined
                                )
                            }
                            className="w-4 h-4 text-primary border-primary-10 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-primary">
                            Active Only
                        </span>
                    </label>
                </div>
            </div>

            {/* Users Table */}
            {isLoading ? (
                <div className="text-center py-8 text-primary-50">
                    Loading users...
                </div>
            ) : isError ? (
                <div className="text-center py-8 text-red-500">
                    Failed to load users. Please try again.
                </div>
            ) : users.length === 0 ? (
                <div className="text-center py-8 text-primary-50">
                    No users found
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-primary-10">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-primary">
                                        Name
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-primary">
                                        Email
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-primary">
                                        Role
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-primary">
                                        Status
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-primary">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user: UserType) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-primary-10 hover:bg-primary-5 transition-colors"
                                    >
                                        <td className="py-3 px-4 text-sm text-primary">
                                            {user.name}
                                        </td>

                                        <td className="py-3 px-4 text-sm text-primary-75">
                                            {user.email}
                                        </td>

                                        <td className="py-3 px-4 text-sm text-primary-75">
                                            {user.role?.displayName ||
                                                user.role?.name ||
                                                user.roles?.[0]?.displayName ||
                                                user.roles?.[0]?.name ||
                                                'N/A'}
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            <Chips
                                                label={
                                                    user.isVerified
                                                        ? 'Verified'
                                                        : 'Unverified'
                                                }
                                                variant={
                                                    user.isVerified
                                                        ? 'success'
                                                        : 'danger'
                                                }
                                            />
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!user.isVerified && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleResendInvitation(
                                                                user.id
                                                            )
                                                        }
                                                        loading={
                                                            isResendingInvitation
                                                        }
                                                        disabled={
                                                            isResendingInvitation
                                                        }
                                                        title="Resend invitation email"
                                                    >
                                                        <FaPaperPlane className="mr-1" />
                                                        Resend
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleEditUser(user)
                                                    }
                                                >
                                                    <FaEdit className="mr-1" />
                                                    Edit
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-primary-10">
                            <div className="text-sm text-primary-50">
                                Showing page {pagination.page} of{' '}
                                {pagination.totalPages} ({pagination.total}{' '}
                                total users)
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handlePageChange(pagination.page - 1)
                                    }
                                    disabled={!pagination.hasPreviousPage}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handlePageChange(pagination.page + 1)
                                    }
                                    disabled={!pagination.hasNextPage}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            <InviteUserModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                roles={roles}
            />

            {selectedUser && (
                <EditUserModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    user={selectedUser}
                />
            )}
        </div>
    );
};

export default UsersTab;
