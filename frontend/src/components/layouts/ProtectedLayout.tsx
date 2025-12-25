import { useEffect, useState, type ReactNode } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useLocation } from 'react-router';
import { useTenant } from '../../stores/tenant/tenantSelectore';
import { PAGE_HEADERS } from '../homepage/constants';
import AddNewModal from '../shared/AddNewModal';
import Bottombar from '../shared/Bottombar';
import Loading from '../shared/Loading';
import PageHeader from '../shared/PageHeader';
import Sidebar from '../shared/Sidebar';
import Topbar from '../shared/Topbar';
import Button from '../typography/Button';

const ProtectedLayout = ({
    children,
    showLoading = false,
}: {
    children: ReactNode;
    showLoading?: boolean;
}) => {
    const location = useLocation();
    const { selectedTenant } = useTenant();
    const [routeLoading, setRouteLoading] = useState(false);
    const [showAddNewModal, setShowAddNewModal] = useState(false);

    useEffect(() => {
        setRouteLoading(true);
        const timeout = setTimeout(() => setRouteLoading(false), 300);

        return () => clearTimeout(timeout);
    }, [location.pathname]);

    const shouldShowLoading = showLoading || routeLoading;
    const currentHeader = PAGE_HEADERS.find(
        (header) => header.path === location.pathname
    );

    return (
        <main className="protected-route">
            <div className="protected-route-wrapper relative">
                {shouldShowLoading && <Loading />}
                <Topbar />
                <Sidebar collapsed={false} />

                <div
                    className="protected-route-content relative"
                    data-tenant-id={selectedTenant?.id || 'default'}
                >
                    {currentHeader && (
                        <PageHeader
                            title={currentHeader.title}
                            subtitle={currentHeader.subtitle}
                        />
                    )}
                    <div
                        key={selectedTenant?.id || 'default-tenant'}
                        className="p-2 sm:h-[calc(100vh-100px)] overflow-auto"
                    >
                        {children}
                    </div>
                </div>
                <div className="absolute bottom-4 right-4">
                    <Button
                        size="sm"
                        isRounded={true}
                        onClick={() => setShowAddNewModal(true)}
                    >
                        <FaPlus />
                        Add New
                    </Button>
                </div>
                <AddNewModal
                    isOpen={showAddNewModal}
                    onClose={() => setShowAddNewModal(false)}
                />
                <Bottombar />
            </div>
        </main>
    );
};

export default ProtectedLayout;
