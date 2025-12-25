import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaLock } from 'react-icons/fa';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useResetPassword } from '../../services/apis/authApi';
import { showErrorToast, showSuccessToast } from '../../utills/toast';
import Button from '../typography/Button';
import { InputField } from '../typography/InputFields';

export function ResetPasswordForm() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    const { mutateAsync: resetPassword, isPending: isResetting } =
        useResetPassword();

    useEffect(() => {
        // Extract token and email from URL query parameters
        const tokenParam = searchParams.get('token');
        const emailParam = searchParams.get('email');

        if (!tokenParam || !emailParam) {
            setError(
                'Invalid or missing reset token. Please request a new password reset link.'
            );
        } else {
            setToken(tokenParam);
            setEmail(decodeURIComponent(emailParam));
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!token || !email) {
            setError(
                'Invalid reset token. Please request a new password reset link.'
            );
            return;
        }

        try {
            await resetPassword({ token, email, password });
            showSuccessToast(
                'Password reset successfully! Redirecting to login...'
            );
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: unknown) {
            let message = 'Failed to reset password. Please try again.';
            if (err && typeof err === 'object' && 'response' in err) {
                const response = (
                    err as { response?: { data?: { message?: string } } }
                ).response;
                message = response?.data?.message || message;
            } else if (err instanceof Error) {
                message = err.message;
            }
            setError(message);
            showErrorToast(message);
        }
    };

    if (!token || !email) {
        return (
            <div className="space-y-6">
                <div className="border border-red-300 bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-red-700 font-medium">
                        Invalid or missing reset token
                    </p>
                    <p className="text-sm text-red-600 mt-2">
                        The password reset link is invalid or has expired.
                        Please request a new password reset link.
                    </p>
                </div>
                <Link to="/login">
                    <Button variant="primary" className="w-full">
                        Back to Login
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-primary mb-2">
                    Reset Your Password
                </h2>
                <p className="text-sm text-primary-50">
                    Enter your new password below
                </p>
                <p className="text-xs text-primary-50 mt-2">Email: {email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <InputField
                        id="reset-password"
                        label="New Password"
                        type="password"
                        placeholder="Enter your new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        icon={<FaLock className="w-4 h-4" />}
                    />
                    <InputField
                        id="reset-confirm-password"
                        label="Confirm New Password"
                        type="password"
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        icon={<FaLock className="w-4 h-4" />}
                    />
                </div>

                {error && (
                    <div className="border border-red-300 bg-red-50 p-3 rounded-lg shadow-sm">
                        <p className="text-sm text-balance text-center text-red-700 font-medium">
                            {error}
                        </p>
                    </div>
                )}

                <div className="space-y-2">
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        loading={isResetting}
                        disabled={isResetting}
                    >
                        Reset Password
                    </Button>
                    <Link to="/login">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            disabled={isResetting}
                        >
                            Back to Login
                        </Button>
                    </Link>
                </div>
            </form>

            <div className="bg-primary-10 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-primary shrink-0 mt-0.5" />
                    <div className="text-sm text-primary-75">
                        <p className="font-medium mb-1">
                            Password Requirements:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>At least 8 characters long</li>
                            <li>Use a combination of letters and numbers</li>
                            <li>
                                Avoid using common words or personal information
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
