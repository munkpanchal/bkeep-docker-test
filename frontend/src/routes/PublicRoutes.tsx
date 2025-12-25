import { Navigate, Outlet } from 'react-router';
import PublicLayout from '../components/layouts/PublicLayout';
import Loading from '../components/shared/Loading';
import SEOUpdater from '../components/shared/SEOUpdater';
import { useAuth } from '../stores/auth/authSelectore';

const PublicRoutes = () => {
    const { accessToken, loading } = useAuth();

    if (loading) {
        return <Loading />;
    }

    if (accessToken) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <>
            <SEOUpdater />
            <PublicLayout>
                <Outlet />
            </PublicLayout>
        </>
    );
};

export default PublicRoutes;
