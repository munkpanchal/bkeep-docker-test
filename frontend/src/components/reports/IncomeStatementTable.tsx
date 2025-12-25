import { Fragment, useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import {
    incomeStatementPeriods,
    IncomeStatementSection,
    incomeStatementSections,
} from '../../constants/incomeStatementData';

const IncomeStatementTable = () => {
    const [expandedSections, setExpandedSections] = useState<{
        [key: string]: boolean;
    }>(() => {
        const initialState: { [key: string]: boolean } = {};
        incomeStatementSections.forEach((section) => {
            if (section.collapsible) {
                initialState[section.id] = true;
            }
        });
        return initialState;
    });

    const toggleSection = (sectionId: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    };

    const formatNumber = (num: number) => {
        return num.toLocaleString();
    };

    const renderSectionRow = (section: IncomeStatementSection) => {
        const isExpanded = expandedSections[section.id];
        const { type, label, totalValues, collapsible } = section;

        let rowClasses = 'border-b border-gray-200';
        let cellClasses =
            'py-3 px-4 font-semibold text-primary sticky left-0 bg-white';
        let valueCellClasses = 'text-right py-3 px-4 font-semibold';

        if (type === 'calculated') {
            rowClasses = 'border-b border-gray-300 bg-gray-50';
            cellClasses =
                'py-3 px-4 font-bold text-primary sticky left-0 bg-gray-50';
            valueCellClasses = 'text-right py-3 px-4 font-bold';
        } else if (type === 'final') {
            rowClasses = 'border-t-2 border-primary bg-primary-10';
            cellClasses =
                'py-4 px-4 font-bold text-primary text-base sticky left-0 bg-primary-10';
            valueCellClasses =
                'text-right py-4 px-4 font-bold text-base text-green-600';
        } else {
            rowClasses += ' hover:bg-gray-50';
            cellClasses += ' hover:bg-gray-50';
        }

        if (collapsible) {
            rowClasses += ' cursor-pointer';
        }

        return (
            <tr
                key={section.id}
                className={rowClasses}
                onClick={
                    collapsible ? () => toggleSection(section.id) : undefined
                }
            >
                <td className={cellClasses}>
                    {collapsible ? (
                        <div className="flex items-center gap-2">
                            {isExpanded ? (
                                <FaChevronDown className="text-xs" />
                            ) : (
                                <FaChevronRight className="text-xs" />
                            )}
                            {label}
                        </div>
                    ) : (
                        label
                    )}
                </td>
                {totalValues.map((value, index) => (
                    <td
                        key={`value-${index}`}
                        className={`${valueCellClasses} min-w-[150px]`}
                    >
                        {formatNumber(value)}
                    </td>
                ))}
            </tr>
        );
    };

    const renderLineItems = (section: IncomeStatementSection) => {
        if (
            !section.collapsible ||
            !expandedSections[section.id] ||
            !section.items ||
            section.items.length === 0
        ) {
            return null;
        }

        return section.items.map((item, itemIndex) => (
            <tr
                key={`${section.id}-item-${itemIndex}`}
                className="border-b border-gray-100 hover:bg-gray-50"
            >
                <td className="py-2 px-4 pl-8 text-black sticky left-0 bg-white hover:bg-gray-50">
                    {item.code && (
                        <span className="text-xs text-gray-400 mr-2">
                            {item.code}
                        </span>
                    )}
                    {item.label}
                </td>
                {item.values.map((value, valueIndex) => (
                    <td
                        key={`item-value-${valueIndex}`}
                        className="text-right py-2 px-4 min-w-[150px]"
                    >
                        {formatNumber(value)}
                    </td>
                ))}
            </tr>
        ));
    };

    return (
        <div className="bg-white rounded-lg border border-primary-10 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-primary sticky left-0 bg-gray-50 z-10">
                                Income statement
                            </th>
                            {incomeStatementPeriods.map((period, index) => (
                                <th
                                    key={`period-${index}`}
                                    className="text-right py-3 px-4 font-semibold text-primary min-w-[150px]"
                                >
                                    {period.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {incomeStatementSections.map((section) => (
                            <Fragment key={section.id}>
                                {renderSectionRow(section)}
                                {renderLineItems(section)}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IncomeStatementTable;
