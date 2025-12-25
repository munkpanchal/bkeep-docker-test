import { useEffect, useMemo, useRef, useState } from 'react';

import {
    FaChartPie,
    FaChevronDown,
    FaDownload,
    FaFileAlt,
    FaFileExcel,
    FaFileInvoiceDollar,
    FaFilter,
    FaMoneyBillWave,
    FaPercent,
    FaUserCheck,
} from 'react-icons/fa';

import toast from 'react-hot-toast';
import { FaArrowTrendUp } from 'react-icons/fa6';

import ChartWidget from '../../components/dashboard/ChartWidget';
import SummaryCard from '../../components/dashboard/SummaryCard';
import ExpensePieChart from '../../components/dashboard/charts/ExpensePieChart';
import ProfitabilityLineChart from '../../components/dashboard/charts/ProfitabilityLineChart';
import RevenueBarChart from '../../components/dashboard/charts/RevenueBarChart';
import IncomeStatementTable from '../../components/reports/IncomeStatementTable';
import {
    exportToCSV,
    exportToExcel,
    prepareReportData,
} from '../../utills/export';

type TimeRangeValue =
    | 'yearly'
    | 'halfYearly'
    | 'quarterly'
    | 'monthly'
    | 'fifteenDays'
    | 'weekly'
    | 'daily';

const TIME_RANGE_OPTIONS: { label: string; value: TimeRangeValue }[] = [
    { label: 'Yearly', value: 'yearly' },
    { label: 'Half-Yearly', value: 'halfYearly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Monthly', value: 'monthly' },
    { label: '15 Days', value: 'fifteenDays' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Daily', value: 'daily' },
];

const RANGE_CONFIG: Record<
    TimeRangeValue,
    { label: string; multiplier: number; trendPeriod: string }
> = {
    yearly: {
        label: '12 months',
        multiplier: 12,
        trendPeriod: 'last year',
    },
    halfYearly: {
        label: '6 months',
        multiplier: 6,
        trendPeriod: 'previous half-year',
    },
    quarterly: {
        label: '3 months',
        multiplier: 3,
        trendPeriod: 'previous quarter',
    },
    monthly: {
        label: '30 days',
        multiplier: 1,
        trendPeriod: 'previous month',
    },
    fifteenDays: {
        label: '15 days',
        multiplier: 0.5,
        trendPeriod: 'previous 15-day period',
    },
    weekly: {
        label: '7 days',
        multiplier: 0.25,
        trendPeriod: 'previous week',
    },
    daily: {
        label: '24 hours',
        multiplier: 1 / 30,
        trendPeriod: 'previous day',
    },
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
});

const baseMonthlyMetrics = {
    netProduction: 98200,
    totalCollections: 89300,
    adjustments: 13850,
    hygieneProduction: 32400,
    treatmentAcceptanceRate: 78,
    newPatients: 46,
    avgClaimCycle: 27,
    collectionRate: 93,
    arBalance: 48200,
};

const baseRevenueByProcedure = [
    { name: 'Restorative', revenue: 31200, percentage: 34 },
    { name: 'Cosmetic', revenue: 25850, percentage: 28 },
    { name: 'Preventive', revenue: 19800, percentage: 22 },
    { name: 'Surgical', revenue: 15600, percentage: 11 },
    { name: 'Orthodontic', revenue: 11250, percentage: 5 },
];

const baseExpenseBreakdown = [
    { category: 'Staffing', amount: 22400, percentage: 36 },
    { category: 'Lab Fees', amount: 16800, percentage: 27 },
    { category: 'Supplies', amount: 10300, percentage: 16 },
    { category: 'Marketing', amount: 6800, percentage: 11 },
    { category: 'Facility', amount: 4800, percentage: 10 },
];

const profitabilityTrendByRange: Record<
    TimeRangeValue,
    { month: string; profitMargin: number; target: number }[]
> = {
    yearly: [
        { month: '2020', profitMargin: 34, target: 38 },
        { month: '2021', profitMargin: 36, target: 38 },
        { month: '2022', profitMargin: 39, target: 39 },
        { month: '2023', profitMargin: 41, target: 40 },
        { month: '2024', profitMargin: 43, target: 41 },
    ],
    halfYearly: [
        { month: 'H1 2024', profitMargin: 40, target: 39 },
        { month: 'H2 2024', profitMargin: 42, target: 40 },
        { month: 'H1 2025', profitMargin: 44, target: 41 },
    ],
    quarterly: [
        { month: 'Q1 2025', profitMargin: 41, target: 40 },
        { month: 'Q2 2025', profitMargin: 42, target: 40 },
        { month: 'Q3 2025', profitMargin: 43, target: 41 },
        { month: 'Q4 2025', profitMargin: 45, target: 41 },
    ],
    monthly: [
        { month: 'Jun', profitMargin: 39, target: 40 },
        { month: 'Jul', profitMargin: 40, target: 40 },
        { month: 'Aug', profitMargin: 41, target: 40 },
        { month: 'Sep', profitMargin: 42, target: 41 },
        { month: 'Oct', profitMargin: 43, target: 41 },
        { month: 'Nov', profitMargin: 44, target: 41 },
    ],
    fifteenDays: [
        { month: 'Oct 1-15', profitMargin: 41, target: 40 },
        { month: 'Oct 16-31', profitMargin: 42, target: 41 },
        { month: 'Nov 1-15', profitMargin: 43, target: 41 },
        { month: 'Nov 16-30', profitMargin: 44, target: 41 },
    ],
    weekly: [
        { month: 'Week 41', profitMargin: 40, target: 40 },
        { month: 'Week 42', profitMargin: 41, target: 40 },
        { month: 'Week 43', profitMargin: 42, target: 41 },
        { month: 'Week 44', profitMargin: 43, target: 41 },
    ],
    daily: [
        { month: 'Mon', profitMargin: 39, target: 40 },
        { month: 'Tue', profitMargin: 41, target: 40 },
        { month: 'Wed', profitMargin: 44, target: 41 },
        { month: 'Thu', profitMargin: 42, target: 41 },
        { month: 'Fri', profitMargin: 43, target: 41 },
        { month: 'Sat', profitMargin: 40, target: 41 },
    ],
};

const baseAgingBuckets = [
    { bucket: '0-30 days', amount: 18600, percent: 48 },
    { bucket: '31-60 days', amount: 11200, percent: 29 },
    { bucket: '61-90 days', amount: 6200, percent: 16 },
    { bucket: '90+ days', amount: 2800, percent: 7 },
];

const baseTopPayers = [
    { payer: 'Sun Life', claims: 68, avgDays: 24, amount: 36200 },
    { payer: 'Blue Cross', claims: 54, avgDays: 29, amount: 28950 },
    { payer: 'Manulife', claims: 46, avgDays: 26, amount: 24400 },
    { payer: 'Great-West', claims: 33, avgDays: 32, amount: 19850 },
];

const claimCycleByRange: Record<TimeRangeValue, number> = {
    yearly: 26,
    halfYearly: 26,
    quarterly: 27,
    monthly: 27,
    fifteenDays: 28,
    weekly: 29,
    daily: 29,
};

const useReportData = (range: TimeRangeValue) => {
    return useMemo(() => {
        const { multiplier, label, trendPeriod } = RANGE_CONFIG[range];
        const scaledNetProduction = Math.round(
            baseMonthlyMetrics.netProduction * multiplier
        );
        const scaledCollections = Math.round(
            baseMonthlyMetrics.totalCollections * multiplier
        );
        const scaledAdjustments = Math.round(
            baseMonthlyMetrics.adjustments * multiplier
        );
        const scaledHygieneProduction = Math.round(
            baseMonthlyMetrics.hygieneProduction * multiplier
        );
        const scaledNewPatients = Math.max(
            1,
            Math.round(baseMonthlyMetrics.newPatients * multiplier)
        );

        const collectionEfficiency = [
            { label: 'Gross Production', value: scaledNetProduction },
            { label: 'Adjustments', value: -scaledAdjustments },
            {
                label: 'Net Production',
                value: scaledNetProduction - scaledAdjustments,
            },
            { label: 'Total Collections', value: scaledCollections },
        ];

        const revenueByProcedure = baseRevenueByProcedure.map((item) => ({
            ...item,
            revenue: Math.round(item.revenue * multiplier),
        }));

        const expenseBreakdown = baseExpenseBreakdown.map((item) => ({
            ...item,
            amount: Math.round(item.amount * multiplier),
        }));

        const agingMultiplier =
            range === 'yearly'
                ? 1.4
                : range === 'halfYearly'
                  ? 1.2
                  : range === 'quarterly'
                    ? 1.0
                    : range === 'monthly'
                      ? 0.9
                      : range === 'fifteenDays'
                        ? 0.75
                        : range === 'weekly'
                          ? 0.65
                          : 0.5;

        // test commit 2
        const agingBuckets = baseAgingBuckets.map((item) => ({
            ...item,
            amount: Math.round(item.amount * agingMultiplier),
        }));

        const topPayers = baseTopPayers.map((payer) => ({
            ...payer,
            amount: Math.round(payer.amount * multiplier),
            avgDays:
                range === 'daily'
                    ? payer.avgDays + 2
                    : range === 'weekly'
                      ? payer.avgDays + 1
                      : payer.avgDays,
        }));

        const profitabilityTrend = profitabilityTrendByRange[range];

        const aiHighlights = [
            `Collection rate is holding at ${baseMonthlyMetrics.collectionRate}% for the ${label} window — continue aggressive follow-ups within 24 hours.`,
            `Net production reached ${currencyFormatter.format(
                scaledNetProduction
            )} with hygiene contributing ${currencyFormatter.format(
                scaledHygieneProduction
            )}.`,
            `Average claim cycle is ${claimCycleByRange[range]} days, ${claimCycleByRange[range] <= 27 ? 'meeting' : 'slightly above'} the goal of 26 days.`,
            `Receivables over 60 days sit at ${compactCurrencyFormatter.format(
                agingBuckets
                    .filter((bucket) => bucket.bucket.includes('60'))
                    .reduce((total, bucket) => total + bucket.amount, 0)
            )} — prioritize Sun Life and Blue Cross claims.`,
        ];

        return {
            rangeLabel: label,
            trendPeriod,
            metrics: {
                netProduction: scaledNetProduction,
                totalCollections: scaledCollections,
                adjustments: scaledAdjustments,
                hygieneProduction: scaledHygieneProduction,
                newPatients: scaledNewPatients,
                collectionRate: baseMonthlyMetrics.collectionRate,
                treatmentAcceptanceRate:
                    baseMonthlyMetrics.treatmentAcceptanceRate,
                avgClaimCycle: claimCycleByRange[range],
                arBalance: baseMonthlyMetrics.arBalance,
            },
            revenueByProcedure,
            expenseBreakdown,
            collectionEfficiency,
            profitabilityTrend,
            agingBuckets,
            topPayers,
            aiHighlights,
        };
    }, [range]);
};

const Reportpage = () => {
    const [selectedRange, setSelectedRange] =
        useState<TimeRangeValue>('monthly');
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [selectedReportType, setSelectedReportType] = useState<
        'income' | 'balance'
    >('income');
    const exportMenuRef = useRef<HTMLDivElement>(null);
    const filterMenuRef = useRef<HTMLDivElement>(null);
    const data = useReportData(selectedRange);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                exportMenuRef.current &&
                !exportMenuRef.current.contains(event.target as Node)
            ) {
                setIsExportMenuOpen(false);
            }
            if (
                filterMenuRef.current &&
                !filterMenuRef.current.contains(event.target as Node)
            ) {
                setIsFilterMenuOpen(false);
            }
        };

        if (isExportMenuOpen || isFilterMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isExportMenuOpen, isFilterMenuOpen]);

    const handleExportExcel = () => {
        try {
            const exportData = prepareReportData(data);
            const filename = `report-${selectedRange}-${new Date().toISOString().split('T')[0]}`;
            const businessName = 'BKeep Accounting';
            const period = `${TIME_RANGE_OPTIONS.find((opt) => opt.value === selectedRange)?.label} [${new Date().toISOString().split('T')[0]}]`;
            exportToExcel(
                exportData,
                filename,
                'Financial Report',
                undefined,
                businessName,
                period
            );
            toast.success('Report exported to Excel successfully!');
            setIsExportMenuOpen(false);
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export report to Excel');
        }
    };

    const handleExportCSV = () => {
        try {
            const exportData = prepareReportData(data);
            const filename = `report-${selectedRange}-${new Date().toISOString().split('T')[0]}`;
            exportToCSV(exportData, filename);
            toast.success('Report exported to CSV successfully!');
            setIsExportMenuOpen(false);
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export report to CSV');
        }
    };

    return (
        <div className="space-y-6">
            {/* Filters and Controls Section */}
            <div className="bg-white border border-primary-10 rounded-2 p-6 shadow-sm">
                <div className="space-y-4">
                    {/* Time Range Selector */}
                    <div>
                        <label className="block text-sm font-semibold text-primary mb-3">
                            Time Range
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {TIME_RANGE_OPTIONS.map((option) => {
                                const isActive = option.value === selectedRange;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() =>
                                            setSelectedRange(option.value)
                                        }
                                        className={`px-4 py-2.5 text-sm font-semibold rounded-2 transition-all duration-200 ${
                                            isActive
                                                ? 'bg-primary text-white shadow-md scale-105'
                                                : 'bg-primary-10 text-primary hover:bg-primary-25 hover:scale-105'
                                        }`}
                                        aria-pressed={isActive}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-primary-50 mt-3 ml-1">
                            Showing insights for the last {data.rangeLabel}.
                            Trends are compared against the {data.trendPeriod}.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-primary-10">
                        {/* Advanced Filters Dropdown */}
                        <div className="relative" ref={filterMenuRef}>
                            <button
                                onClick={() =>
                                    setIsFilterMenuOpen(!isFilterMenuOpen)
                                }
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-primary bg-white border-2 border-primary-10 rounded-2 hover:border-primary hover:bg-primary-10 hover:shadow-sm transition-all duration-200"
                                type="button"
                            >
                                <FaFilter className="text-primary" />
                                {selectedReportType === 'income'
                                    ? 'Income Statement'
                                    : 'Balance Sheet'}
                                <FaChevronDown
                                    className={`w-3 h-3 transition-transform duration-200 ${
                                        isFilterMenuOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            {isFilterMenuOpen && (
                                <div className="absolute left-0 mt-2 w-56 bg-white rounded-2 shadow-lg border border-primary-10 py-2 z-50 dropdown-animate">
                                    <button
                                        onClick={() => {
                                            setSelectedReportType('income');
                                            setIsFilterMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                            selectedReportType === 'income'
                                                ? 'bg-primary-10 text-primary font-semibold'
                                                : 'text-primary-75 hover:bg-primary-10 hover:text-primary'
                                        }`}
                                        type="button"
                                    >
                                        <FaFileAlt className="w-4 h-4" />
                                        <span>Income Statement</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedReportType('balance');
                                            setIsFilterMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                            selectedReportType === 'balance'
                                                ? 'bg-primary-10 text-primary font-semibold'
                                                : 'text-primary-75 hover:bg-primary-10 hover:text-primary'
                                        }`}
                                        type="button"
                                    >
                                        <FaChartPie className="w-4 h-4" />
                                        <span>Balance Sheet</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Export Dropdown */}
                        <div className="relative" ref={exportMenuRef}>
                            <button
                                onClick={() =>
                                    setIsExportMenuOpen(!isExportMenuOpen)
                                }
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-2 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-primary/90"
                                type="button"
                            >
                                <FaDownload />
                                Export Report
                                <FaChevronDown
                                    className={`w-3 h-3 transition-transform duration-200 ${
                                        isExportMenuOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            {isExportMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2 shadow-lg border border-primary-10 py-2 z-50 dropdown-animate">
                                    <button
                                        onClick={handleExportExcel}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary-75 hover:bg-primary-10 hover:text-primary transition-colors"
                                        type="button"
                                    >
                                        <FaFileExcel className="w-4 h-4 text-green-600" />
                                        <span>Export to Excel</span>
                                    </button>
                                    <button
                                        onClick={handleExportCSV}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary-75 hover:bg-primary-10 hover:text-primary transition-colors"
                                        type="button"
                                    >
                                        <FaFileAlt className="w-4 h-4 text-blue-600" />
                                        <span>Export to CSV</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <SummaryCard
                    title="Net Production"
                    value={currencyFormatter.format(data.metrics.netProduction)}
                    trend={{
                        value: 6,
                        direction: 'up',
                        period: data.trendPeriod,
                    }}
                    breakdown={[
                        {
                            label: 'Doctor Production',
                            value: currencyFormatter.format(
                                data.metrics.netProduction -
                                    data.metrics.hygieneProduction
                            ),
                        },
                        {
                            label: 'Hygiene Production',
                            value: currencyFormatter.format(
                                data.metrics.hygieneProduction
                            ),
                        },
                    ]}
                    aiNotes={[
                        `Treatment acceptance rate is ${data.metrics.treatmentAcceptanceRate}% for the selected period.`,
                    ]}
                    icon={<FaMoneyBillWave />}
                />
                <SummaryCard
                    title="Total Collections"
                    value={currencyFormatter.format(
                        data.metrics.totalCollections
                    )}
                    trend={{
                        value: 4,
                        direction: 'up',
                        period: data.trendPeriod,
                    }}
                    breakdown={[
                        {
                            label: 'Insurance',
                            value: currencyFormatter.format(
                                Math.round(data.metrics.totalCollections * 0.7)
                            ),
                        },
                        {
                            label: 'Patient',
                            value: currencyFormatter.format(
                                Math.round(data.metrics.totalCollections * 0.22)
                            ),
                        },
                        {
                            label: 'Membership',
                            value: currencyFormatter.format(
                                Math.round(data.metrics.totalCollections * 0.08)
                            ),
                        },
                    ]}
                    icon={<FaFileInvoiceDollar />}
                    aiNotes={[
                        `Average claim cycle is ${data.metrics.avgClaimCycle} days.`,
                    ]}
                />
                <SummaryCard
                    title="Collection Rate"
                    value={`${data.metrics.collectionRate}%`}
                    trend={{
                        value: 2,
                        direction: 'up',
                        period: data.trendPeriod,
                    }}
                    breakdown={[
                        {
                            label: 'Net Production',
                            value: currencyFormatter.format(
                                data.metrics.netProduction -
                                    data.metrics.adjustments
                            ),
                        },
                        {
                            label: 'Write-offs',
                            value: currencyFormatter.format(
                                data.metrics.adjustments
                            ),
                        },
                    ]}
                    icon={<FaPercent />}
                    aiNotes={[
                        'Maintain same-day verification to protect the rate.',
                    ]}
                />
                <SummaryCard
                    title="New Patients"
                    value={numberFormatter.format(data.metrics.newPatients)}
                    trend={{
                        value: 5,
                        direction: 'up',
                        period: data.trendPeriod,
                    }}
                    breakdown={[
                        {
                            label: 'Accepted Plans',
                            value: numberFormatter.format(
                                Math.round(data.metrics.newPatients * 0.64)
                            ),
                        },
                        {
                            label: 'Pending Follow-ups',
                            value: numberFormatter.format(
                                Math.max(
                                    1,
                                    Math.round(data.metrics.newPatients * 0.18)
                                )
                            ),
                        },
                    ]}
                    icon={<FaUserCheck />}
                    aiNotes={['Promote whitening bundles to boost acceptance.']}
                />
            </div>

            {/* Charts and Analytics Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    <ChartWidget
                        title="Revenue Mix"
                        subtitle={`Distribution across procedure types (${data.rangeLabel})`}
                        aiInsight="Cosmetic revenue is edging higher — consider spotlight campaigns to sustain momentum."
                    >
                        <RevenueBarChart data={data.revenueByProcedure} />
                    </ChartWidget>

                    <ChartWidget
                        title="Expense Breakdown"
                        subtitle={`Operating expenses (${data.rangeLabel})`}
                        aiInsight="Staffing and lab fees remain the largest cost centers — audit overtime and lab remakes weekly."
                    >
                        <ExpensePieChart data={data.expenseBreakdown} />
                    </ChartWidget>

                    <ChartWidget
                        title="Collections vs Adjustments"
                        subtitle={`Understanding net production (${data.rangeLabel})`}
                        aiInsight="Keep write-offs under 10% of gross production by auditing membership plan discounts."
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {data.collectionEfficiency.map((item) => (
                                <div
                                    key={item.label}
                                    className="bg-primary-10 rounded-2 px-4 py-3 border border-primary-10"
                                >
                                    <p className="text-xs font-semibold uppercase text-primary-50">
                                        {item.label}
                                    </p>
                                    <p className="mt-2 text-lg font-bold text-primary">
                                        {currencyFormatter.format(item.value)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </ChartWidget>

                    <ChartWidget
                        title="Profitability Trend"
                        subtitle="Profit margin vs target"
                        aiInsight="Profitability is consistently above target with a widening spread in the last period."
                    >
                        <ProfitabilityLineChart
                            data={data.profitabilityTrend}
                        />
                    </ChartWidget>
                </div>

                <div className="space-y-6">
                    <ChartWidget
                        title="Receivables Aging"
                        subtitle="Current outstanding A/R"
                        actions={
                            <span className="px-3 py-1 text-xs font-semibold text-primary bg-primary-10 rounded-full">
                                Balance{' '}
                                {currencyFormatter.format(
                                    data.metrics.arBalance
                                )}
                            </span>
                        }
                    >
                        <div className="space-y-4">
                            {data.agingBuckets.map((bucket) => (
                                <div key={bucket.bucket}>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-primary">
                                            {bucket.bucket}
                                        </p>
                                        <span className="text-sm font-medium text-primary">
                                            {currencyFormatter.format(
                                                bucket.amount
                                            )}
                                        </span>
                                    </div>
                                    <div className="mt-2 h-2 rounded-full bg-primary-10">
                                        <div
                                            className="h-full rounded-full bg-primary"
                                            style={{
                                                width: `${bucket.percent}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ChartWidget>

                    <ChartWidget
                        title="Top Insurance Payers"
                        subtitle="By total reimbursements"
                    >
                        <div className="space-y-4">
                            {data.topPayers.map((payer) => (
                                <div
                                    key={payer.payer}
                                    className="flex items-center justify-between"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-primary">
                                            {payer.payer}
                                        </p>
                                        <p className="text-xs text-primary-50">
                                            {payer.claims} claims · Avg{' '}
                                            {payer.avgDays} days
                                        </p>
                                    </div>
                                    <span className="text-sm font-semibold text-primary">
                                        {currencyFormatter.format(payer.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </ChartWidget>

                    <div className="bg-white border border-primary-10 rounded-2 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <FaChartPie className="text-primary" />
                            <h3 className="text-lg font-semibold text-primary">
                                Highlights & Actions
                            </h3>
                        </div>
                        <ul className="space-y-3">
                            {data.aiHighlights.map((highlight, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-2 text-sm text-primary-75"
                                >
                                    <FaArrowTrendUp className="text-primary mt-1 shrink-0" />
                                    <span>{highlight}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="w-full px-4 py-2 text-sm font-semibold text-primary bg-primary-10 rounded-2 hover:bg-primary-25 transition"
                            >
                                Schedule Report Email
                            </button>
                            <button
                                type="button"
                                className="w-full px-4 py-2 text-sm font-semibold text-white bg-primary rounded-2 hover:shadow-md transition"
                            >
                                Share with Partners
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Income Statement Table - Only show when Income Statement is selected */}
            {selectedReportType === 'income' && (
                <div className="mt-6">
                    <IncomeStatementTable />
                </div>
            )}
        </div>
    );
};

export default Reportpage;
