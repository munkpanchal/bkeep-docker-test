import React, { useState } from 'react';
import {
    FaEnvelope,
    FaGoogle,
    FaLock,
    FaMicrosoft,
    FaUser,
} from 'react-icons/fa';
import { useNavigate } from 'react-router';
import Button from '../typography/Button';
import { InputField } from '../typography/InputFields';

export function RegisterForm() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null);
    const navigate = useNavigate();
    const { register, isLoading } = {
        register: () => Promise.resolve(true),
        isLoading: false,
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        const success = await register();
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Registration failed. Please try again.');
        }
    };

    const handleGoogleRegister = async () => {
        setIsOAuthLoading('google');
        setError('');
        try {
            // TODO: Implement Google OAuth registration
            // Example: await signUpWithGoogle();
            console.log('Google registration initiated');
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // navigate('/dashboard');
        } catch {
            setError('Failed to sign up with Google');
        } finally {
            setIsOAuthLoading(null);
        }
    };

    const handleOutlookRegister = async () => {
        setIsOAuthLoading('outlook');
        setError('');
        try {
            // TODO: Implement Microsoft/Outlook OAuth registration
            // Example: await signUpWithMicrosoft();
            console.log('Outlook registration initiated');
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // navigate('/dashboard');
        } catch {
            setError('Failed to sign up with Outlook');
        } finally {
            setIsOAuthLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* OAuth Register Buttons */}
            <div className="space-y-3">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleRegister}
                    loading={isOAuthLoading === 'google'}
                    disabled={isOAuthLoading !== null || isLoading}
                    icon={<FaGoogle className="w-5 h-5" />}
                >
                    Continue with Google
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleOutlookRegister}
                    loading={isOAuthLoading === 'outlook'}
                    disabled={isOAuthLoading !== null || isLoading}
                    icon={<FaMicrosoft className="w-5 h-5" />}
                >
                    Continue with Outlook
                </Button>
            </div>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-primary-25"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-primary-50">
                        Or continue with
                    </span>
                </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <InputField
                        label="Full Name"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        icon={<FaUser className="w-4 h-4" />}
                    />
                    <InputField
                        label="Email ID"
                        type="email"
                        placeholder="abc@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        icon={<FaEnvelope className="w-4 h-4" />}
                    />
                    <InputField
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        icon={<FaLock className="w-4 h-4" />}
                    />
                    <InputField
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        icon={<FaLock className="w-4 h-4" />}
                    />
                </div>

                {error && (
                    <div className="border border-red-300 bg-red-50 p-3 rounded-lg shadow-sm">
                        <p className="text-sm text-red-700 font-medium">
                            {error}
                        </p>
                    </div>
                )}

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    loading={isLoading}
                    disabled={isLoading || isOAuthLoading !== null}
                >
                    Create Account
                </Button>
            </form>

            <div className="text-center pt-2">
                <p className="text-xs text-primary-50 text-balance">
                    By creating an account, you agree to our Terms of Service
                    and Privacy Policy
                </p>
            </div>
        </div>
    );
}
