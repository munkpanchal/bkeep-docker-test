import React from 'react';

type ChartWidgetProps = {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    aiInsight?: string;
    actions?: React.ReactNode;
};

const ChartWidget = ({
    title,
    subtitle,
    children,
    aiInsight,
    actions,
}: ChartWidgetProps) => {
    return (
        <div className="inner-section">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-primary mb-1">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-xs text-primary-50">{subtitle}</p>
                    )}
                </div>
                {actions && <div>{actions}</div>}
            </div>

            <div className="mb-4">{children}</div>

            {aiInsight && (
                <div className="pt-4 border-t border-primary-10">
                    <p className="text-xs text-primary-50 italic">
                        💡 {aiInsight}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ChartWidget;
