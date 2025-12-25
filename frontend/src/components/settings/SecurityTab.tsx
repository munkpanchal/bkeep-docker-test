import { useEffect, useState } from 'react';
import {
    useDisableMFA,
    useEnableMFA,
    useMfaStatus,
} from '../../services/apis/authApi';
import { useDisableTOTP, useTOTPStatus } from '../../services/apis/mfaApi';
import { usePasskeyStats } from '../../services/apis/passkeyApi';
import { useAuth } from '../../stores/auth/authSelectore';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import Button from '../typography/Button';
import ChangePasswordModal from './ChangePasswordModal';
import PasskeyManagementModal from './PasskeyManagementModal';
import TOTPSetupModal from './TOTPSetupModal';

const SecurityTab = () => {
    const { mfaEnabled, setMfaEnabled } = useAuth();
    const { mutate: enableMFA, isPending: isEnabling } = useEnableMFA();
    const { mutate: disableMFA, isPending: isDisabling } = useDisableMFA();
    const { data: mfaStatusData, isLoading: isStatusLoading } = useMfaStatus();
    const { data: totpStatusData, isLoading: isTotpStatusLoading } =
        useTOTPStatus();
    const { mutate: disableTOTP, isPending: isDisablingTOTP } =
        useDisableTOTP();

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showTotpConfirmDialog, setShowTotpConfirmDialog] = useState(false);
    const [pendingAction, setPendingAction] = useState<
        'enable' | 'disable' | null
    >(null);

    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
        useState(false);
    const [isTOTPSetupModalOpen, setIsTOTPSetupModalOpen] = useState(false);
    const [isPasskeyModalOpen, setIsPasskeyModalOpen] = useState(false);

    const { data: passkeyStatsData, isLoading: isLoadingPasskeyStats } =
        usePasskeyStats();

    const totpEnabled = totpStatusData?.data?.totpEnabled ?? false;
    const passkeyStats = passkeyStatsData?.data?.stats;

    useEffect(() => {
        if (!isStatusLoading && mfaStatusData?.data?.mfaEnabled !== undefined) {
            const enabled = !!mfaStatusData.data.mfaEnabled;
            if (enabled !== mfaEnabled) {
                setMfaEnabled(enabled);
            }
        }
    }, [isStatusLoading, mfaStatusData, mfaEnabled, setMfaEnabled]);

    const statusLabel = isStatusLoading
        ? 'Checking...'
        : mfaEnabled
          ? 'Enabled'
          : 'Disabled';

    const statusClass = isStatusLoading
        ? 'text-primary-50'
        : mfaEnabled
          ? 'text-green-600'
          : 'text-red-500';

    const totpStatusLabel = isTotpStatusLoading
        ? 'Checking...'
        : totpEnabled
          ? 'Enabled'
          : 'Disabled';

    const totpStatusClass = isTotpStatusLoading
        ? 'text-primary-50'
        : totpEnabled
          ? 'text-green-600'
          : 'text-red-500';

    const handleMfaToggle = () => {
        if (mfaEnabled) {
            setPendingAction('disable');
            setShowConfirmDialog(true);
        } else {
            setPendingAction('enable');
            setShowConfirmDialog(true);
        }
    };

    const handleConfirmMfa = () => {
        if (pendingAction === 'enable') {
            enableMFA();
        } else if (pendingAction === 'disable') {
            disableMFA();
        }
        setShowConfirmDialog(false);
        setPendingAction(null);
    };

    const handleCancelMfa = () => {
        setShowConfirmDialog(false);
        setPendingAction(null);
    };

    const handleTotpSetup = () => {
        setIsTOTPSetupModalOpen(true);
    };

    const handleDisableTOTP = () => {
        setShowTotpConfirmDialog(true);
    };

    const handleConfirmDisableTOTP = () => {
        disableTOTP();
        setShowTotpConfirmDialog(false);
    };

    const handleCancelDisableTOTP = () => {
        setShowTotpConfirmDialog(false);
    };

    const mfaButtonLabel = mfaEnabled
        ? isDisabling
            ? 'Disabling...'
            : 'Disable 2FA'
        : isEnabling
          ? 'Enabling...'
          : 'Enable 2FA';

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-primary mb-4">
                Security Settings
            </h3>
            <div className="space-y-4">
                <div className="p-4 border border-primary-10 rounded-2">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="font-medium text-primary">
                                Change Password
                            </div>
                            <div className="text-sm text-primary-50">
                                Update your password to keep your account secure
                            </div>
                        </div>
                        <Button
                            size="sm"
                            onClick={() => setIsChangePasswordModalOpen(true)}
                        >
                            Change Password
                        </Button>
                    </div>
                </div>
                <div className="p-4 border border-primary-10 rounded-2">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="font-medium text-primary">
                                Two-Factor Authentication (Email)
                            </div>
                            <div className="text-sm text-primary-50">
                                Receive verification codes via email
                            </div>
                            <div className="text-xs text-primary-40 mt-2">
                                Status:{' '}
                                <span className={statusClass}>
                                    {statusLabel}
                                </span>
                            </div>
                        </div>
                        <Button
                            size="sm"
                            onClick={handleMfaToggle}
                            loading={isEnabling || isDisabling}
                            disabled={
                                isEnabling || isDisabling || isStatusLoading
                            }
                        >
                            {mfaButtonLabel}
                        </Button>
                    </div>
                </div>
                <div className="p-4 border border-primary-10 rounded-2">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="font-medium text-primary">
                                Authenticator App
                            </div>
                            <div className="text-sm text-primary-50">
                                Use an authenticator app like Google/Microsoft
                                Authenticator
                            </div>
                            <div className="text-xs text-primary-40 mt-2">
                                Status:{' '}
                                <span className={totpStatusClass}>
                                    {totpStatusLabel}
                                </span>
                            </div>
                        </div>
                        <Button
                            size="sm"
                            onClick={
                                totpEnabled
                                    ? handleDisableTOTP
                                    : handleTotpSetup
                            }
                            loading={isDisablingTOTP}
                            disabled={isDisablingTOTP || isTotpStatusLoading}
                        >
                            {totpEnabled
                                ? isDisablingTOTP
                                    ? 'Disabling...'
                                    : 'Disable TOTP'
                                : 'Enable TOTP'}
                        </Button>
                    </div>
                </div>
                <div className="p-4 border border-primary-10 rounded-2">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="font-medium text-primary">
                                Passkeys
                            </div>
                            <div className="text-sm text-primary-50">
                                Use biometrics or security keys for passwordless
                                sign-in
                            </div>
                            <div className="text-xs text-primary-40 mt-2">
                                {isLoadingPasskeyStats ? (
                                    'Loading...'
                                ) : passkeyStats?.total ? (
                                    <>
                                        {passkeyStats.active} active of{' '}
                                        {passkeyStats.total} total passkey
                                        {passkeyStats.total !== 1 ? 's' : ''}
                                        {' • '}
                                        {passkeyStats.platform} device
                                        {passkeyStats.platform !== 1 ? 's' : ''}
                                        {', '}
                                        {passkeyStats.roaming} security key
                                        {passkeyStats.roaming !== 1 ? 's' : ''}
                                    </>
                                ) : (
                                    'No passkeys configured'
                                )}
                            </div>
                        </div>
                        <Button
                            size="sm"
                            onClick={() => setIsPasskeyModalOpen(true)}
                            disabled={isLoadingPasskeyStats}
                        >
                            Manage Passkeys
                        </Button>
                    </div>
                </div>
            </div>

            <ChangePasswordModal
                isOpen={isChangePasswordModalOpen}
                onClose={() => setIsChangePasswordModalOpen(false)}
            />

            <TOTPSetupModal
                isOpen={isTOTPSetupModalOpen}
                onClose={() => setIsTOTPSetupModalOpen(false)}
            />

            <PasskeyManagementModal
                isOpen={isPasskeyModalOpen}
                onClose={() => setIsPasskeyModalOpen(false)}
            />

            {/* MFA Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={showConfirmDialog}
                onClose={handleCancelMfa}
                onConfirm={handleConfirmMfa}
                title={
                    pendingAction === 'enable'
                        ? 'Enable Two-Factor Authentication'
                        : 'Disable Two-Factor Authentication'
                }
                message={
                    pendingAction === 'enable'
                        ? 'Are you sure you want to enable two-factor authentication? You will need to verify your identity with a code sent to your email when logging in.'
                        : 'Are you sure you want to disable two-factor authentication? This will reduce the security of your account.'
                }
                confirmText={
                    pendingAction === 'enable' ? 'Enable 2FA' : 'Disable 2FA'
                }
                cancelText="Cancel"
                confirmVariant={
                    pendingAction === 'disable' ? 'danger' : 'primary'
                }
                loading={isEnabling || isDisabling}
            />

            {/* TOTP Disable Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={showTotpConfirmDialog}
                onClose={handleCancelDisableTOTP}
                onConfirm={handleConfirmDisableTOTP}
                title="Disable Authenticator App"
                message="Are you sure you want to disable TOTP authenticator? This will reduce the security of your account."
                confirmText="Disable TOTP"
                cancelText="Cancel"
                confirmVariant="danger"
                loading={isDisablingTOTP}
            />
        </div>
    );
};

export default SecurityTab;
