import { useEffect, useState } from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { useGetRoles } from '../../services/apis/roleApi';
import { useUpdateUser } from '../../services/apis/usersApi';
import { UserType } from '../../types';
import Button from '../typography/Button';
import { InputField, SelectField } from '../typography/InputFields';

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserType | null;
}

const EditUserModal = ({ isOpen, onClose, user }: EditUserModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        roleId: '',
        isActive: true,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { data: rolesData } = useGetRoles();
    const roles = rolesData?.data?.items || [];

    const { mutateAsync: updateUser, isPending } = useUpdateUser();

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: '',
                roleId: user.role?.id || '',
                isActive: true,
            });
        }
    }, [user]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen && !isPending) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose, isPending]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && !isPending) {
            onClose();
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
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

        if (!validateForm() || !user) {
            return;
        }

        try {
            await updateUser({
                userId: user.id,
                name: formData.name,
                email: formData.email,
                roleId: formData.roleId,
                phone: formData.phone || undefined,
                isActive: formData.isActive,
            });
            setErrors({});
            onClose();
        } catch (error) {
            console.error('Update user error:', error);
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={handleBackdropClick}
        >
            <div className="w-full max-w-2xl rounded-2 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-primary">
                        Edit User
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="text-primary-50 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Close"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* User Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-4">
                            User Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputField
                                    id="edit-user-name"
                                    label="Name"
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
                                    placeholder="Enter full name"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <FaExclamationTriangle className="w-3 h-3" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <InputField
                                    id="edit-user-email"
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

                            <div>
                                <InputField
                                    id="edit-user-phone"
                                    label="Phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            phone: e.target.value,
                                        });
                                    }}
                                    placeholder="(123) 456-7890"
                                />
                            </div>

                            <div>
                                <SelectField
                                    id="edit-user-role"
                                    label="Role"
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
                        </div>
                    </div>

                    {/* Account Status */}
                    <div className="border-t border-primary-10 pt-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        isActive: e.target.checked,
                                    })
                                }
                                className="w-4 h-4 text-primary border-primary-10 rounded focus:ring-primary"
                            />
                            <div>
                                <span className="text-sm font-medium text-primary">
                                    Active account
                                </span>
                                <p className="text-xs text-primary-50">
                                    User can access the system when active
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-primary-10">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={isPending}
                            disabled={isPending}
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
