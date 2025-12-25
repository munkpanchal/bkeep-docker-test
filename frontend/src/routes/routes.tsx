import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import Loading from '../components/shared/Loading';
import ProtectedRoutes from './ProtectedRoutes';
import PublicRoutes from './PublicRoutes';

// Lazy load pages for code splitting
const Homepage = lazy(() => import('../pages/public/Homepage'));
const Loginpage = lazy(() => import('../pages/public/Loginpage'));
const PasskeyLoginpage = lazy(() => import('../pages/public/PasskeyLoginpage'));
const Registerpage = lazy(() => import('../pages/public/Registerpage'));
const ForgotPasswordpage = lazy(
    () => import('../pages/public/ForgotPasswordpage')
);
const OtpVerificationpage = lazy(
    () => import('../pages/public/OtpVerificationpage')
);
const ResetPasswordpage = lazy(
    () => import('../pages/public/ResetPasswordpage')
);
const AcceptInvitationpage = lazy(
    () => import('../pages/public/AcceptInvitationpage')
);

const Dashboardpage = lazy(() => import('../pages/protected/Dashboardpage'));
const Transactionpage = lazy(
    () => import('../pages/protected/Transactionpage')
);
const Reportpage = lazy(() => import('../pages/protected/Reportpage'));
const IncomeStatementpage = lazy(
    () => import('../pages/protected/IncomeStatementpage')
);
const BalanceSheetpage = lazy(
    () => import('../pages/protected/BalanceSheetpage')
);
const ChartOfAccountspage = lazy(
    () => import('../pages/protected/ChartOfAccountspage')
);
const Settingspage = lazy(() => import('../pages/protected/Settingspage'));
const Invoicepage = lazy(() => import('../pages/protected/Invoicepage'));
const Expensespage = lazy(() => import('../pages/protected/Expensespage'));
const Documentspage = lazy(() => import('../pages/protected/Documentspage'));
const ClientReviewpage = lazy(
    () => import('../pages/protected/ClientReviewpage')
);
const JournalEntriespage = lazy(
    () => import('../pages/protected/JournalEntriespage')
);
const CreateJournalEntrypage = lazy(
    () => import('../pages/protected/CreateJournalEntrypage')
);
const ViewJournalEntrypage = lazy(
    () => import('../pages/protected/ViewJournalEntrypage')
);
const EditJournalEntrypage = lazy(
    () => import('../pages/protected/EditJournalEntrypage')
);

// Lazy load settings components
const ProfileTabWrapper = lazy(() =>
    import('../components/settings/SettingsTabWrappers').then((module) => ({
        default: module.ProfileTabWrapper,
    }))
);
const NotificationsTabWrapper = lazy(() =>
    import('../components/settings/SettingsTabWrappers').then((module) => ({
        default: module.NotificationsTabWrapper,
    }))
);
const DataPrivacyTab = lazy(
    () => import('../components/settings/DataPrivacyTab')
);
const RolesTab = lazy(() => import('../components/settings/RolesTab'));
const SecurityTab = lazy(() => import('../components/settings/SecurityTab'));
const TenantsTab = lazy(() => import('../components/settings/TenantsTab'));
const UsersTab = lazy(() => import('../components/settings/UsersTab'));

// Helper component to wrap lazy-loaded routes with Suspense
const withSuspense = (
    Component: React.LazyExoticComponent<
        React.ComponentType<Record<string, never>>
    >
) => {
    return (
        <Suspense fallback={<Loading />}>
            <Component />
        </Suspense>
    );
};

const routes = createBrowserRouter([
    {
        element: <PublicRoutes />,
        children: [
            {
                path: '/',
                element: withSuspense(Homepage),
            },
            {
                path: '/login',
                element: withSuspense(Loginpage),
            },
            {
                path: '/passkey-login',
                element: withSuspense(PasskeyLoginpage),
            },
            {
                path: '/register',
                element: withSuspense(Registerpage),
            },
            {
                path: '/forgot-password',
                element: withSuspense(ForgotPasswordpage),
            },
            {
                path: '/enter-otp',
                element: withSuspense(OtpVerificationpage),
            },
            {
                path: '/reset-password',
                element: withSuspense(ResetPasswordpage),
            },
            {
                path: '/accept-invitation',
                element: withSuspense(AcceptInvitationpage),
            },
        ],
    },
    {
        element: <ProtectedRoutes />,
        children: [
            {
                path: '/dashboard',
                element: withSuspense(Dashboardpage),
            },
            {
                path: '/transactions',
                element: withSuspense(Transactionpage),
            },
            {
                path: '/reports',
                element: withSuspense(Reportpage),
            },
            {
                path: '/reports/income-statement',
                element: withSuspense(IncomeStatementpage),
            },
            {
                path: '/reports/balance-sheet',
                element: withSuspense(BalanceSheetpage),
            },
            {
                path: '/chart-of-accounts',
                element: withSuspense(ChartOfAccountspage),
            },
            {
                path: '/settings',
                element: withSuspense(Settingspage),
                children: [
                    {
                        index: true,
                        element: <Navigate to="/settings/profile" replace />,
                    },
                    {
                        path: '/settings/profile',
                        element: withSuspense(ProfileTabWrapper),
                    },
                    {
                        path: '/settings/tenants',
                        element: withSuspense(TenantsTab),
                    },
                    {
                        path: '/settings/users',
                        element: withSuspense(UsersTab),
                    },
                    {
                        path: '/settings/roles',
                        element: withSuspense(RolesTab),
                    },
                    {
                        path: '/settings/security',
                        element: withSuspense(SecurityTab),
                    },
                    {
                        path: '/settings/data',
                        element: withSuspense(DataPrivacyTab),
                    },
                    {
                        path: '/settings/notifications',
                        element: withSuspense(NotificationsTabWrapper),
                    },
                ],
            },
            {
                path: '/invoices',
                element: withSuspense(Invoicepage),
            },
            {
                path: '/expenses',
                element: withSuspense(Expensespage),
            },
            {
                path: '/documents',
                element: withSuspense(Documentspage),
            },
            {
                path: '/client-review',
                element: withSuspense(ClientReviewpage),
            },
            {
                path: '/journal-entries',
                element: withSuspense(JournalEntriespage),
            },
            {
                path: '/journal-entries/new',
                element: withSuspense(CreateJournalEntrypage),
            },
            {
                path: '/journal-entries/:id',
                element: withSuspense(ViewJournalEntrypage),
            },
            {
                path: '/journal-entries/:id/edit',
                element: withSuspense(EditJournalEntrypage),
            },
        ],
    },
]);

export default routes;
