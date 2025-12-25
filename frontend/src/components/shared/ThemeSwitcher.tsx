import { useEffect, useRef, useState } from 'react';
import {
    FaCheck,
    FaChevronDown,
    FaDesktop,
    FaMoon,
    FaSun,
} from 'react-icons/fa';

type Theme = 'light' | 'dark' | 'system';

type ThemeSwitcherProps = {
    compact?: boolean;
};

const ThemeSwitcher = ({ compact = false }: ThemeSwitcherProps) => {
    const [currentTheme, setCurrentTheme] = useState<Theme>('system');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme) {
            setCurrentTheme(savedTheme);
            applyTheme(savedTheme);
        } else {
            applyTheme('system');
        }
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const applyTheme = (theme: Theme) => {
        const root = document.documentElement;

        if (theme === 'system') {
            const systemPrefersDark = window.matchMedia(
                '(prefers-color-scheme: dark)'
            ).matches;
            if (systemPrefersDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        } else if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };

    const handleThemeChange = (theme: Theme) => {
        setCurrentTheme(theme);
        localStorage.setItem('theme', theme);
        applyTheme(theme);
        setIsOpen(false);
    };

    const themes: Array<{
        id: Theme;
        name: string;
        icon: typeof FaSun;
        description: string;
    }> = [
        {
            id: 'light',
            name: 'Light',
            icon: FaSun,
            description: 'Light theme',
        },
        {
            id: 'dark',
            name: 'Dark',
            icon: FaMoon,
            description: 'Dark theme',
        },
        {
            id: 'system',
            name: 'System',
            icon: FaDesktop,
            description: 'Use system preference',
        },
    ];

    const getCurrentThemeData = () => {
        return themes.find((t) => t.id === currentTheme) || themes[2];
    };

    const currentThemeData = getCurrentThemeData();
    const CurrentIcon = currentThemeData.icon;

    const buttonClasses = compact ? 'text-xs px-2 py-1' : 'text-sm px-3 py-2';

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 bg-white border border-primary-10 rounded-2 shadow-sm hover:shadow-md transition-all duration-200 ${buttonClasses} cursor-pointer hover:border-primary-20`}
                aria-label="Switch theme"
            >
                <CurrentIcon className="text-primary-50 w-4 h-4" />
                <span className="text-primary font-medium">
                    {currentThemeData.name}
                </span>
                <FaChevronDown
                    className={`text-primary-50 w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Popup */}
            {isOpen && (
                <div className="absolute top-full mt-2 right-0 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-700">
                            Switch Theme
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                            Choose your preferred theme
                        </p>
                    </div>

                    {/* Theme List */}
                    <div className="overflow-y-auto">
                        {themes.map((theme) => {
                            const isSelected = theme.id === currentTheme;
                            const ThemeIcon = theme.icon;
                            return (
                                <button
                                    key={theme.id}
                                    onClick={() => handleThemeChange(theme.id)}
                                    className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 ${
                                        isSelected
                                            ? 'bg-primary-5 hover:bg-primary-5'
                                            : ''
                                    } cursor-pointer`}
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div
                                            className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                                                isSelected
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            <ThemeIcon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 text-left min-w-0">
                                            <p
                                                className={`text-sm font-medium ${
                                                    isSelected
                                                        ? 'text-primary'
                                                        : 'text-gray-900'
                                                }`}
                                            >
                                                {theme.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {theme.description}
                                            </p>
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <FaCheck className="text-primary w-4 h-4 shrink-0" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeSwitcher;
