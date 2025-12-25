import { useState } from 'react';
import {
    FaEnvelope,
    FaMapMarkerAlt,
    FaPhone,
    FaSave,
    FaUser,
} from 'react-icons/fa';
import { useAuth } from '../../stores/auth/authSelectore';
import Button from '../typography/Button';
import { InputField } from '../typography/InputFields';
import { SettingsFormData } from './types';

interface ProfileTabProps {
    formData: SettingsFormData;
    onFormDataChange: (data: SettingsFormData) => void;
    onSubmit: (e: React.FormEvent) => void;
    roleDisplayName?: string;
}

const ProfileTab = ({
    formData,
    onFormDataChange,
    onSubmit,
    roleDisplayName,
}: ProfileTabProps) => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        onSubmit(e);
        setIsEditing(false);
    };

    // Get user initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="flex flex-col gap-2">
            {/* Profile Header Card */}
            <div className="bg-gradient-to-br from-primary/5 to-primary-10/30 rounded-2 p-6 border border-primary-10">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-primary-75 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            {getInitials(formData.name || 'User')}
                        </div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 space-y-3">
                        <div>
                            <h2 className="text-2xl font-bold text-primary mb-1">
                                {formData.name || 'User Name'}
                            </h2>
                            <p className="text-sm text-primary-50">
                                Manage your personal information and account
                                settings
                            </p>
                        </div>

                        {/* Contact Badges */}
                        <div className="flex flex-wrap gap-3">
                            {formData.company && (
                                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-xs text-primary-75 border border-primary-10">
                                    <FaMapMarkerAlt className="text-primary" />
                                    {formData.company}
                                </div>
                            )}
                            {formData.phone && (
                                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-xs text-primary-75 border border-primary-10">
                                    <FaPhone className="text-primary" />
                                    {formData.phone}
                                </div>
                            )}
                            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-xs text-primary-75 border border-primary-10">
                                <FaEnvelope className="text-primary" />
                                {formData.email}
                            </div>
                        </div>
                    </div>

                    {/* Edit Button */}
                    {!isEditing && (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            type="button"
                        >
                            Edit Profile
                        </Button>
                    )}
                </div>
            </div>

            {/* Information Grid */}
            {isEditing ? (
                /* Edit Mode - Form */
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-2 border border-primary-10 p-6">
                        <h3 className="text-lg font-semibold text-primary mb-6 flex items-center gap-2">
                            <FaUser className="text-primary-50" />
                            Personal Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <InputField
                                id="name"
                                label="Full Name"
                                value={formData.name}
                                onChange={(e) =>
                                    onFormDataChange({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                required
                            />
                            <InputField
                                id="email"
                                label="Email Address"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    onFormDataChange({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                required
                            />
                            <InputField
                                id="phone"
                                label="Phone Number"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) =>
                                    onFormDataChange({
                                        ...formData,
                                        phone: e.target.value,
                                    })
                                }
                            />
                            <InputField
                                id="company"
                                label="Company / Location"
                                value={formData.company}
                                onChange={(e) =>
                                    onFormDataChange({
                                        ...formData,
                                        company: e.target.value,
                                    })
                                }
                            />
                            <InputField
                                id="timezone"
                                label="Timezone"
                                value={formData.timezone}
                                onChange={(e) =>
                                    onFormDataChange({
                                        ...formData,
                                        timezone: e.target.value,
                                    })
                                }
                            />
                            <InputField
                                id="currency"
                                label="Currency"
                                value={formData.currency}
                                onChange={(e) =>
                                    onFormDataChange({
                                        ...formData,
                                        currency: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-primary-10">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            <FaSave className="mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </form>
            ) : (
                /* View Mode - Display */
                <div className="flex flex-col gap-2">
                    {/* Primary Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white rounded-2 border border-primary-10 p-4">
                            <div className="text-xs font-medium text-primary-50 mb-2">
                                Full Name
                            </div>
                            <div className="text-sm font-semibold text-primary">
                                {formData.name || user?.name || '—'}
                            </div>
                        </div>

                        <div className="bg-white rounded-2 border border-primary-10 p-4">
                            <div className="text-xs font-medium text-primary-50 mb-2">
                                Email Address
                            </div>
                            <div className="text-sm font-semibold text-primary break-all">
                                {formData.email || user?.email || '—'}
                            </div>
                        </div>

                        <div className="bg-white rounded-2 border border-primary-10 p-4">
                            <div className="text-xs font-medium text-primary-50 mb-2">
                                Phone Number
                            </div>
                            <div className="text-sm font-semibold text-primary">
                                {formData.phone || '—'}
                            </div>
                        </div>

                        <div className="bg-white rounded-2 border border-primary-10 p-4">
                            <div className="text-xs font-medium text-primary-50 mb-2">
                                Company / Location
                            </div>
                            <div className="text-sm font-semibold text-primary">
                                {formData.company || '—'}
                            </div>
                        </div>

                        <div className="bg-white rounded-2 border border-primary-10 p-4">
                            <div className="text-xs font-medium text-primary-50 mb-2">
                                Role
                            </div>
                            <div className="text-sm font-semibold text-primary">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-10 text-primary">
                                    {roleDisplayName ||
                                        user?.role?.displayName ||
                                        user?.role?.name ||
                                        '—'}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2 border border-primary-10 p-4">
                            <div className="text-xs font-medium text-primary-50 mb-2">
                                Currency
                            </div>
                            <div className="text-sm font-semibold text-primary">
                                {formData.currency || '—'}
                            </div>
                        </div>
                    </div>

                    {/* Permissions */}
                    <div className="bg-white rounded-2 border border-primary-10 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className="text-sm font-semibold text-primary">
                                    Permissions
                                </div>
                                <p className="text-xs text-primary-50">
                                    Capabilities granted to this user
                                </p>
                            </div>
                            <span className="text-xs text-primary-50">
                                {user?.permissions?.length || 0} permission
                                {user && user.permissions.length !== 1
                                    ? 's'
                                    : ''}
                            </span>
                        </div>
                        {user?.permissions && user.permissions.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {user.permissions.map((perm) => (
                                    <span
                                        key={perm.id}
                                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-5 text-primary border border-primary-10"
                                    >
                                        {perm.displayName}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-primary-50">
                                No permissions assigned
                            </p>
                        )}
                    </div>

                    {/* Tenants / Organizations */}
                    <div className="bg-white rounded-2 border border-primary-10 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className="text-sm font-semibold text-primary">
                                    Organizations / Tenants
                                </div>
                                <p className="text-xs text-primary-50">
                                    All organizations this user belongs to
                                </p>
                            </div>
                            {user?.tenants && (
                                <span className="text-xs text-primary-50">
                                    {user.tenants.length} tenant
                                    {user.tenants.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>

                        {user?.tenants && user.tenants.length > 0 ? (
                            <div className="space-y-2">
                                {user.tenants.map((tenant) => {
                                    const isPrimary = tenant.isPrimary;
                                    const isSelected =
                                        user.selectedTenantId === tenant.id;
                                    return (
                                        <div
                                            key={tenant.id}
                                            className="flex items-center justify-between rounded-lg border border-primary-10 px-3 py-2 text-sm"
                                        >
                                            <div>
                                                <div className="font-semibold text-primary">
                                                    {tenant.name}
                                                </div>
                                                <div className="text-xs text-primary-50 break-all">
                                                    {tenant.id}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {isPrimary && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary-10 text-primary">
                                                        Primary
                                                    </span>
                                                )}
                                                {isSelected && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">
                                                        Selected
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-xs text-primary-50">
                                No tenant information available
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileTab;
