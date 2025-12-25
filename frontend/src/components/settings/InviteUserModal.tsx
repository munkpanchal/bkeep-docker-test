import { useState } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useInviteUser } from '../../services/apis/usersApi';
import { Role } from '../../types';
import Popup from '../shared/Popup';
import Button from '../typography/Button';
import { InputField, SelectField } from '../typography/InputFields';

interface InviteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    roles?: Role[];
}

const InviteUserModal = ({
    isOpen,
    onClose,
    roles = [],
}: InviteUserModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        roleId: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { mutateAsync: inviteUser, isPending } = useInviteUser();

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.roleId) {
            newErrors.roleId = 'Please select a role';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await inviteUser({
                name: formData.name,
                email: formData.email,
                roleId: formData.roleId,
            });
            // Reset form on success
            setFormData({ name: '', email: '', roleId: '' });
            setErrors({});
            onClose();
        } catch (error) {
            // Error is handled by the mutation's onError
            console.error('Invite user error:', error);
        }
    };

    return (
        <Popup
            isOpen={isOpen}
            onClose={onClose}
            title="Add user"
            size="2xl"
            loading={isPending}
            footer={
                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        loading={isPending}
                        disabled={isPending}
                        form="invite-user-form"
                    >
                        Send invite
                    </Button>
                </div>
            }
        >
            <form
                id="invite-user-form"
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                {/* User Information */}
                <div>
                    <h3 className="text-lg font-semibold text-primary mb-4">
                        User Information
                    </h3>
                    <div className="space-y-4">
                        {/* Name Field */}
                        <div>
                            <InputField
                                id="user-name"
                                label="Full Name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    });
                                    if (errors.name) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            name: '',
                                        }));
                                    }
                                }}
                                required
                                placeholder="John Doe"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <FaExclamationTriangle className="w-3 h-3" />
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <InputField
                                id="user-email"
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    });
                                    if (errors.email) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            email: '',
                                        }));
                                    }
                                }}
                                required
                                placeholder="user@example.com"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <FaExclamationTriangle className="w-3 h-3" />
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Select a role */}
                <div>
                    <SelectField
                        id="user-role"
                        label="Select a role"
                        value={formData.roleId}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                roleId: e.target.value,
                            });
                            if (errors.roleId) {
                                setErrors((prev) => ({
                                    ...prev,
                                    roleId: '',
                                }));
                            }
                        }}
                        required
                        options={roles.map((role) => ({
                            value: role.id,
                            label: role.displayName,
                        }))}
                    />
                    {errors.roleId && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <FaExclamationTriangle className="w-3 h-3" />
                            {errors.roleId}
                        </p>
                    )}
                </div>
            </form>
        </Popup>
    );
};

export default InviteUserModal;
