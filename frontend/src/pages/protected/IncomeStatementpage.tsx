import { useState } from 'react';
import {
    FaChartLine,
    FaDownload,
    FaMoneyBillWave,
    FaPercent,
} from 'react-icons/fa';
import ExpensePieChart from '../../components/dashboard/charts/ExpensePieChart';
import ProfitabilityLineChart from '../../components/dashboard/charts/ProfitabilityLineChart';
import RevenueBarChart from '../../components/dashboard/charts/RevenueBarChart';
import ChartWidget from '../../components/dashboard/ChartWidget';
import SummaryCard from '../../components/dashboard/SummaryCard';
import IncomeStatementTable from '../../components/reports/IncomeStatementTable';

const IncomeStatementpage = () => {
    const [dateRange, setDateRange] = useState('monthly');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Mock data - replace with API calls
    const revenueData = [
        { name: 'Service Revenue', revenue: 120000, percentage: 60 },
        { name: 'Product Sales', revenue: 50000, percentage: 25 },
        { name: 'Other Income', revenue: 30000, percentage: 15 },
    ];

    const expenseData = [
        { category: 'Salaries', amount: 53000, percentage: 35 },
        { category: 'Rent', amount: 12000, percentage: 20 },
        { category: 'Utilities', amount: 5000, percentage: 15 },
        { category: 'Marketing', amount: 8000, percentage: 13 },
        { category: 'Other', amount: 12000, percentage: 17 },
    ];

    const profitabilityData = [
        { month: 'Jan', profitMargin: 38, target: 40 },
        { month: 'Feb', profitMargin: 40, target: 40 },
        { month: 'Mar', profitMargin: 39, target: 40 },
        { month: 'Apr', profitMargin: 41, target: 40 },
        { month: 'May', profitMargin: 42, target: 40 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-primary">
                        Income Statement
                    </h2>
                    <p className="text-sm text-primary-50 mt-1">
                        View your revenue, expenses, and net income
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-white border-2 border-primary-10 rounded-2 hover:border-primary hover:bg-primary-10 transition-all">
                            <FaDownload />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Date Range Selector */}
            <div className="bg-white rounded-2 shadow-sm border border-primary-10 p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-primary mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2 border border-primary-10 rounded-2 text-sm text-primary focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-primary mb-2">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-2 border border-primary-10 rounded-2 text-sm text-primary focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {['Monthly', 'Quarterly', 'Yearly'].map((range) => (
                            <button
                                key={range}
                                onClick={() =>
                                    setDateRange(range.toLowerCase())
                                }
                                className={`px-4 py-2 text-sm font-medium rounded-2 transition-all ${
                                    dateRange === range.toLowerCase()
                                        ? 'bg-primary text-white'
                                        : 'bg-primary-10 text-primary hover:bg-primary-25'
                                }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard
                    title="Total Revenue"
                    value="$200,000"
                    trend={{ value: 8, direction: 'up', period: 'last month' }}
                    icon={<FaMoneyBillWave />}
                />
                <SummaryCard
                    title="Total Expenses"
                    value="$90,000"
                    trend={{ value: 5, direction: 'up', period: 'last month' }}
                    icon={<FaChartLine />}
                />
                <SummaryCard
                    title="Net Income"
                    value="$110,000"
                    trend={{ value: 12, direction: 'up', period: 'last month' }}
                    icon={<FaPercent />}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ChartWidget
                    title="Revenue Breakdown"
                    subtitle="Revenue by category"
                >
                    <RevenueBarChart data={revenueData} />
                </ChartWidget>
                <ChartWidget
                    title="Expense Breakdown"
                    subtitle="Expenses by category"
                >
                    <ExpensePieChart data={expenseData} />
                </ChartWidget>
            </div>

            <ChartWidget
                title="Profitability Trend"
                subtitle="Net profit margin over time"
            >
                <ProfitabilityLineChart data={profitabilityData} />
            </ChartWidget>

            {/* Income Statement Table */}
            <div className="bg-white rounded-2 shadow-sm border border-primary-10 p-6">
                <h3 className="text-lg font-semibold text-primary mb-4">
                    Detailed Income Statement
                </h3>
                <IncomeStatementTable />
            </div>
        </div>
    );
};

export default IncomeStatementpage;
