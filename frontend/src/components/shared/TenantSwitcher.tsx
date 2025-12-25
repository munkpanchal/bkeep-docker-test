import { useEffect, useRef, useState } from 'react';
import { FaBuilding, FaCheck, FaChevronDown, FaSpinner } from 'react-icons/fa';
import { useSwitchTenant, useUserTenants } from '../../services/apis/tenantApi';
import { useAuth } from '../../stores/auth/authSelectore';
import { showErrorToast } from '../../utills/toast';

type TenantSwitcherProps = {
    compact?: boolean;
};

const TenantSwitcher = ({ compact = false }: TenantSwitcherProps) => {
    const { user, setAuth } = useAuth();
    const [isSwitching, setIsSwitching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { mutateAsync: switchTenant } = useSwitchTenant();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch user-accessible tenants from API (works for all users)
    const { data: tenantsResponse, isLoading: isLoadingTenants } =
        useUserTenants({
            page: 1,
            limit: 100,
            sort: 'createdAt',
            order: 'asc',
        });

    const tenants = tenantsResponse?.data?.items || [];
    const selectedTenantId = user?.selectedTenantId;
    const selectedTenant = tenants.find((t) => t.id === selectedTenantId);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleTenantChange = async (tenantId: string) => {
        if (!tenantId || tenantId === selectedTenantId) {
            setIsOpen(false);
            return;
        }

        setIsSwitching(true);
        setIsOpen(false);

        try {
            console.log('Initiating tenant switch to:', tenantId);

            // Call the switch API
            const response = await switchTenant(tenantId);

            console.log('Tenant switch response:', response);

            // Update auth tokens with the new ones from the response
            if (
                user &&
                response.data.accessToken &&
                response.data.refreshToken
            ) {
                // Update the user's selectedTenantId
                const updatedUser = {
                    ...user,
                    selectedTenantId: tenantId,
                };

                // Update auth store with new tokens and updated user
                setAuth(
                    updatedUser,
                    response.data.accessToken,
                    response.data.refreshToken
                );

                console.log('Auth tokens and user updated successfully');
            }

            // Reload the page to ensure all data is refreshed with new tenant context
            window.location.reload();
        } catch (error) {
            console.error('Failed to switch tenant:', error);
            showErrorToast('Failed to switch tenant. Please try again.');
        } finally {
            setIsSwitching(false);
        }
    };

    // Don't render if still loading or no tenants
    if (isLoadingTenants || !tenants.length) {
        return null;
    }

    const buttonClasses = compact ? 'text-xs px-2 py-1' : 'text-sm px-3 py-2';

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() =>
                    !isSwitching && !isLoadingTenants && setIsOpen(!isOpen)
                }
                disabled={isSwitching || isLoadingTenants}
                className={`flex items-center px-4 py-2 gap-2 bg-white border border-primary/25 rounded-2 transition-all duration-200 ${buttonClasses} ${isSwitching || isLoadingTenants ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary-20'}`}
            >
                {isSwitching || isLoadingTenants ? (
                    <FaSpinner className="text-primary-50 w-4 h-4 animate-spin" />
                ) : (
                    <FaBuilding className="text-primary-50 w-4 h-4" />
                )}
                <span className="text-primary font-medium truncate max-w-[150px]">
                    {isLoadingTenants
                        ? 'Loading...'
                        : selectedTenant?.name || 'Select Tenant'}
                </span>
                <FaChevronDown
                    className={`text-primary-50 w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Popup */}
            {isOpen && (
                <div className="absolute top-full mt-2 right-0 w-64 bg-white border border-gray-200 rounded-2 z-50 max-h-96 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-700">
                            Switch Tenant
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                            Select a tenant to switch to
                        </p>
                    </div>

                    {/* Tenant List */}
                    <div className="overflow-y-auto max-h-80">
                        {tenants.map((tenant) => {
                            const isSelected = tenant.id === selectedTenantId;
                            return (
                                <button
                                    key={tenant.id}
                                    onClick={() =>
                                        handleTenantChange(tenant.id)
                                    }
                                    disabled={isSwitching || isSelected}
                                    className={`w-full px-4 py-3 flex items-center justify-between  hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 ${
                                        isSelected
                                            ? 'bg-primary-5 hover:bg-primary-5'
                                            : ''
                                    } ${isSwitching ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div
                                            className={`shrink-0 w-10 h-10 rounded-2 flex items-center justify-center ${
                                                isSelected
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            <FaBuilding className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 text-left min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p
                                                    className={`text-sm font-medium truncate ${
                                                        isSelected
                                                            ? 'text-primary'
                                                            : 'text-gray-900'
                                                    }`}
                                                >
                                                    {tenant.name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <FaCheck className="text-primary w-4 h-4 shrink-0" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    {tenants.length === 0 && (
                        <div className="px-4 py-6 text-center">
                            <p className="text-sm text-gray-500">
                                No tenants available
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TenantSwitcher;
