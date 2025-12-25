import { APP_TITLE } from '../../constants';
import PageHeaderMenu from './PageHeaderMenu';
import TenantSwitcher from './TenantSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import logo from '/logo.png';

const Topbar = () => {
    return (
        <div className="protected-route-topbar">
            <div className="topbar-content">
                <div className="topbar-logo">
                    <img
                        src={logo}
                        alt="BKeep Accounting Logo"
                        className="w-8 h-8 object-contain"
                    />
                    <span className="topbar-logo-text">{APP_TITLE}</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3">
                        <TenantSwitcher />
                        <ThemeSwitcher />
                    </div>
                    <div className="inline-block lg:hidden">
                        <PageHeaderMenu />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
