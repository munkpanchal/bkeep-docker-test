import React, { useState } from 'react';
import { FaFingerprint, FaLock, FaUser } from 'react-icons/fa';
import { Link } from 'react-router';
import { useLogin } from '../../services/apis/authApi';

import { showErrorToast } from '../../utills/toast';
import Button from '../typography/Button';
import { InputField } from '../typography/InputFields';

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {
        mutateAsync: login,
        isPending: isLoading,
        error: loginError,
    } = useLogin();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await login({ email, password });
        } catch (err: unknown) {
            let message = 'Invalid email or password';
            showErrorToast(message);

            if (err && typeof err === 'object' && 'response' in err) {
                const response = (
                    err as { response?: { data?: { message?: string } } }
                ).response;
                message = response?.data?.message || message;
            } else if (err instanceof Error) {
                message = err.message;
            } else if (loginError instanceof Error) {
                message = loginError.message;
            }

            setError(message);
        }
    };

    return (
        <div className="space-y-6">
            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <InputField
                        id="login-email"
                        label="Email ID"
                        type="email"
                        placeholder="abc@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        icon={<FaUser className="w-4 h-4" />}
                    />
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label
                                htmlFor="login-password"
                                className="text-sm font-medium text-primary"
                            >
                                Password
                            </label>
                        </div>
                        <InputField
                            id="login-password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            icon={<FaLock className="w-4 h-4" />}
                        />
                    </div>
                </div>

                {error && (
                    <div className="border border-red-300 bg-red-50 p-3 rounded-lg shadow-sm">
                        <p className="text-sm text-center text-red-700 font-medium">
                            {error}
                        </p>
                    </div>
                )}

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    loading={isLoading}
                    disabled={isLoading}
                >
                    Sign In
                </Button>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-primary-25"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-primary-50">
                        Or if you forgot your password
                    </span>
                </div>
            </div>
            <div className="flex justify-center gap-4">
                <Link
                    to="/forgot-password"
                    className="text-sm  text-primary hover:text-primary-75 transition-colors cursor-pointer"
                >
                    Forgot Password?
                </Link>
                <span className="text-primary-25">•</span>
                <Link
                    to="/passkey-login"
                    className="text-sm text-primary hover:text-primary-75 transition-colors cursor-pointer flex items-center gap-1"
                >
                    <FaFingerprint className="w-4 h-4" />
                    Sign in with Passkey
                </Link>
            </div>

            <div className="text-center pt-2">
                <p className="text-xs text-primary-50">
                    Secure login powered by our system
                </p>
            </div>
        </div>
    );
}
