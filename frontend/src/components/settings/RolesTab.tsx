import { FaLock } from 'react-icons/fa';
import { useGetRoles } from '../../services/apis/roleApi';
import Button from '../typography/Button';

const RolesTab = () => {
    const { data, isLoading, isError } = useGetRoles();

    const roles = data?.data?.items || [];
    const pagination = data?.data?.pagination;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <FaLock className="w-4 h-4" />
                    <span>Roles</span>
                </h3>
                <div className="flex items-center gap-2 text-sm text-primary-50">
                    <span>
                        {pagination?.total || roles.length} role
                        {(pagination?.total || roles.length) !== 1 ? 's' : ''}
                    </span>

                    <Button variant="outline" size="sm" disabled>
                        Add role
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-8 text-primary-50">
                    Loading roles...
                </div>
            ) : isError ? (
                <div className="text-center py-8 text-red-500">
                    Failed to load roles. Please try again.
                </div>
            ) : roles.length === 0 ? (
                <div className="text-center py-8 text-primary-50">
                    No roles found
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
                                        Display name
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-primary">
                                        Description
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-primary">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.map((role) => (
                                    <tr
                                        key={role.id}
                                        className="border-b border-primary-10 hover:bg-primary-5 transition-colors"
                                    >
                                        <td className="py-3 px-4 text-sm text-primary">
                                            {role.name}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-primary-75">
                                            {role.displayName}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-primary-75 max-w-md truncate">
                                            {role.description || '—'}
                                            hh
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    role.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {role.isActive
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-primary-10 text-sm text-primary-50">
                            <span>
                                Page {pagination.page} of{' '}
                                {pagination.totalPages} ({pagination.total}{' '}
                                total roles)
                            </span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default RolesTab;
