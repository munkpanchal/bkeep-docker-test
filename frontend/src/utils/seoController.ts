import { APP_TITLE } from '../constants';

export interface SEOData {
    title: string;
    description: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogType?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    canonical?: string;
}

const DEFAULT_SEO: SEOData = {
    title: `${APP_TITLE} - Modern Accounting Software`,
    description: `${APP_TITLE} is a modern accounting software solution for managing your business finances, invoices, expenses, and reports.`,
    keywords:
        'accounting, bookkeeping, invoicing, financial management, business software',
    ogType: 'website',
    twitterCard: 'summary_large_image',
};

// SEO Controller - Maps routes to SEO metadata
export const seoController: Record<string, SEOData> = {
    // Public Routes
    '/': {
        title: `${APP_TITLE} - Modern Accounting Software for Your Business`,
        description: `Streamline your accounting with ${APP_TITLE}. Manage invoices, track expenses, generate reports, and keep your finances organized all in one place.`,
        keywords:
            'accounting software, bookkeeping, invoicing, financial management, business accounting',
        ogTitle: `${APP_TITLE} - Modern Accounting Software`,
        ogDescription:
            'Streamline your accounting with our modern software solution.',
    },
    '/login': {
        title: `Login - ${APP_TITLE}`,
        description: `Sign in to your ${APP_TITLE} account to access your dashboard and manage your accounting needs.`,
        keywords: 'login, sign in, account access, accounting software login',
    },
    '/passkey-login': {
        title: `Passkey Login - ${APP_TITLE}`,
        description: `Sign in securely using passkey authentication to your ${APP_TITLE} account.`,
        keywords: 'passkey login, passwordless authentication, secure login',
    },
    '/register': {
        title: `Create Account - ${APP_TITLE}`,
        description: `Create your ${APP_TITLE} account and start managing your business finances today.`,
        keywords:
            'register, sign up, create account, accounting software registration',
    },
    '/forgot-password': {
        title: `Forgot Password - ${APP_TITLE}`,
        description: `Reset your ${APP_TITLE} account password. Enter your email to receive password reset instructions.`,
        keywords: 'forgot password, password reset, account recovery',
    },
    '/enter-otp': {
        title: `OTP Verification - ${APP_TITLE}`,
        description: `Verify your identity with OTP code to access your ${APP_TITLE} account.`,
        keywords:
            'otp verification, two-factor authentication, account security',
    },
    '/reset-password': {
        title: `Reset Password - ${APP_TITLE}`,
        description: `Set a new password for your ${APP_TITLE} account.`,
        keywords: 'reset password, new password, account security',
    },
    '/accept-invitation': {
        title: `Accept Invitation - ${APP_TITLE}`,
        description: `Accept the invitation to join ${APP_TITLE} and start collaborating with your team.`,
        keywords: 'invitation, team collaboration, join organization',
    },

    // Protected Routes - Dashboard
    '/dashboard': {
        title: `Dashboard - ${APP_TITLE}`,
        description: `View your financial overview, recent transactions, and key metrics on your ${APP_TITLE} dashboard.`,
        keywords:
            'dashboard, financial overview, accounting dashboard, business metrics',
    },

    // Transactions
    '/transactions': {
        title: `Transactions - ${APP_TITLE}`,
        description: `View and manage all your financial transactions in one place with ${APP_TITLE}.`,
        keywords:
            'transactions, financial records, transaction management, accounting transactions',
    },

    // Reports
    '/reports': {
        title: `Reports - ${APP_TITLE}`,
        description: `Generate and view comprehensive financial reports including income statements, balance sheets, and more.`,
        keywords:
            'financial reports, accounting reports, business reports, financial analysis',
    },
    '/reports/income-statement': {
        title: `Income Statement - ${APP_TITLE}`,
        description: `View your revenue, expenses, and net income with detailed income statement reports.`,
        keywords:
            'income statement, profit and loss, revenue, expenses, financial statement',
    },
    '/reports/balance-sheet': {
        title: `Balance Sheet - ${APP_TITLE}`,
        description: `View your assets, liabilities, and equity with comprehensive balance sheet reports.`,
        keywords:
            'balance sheet, assets, liabilities, equity, financial position',
    },

    // Chart of Accounts
    '/chart-of-accounts': {
        title: `Chart of Accounts - ${APP_TITLE}`,
        description: `Manage your accounts, track balances, and organize your financial structure with the chart of accounts.`,
        keywords:
            'chart of accounts, accounts management, accounting structure, financial accounts',
    },

    // Settings
    '/settings': {
        title: `Settings - ${APP_TITLE}`,
        description: `Manage your account settings, preferences, and user management in ${APP_TITLE}.`,
        keywords: 'settings, account settings, preferences, user management',
    },
    '/settings/profile': {
        title: `Profile Settings - ${APP_TITLE}`,
        description: `Update your profile information, personal details, and account preferences.`,
        keywords:
            'profile settings, user profile, account information, personal settings',
    },
    '/settings/tenants': {
        title: `Tenants Management - ${APP_TITLE}`,
        description: `Manage your organization tenants and multi-tenant settings.`,
        keywords:
            'tenants, organization management, multi-tenant, workspace settings',
    },
    '/settings/users': {
        title: `Users Management - ${APP_TITLE}`,
        description: `Manage users, roles, and permissions for your organization.`,
        keywords:
            'user management, team management, roles, permissions, access control',
    },
    '/settings/roles': {
        title: `Roles Management - ${APP_TITLE}`,
        description: `Configure and manage user roles and permissions for your organization.`,
        keywords:
            'roles, permissions, access control, user roles, security roles',
    },
    '/settings/security': {
        title: `Security Settings - ${APP_TITLE}`,
        description: `Manage your account security settings including passwords, two-factor authentication, and passkeys.`,
        keywords:
            'security settings, password, two-factor authentication, passkey, account security',
    },
    '/settings/data': {
        title: `Data & Privacy - ${APP_TITLE}`,
        description: `Manage your data privacy settings and preferences in ${APP_TITLE}.`,
        keywords:
            'data privacy, privacy settings, data protection, GDPR, privacy policy',
    },
    '/settings/notifications': {
        title: `Notification Settings - ${APP_TITLE}`,
        description: `Configure your notification preferences for email, push, and SMS notifications.`,
        keywords:
            'notifications, notification settings, alerts, email notifications, push notifications',
    },

    // Invoices
    '/invoices': {
        title: `Invoices - ${APP_TITLE}`,
        description: `Create, manage, and track your invoices with ${APP_TITLE} invoicing system.`,
        keywords:
            'invoices, invoicing, billing, invoice management, create invoice',
    },

    // Expenses
    '/expenses': {
        title: `Expenses - ${APP_TITLE}`,
        description: `Track and manage your business expenses efficiently with ${APP_TITLE}.`,
        keywords:
            'expenses, expense tracking, business expenses, cost management, expense reports',
    },

    // Documents
    '/documents': {
        title: `Documents - ${APP_TITLE}`,
        description: `Upload, organize, and manage your business documents in one secure location.`,
        keywords:
            'documents, document management, file storage, document organization',
    },

    // Client Review
    '/client-review': {
        title: `Client Review - ${APP_TITLE}`,
        description: `Review and categorize transactions that need your input and approval.`,
        keywords:
            'client review, transaction review, approval workflow, transaction categorization',
    },

    // Journal Entries
    '/journal-entries': {
        title: `Journal Entries - ${APP_TITLE}`,
        description: `View and manage all your accounting journal entries.`,
        keywords:
            'journal entries, accounting entries, general ledger, bookkeeping entries',
    },
    '/journal-entries/new': {
        title: `Create Journal Entry - ${APP_TITLE}`,
        description: `Create a new journal entry to record financial transactions.`,
        keywords:
            'create journal entry, new entry, accounting entry, financial transaction',
    },
    '/journal-entries/:id': {
        title: `View Journal Entry - ${APP_TITLE}`,
        description: `View details of a specific journal entry in your accounting records.`,
        keywords:
            'journal entry, view entry, accounting entry details, transaction details',
    },
    '/journal-entries/:id/edit': {
        title: `Edit Journal Entry - ${APP_TITLE}`,
        description: `Edit an existing journal entry to update financial transaction records.`,
        keywords:
            'edit journal entry, update entry, modify transaction, edit accounting entry',
    },
};

/**
 * Get SEO data for a given path
 * @param pathname - The current pathname
 * @returns SEO data for the path or default SEO data
 */
export const getSEOData = (pathname: string): SEOData => {
    const normalizedPath = normalizePath(pathname);

    // Check for exact match first
    if (seoController[normalizedPath]) {
        return seoController[normalizedPath];
    }

    // Handle dynamic routes by pattern matching
    const pathSegments = normalizedPath.split('/').filter(Boolean);

    // Try to match dynamic patterns
    if (pathSegments.length >= 2) {
        // Check for edit pattern: /journal-entries/:id/edit
        if (pathSegments[pathSegments.length - 1] === 'edit') {
            const basePath = '/' + pathSegments.slice(0, -2).join('/');
            const editPattern = basePath + '/:id/edit';
            if (seoController[editPattern]) {
                return seoController[editPattern];
            }
        }

        // Check for view pattern: /journal-entries/:id
        const basePath = '/' + pathSegments.slice(0, -1).join('/');
        const viewPattern = basePath + '/:id';
        if (seoController[viewPattern]) {
            return seoController[viewPattern];
        }

        // Fallback to parent path
        if (seoController[basePath]) {
            return seoController[basePath];
        }
    }

    // Check for base route match
    if (pathSegments.length > 0) {
        const basePath = '/' + pathSegments[0];
        if (seoController[basePath]) {
            return seoController[basePath];
        }
    }

    // Return default SEO
    return DEFAULT_SEO;
};

/**
 * Normalize path for SEO lookup
 * Removes query params and handles dynamic segments
 */
const normalizePath = (pathname: string): string => {
    // Remove query parameters
    const pathWithoutQuery = pathname.split('?')[0];

    // Return the path as-is (dynamic segments will be handled in getSEOData)
    return pathWithoutQuery;
};

/**
 * Generate full page title with app name
 */
export const getPageTitle = (pathname: string): string => {
    const seoData = getSEOData(pathname);
    return seoData.title;
};

/**
 * Get meta description for a path
 */
export const getMetaDescription = (pathname: string): string => {
    const seoData = getSEOData(pathname);
    return seoData.description;
};
