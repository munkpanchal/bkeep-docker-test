import { useEffect } from 'react';
import {
    FaBell,
    FaBuilding,
    FaDatabase,
    FaLock,
    FaUser,
    FaUsers,
    FaUserShield,
} from 'react-icons/fa';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { SettingsTabs, type SettingsTab } from '../../components/settings';
import { useAuth } from '../../stores/auth/authSelectore';

const Settingspage = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Check if user is superadmin
    const isSuperAdmin = user?.role?.name === 'superadmin';

    // Get active tab from route
    const getActiveTab = () => {
        const path = location.pathname;
        if (path.includes('/settings/profile')) return 'profile';
        if (path.includes('/settings/tenants')) return 'tenants';
        if (path.includes('/settings/users')) return 'users';
        if (path.includes('/settings/roles')) return 'roles';
        if (path.includes('/settings/security')) return 'security';
        if (path.includes('/settings/data')) return 'data';
        if (path.includes('/settings/notifications')) return 'notifications';
        return 'profile';
    };

    const activeTab = getActiveTab();

    // Redirect to profile if on base settings route
    useEffect(() => {
        if (location.pathname === '/settings') {
            navigate('/settings/profile', { replace: true });
        }
    }, [location.pathname, navigate]);

    const tabs: SettingsTab[] = [
        { id: 'profile', label: 'Profile', icon: <FaUser /> },
        // Only show tenants tab for superadmin
        ...(isSuperAdmin
            ? [
                  {
                      id: 'tenants' as const,
                      label: 'Tenants',
                      icon: <FaBuilding />,
                  },
              ]
            : []),
        { id: 'users', label: 'Users', icon: <FaUsers /> },
        { id: 'roles', label: 'Roles', icon: <FaUserShield /> },
        { id: 'security', label: 'Security', icon: <FaLock /> },
        { id: 'data', label: 'Data & Privacy', icon: <FaDatabase /> },
        { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
    ];

    const handleTabChange = (tabId: string) => {
        navigate(`/settings/${tabId}`);
    };

    return (
        <div className="flex flex-col gap-2">
            <SettingsTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

            <div className="bg-white rounded-2 shadow-sm border border-primary-10 p-6">
                <Outlet />
            </div>
        </div>
    );
};

export default Settingspage;
