import { useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { Link, useLocation } from 'react-router';
import { APP_TITLE, SIDEBAR_ITEMS } from '../../constants';
import { LOGO_IMAGE } from '../../constants/images';
import HorizontalRuler from './HorizontalRuler';

const Sidebar = ({ collapsed }: { collapsed: boolean }) => {
    const location = useLocation();

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(collapsed);

    // Check if a sidebar item should be active
    // Parent items are active if current path starts with the item path
    const isItemActive = (itemPath: string | undefined) => {
        if (!itemPath) return false;

        // Exact match
        if (location.pathname === itemPath) return true;

        // Check if current path is a child of this item
        // e.g., /settings/users should make /settings active
        // But /dashboard should not match /dashboard-something
        if (location.pathname.startsWith(itemPath + '/')) {
            return true;
        }

        return false;
    };

    return (
        <div
            className={`protected-route-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}
        >
            <div className="sidebar-header">
                <div className="sidebar-header-logo">
                    <img src={LOGO_IMAGE} alt="logo" className="w-10 h-10" />
                    <span className="sidebar-header-title-text">
                        {APP_TITLE}
                    </span>
                </div>
            </div>

            <HorizontalRuler />

            <div className="flex-1 flex flex-col gap-4">
                <div className="sidebar-items flex-1">
                    {SIDEBAR_ITEMS.map((item) => (
                        <Link
                            to={item.path || '/dashboard'}
                            key={item.label}
                            className={`sidebar-item ${isItemActive(item.path) ? 'active' : ''}`}
                        >
                            <span className="sidebar-item-icon">
                                {item.icon}
                            </span>
                            <span className="sidebar-item-label">
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </div>

                <HorizontalRuler />
                <div
                    className="sidebar-item sidebar-toggle"
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                >
                    <span
                        className={`sidebar-item-icon ${
                            isSidebarCollapsed ? 'rotate-180' : ''
                        }`}
                    >
                        <FaChevronLeft className="w-3 h-3" />
                    </span>
                    <span className="sidebar-item-label">Collapse Sidebar</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
