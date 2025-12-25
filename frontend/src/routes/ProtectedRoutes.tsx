import { Navigate, Outlet } from 'react-router';
import ProtectedLayout from '../components/layouts/ProtectedLayout';
import Loading from '../components/shared/Loading';
import SEOUpdater from '../components/shared/SEOUpdater';
import { useAuth } from '../stores/auth/authSelectore';

const ProtectedRoutes = () => {
    const { accessToken, loading } = useAuth();

    // Show loading only if we're actively loading and have no token
    // This prevents flicker when refreshing with valid auth
    if (loading && !accessToken) {
        return <Loading />;
    }

    // Only redirect to login if we're certain there's no token
    // Since auth store now initializes synchronously from localStorage,
    // this check is reliable on first render
    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    // User has valid token, show protected content
    // This allows users to stay on their current page when refreshing
    return (
        <>
            <SEOUpdater />
            <ProtectedLayout showLoading={loading}>
                <Outlet />
            </ProtectedLayout>
        </>
    );
};

export default ProtectedRoutes;
