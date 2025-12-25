import { create } from 'zustand';
import type { Tenant, TenantState } from '../../types';

const TENANT_LIST_KEY = 'tenants';
const SELECTED_TENANT_KEY = 'selectedTenant';

const isBrowser = typeof window !== 'undefined';

const readFromStorage = <T>(key: string): T | null => {
    if (!isBrowser) return null;
    try {
        const raw = window.localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
    } catch (error) {
        console.warn(`Failed to read ${key} from storage`, error);
        return null;
    }
};

const writeToStorage = (key: string, value: unknown) => {
    if (!isBrowser) return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn(`Failed to write ${key} to storage`, error);
    }
};

const removeFromStorage = (key: string) => {
    if (!isBrowser) return;
    try {
        window.localStorage.removeItem(key);
    } catch (error) {
        console.warn(`Failed to remove ${key} from storage`, error);
    }
};

const getInitialTenants = () =>
    readFromStorage<Tenant[]>(TENANT_LIST_KEY) || [];
const getInitialSelectedTenant = () =>
    readFromStorage<Tenant>(SELECTED_TENANT_KEY);

export const TenantStore = create<TenantState>((set, get) => ({
    tenants: getInitialTenants(),
    selectedTenant: getInitialSelectedTenant(),

    setTenants: (tenants, options) => {
        writeToStorage(TENANT_LIST_KEY, tenants);
        set({ tenants });

        const preferredTenantId =
            options?.selectTenantId || get().selectedTenant?.id;
        const resolvedTenant =
            tenants.find((tenant) => tenant.id === preferredTenantId) ||
            tenants[0] ||
            null;

        if (resolvedTenant) {
            writeToStorage(SELECTED_TENANT_KEY, resolvedTenant);
            set({ selectedTenant: resolvedTenant });
        } else {
            removeFromStorage(SELECTED_TENANT_KEY);
            set({ selectedTenant: null });
        }
    },

    selectTenant: (tenantId) => {
        const tenant = get().tenants.find((item) => item.id === tenantId);
        if (!tenant) return;

        writeToStorage(SELECTED_TENANT_KEY, tenant);
        set({ selectedTenant: tenant });
    },

    hydrateTenant: () => {
        const tenants = getInitialTenants();
        const storedSelected = getInitialSelectedTenant();

        const selected =
            (storedSelected &&
                tenants.find((tenant) => tenant.id === storedSelected.id)) ||
            tenants[0] ||
            null;

        set({
            tenants,
            selectedTenant: selected,
        });
    },

    clearTenants: () => {
        removeFromStorage(TENANT_LIST_KEY);
        removeFromStorage(SELECTED_TENANT_KEY);
        set({
            tenants: [],
            selectedTenant: null,
        });
    },
}));
