import { useEffect, useMemo, useState } from 'react';
import {
    FaBuilding,
    FaCheck,
    FaCheckCircle,
    FaEnvelope,
    FaExclamationTriangle,
    FaLock,
    FaSpinner,
    FaTimes,
    FaUser,
} from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router';
import {
    useAcceptInvitation,
    useVerifyInvitation,
} from '../../services/apis/authApi';
import Button from '../typography/Button';
import { InputField } from '../typography/InputFields';

interface PasswordRequirement {
    label: string;
    test: (pwd: string) => boolean;
}

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
    { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
    { label: 'One uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
    { label: 'One lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
    { label: 'One number', test: (pwd) => /[0-9]/.test(pwd) },
    {
        label: 'One special character',
        test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    },
];

const AcceptInvitationForm = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token') || '';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Verify invitation token
    const {
        data: verificationData,
        isLoading: isVerifying,
        error: verificationError,
    } = useVerifyInvitation(token);

    const { mutateAsync: acceptInvitation, isPending: isAccepting } =
        useAcceptInvitation();

    const [hasAutoAccepted, setHasAutoAccepted] = useState(false);

    // Auto-accept invitation if password is not required
    useEffect(() => {
        const invitationData = verificationData?.data;
        if (
            invitationData &&
            invitationData.requiresPassword === false &&
            !isAccepting &&
            !isVerifying &&
            !hasAutoAccepted &&
            token
        ) {
            setHasAutoAccepted(true);
            // Automatically accept invitation without password
            acceptInvitation({
                token,
            }).catch((error) => {
                console.error('Auto-accept invitation error:', error);
                setHasAutoAccepted(false); // Allow retry on error
            });
        }
    }, [
        verificationData?.data,
        token,
        isAccepting,
        isVerifying,
        hasAutoAccepted,
        acceptInvitation,
    ]);

    // Real-time password validation
    const passwordValidation = useMemo(() => {
        return PASSWORD_REQUIREMENTS.map((req) => ({
            ...req,
            met: req.test(password),
        }));
    }, [password]);

    const isPasswordValid = useMemo(() => {
        return passwordValidation.every((req) => req.met);
    }, [passwordValidation]);

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        // Clear password error when user starts typing
        if (errors.password) {
            setErrors((prev) => ({ ...prev, password: '' }));
        }
    };

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        // Clear confirm password error when user starts typing
        if (errors.confirmPassword) {
            setErrors((prev) => ({ ...prev, confirmPassword: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const invitationData = verificationData?.data;

        // If password is not required, accept immediately
        if (invitationData?.requiresPassword === false) {
            try {
                await acceptInvitation({
                    token,
                });
            } catch (error) {
                console.error('Accept invitation error:', error);
            }
            return;
        }

        const newErrors: Record<string, string> = {};

        // Validate password
        if (!isPasswordValid) {
            const unmetRequirements = passwordValidation
                .filter((req) => !req.met)
                .map((req) => req.label.toLowerCase());
            newErrors.password = `Password must contain ${unmetRequirements.join(', ')}`;
        }

        // Validate confirm password
        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await acceptInvitation({
                token,
                password,
            });
        } catch (error) {
            console.error('Accept invitation error:', error);
        }
    };

    // Loading state
    if (isVerifying) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                    <FaSpinner className="w-16 h-16 text-primary animate-spin mb-6" />
                </div>
                <h2 className="text-2xl font-bold text-primary mb-3">
                    Verifying Invitation
                </h2>
                <p className="text-sm text-primary-50 text-center max-w-sm">
                    Please wait while we verify your invitation token...
                </p>
            </div>
        );
    }

    // Error state
    if (verificationError || !verificationData?.success) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                    <FaExclamationTriangle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-primary mb-3">
                    Invalid or Expired Invitation
                </h2>
                <p className="text-sm text-primary-50 text-center mb-8 max-w-md">
                    {verificationData?.message ||
                        'This invitation link is invalid or has expired. Please contact your administrator for a new invitation.'}
                </p>
                <Button
                    variant="primary"
                    onClick={() => navigate('/login')}
                    className="w-full"
                >
                    Go to Login
                </Button>
            </div>
        );
    }

    const invitationData = verificationData.data;
    const requiresPassword = invitationData?.requiresPassword !== false;

    // Show loading state if auto-accepting
    if (!requiresPassword && isAccepting) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                    <FaSpinner className="w-16 h-16 text-primary animate-spin mb-6" />
                </div>
                <h2 className="text-2xl font-bold text-primary mb-3">
                    Accepting Invitation
                </h2>
                <p className="text-sm text-primary-50 text-center max-w-sm">
                    Please wait while we set up your account...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-2">
                    Accept Invitation
                </h2>
                <p className="text-sm text-primary-50">
                    {requiresPassword
                        ? 'Complete your account setup to get started'
                        : 'Review your invitation details'}
                </p>
            </div>

            {/* Invitation Details Card */}
            {invitationData && (
                <div className="bg-gradient-to-br from-primary-5 to-primary-10 rounded-2 p-6 mb-8 border border-primary-20 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <FaCheckCircle className="w-5 h-5 text-primary" />
                        <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
                            Invitation Details
                        </h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                            <div className="w-12 h-12 rounded-2 bg-primary/10 flex items-center justify-center shrink-0">
                                <FaUser className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-primary-50 uppercase tracking-wide mb-1">
                                    Full Name
                                </p>
                                <p className="text-base font-semibold text-primary truncate">
                                    {invitationData.name}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                            <div className="w-12 h-12 rounded-2 bg-primary/10 flex items-center justify-center shrink-0">
                                <FaEnvelope className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-primary-50 uppercase tracking-wide mb-1">
                                    Email Address
                                </p>
                                <p className="text-base font-semibold text-primary truncate">
                                    {invitationData.email}
                                </p>
                            </div>
                        </div>
                        {invitationData.role && (
                            <div className="flex items-start gap-4 p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                                <div className="w-12 h-12 rounded-2 bg-primary/10 flex items-center justify-center shrink-0">
                                    <FaCheckCircle className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-primary-50 uppercase tracking-wide mb-1">
                                        Role
                                    </p>
                                    <p className="text-base font-semibold text-primary truncate">
                                        {invitationData.role.displayName}
                                    </p>
                                </div>
                            </div>
                        )}
                        {(invitationData.tenantName ||
                            invitationData.tenant) && (
                            <div className="flex items-start gap-4 p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                                <div className="w-12 h-12 rounded-2 bg-primary/10 flex items-center justify-center shrink-0">
                                    <FaBuilding className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-primary-50 uppercase tracking-wide mb-1">
                                        Organization
                                    </p>
                                    <p className="text-base font-semibold text-primary truncate">
                                        {invitationData.tenantName ||
                                            invitationData.tenant?.name}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Password Form - Only show if password is required */}
            {requiresPassword ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Password Field */}
                    <div>
                        <InputField
                            id="password"
                            label="Create Password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                handlePasswordChange(e.target.value)
                            }
                            required
                            icon={<FaLock className="w-4 h-4" />}
                            disabled={isAccepting}
                        />
                        {errors.password && (
                            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700 text-xs flex items-center gap-2">
                                    <FaExclamationTriangle className="w-3 h-3 shrink-0" />
                                    {errors.password}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Password Requirements - Interactive */}
                    {password && (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2 p-4 shadow-sm">
                            <p className="text-xs font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                <FaLock className="w-3 h-3" />
                                Password Requirements
                            </p>
                            <ul className="space-y-2">
                                {passwordValidation.map((req, index) => (
                                    <li
                                        key={index}
                                        className={`flex items-center gap-2 text-xs transition-all duration-200 ${
                                            req.met
                                                ? 'text-green-700'
                                                : 'text-blue-700'
                                        }`}
                                    >
                                        <div
                                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                                                req.met
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-blue-200 text-blue-600'
                                            }`}
                                        >
                                            {req.met ? (
                                                <FaCheck className="w-2.5 h-2.5" />
                                            ) : (
                                                <FaTimes className="w-2.5 h-2.5" />
                                            )}
                                        </div>
                                        <span
                                            className={
                                                req.met
                                                    ? 'line-through opacity-60'
                                                    : ''
                                            }
                                        >
                                            {req.label}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            {isPasswordValid && (
                                <div className="mt-3 pt-3 border-t border-green-200">
                                    <p className="text-xs font-medium text-green-700 flex items-center gap-2">
                                        <FaCheckCircle className="w-3 h-3" />
                                        Password meets all requirements
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Confirm Password Field */}
                    <div>
                        <InputField
                            id="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) =>
                                handleConfirmPasswordChange(e.target.value)
                            }
                            required
                            icon={<FaLock className="w-4 h-4" />}
                            disabled={isAccepting}
                        />
                        {confirmPassword && password === confirmPassword && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-green-700 text-xs flex items-center gap-2">
                                    <FaCheck className="w-3 h-3" />
                                    Passwords match
                                </p>
                            </div>
                        )}
                        {errors.confirmPassword && (
                            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700 text-xs flex items-center gap-2">
                                    <FaExclamationTriangle className="w-3 h-3 shrink-0" />
                                    {errors.confirmPassword}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        loading={isAccepting}
                        disabled={isAccepting || !isPasswordValid}
                    >
                        {isAccepting
                            ? 'Creating Account...'
                            : 'Accept & Create Account'}
                    </Button>
                </form>
            ) : (
                <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-2 p-4">
                        <p className="text-sm text-blue-800 text-center">
                            No password required. Click the button below to
                            accept the invitation.
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="primary"
                        className="w-full"
                        onClick={handleSubmit}
                        loading={isAccepting}
                        disabled={isAccepting}
                    >
                        {isAccepting
                            ? 'Accepting Invitation...'
                            : 'Accept Invitation'}
                    </Button>
                </div>
            )}

            {/* Footer Link */}
            <div className="pt-4 border-t border-primary-10">
                <p className="text-xs text-center text-primary-50">
                    Already have an account?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="text-primary hover:text-primary-75 font-semibold underline transition-colors"
                    >
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AcceptInvitationForm;
