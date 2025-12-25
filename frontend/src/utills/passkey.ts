/**
 * Utility functions for managing passkey user data
 */

export type StoredPasskeyUser = {
    email: string;
    lastAccessed: string;
    device: string;
    credentialId?: string;
};

/**
 * Store passkey user information in localStorage
 */
export function storePasskeyUser(email: string, credentialId?: string): void {
    const existingUser = getStoredPasskeyUser();
    const user: StoredPasskeyUser = {
        email,
        lastAccessed: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }),
        device: navigator.userAgent,
        credentialId: credentialId || existingUser?.credentialId,
    };
    localStorage.setItem('passkeyUser', JSON.stringify(user));
}

/**
 * Retrieve stored passkey user from localStorage
 */
export function getStoredPasskeyUser(): StoredPasskeyUser | null {
    try {
        const stored = localStorage.getItem('passkeyUser');
        if (stored) {
            return JSON.parse(stored) as StoredPasskeyUser;
        }
    } catch (e) {
        console.error('Failed to parse stored passkey user', e);
    }
    return null;
}

/**
 * Remove stored passkey user from localStorage
 */
export function removePasskeyUser(): void {
    localStorage.removeItem('passkeyUser');
}

/**
 * Update last accessed timestamp for stored passkey user
 */
export function updatePasskeyUserLastAccessed(): void {
    const user = getStoredPasskeyUser();
    if (user) {
        storePasskeyUser(user.email, user.credentialId);
    }
}

/**
 * Convert base64url string to ArrayBuffer
 */
export function base64urlToArrayBuffer(base64url: string): ArrayBuffer {
    // Replace base64url chars with base64 chars
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    // Pad with '=' if needed
    const paddedBase64 = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        '='
    );
    const binary = atob(paddedBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * Convert ArrayBuffer to base64url string
 */
export function arrayBufferToBase64url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    // Convert to base64url
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Check if WebAuthn is supported in the browser
 */
export function isWebAuthnSupported(): boolean {
    return (
        window.PublicKeyCredential !== undefined &&
        typeof window.PublicKeyCredential === 'function'
    );
}

/**
 * Check if platform authenticator is available (Face ID, Touch ID, Windows Hello)
 */
export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
    if (!isWebAuthnSupported()) return false;
    try {
        return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
        return false;
    }
}
