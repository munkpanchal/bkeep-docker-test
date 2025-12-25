import { Link } from 'react-router';
import { SettingsTab } from './types';

interface SettingsTabsProps {
    tabs: SettingsTab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

const SettingsTabs = ({ tabs, activeTab, onTabChange }: SettingsTabsProps) => {
    return (
        <div className="bg-white rounded-2 border border-primary/25 overflow-hidden">
            <nav className="flex flex-wrap gap-1 overflow-x-auto px-2 py-2 ">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <Link
                            key={tab.id}
                            to={`/settings/${tab.id}`}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                                relative cursor-pointer flex items-center gap-2.5 px-5 py-3 rounded-2 text-sm font-semibold
                                transition-all duration-300 ease-in-out whitespace-nowrap
                                group no-underline
                                ${
                                    isActive
                                        ? 'text-primary'
                                        : 'text-primary-50 hover:text-primary-75'
                                }
                            `}
                        >
                            {/* Active indicator background */}
                            {isActive && (
                                <span className="absolute inset-0 bg-primary/10 rounded-2 z-0" />
                            )}

                            {/* Icon with animation */}
                            <span
                                className={`
                                    relative z-10 transition-transform duration-300
                                    ${isActive ? 'text-primary scale-110' : 'text-primary-50 group-hover:text-primary-75 group-hover:scale-105'}
                                `}
                            >
                                {tab.icon}
                            </span>

                            {/* Label */}
                            <span className="relative z-10">{tab.label}</span>

                            {/* Active underline indicator */}
                            {isActive && (
                                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                            )}

                            {/* Hover effect */}
                            {!isActive && (
                                <span className="absolute inset-0 bg-primary-5 rounded-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default SettingsTabs;
