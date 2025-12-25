import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Button from '../../components/typography/Button';
import { InputField } from '../../components/typography/InputFields';
import { useVerifyMfa } from '../../services/apis/authApi';
import { useTOTPLogin } from '../../services/apis/mfaApi';
import { useAuth } from '../../stores/auth/authSelectore';
import { useTenant } from '../../stores/tenant/tenantSelectore';
import { Tenant } from '../../types';
import { storePasskeyUser } from '../../utills/passkey';
import { showSuccessToast } from '../../utills/toast';

const OtpVerificationpage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as { email?: string; mfaType?: string } | null;

    const [code, setCode] = useState('');
    const [isBackupCode, setIsBackupCode] = useState(false);

    const email = state?.email;
    const mfaType = state?.mfaType || 'email';

    const { setAuth } = useAuth();
    const { setTenants } = useTenant();

    const { mutateAsync: verifyMfa, isPending: isVerifyingMfa } =
        useVerifyMfa();
    const { mutateAsync: verifyTOTP, isPending: isVerifyingTOTP } =
        useTOTPLogin();

    const isVerifying = isVerifyingMfa || isVerifyingTOTP;

    const buildTenantsFromLogin = (tenantsFromApi?: Tenant[]): Tenant[] => {
        if (!tenantsFromApi) return [];

        const uniqueTenants = new Map<string, Tenant>();
        tenantsFromApi.forEach((tenant) => {
            if (tenant && tenant.id) {
                uniqueTenants.set(tenant.id, tenant);
            }
        });

        return Array.from(uniqueTenants.values());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            // If we somehow lost state, send user back to login
            navigate('/login');
            return;
        }

        try {
            if (mfaType === 'totp') {
                // TOTP login flow
                const response = await verifyTOTP({
                    email,
                    code,
                    isBackupCode,
                });

                const payload = response?.data;

                if (
                    payload?.user &&
                    payload?.accessToken &&
                    payload?.refreshToken
                ) {
                    // Transform tenants to include all required properties
                    const transformedTenants = (payload.user.tenants || []).map(
                        (tenant: {
                            id: string;
                            name: string;
                            isPrimary: boolean;
                            isActive?: boolean;
                            createdAt?: string;
                            updatedAt?: string;
                        }) => ({
                            ...tenant,
                            isActive: tenant.isActive ?? true,
                            createdAt:
                                tenant.createdAt || new Date().toISOString(),
                            updatedAt:
                                tenant.updatedAt || new Date().toISOString(),
                        })
                    );

                    // Transform user data to match UserType
                    const userData = {
                        ...payload.user,
                        roles: payload.user.role ? [payload.user.role] : [],
                        permissions: payload.user.permissions || [],
                        tenants: transformedTenants,
                        selectedTenantId: payload.user.selectedTenantId || '',
                    };

                    setAuth(
                        userData,
                        payload.accessToken,
                        payload.refreshToken
                    );

                    const tenants = buildTenantsFromLogin(transformedTenants);
                    setTenants(tenants, {
                        selectTenantId: payload.user.selectedTenantId,
                    });

                    // Store user email for passkey login
                    storePasskeyUser(payload.user.email);

                    showSuccessToast(
                        response?.message ||
                            'Successfully verified. Welcome back!'
                    );
                    navigate('/dashboard');
                }
            } else {
                // Email MFA flow (existing)
                await verifyMfa({ email, code });
            }
        } catch (error) {
            console.error('Verification failed:', error);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    // Get title and description based on mfaType
    const getTitle = () => {
        switch (mfaType) {
            case 'totp':
                return 'Enter Authenticator Code';
            case 'email':
            default:
                return 'Enter Verification Code';
        }
    };

    const getDescription = () => {
        switch (mfaType) {
            case 'totp':
                return (
                    <>
                        Open your authenticator app and enter the 6-digit code
                        for{' '}
                        <span className="font-semibold text-primary">
                            {email || 'your account'}
                        </span>
                        .
                    </>
                );
            case 'email':
            default:
                return (
                    <>
                        We&apos;ve sent an email verification code to{' '}
                        <span className="font-semibold text-primary">
                            {email || 'your email'}
                        </span>
                        . Please enter it below to continue.
                    </>
                );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-lightBg px-4">
            <div className="w-full max-w-md bg-white rounded-2 shadow-xl p-6 lg:p-8 border border-primary-10">
                <h1 className="text-2xl font-bold text-primary mb-2">
                    {getTitle()}
                </h1>
                <p className="text-sm text-primary-50 mb-6">
                    {getDescription()}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <InputField
                        id="otp-code"
                        label={
                            mfaType === 'totp'
                                ? isBackupCode
                                    ? 'Backup Code'
                                    : 'Authenticator Code'
                                : 'Verification Code'
                        }
                        value={code}
                        onChange={(e) => {
                            const value = isBackupCode
                                ? e.target.value.replace(/[^a-zA-Z0-9]/g, '')
                                : e.target.value.replace(/\D/g, '');
                            if (!isBackupCode && value.length <= 6) {
                                setCode(value);
                            } else if (isBackupCode && value.length <= 16) {
                                setCode(value);
                            }
                        }}
                        placeholder={
                            isBackupCode
                                ? 'Enter backup code'
                                : 'Enter the 6-digit code'
                        }
                        maxLength={isBackupCode ? 16 : 6}
                        required
                    />

                    {mfaType === 'totp' && (
                        <div className="flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsBackupCode(!isBackupCode);
                                    setCode('');
                                }}
                                className="text-sm text-primary hover:underline"
                            >
                                {isBackupCode
                                    ? 'Use authenticator code instead'
                                    : 'Use backup code instead'}
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            loading={isVerifying}
                            disabled={
                                isVerifying ||
                                (isBackupCode
                                    ? code.length === 0
                                    : code.length !== 6)
                            }
                        >
                            {isVerifying ? 'Verifying...' : 'Verify & Continue'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={handleBackToLogin}
                            disabled={isVerifying}
                        >
                            Back to Login
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OtpVerificationpage;
