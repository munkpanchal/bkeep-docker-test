import { useState } from 'react';
import { NotificationsTab, ProfileTab, type SettingsFormData } from './index';
import { useAuth } from '../../stores/auth/authSelectore';

export const ProfileTabWrapper = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState<SettingsFormData>({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        company: '',
        timezone: 'America/New_York',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        notifications: {
            email: true,
            push: false,
            sms: false,
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Settings saved:', formData);
    };

    return (
        <ProfileTab
            formData={formData}
            onFormDataChange={setFormData}
            onSubmit={handleSubmit}
            roleDisplayName={user?.role?.displayName || user?.role?.name}
        />
    );
};

export const NotificationsTabWrapper = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState<SettingsFormData>({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        company: '',
        timezone: 'America/New_York',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        notifications: {
            email: true,
            push: false,
            sms: false,
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Settings saved:', formData);
    };

    return (
        <NotificationsTab
            formData={formData}
            onFormDataChange={setFormData}
            onSubmit={handleSubmit}
        />
    );
};
