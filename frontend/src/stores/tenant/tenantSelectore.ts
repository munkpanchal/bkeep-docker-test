import { TenantStore } from './tenantStore';

export const useTenant = () => {
    const tenants = TenantStore((state) => state.tenants);
    const selectedTenant = TenantStore((state) => state.selectedTenant);
    const setTenants = TenantStore((state) => state.setTenants);
    const selectTenant = TenantStore((state) => state.selectTenant);
    const hydrateTenant = TenantStore((state) => state.hydrateTenant);
    const clearTenants = TenantStore((state) => state.clearTenants);

    return {
        tenants,
        selectedTenant,
        setTenants,
        selectTenant,
        hydrateTenant,
        clearTenants,
    };
};
