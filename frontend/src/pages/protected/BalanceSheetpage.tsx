import { useState } from 'react';
import {
    FaBuilding,
    FaDownload,
    FaFileInvoiceDollar,
    FaPiggyBank,
} from 'react-icons/fa';
import SummaryCard from '../../components/dashboard/SummaryCard';

const BalanceSheetpage = () => {
    const [dateRange, setDateRange] = useState('monthly');
    const [asOfDate, setAsOfDate] = useState('');

    // Mock data - replace with API calls
    const assets = {
        current: [
            { name: 'Cash and Cash Equivalents', amount: 45000 },
            { name: 'Accounts Receivable', amount: 35000 },
            { name: 'Inventory', amount: 15000 },
            { name: 'Prepaid Expenses', amount: 5000 },
        ],
        fixed: [
            { name: 'Property, Plant & Equipment', amount: 120000 },
            { name: 'Accumulated Depreciation', amount: -30000 },
            { name: 'Intangible Assets', amount: 25000 },
        ],
    };

    const liabilities = {
        current: [
            { name: 'Accounts Payable', amount: 20000 },
            { name: 'Short-term Debt', amount: 15000 },
            { name: 'Accrued Expenses', amount: 8000 },
        ],
        longTerm: [
            { name: 'Long-term Debt', amount: 50000 },
            { name: 'Deferred Tax Liabilities', amount: 5000 },
        ],
    };

    const equity = [
        { name: 'Common Stock', amount: 100000 },
        { name: 'Retained Earnings', amount: 50000 },
        { name: 'Other Equity', amount: 10000 },
    ];

    const totalAssets =
        assets.current.reduce((sum, item) => sum + item.amount, 0) +
        assets.fixed.reduce((sum, item) => sum + item.amount, 0);
    const totalLiabilities =
        liabilities.current.reduce((sum, item) => sum + item.amount, 0) +
        liabilities.longTerm.reduce((sum, item) => sum + item.amount, 0);
    const totalEquity = equity.reduce((sum, item) => sum + item.amount, 0);

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-primary">
                        Balance Sheet
                    </h2>
                    <p className="text-sm text-primary-50 mt-1">
                        View your assets, liabilities, and equity
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

            {/* Date Selector */}
            <div className="bg-white rounded-2 shadow-sm border border-primary-10 p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-primary mb-2">
                            As of Date
                        </label>
                        <input
                            type="date"
                            value={asOfDate}
                            onChange={(e) => setAsOfDate(e.target.value)}
                            className="w-full px-4 py-2 border border-primary-10 rounded-2 text-sm text-primary focus:outline-none focus:border-primary"
                        />
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
                    title="Total Assets"
                    value={currencyFormatter.format(totalAssets)}
                    icon={<FaBuilding />}
                />
                <SummaryCard
                    title="Total Liabilities"
                    value={currencyFormatter.format(totalLiabilities)}
                    icon={<FaFileInvoiceDollar />}
                />
                <SummaryCard
                    title="Total Equity"
                    value={currencyFormatter.format(totalEquity)}
                    icon={<FaPiggyBank />}
                />
            </div>

            {/* Balance Sheet Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Assets */}
                <div className="bg-white rounded-2 shadow-sm border border-primary-10 p-6">
                    <h3 className="text-lg font-semibold text-primary mb-4">
                        Assets
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary mb-2">
                                Current Assets
                            </h4>
                            <div className="space-y-2">
                                {assets.current.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center py-2 border-b border-primary-10"
                                    >
                                        <span className="text-primary-75">
                                            {item.name}
                                        </span>
                                        <span className="font-medium text-primary">
                                            {currencyFormatter.format(
                                                item.amount
                                            )}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center py-2 font-semibold text-primary border-t-2 border-primary">
                                    <span>Total Current Assets</span>
                                    <span>
                                        {currencyFormatter.format(
                                            assets.current.reduce(
                                                (sum, item) =>
                                                    sum + item.amount,
                                                0
                                            )
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-primary mb-2">
                                Fixed Assets
                            </h4>
                            <div className="space-y-2">
                                {assets.fixed.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center py-2 border-b border-primary-10"
                                    >
                                        <span className="text-primary-75">
                                            {item.name}
                                        </span>
                                        <span className="font-medium text-primary">
                                            {currencyFormatter.format(
                                                item.amount
                                            )}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center py-2 font-semibold text-primary border-t-2 border-primary">
                                    <span>Total Fixed Assets</span>
                                    <span>
                                        {currencyFormatter.format(
                                            assets.fixed.reduce(
                                                (sum, item) =>
                                                    sum + item.amount,
                                                0
                                            )
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center py-3 font-bold text-lg text-primary border-t-2 border-primary mt-4">
                            <span>Total Assets</span>
                            <span>{currencyFormatter.format(totalAssets)}</span>
                        </div>
                    </div>
                </div>

                {/* Liabilities & Equity */}
                <div className="bg-white rounded-2 shadow-sm border border-primary-10 p-6">
                    <h3 className="text-lg font-semibold text-primary mb-4">
                        Liabilities & Equity
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary mb-2">
                                Current Liabilities
                            </h4>
                            <div className="space-y-2">
                                {liabilities.current.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center py-2 border-b border-primary-10"
                                    >
                                        <span className="text-primary-75">
                                            {item.name}
                                        </span>
                                        <span className="font-medium text-primary">
                                            {currencyFormatter.format(
                                                item.amount
                                            )}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center py-2 font-semibold text-primary border-t-2 border-primary">
                                    <span>Total Current Liabilities</span>
                                    <span>
                                        {currencyFormatter.format(
                                            liabilities.current.reduce(
                                                (sum, item) =>
                                                    sum + item.amount,
                                                0
                                            )
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-primary mb-2">
                                Long-term Liabilities
                            </h4>
                            <div className="space-y-2">
                                {liabilities.longTerm.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center py-2 border-b border-primary-10"
                                    >
                                        <span className="text-primary-75">
                                            {item.name}
                                        </span>
                                        <span className="font-medium text-primary">
                                            {currencyFormatter.format(
                                                item.amount
                                            )}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center py-2 font-semibold text-primary border-t-2 border-primary">
                                    <span>Total Long-term Liabilities</span>
                                    <span>
                                        {currencyFormatter.format(
                                            liabilities.longTerm.reduce(
                                                (sum, item) =>
                                                    sum + item.amount,
                                                0
                                            )
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-primary mb-2">
                                Equity
                            </h4>
                            <div className="space-y-2">
                                {equity.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center py-2 border-b border-primary-10"
                                    >
                                        <span className="text-primary-75">
                                            {item.name}
                                        </span>
                                        <span className="font-medium text-primary">
                                            {currencyFormatter.format(
                                                item.amount
                                            )}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center py-2 font-semibold text-primary border-t-2 border-primary">
                                    <span>Total Equity</span>
                                    <span>
                                        {currencyFormatter.format(totalEquity)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center py-3 font-bold text-lg text-primary border-t-2 border-primary mt-4">
                            <span>Total Liabilities & Equity</span>
                            <span>
                                {currencyFormatter.format(
                                    totalLiabilities + totalEquity
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BalanceSheetpage;
