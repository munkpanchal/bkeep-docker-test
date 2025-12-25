/**
 * Passkey Debugging Utilities
 *
 * These utilities help diagnose passkey login issues
 */

import { getStoredPasskeyUser, isWebAuthnSupported } from './passkey';

export type PasskeyDiagnostics = {
    hasStoredUser: boolean;
    storedEmail: string | null;
    webAuthnSupported: boolean;
    isPlatformAuthenticatorAvailable: boolean | null;
    isHttps: boolean;
    userAgent: string;
    issues: string[];
    recommendations: string[];
};

/**
 * Run comprehensive passkey diagnostics
 */
export async function diagnosePasskeySetup(): Promise<PasskeyDiagnostics> {
    const diagnostics: PasskeyDiagnostics = {
        hasStoredUser: false,
        storedEmail: null,
        webAuthnSupported: false,
        isPlatformAuthenticatorAvailable: null,
        isHttps:
            window.location.protocol === 'https:' ||
            window.location.hostname === 'localhost',
        userAgent: navigator.userAgent,
        issues: [],
        recommendations: [],
    };

    // Check stored user
    const storedUser = getStoredPasskeyUser();
    if (storedUser) {
        diagnostics.hasStoredUser = true;
        diagnostics.storedEmail = storedUser.email;
    } else {
        diagnostics.issues.push('No stored user email found in localStorage');
        diagnostics.recommendations.push(
            'Log in with email and password first to store your email'
        );
    }

    // Check WebAuthn support
    diagnostics.webAuthnSupported = isWebAuthnSupported();
    if (!diagnostics.webAuthnSupported) {
        diagnostics.issues.push('WebAuthn is not supported in this browser');
        diagnostics.recommendations.push(
            'Use a modern browser like Chrome, Safari, Firefox, or Edge'
        );
    }

    // Check platform authenticator
    if (diagnostics.webAuthnSupported) {
        try {
            diagnostics.isPlatformAuthenticatorAvailable =
                await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();

            if (!diagnostics.isPlatformAuthenticatorAvailable) {
                diagnostics.issues.push(
                    'Platform authenticator (Touch ID, Face ID, Windows Hello) not available'
                );
                diagnostics.recommendations.push(
                    'Use a device with biometric authentication or a security key'
                );
            }
        } catch (error) {
            console.error('Error checking platform authenticator:', error);
        }
    }

    // Check HTTPS
    if (!diagnostics.isHttps) {
        diagnostics.issues.push(
            'Not using HTTPS - WebAuthn requires secure context'
        );
        diagnostics.recommendations.push(
            'Use HTTPS in production (localhost is allowed for development)'
        );
    }

    return diagnostics;
}

/**
 * Log passkey diagnostics to console
 */
export async function logPasskeyDiagnostics(): Promise<void> {
    console.group('🔐 Passkey Diagnostics');

    const diagnostics = await diagnosePasskeySetup();

    console.log(
        'Stored User:',
        diagnostics.hasStoredUser ? diagnostics.storedEmail : 'None'
    );
    console.log('WebAuthn Supported:', diagnostics.webAuthnSupported);
    console.log(
        'Platform Authenticator:',
        diagnostics.isPlatformAuthenticatorAvailable
    );
    console.log('HTTPS:', diagnostics.isHttps);
    console.log('User Agent:', diagnostics.userAgent);

    if (diagnostics.issues.length > 0) {
        console.group('⚠️ Issues Found');
        diagnostics.issues.forEach((issue, i) => {
            console.warn(`${i + 1}. ${issue}`);
        });
        console.groupEnd();
    }

    if (diagnostics.recommendations.length > 0) {
        console.group('💡 Recommendations');
        diagnostics.recommendations.forEach((rec, i) => {
            console.info(`${i + 1}. ${rec}`);
        });
        console.groupEnd();
    }

    if (diagnostics.issues.length === 0) {
        console.log('✅ All checks passed! Passkey login should work.');
    }

    console.groupEnd();
}

/**
 * Test passkey login options endpoint
 */
export async function testPasskeyLoginOptions(
    email: string,
    apiBaseUrl: string
): Promise<{
    success: boolean;
    hasCredentials: boolean;
    credentialCount: number;
    error?: string;
}> {
    try {
        const response = await fetch(
            `${apiBaseUrl}/auth/passkey/login/options`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                hasCredentials: false,
                credentialCount: 0,
                error: data.message || `HTTP ${response.status}`,
            };
        }

        const credentialCount = data.data?.allowCredentials?.length || 0;

        return {
            success: true,
            hasCredentials: credentialCount > 0,
            credentialCount,
        };
    } catch (error) {
        return {
            success: false,
            hasCredentials: false,
            credentialCount: 0,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Format diagnostics for display in UI
 */
export function formatDiagnostics(diagnostics: PasskeyDiagnostics): string {
    let output = '=== Passkey Diagnostics ===\n\n';

    output += `Stored User: ${diagnostics.hasStoredUser ? diagnostics.storedEmail : 'None'}\n`;
    output += `WebAuthn: ${diagnostics.webAuthnSupported ? '✅ Supported' : '❌ Not Supported'}\n`;
    output += `Platform Auth: ${diagnostics.isPlatformAuthenticatorAvailable ? '✅ Available' : '❌ Not Available'}\n`;
    output += `HTTPS: ${diagnostics.isHttps ? '✅ Yes' : '❌ No'}\n`;

    if (diagnostics.issues.length > 0) {
        output += '\n⚠️ Issues:\n';
        diagnostics.issues.forEach((issue, i) => {
            output += `${i + 1}. ${issue}\n`;
        });
    }

    if (diagnostics.recommendations.length > 0) {
        output += '\n💡 Recommendations:\n';
        diagnostics.recommendations.forEach((rec, i) => {
            output += `${i + 1}. ${rec}\n`;
        });
    }

    if (diagnostics.issues.length === 0) {
        output += '\n✅ All checks passed!\n';
    }

    return output;
}

/**
 * Clear passkey data (for troubleshooting)
 */
export function clearPasskeyData(): void {
    localStorage.removeItem('passkeyUser');
    console.log('Passkey user data cleared from localStorage');
}

/**
 * Export diagnostics data
 */
export async function exportDiagnostics(): Promise<string> {
    const diagnostics = await diagnosePasskeySetup();
    return JSON.stringify(diagnostics, null, 2);
}

// Make available in global scope for console debugging
if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).passkeyDebug = {
        diagnose: diagnosePasskeySetup,
        log: logPasskeyDiagnostics,
        clear: clearPasskeyData,
        export: exportDiagnostics,
        test: testPasskeyLoginOptions,
    };
}
