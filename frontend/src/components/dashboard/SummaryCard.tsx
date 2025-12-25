import React from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

type SummaryCardProps = {
    title: string;
    value: string;
    trend?: {
        value: number;
        direction: 'up' | 'down';
        period: string;
    };
    breakdown?: {
        label: string;
        value: string;
    }[];
    aiNotes?: string[];
    icon?: React.ReactNode;
    indicator?: 'green' | 'yellow' | 'red';
};

const SummaryCard = ({
    title,
    value,
    trend,
    breakdown,
    aiNotes,
    icon,
    indicator,
}: SummaryCardProps) => {
    const indicatorColor = {
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        red: 'bg-red-500',
    };

    return (
        <div className="bg-white rounded-2 shadow-sm border border-primary-10 p-6 hover:shadow-md transition-shadow min-w-0 w-full h-full overflow-auto">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {icon && <div className="text-primary text-xl">{icon}</div>}
                    <h3 className="text-sm font-semibold text-primary-75 uppercase">
                        {title}
                    </h3>
                </div>
                {indicator && (
                    <div
                        className={`w-3 h-3 rounded-full ${indicatorColor[indicator]}`}
                    ></div>
                )}
            </div>

            <div className="mb-4">
                <p className="text-3xl font-bold text-primary mb-2">{value}</p>
                {trend && (
                    <div
                        className={`flex items-center gap-2 text-sm ${
                            trend.direction === 'up'
                                ? 'text-green-600'
                                : 'text-red-600'
                        }`}
                    >
                        {trend.direction === 'up' ? (
                            <FaArrowUp className="w-3 h-3" />
                        ) : (
                            <FaArrowDown className="w-3 h-3" />
                        )}
                        <span>
                            {Math.abs(trend.value)}% vs {trend.period}
                        </span>
                    </div>
                )}
            </div>

            {breakdown && breakdown.length > 0 && (
                <div className="mb-4 space-y-2">
                    {breakdown.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between text-sm"
                        >
                            <span className="text-primary-50">
                                {item.label}
                            </span>
                            <span className="font-medium text-primary">
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {aiNotes && aiNotes.length > 0 && (
                <div className="pt-4 border-t border-primary-10">
                    <div className="space-y-2">
                        {aiNotes.map((note, index) => (
                            <p
                                key={index}
                                className="text-xs text-primary-50 italic"
                            >
                                💡 {note}
                            </p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SummaryCard;
