import PageHeaderMenu from './PageHeaderMenu';
import TenantSwitcher from './TenantSwitcher';

const PageHeader = ({
    title,
    subtitle,
}: {
    title: string;
    subtitle: string;
}) => {
    return (
        <div className="flex items-center bg-white p-4 border-b border-primary/50 justify-between gap-4 flex-wrap">
            <div className="flex flex-col justify-between min-w-[200px]">
                <h1 className="text-xl font-bold text-primary">{title}</h1>
                <p className="text-sm text-primary-50">{subtitle}</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden lg:block">
                    <TenantSwitcher compact />
                </div>
                <div className="hidden lg:inline-block">
                    <PageHeaderMenu />
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
