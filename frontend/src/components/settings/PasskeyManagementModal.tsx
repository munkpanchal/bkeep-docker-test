import { useEffect, useState } from 'react';
import {
    FaCheck,
    FaEdit,
    FaFingerprint,
    FaPlus,
    FaTimes,
    FaTrash,
} from 'react-icons/fa';
import {
    Passkey,
    useDeletePasskey,
    useDisablePasskey,
    useEnablePasskey,
    usePasskeyRegistrationOptions,
    usePasskeyRegistrationVerify,
    usePasskeysList,
    useRenamePasskey,
} from '../../services/apis/passkeyApi';
import {
    arrayBufferToBase64url,
    base64urlToArrayBuffer,
    isWebAuthnSupported,
} from '../../utills/passkey';
import { showErrorToast } from '../../utills/toast';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import Button from '../typography/Button';
import { InputField } from '../typography/InputFields';

type PasskeyManagementModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

type ModalStep =
    | 'list'
    | 'register'
    | 'rename'
    | 'confirm-delete'
    | 'confirm-disable';

const PasskeyManagementModal = ({
    isOpen,
    onClose,
}: PasskeyManagementModalProps) => {
    const [currentStep, setCurrentStep] = useState<ModalStep>('list');
    const [friendlyName, setFriendlyName] = useState('');
    const [selectedPasskey, setSelectedPasskey] = useState<Passkey | null>(
        null
    );
    const [isRegistering, setIsRegistering] = useState(false);
    const [webAuthnSupported, setWebAuthnSupported] = useState(true);

    // API hooks
    const { data: passkeysData, isLoading: isLoadingPasskeys } =
        usePasskeysList();
    const { mutateAsync: getRegistrationOptions } =
        usePasskeyRegistrationOptions();
    const { mutateAsync: verifyRegistration } = usePasskeyRegistrationVerify();
    const { mutate: deletePasskey, isPending: isDeleting } = useDeletePasskey();
    const { mutate: renamePasskey, isPending: isRenaming } = useRenamePasskey();
    const { mutate: enablePasskey, isPending: isEnabling } = useEnablePasskey();
    const { mutate: disablePasskey, isPending: isDisabling } =
        useDisablePasskey();

    const passkeys = passkeysData?.data?.passkeys || [];

    useEffect(() => {
        setWebAuthnSupported(isWebAuthnSupported());
    }, []);

    useEffect(() => {
        if (!isOpen) {
            // Reset state when modal closes
            setCurrentStep('list');
            setFriendlyName('');
            setSelectedPasskey(null);
        }
    }, [isOpen]);

    const handleClose = () => {
        if (isRegistering || isDeleting || isRenaming) {
            return; // Don't close while operations are in progress
        }
        onClose();
    };

    const handleStartRegistration = () => {
        setCurrentStep('register');
        setFriendlyName('');
    };

    const handleRegisterPasskey = async () => {
        if (!webAuthnSupported) {
            showErrorToast(
                'WebAuthn is not supported in this browser. Please use a modern browser.'
            );
            return;
        }

        if (!friendlyName.trim()) {
            showErrorToast('Please enter a friendly name for your passkey');
            return;
        }

        setIsRegistering(true);

        try {
            // Step 1: Get registration options from server
            const optionsResponse = await getRegistrationOptions();
            const options = optionsResponse.data.options;

            // Step 2: Convert challenge and user.id to ArrayBuffer for WebAuthn
            const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions =
                {
                    challenge: base64urlToArrayBuffer(options.challenge),
                    rp: {
                        name: options.rp.name,
                        id: options.rp.id,
                    },
                    user: {
                        id: base64urlToArrayBuffer(options.user.id),
                        name: options.user.name,
                        displayName: options.user.displayName,
                    },
                    pubKeyCredParams: options.pubKeyCredParams.map((param) => ({
                        alg: param.alg,
                        type: param.type as PublicKeyCredentialType,
                    })),
                    timeout: options.timeout,
                    attestation:
                        options.attestation as AttestationConveyancePreference,
                    excludeCredentials: options.excludeCredentials.map(
                        (cred) => ({
                            id: base64urlToArrayBuffer(cred.id),
                            type: cred.type as PublicKeyCredentialType,
                            transports: cred.transports,
                        })
                    ),
                    authenticatorSelection: {
                        userVerification:
                            options.authenticatorSelection.userVerification,
                        residentKey: options.authenticatorSelection.residentKey,
                        requireResidentKey:
                            options.authenticatorSelection.requireResidentKey,
                    },
                    extensions: options.extensions,
                };

            // Step 3: Create credential using WebAuthn API
            const credential = (await navigator.credentials.create({
                publicKey: publicKeyCredentialCreationOptions,
            })) as PublicKeyCredential | null;

            if (!credential) {
                throw new Error('No credential returned from authenticator');
            }

            const response =
                credential.response as AuthenticatorAttestationResponse;

            // Step 4: Extract transports if available
            let transports: AuthenticatorTransport[] | undefined;
            if (
                'getTransports' in response &&
                typeof response.getTransports === 'function'
            ) {
                transports =
                    response.getTransports() as AuthenticatorTransport[];
            }

            // Step 5: Build credential object in SimpleWebAuthn format
            const credentialForBackend = {
                id: credential.id,
                rawId: arrayBufferToBase64url(credential.rawId),
                response: {
                    attestationObject: arrayBufferToBase64url(
                        response.attestationObject
                    ),
                    clientDataJSON: arrayBufferToBase64url(
                        response.clientDataJSON
                    ),
                    transports: transports,
                },
                type: credential.type,
                clientExtensionResults:
                    credential.getClientExtensionResults() as Record<
                        string,
                        unknown
                    >,
                authenticatorAttachment:
                    credential.authenticatorAttachment || undefined,
            };

            // Step 6: Send credential to server for verification
            await verifyRegistration({
                name: friendlyName.trim(),
                credential: credentialForBackend,
            });

            // Success - go back to list
            setCurrentStep('list');
            setFriendlyName('');
        } catch (error) {
            console.error('Passkey registration failed:', error);
            // Error toast is shown by the hook, but handle WebAuthn-specific errors
            if (error instanceof DOMException) {
                if (error.name === 'NotAllowedError') {
                    showErrorToast('Registration was cancelled or not allowed');
                } else if (error.name === 'SecurityError') {
                    showErrorToast(
                        'Security error during registration. Please try again.'
                    );
                } else if (error.name === 'AbortError') {
                    showErrorToast('Registration was aborted');
                } else if (error.name === 'InvalidStateError') {
                    showErrorToast(
                        'This authenticator is already registered. Please use a different one.'
                    );
                }
            }
        } finally {
            setIsRegistering(false);
        }
    };

    const handleStartRename = (passkey: Passkey) => {
        setSelectedPasskey(passkey);
        setFriendlyName(passkey.name);
        setCurrentStep('rename');
    };

    const handleRenamePasskey = () => {
        if (!selectedPasskey) return;
        if (!friendlyName.trim()) {
            showErrorToast('Please enter a friendly name');
            return;
        }

        renamePasskey(
            {
                passkeyId: selectedPasskey.id,
                name: friendlyName.trim(),
            },
            {
                onSuccess: () => {
                    setCurrentStep('list');
                    setFriendlyName('');
                    setSelectedPasskey(null);
                },
            }
        );
    };

    const handleStartDelete = (passkey: Passkey) => {
        setSelectedPasskey(passkey);
        setCurrentStep('confirm-delete');
    };

    const handleConfirmDelete = () => {
        if (!selectedPasskey) return;

        deletePasskey(selectedPasskey.id, {
            onSuccess: () => {
                setCurrentStep('list');
                setSelectedPasskey(null);
            },
        });
    };

    const handleToggleEnabled = (passkey: Passkey) => {
        if (passkey.isActive) {
            setSelectedPasskey(passkey);
            setCurrentStep('confirm-disable');
        } else {
            enablePasskey(passkey.id);
        }
    };

    const handleConfirmDisable = () => {
        if (!selectedPasskey) return;

        disablePasskey(selectedPasskey.id, {
            onSuccess: () => {
                setCurrentStep('list');
                setSelectedPasskey(null);
            },
        });
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Modal Overlay */}
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/15 bg-opacity-50 p-4"
                onClick={(e) =>
                    e.target === e.currentTarget &&
                    !isRegistering &&
                    !isDeleting &&
                    !isRenaming &&
                    handleClose()
                }
            >
                <div className="w-full max-w-2xl rounded-2 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-primary">
                            {currentStep === 'list' && 'Passkey Management'}
                            {currentStep === 'register' &&
                                'Register New Passkey'}
                            {currentStep === 'rename' && 'Rename Passkey'}
                        </h3>
                        <button
                            onClick={handleClose}
                            disabled={isRegistering || isDeleting || isRenaming}
                            className="text-primary-50 hover:text-primary transition-colors disabled:opacity-50"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        {/* WebAuthn Not Supported */}
                        {!webAuthnSupported && (
                            <div className="bg-red-50 border border-red-200 rounded-2 p-4">
                                <p className="text-sm text-red-800">
                                    Your browser doesn't support passkeys.
                                    Please use a modern browser like Chrome,
                                    Edge, Safari, or Firefox.
                                </p>
                            </div>
                        )}

                        {/* List View */}
                        {currentStep === 'list' && (
                            <div className="space-y-6">
                                {/* Info Banner */}
                                <div className="bg-blue-50 border border-blue-200 rounded-2 p-4">
                                    <p className="text-sm text-blue-800">
                                        Passkeys are a more secure and
                                        convenient way to sign in. Use your
                                        fingerprint, face, or device PIN instead
                                        of a password.
                                    </p>
                                </div>

                                {/* Add New Passkey Button */}
                                <Button
                                    variant="primary"
                                    onClick={handleStartRegistration}
                                    disabled={!webAuthnSupported}
                                    className="w-full"
                                >
                                    <FaPlus className="w-4 h-4" />
                                    Add New Passkey
                                </Button>

                                {/* Passkeys List */}
                                {isLoadingPasskeys ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                        <p className="text-sm text-primary-50 mt-3">
                                            Loading passkeys...
                                        </p>
                                    </div>
                                ) : passkeys.length === 0 ? (
                                    <div className="bg-gray-50 border border-primary-10 rounded-2 p-8 text-center">
                                        <FaFingerprint className="w-12 h-12 text-primary-20 mx-auto mb-3" />
                                        <p className="text-sm font-medium text-primary mb-1">
                                            No passkeys registered yet
                                        </p>
                                        <p className="text-xs text-primary-50">
                                            Add a passkey to enable passwordless
                                            authentication
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {passkeys.map((passkey) => (
                                            <div
                                                key={passkey.id}
                                                className={`border rounded-2 p-4 transition-colors ${
                                                    passkey.isActive
                                                        ? 'border-primary-10 bg-white'
                                                        : 'border-gray-200 bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-3 flex-1">
                                                        <div
                                                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                                                passkey.isActive
                                                                    ? 'bg-primary-10'
                                                                    : 'bg-gray-200'
                                                            }`}
                                                        >
                                                            <FaFingerprint
                                                                className={`w-5 h-5 ${
                                                                    passkey.isActive
                                                                        ? 'text-primary'
                                                                        : 'text-gray-400'
                                                                }`}
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="font-medium text-primary truncate">
                                                                    {
                                                                        passkey.name
                                                                    }
                                                                </h4>
                                                                {passkey.isActive && (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                                                        <FaCheck className="w-3 h-3" />
                                                                        Active
                                                                    </span>
                                                                )}
                                                                {!passkey.isActive && (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-xs font-medium">
                                                                        Disabled
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-primary-50 mt-1">
                                                                Created:{' '}
                                                                {formatDate(
                                                                    passkey.createdAt
                                                                )}
                                                            </p>
                                                            <p className="text-xs text-primary-50">
                                                                Last used:{' '}
                                                                {formatDate(
                                                                    passkey.lastUsedAt
                                                                )}
                                                            </p>
                                                            <p className="text-xs text-primary-40">
                                                                Type:{' '}
                                                                {passkey.credentialType ===
                                                                'platform'
                                                                    ? 'Device'
                                                                    : 'Security Key'}
                                                                {passkey.backupEligible &&
                                                                    ' • Backup enabled'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <button
                                                            onClick={() =>
                                                                handleStartRename(
                                                                    passkey
                                                                )
                                                            }
                                                            className="p-2 text-primary-50 hover:text-primary hover:bg-primary-5 rounded-lg transition-colors"
                                                            title="Rename"
                                                        >
                                                            <FaEdit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleToggleEnabled(
                                                                    passkey
                                                                )
                                                            }
                                                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                                                passkey.isActive
                                                                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            }`}
                                                            disabled={
                                                                isEnabling ||
                                                                isDisabling
                                                            }
                                                        >
                                                            {passkey.isActive
                                                                ? 'Disable'
                                                                : 'Enable'}
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleStartDelete(
                                                                    passkey
                                                                )
                                                            }
                                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <FaTrash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Register View */}
                        {currentStep === 'register' && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 border border-blue-200 rounded-2 p-4">
                                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                        <FaFingerprint className="w-4 h-4" />
                                        Biometric Authentication
                                    </h4>
                                    <p className="text-sm text-blue-800">
                                        You'll be prompted to use your device's
                                        biometric authentication (fingerprint,
                                        face recognition) or security key.
                                    </p>
                                </div>

                                <div>
                                    <InputField
                                        label="Passkey Name"
                                        placeholder="e.g., My iPhone, Touch ID, Work Laptop"
                                        value={friendlyName}
                                        onChange={(e) =>
                                            setFriendlyName(e.target.value)
                                        }
                                        disabled={isRegistering}
                                        required
                                    />
                                    <p className="text-xs text-primary-50 mt-2">
                                        Give this passkey a name to help you
                                        identify it later
                                    </p>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-primary-10">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setCurrentStep('list')}
                                        disabled={isRegistering}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="primary"
                                        onClick={handleRegisterPasskey}
                                        loading={isRegistering}
                                        disabled={isRegistering}
                                    >
                                        Register Passkey
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Rename View */}
                        {currentStep === 'rename' && selectedPasskey && (
                            <div className="space-y-6">
                                <div className="bg-gray-50 border border-primary-10 rounded-2 p-4">
                                    <p className="text-sm text-primary-75">
                                        Update the name of this passkey to help
                                        you identify it more easily.
                                    </p>
                                </div>

                                <InputField
                                    label="Passkey Name"
                                    placeholder="e.g., My iPhone, Touch ID, Work Laptop"
                                    value={friendlyName}
                                    onChange={(e) =>
                                        setFriendlyName(e.target.value)
                                    }
                                    disabled={isRenaming}
                                    required
                                />

                                <div className="flex justify-end gap-3 pt-4 border-t border-primary-10">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setCurrentStep('list')}
                                        disabled={isRenaming}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="primary"
                                        onClick={handleRenamePasskey}
                                        loading={isRenaming}
                                        disabled={isRenaming}
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={currentStep === 'confirm-delete' && !!selectedPasskey}
                onClose={() => {
                    setCurrentStep('list');
                    setSelectedPasskey(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete Passkey"
                message={`Are you sure you want to delete "${selectedPasskey?.name}"? This action cannot be undone.`}
                confirmText="Delete Passkey"
                cancelText="Cancel"
                confirmVariant="danger"
                loading={isDeleting}
            />

            {/* Disable Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={currentStep === 'confirm-disable' && !!selectedPasskey}
                onClose={() => {
                    setCurrentStep('list');
                    setSelectedPasskey(null);
                }}
                onConfirm={handleConfirmDisable}
                title="Disable Passkey"
                message={`Are you sure you want to disable "${selectedPasskey?.name}"? You can re-enable it later.`}
                confirmText="Disable Passkey"
                cancelText="Cancel"
                confirmVariant="danger"
                loading={isDisabling}
            />
        </>
    );
};

export default PasskeyManagementModal;
