import { ReactNode, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

export type PopupSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full';

export interface PopupProps {
    /** Whether the popup is open */
    isOpen: boolean;
    /** Callback when popup should close */
    onClose: () => void;
    /** Content to display in the popup */
    children: ReactNode;
    /** Optional title to display in the header */
    title?: string;
    /** Optional custom header content (overrides title) */
    header?: ReactNode;
    /** Optional custom footer content */
    footer?: ReactNode;
    /** Size of the popup */
    size?: PopupSize;
    /** Whether to show the close button */
    showCloseButton?: boolean;
    /** Whether to close on backdrop click */
    closeOnBackdropClick?: boolean;
    /** Whether to close on ESC key press */
    closeOnEscape?: boolean;
    /** Whether the popup is in a loading state (prevents closing) */
    loading?: boolean;
    /** Custom className for the popup container */
    className?: string;
    /** Custom className for the content area */
    contentClassName?: string;
    /** Whether to show scrollbar when content overflows */
    scrollable?: boolean;
    /** Maximum height of the popup (e.g., '90vh') */
    maxHeight?: string;
}

const SIZE_CLASSES: Record<PopupSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full',
};

const Popup = ({
    isOpen,
    onClose,
    children,
    title,
    header,
    footer,
    size = 'md',
    showCloseButton = true,
    closeOnBackdropClick = true,
    closeOnEscape = true,
    loading = false,
    className = '',
    contentClassName = '',
    scrollable = true,
    maxHeight = '90vh',
}: PopupProps) => {
    // Handle ESC key press
    useEffect(() => {
        if (!isOpen || !closeOnEscape) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !loading) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, closeOnEscape, loading, onClose]);

    // Prevent body scroll when popup is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && closeOnBackdropClick && !loading) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const sizeClass = SIZE_CLASSES[size];
    const scrollableClass = scrollable ? 'overflow-y-auto' : 'overflow-hidden';
    const maxHeightStyle = scrollable ? { maxHeight } : {};

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'popup-title' : undefined}
        >
            <div
                className={`w-full ${sizeClass} rounded-2 bg-white shadow-2xl ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {(title || header || showCloseButton) && (
                    <div className="flex items-center justify-between border-b border-primary-10 px-6 py-4">
                        {header ? (
                            <div className="flex-1">{header}</div>
                        ) : title ? (
                            <h2
                                id="popup-title"
                                className="text-xl font-semibold text-primary"
                            >
                                {title}
                            </h2>
                        ) : (
                            <div className="flex-1" />
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="ml-4 text-primary-50 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                                aria-label="Close popup"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div
                    className={`px-6 py-6 ${scrollableClass} ${contentClassName}`}
                    style={maxHeightStyle}
                >
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="border-t border-primary-10 px-6 py-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Popup;
