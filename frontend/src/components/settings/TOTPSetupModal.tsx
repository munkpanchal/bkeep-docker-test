import { useEffect, useState } from 'react';
import {
    FaCheckCircle,
    FaCopy,
    FaDownload,
    FaKey,
    FaQrcode,
    FaTimes,
} from 'react-icons/fa';
import {
    MFA_TOTP_SETUP_RESPONSE,
    useSetupTOTP,
    useVerifyTOTP,
} from '../../services/apis/mfaApi';
import { showSuccessToast } from '../../utills/toast';
import Button from '../typography/Button';
import { InputField } from '../typography/InputFields';

interface TOTPSetupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const TOTPSetupModal = ({
    isOpen,
    onClose,
    onSuccess,
}: TOTPSetupModalProps) => {
    const [step, setStep] = useState<'setup' | 'verify'>('setup');
    const [totpData, setTotpData] = useState<
        MFA_TOTP_SETUP_RESPONSE['data'] | null
    >(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [copiedSecret, setCopiedSecret] = useState(false);
    const [copiedBackupCodes, setCopiedBackupCodes] = useState(false);

    const { mutateAsync: setupTOTP, isPending: isSettingUp } = useSetupTOTP();
    const { mutateAsync: verifyTOTP, isPending: isVerifying } = useVerifyTOTP();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            handleSetupTOTP();
        } else {
            document.body.style.overflow = 'unset';
            // Reset state when modal closes
            setStep('setup');
            setTotpData(null);
            setVerificationCode('');
            setCopiedSecret(false);
            setCopiedBackupCodes(false);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen && !isSettingUp && !isVerifying) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose, isSettingUp, isVerifying]);

    const handleSetupTOTP = async () => {
        try {
            const response = await setupTOTP();
            setTotpData(response.data);
        } catch (error) {
            console.error('Failed to setup TOTP:', error);
            onClose();
        }
    };

    const handleCopySecret = () => {
        if (totpData?.secret) {
            navigator.clipboard.writeText(totpData.secret);
            setCopiedSecret(true);
            showSuccessToast('Secret copied to clipboard');
            setTimeout(() => setCopiedSecret(false), 3000);
        }
    };

    const handleCopyBackupCodes = () => {
        if (totpData?.backupCodes) {
            const codesText = totpData.backupCodes.join('\n');
            navigator.clipboard.writeText(codesText);
            setCopiedBackupCodes(true);
            showSuccessToast('Backup codes copied to clipboard');
            setTimeout(() => setCopiedBackupCodes(false), 3000);
        }
    };

    const handleDownloadBackupCodes = () => {
        if (totpData?.backupCodes) {
            const codesText = totpData.backupCodes.join('\n');
            const blob = new Blob([codesText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'backup-codes.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showSuccessToast('Backup codes downloaded');
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await verifyTOTP(verificationCode);
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Verification failed:', error);
        }
    };

    const handleProceedToVerify = () => {
        setStep('verify');
    };

    if (!isOpen || !totpData) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={(e) =>
                e.target === e.currentTarget &&
                !isSettingUp &&
                !isVerifying &&
                onClose()
            }
        >
            <div className="w-full max-w-2xl rounded-2 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-primary">
                        {step === 'setup'
                            ? 'Setup Authenticator App'
                            : 'Verify Setup'}
                    </h3>
                    <button
                        onClick={onClose}
                        disabled={isSettingUp || isVerifying}
                        className="text-primary-50 hover:text-primary transition-colors disabled:opacity-50"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                {step === 'setup' ? (
                    <div className="space-y-6">
                        {/* Instructions */}
                        <div className="bg-blue-50 border border-blue-200 rounded-2 p-4">
                            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                <FaQrcode className="w-4 h-4" />
                                Step 1: Scan QR Code
                            </h4>
                            <p className="text-sm text-blue-800">
                                Open your authenticator app (Google
                                Authenticator, Authy, 1Password, etc.) and scan
                                the QR code below.
                            </p>
                        </div>

                        {/* QR Code */}
                        <div className="flex justify-center p-6 bg-white border-2 border-primary-10 rounded-2">
                            <img
                                src={totpData.qrCode}
                                alt="TOTP QR Code"
                                className="w-64 h-64"
                            />
                        </div>

                        {/* Manual Setup */}
                        <div className="bg-gray-50 border border-primary-10 rounded-2 p-4">
                            <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                                <FaKey className="w-4 h-4" />
                                Can't scan? Enter manually
                            </h4>
                            <div className="space-y-2">
                                <p className="text-xs text-primary-50 mb-2">
                                    Secret Key:
                                </p>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-white border border-primary-10 rounded-lg p-3 font-mono text-sm break-all">
                                        {totpData.secret}
                                    </div>
                                    <Button
                                        type="button"
                                        variant={
                                            copiedSecret ? 'primary' : 'outline'
                                        }
                                        size="sm"
                                        onClick={handleCopySecret}
                                    >
                                        {copiedSecret ? (
                                            <FaCheckCircle />
                                        ) : (
                                            <FaCopy />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Backup Codes */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-2 p-4">
                            <h4 className="font-semibold text-yellow-900 mb-2">
                                Save Your Backup Codes
                            </h4>
                            <p className="text-sm text-yellow-800 mb-3">
                                Store these codes in a safe place. You can use
                                them to access your account if you lose your
                                authenticator device.
                            </p>
                            <div className="bg-white border border-yellow-200 rounded-lg p-3 mb-3">
                                <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                                    {totpData.backupCodes.map((code, index) => (
                                        <div
                                            key={index}
                                            className="text-primary-75"
                                        >
                                            {code}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCopyBackupCodes}
                                    className="flex-1"
                                >
                                    {copiedBackupCodes ? (
                                        <>
                                            <FaCheckCircle className="mr-2" />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <FaCopy className="mr-2" />
                                            Copy Codes
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDownloadBackupCodes}
                                    className="flex-1"
                                >
                                    <FaDownload className="mr-2" />
                                    Download
                                </Button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-primary-10">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isSettingUp}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleProceedToVerify}
                                disabled={isSettingUp}
                            >
                                Next: Verify Setup
                            </Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleVerify} className="space-y-6">
                        {/* Verification Instructions */}
                        <div className="bg-blue-50 border border-blue-200 rounded-2 p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">
                                Step 2: Verify Your Setup
                            </h4>
                            <p className="text-sm text-blue-800">
                                Enter the 6-digit code from your authenticator
                                app to complete the setup.
                            </p>
                        </div>

                        {/* Verification Code Input */}
                        <InputField
                            id="verification-code"
                            label="Verification Code"
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={verificationCode}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 6) {
                                    setVerificationCode(value);
                                }
                            }}
                            required
                            maxLength={6}
                        />

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-primary-10">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep('setup')}
                                disabled={isVerifying}
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={isVerifying}
                                disabled={
                                    isVerifying || verificationCode.length !== 6
                                }
                            >
                                Verify & Enable
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default TOTPSetupModal;
