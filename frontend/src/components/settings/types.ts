import React from 'react';

export interface SettingsFormData {
    name: string;
    email: string;
    phone: string;
    company: string;
    timezone: string;
    currency: string;
    dateFormat: string;
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
    };
}

export type SettingsTabId =
    | 'profile'
    | 'notifications'
    | 'security'
    | 'preferences'
    | 'data'
    | 'users'
    | 'roles'
    | 'tenants';

export interface SettingsTab {
    id: SettingsTabId;
    label: string;
    icon: React.ReactNode;
}
