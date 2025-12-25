import { useState } from 'react';
import { FaCheck, FaClock, FaTimes } from 'react-icons/fa';

type AIInsightCardProps = {
    type: 'alert' | 'suggestion' | 'warning';
    title: string;
    message: string;
    onAccept?: () => void;
    onSnooze?: () => void;
    onDismiss?: () => void;
};

const AIInsightCard = ({
    type,
    title,
    message,
    onAccept,
    onSnooze,
    onDismiss,
}: AIInsightCardProps) => {
    const [isDismissed, setIsDismissed] = useState(false);

    const typeStyles = {
        alert: 'border-yellow-300 bg-yellow-50',
        suggestion: 'border-blue-300 bg-blue-50',
        warning: 'border-red-300 bg-red-50',
    };

    const handleDismiss = () => {
        setIsDismissed(true);
        onDismiss?.();
    };

    if (isDismissed) return null;

    return (
        <div
            className={`rounded-lg border p-4 ${typeStyles[type]} transition-all hover:shadow-md`}
        >
            <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-sm text-primary">{title}</h4>
            </div>
            <p className="text-xs text-primary-75 mb-4">{message}</p>
            <div className="flex items-center flex-wrap gap-2">
                {onAccept && (
                    <button
                        onClick={onAccept}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-primary text-white rounded-md hover:bg-primary-75 transition-colors"
                    >
                        <FaCheck className="w-3 h-3" />
                        Accept
                    </button>
                )}
                {onSnooze && (
                    <button
                        onClick={onSnooze}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white text-primary border border-primary-25 rounded-md hover:bg-primary-10 transition-colors"
                    >
                        <FaClock className="w-3 h-3" />
                        Snooze
                    </button>
                )}
                {onDismiss && (
                    <button
                        onClick={handleDismiss}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white text-primary-50 border border-primary-10 rounded-md hover:bg-primary-10 transition-colors ml-auto"
                    >
                        <FaTimes className="w-3 h-3" />
                        Dismiss
                    </button>
                )}
            </div>
        </div>
    );
};

export default AIInsightCard;
