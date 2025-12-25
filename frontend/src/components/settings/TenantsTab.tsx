import { useState } from 'react';
import { FaBuilding, FaPlus } from 'react-icons/fa';
import {
    useTenants,
    type TenantsQueryParams,
} from '../../services/apis/tenantApi';
import { Tenant } from '../../types';
import Button from '../typography/Button';
import Chips from '../typography/Chips';
import CreateTenantModal from './CreateTenantModal';

const TenantsTab = () => {
    const [filters, setFilters] = useState<TenantsQueryParams>({
        page: 1,
        limit: 20,
        sort: 'createdAt',
        order: 'asc',
    });
    const [showCreateModal, setShowCreateModal] = useState(false);

    const { data, isLoading, isError } = useTenants(filters);

    const tenants = data?.data?.items || [];
    const pagination = data?.data?.pagination;

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({
            ...prev,
            page: newPage,
        }));
    };

    const handleSortChange = (sort: string, order: 'asc' | 'desc') => {
        setFilters((prev) => ({
            ...prev,
            sort,
            order,
            page: 1,
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <FaBuilding className="w-4 h-4" />
                    <span>Tenants Management</span>
                </h3>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-primary-50">
                        <FaBuilding className="w-4 h-4" />
                        <span>
                            {pagination?.total || 0} tenant
                            {(pagination?.total || tenants.length) !== 1
                                ? 's'
                                : ''}
                        </span>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)} size="sm">
                        <FaPlus className="w-3 h-3" />
                        Create Tenant
                    </Button>
                </div>
            </div>

            {/* Tenants Table */}
            {isLoading ? (
                <div className="text-center py-8 text-primary-50">
                    Loading tenants...
                </div>
            ) : isError ? (
                <div className="text-center py-8 text-red-500">
                    Failed to load tenants. Please try again.
                </div>
            ) : tenants.length === 0 ? (
                <div className="text-center py-8 text-primary-50">
                    No tenants found
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-primary-10">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-primary">
                                        <button
                                            onClick={() =>
                                                handleSortChange(
                                                    'name',
                                                    filters.order === 'asc'
                                                        ? 'desc'
                                                        : 'asc'
                                                )
                                            }
                                            className="flex items-center gap-2 hover:text-primary-75 transition-colors"
                                        >
                                            Name
                                            <span className="text-xs">
                                                {filters.sort === 'name'
                                                    ? filters.order === 'asc'
                                                        ? '↑'
                                                        : '↓'
                                                    : ''}
                                            </span>
                                        </button>
                                    </th>

                                    <th className="text-left py-3 px-4 text-sm font-semibold text-primary">
                                        Created At
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-primary">
                                        Status
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-primary">
                                        Is Primary
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tenants.map((tenant: Tenant) => (
                                    <tr
                                        key={tenant.id}
                                        className="border-b border-primary-10 hover:bg-primary-5 transition-colors"
                                    >
                                        <td className="py-3 px-4 text-sm text-primary font-medium">
                                            {tenant.name}
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            {new Date(
                                                tenant.createdAt
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            <Chips
                                                label={
                                                    tenant.isActive
                                                        ? 'Active'
                                                        : 'Inactive'
                                                }
                                                variant={
                                                    tenant.isActive
                                                        ? 'success'
                                                        : 'danger'
                                                }
                                            />
                                        </td>
                                        <td className="py-3 px-4 text-sm text-center">
                                            <Chips
                                                label={
                                                    tenant.isPrimary
                                                        ? 'Primary'
                                                        : 'NA'
                                                }
                                                variant={
                                                    tenant.isPrimary
                                                        ? 'success'
                                                        : 'danger'
                                                }
                                            />
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
                                total tenants)
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

            {/* Create Tenant Modal */}
            <CreateTenantModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </div>
    );
};

export default TenantsTab;
