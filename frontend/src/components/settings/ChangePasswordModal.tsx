import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useChangePassword } from '../../services/apis/authApi';
import Button from '../typography/Button';
import { InputField } from '../typography/InputFields';

type changePasswordModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const ChangePasswordModal = ({ isOpen, onClose }: changePasswordModalProps) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { mutateAsync: changePassword, isPending: loading } =
        useChangePassword();

    const [error, setError] = useState('');
    /*     const [success, setSuccess] = useState(""); */

    useEffect(() => {
        if (isOpen) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setError('');
            /*         setSuccess(""); */
            /*         setLoading(false); */

            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        try {
            console.log('submitting password change ...');

            await changePassword({
                currentPassword,
                newPassword,
            });
            onClose();
        } catch (error: unknown) {
            const message =
                error &&
                typeof error === 'object' &&
                'response' in error &&
                error.response &&
                typeof error.response === 'object' &&
                'data' in error.response &&
                error.response.data &&
                typeof error.response.data === 'object' &&
                'message' in error.response.data &&
                typeof error.response.data.message === 'string'
                    ? error.response.data.message
                    : 'Failed to update password';
            setError(message);
        }
    };

    if (!isOpen) return null;

    return (
        // 1. Overlay (Dark background)
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            {/* 2. Modal Container */}
            <div className="w-full max-w-md rounded-2 bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-primary">
                        Change Password
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-primary-50 hover:text-primary transition-colors"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        id="current-password"
                        label="Current Password"
                        type="password"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />

                    <InputField
                        id="new-password"
                        label="New Password"
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                    />

                    <InputField
                        id="confirm-password"
                        label="Confirm New Password"
                        type="password"
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                    />

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                            disabled={loading}
                        >
                            Update Password
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
