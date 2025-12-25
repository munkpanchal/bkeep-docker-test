import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import {
    useCreateTenant,
    type CreateTenantRequest,
} from '../../services/apis/tenantApi';
import Button from '../typography/Button';
import { InputField } from '../typography/InputFields';

interface CreateTenantModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateTenantModal = ({ isOpen, onClose }: CreateTenantModalProps) => {
    const [formData, setFormData] = useState<CreateTenantRequest>({
        name: '',
        schemaName: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { mutateAsync: createTenant, isPending } = useCreateTenant();

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

    // Generate schema name from tenant name
    const generateSchemaName = (name: string): string => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '') // Remove special characters
            .replace(/\s+/g, '_') // Replace spaces with underscores
            .replace(/_+/g, '_') // Replace multiple underscores with single
            .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
    };

    const handleNameChange = (value: string) => {
        setFormData({
            name: value,
            schemaName: generateSchemaName(value),
        });
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Tenant name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Tenant name must be at least 2 characters';
        }

        if (!formData.schemaName.trim()) {
            newErrors.schemaName = 'Schema name is required';
        } else if (!/^[a-z0-9_]+$/.test(formData.schemaName)) {
            newErrors.schemaName =
                'Schema name can only contain lowercase letters, numbers, and underscores';
        } else if (formData.schemaName.length < 2) {
            newErrors.schemaName = 'Schema name must be at least 2 characters';
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
            await createTenant({
                name: formData.name.trim(),
                schemaName: formData.schemaName.trim(),
            });
            // Reset form on success
            setFormData({ name: '', schemaName: '' });
            setErrors({});
            onClose();
        } catch (error) {
            // Error is handled by the mutation's onError
            console.error('Create tenant error:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={handleBackdropClick}
        >
            <div className="w-full max-w-md rounded-2 bg-white p-6 shadow-2xl">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-primary">
                        Create New Tenant
                    </h3>
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="text-primary-50 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Close"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <InputField
                            id="tenant-name"
                            label="Tenant Name"
                            placeholder="e.g., Sun Medicose"
                            value={formData.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            required
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1 pl-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <InputField
                            id="schema-name"
                            label="Schema Name"
                            placeholder="e.g., sun_medicose"
                            value={formData.schemaName}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    schemaName: e.target.value.toLowerCase(),
                                })
                            }
                            required
                        />
                        {errors.schemaName && (
                            <p className="text-red-500 text-xs mt-1 pl-1">
                                {errors.schemaName}
                            </p>
                        )}
                        <p className="text-primary-50 text-xs mt-1 pl-1">
                            Lowercase letters, numbers, and underscores only.
                            Auto-generated from tenant name.
                        </p>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 sm:flex-initial"
                            onClick={onClose}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-1 sm:flex-initial"
                            loading={isPending}
                        >
                            Create Tenant
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTenantModal;
