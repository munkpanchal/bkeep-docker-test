import { useState } from 'react';
import {
    FaEdit,
    FaFilter,
    FaReceipt,
    FaSearch,
    FaTag,
    FaTrash,
} from 'react-icons/fa';
import Button from '../../components/typography/Button';
import { InputField } from '../../components/typography/InputFields';

type Expense = {
    id: string;
    date: string;
    vendor: string;
    category: string;
    amount: number;
    description: string;
    receipt?: string;
    paymentMethod: string;
};

const MOCK_EXPENSES: Expense[] = [
    {
        id: '1',
        date: '2024-01-15',
        vendor: 'Office Supplies Co',
        category: 'Office Supplies',
        amount: 250.5,
        description: 'Printer paper and pens',
        paymentMethod: 'Credit Card',
    },
    {
        id: '2',
        date: '2024-01-18',
        vendor: 'Cloud Services Inc',
        category: 'Software',
        amount: 99.99,
        description: 'Monthly subscription',
        paymentMethod: 'Bank Transfer',
    },
    {
        id: '3',
        date: '2024-01-20',
        vendor: 'Utility Company',
        category: 'Utilities',
        amount: 450.0,
        description: 'Electricity bill',
        paymentMethod: 'Bank Transfer',
    },
    {
        id: '4',
        date: '2024-01-22',
        vendor: 'Marketing Agency',
        category: 'Marketing',
        amount: 1500.0,
        description: 'Q1 Marketing campaign',
        paymentMethod: 'Check',
    },
];

const CATEGORIES = [
    'Office Supplies',
    'Software',
    'Utilities',
    'Marketing',
    'Travel',
    'Meals',
    'Rent',
    'Insurance',
    'Other',
];

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
});

const Expensespage = () => {
    const [expenses] = useState<Expense[]>(MOCK_EXPENSES);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const filteredExpenses = expenses.filter((expense) => {
        const matchesSearch =
            expense.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            expense.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        const matchesCategory =
            categoryFilter === 'all' || expense.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const totalAmount = filteredExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
    );

    const expensesByCategory = filteredExpenses.reduce(
        (acc, expense) => {
            acc[expense.category] =
                (acc[expense.category] || 0) + expense.amount;
            return acc;
        },
        {} as Record<string, number>
    );

    return (
        <div className="flex flex-col gap-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2 shadow-sm border border-primary-10 p-4">
                    <div className="text-sm text-primary-50 mb-1">
                        Total Expenses
                    </div>
                    <div className="text-2xl font-bold text-primary">
                        {currencyFormatter.format(totalAmount)}
                    </div>
                    <div className="text-xs text-primary-50 mt-1">
                        {filteredExpenses.length} expenses
                    </div>
                </div>
                {Object.entries(expensesByCategory)
                    .slice(0, 3)
                    .map(([category, amount]) => (
                        <div
                            key={category}
                            className="bg-white rounded-2 shadow-sm border border-primary-10 p-4"
                        >
                            <div className="text-sm text-primary-50 mb-1">
                                {category}
                            </div>
                            <div className="text-xl font-bold text-primary">
                                {currencyFormatter.format(amount)}
                            </div>
                        </div>
                    ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2 shadow-sm border border-primary-10 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-50 w-4 h-4" />
                            <InputField
                                id="search-expenses"
                                placeholder="Search expenses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaFilter className="text-primary-50" />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2 border border-primary-10 rounded-2 text-sm text-primary focus:outline-none focus:border-primary"
                        >
                            <option value="all">All Categories</option>
                            {CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Expenses Table */}
            <div className="bg-white rounded-2 shadow-sm border border-primary-10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-primary-10">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                                    Date
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                                    Vendor
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                                    Description
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-primary">
                                    Amount
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                                    Payment Method
                                </th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-primary w-32">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-8 text-center text-primary-50"
                                    >
                                        No expenses found
                                    </td>
                                </tr>
                            ) : (
                                filteredExpenses.map((expense) => (
                                    <tr
                                        key={expense.id}
                                        className="border-b border-primary-10 hover:bg-primary-5"
                                    >
                                        <td className="px-4 py-3 text-primary-75">
                                            {new Date(
                                                expense.date
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-primary">
                                                {expense.vendor}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-10 text-primary rounded-full text-xs font-medium">
                                                <FaTag className="w-3 h-3" />
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-primary-75">
                                            {expense.description}
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-primary">
                                            {currencyFormatter.format(
                                                expense.amount
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-primary-75">
                                            {expense.paymentMethod}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                {expense.receipt && (
                                                    <button
                                                        className="p-2 text-primary-50 hover:text-primary hover:bg-primary-10 rounded transition-colors"
                                                        title="View Receipt"
                                                    >
                                                        <FaReceipt className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    className="p-2 text-primary-50 hover:text-primary hover:bg-primary-10 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Expense Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                    <div className="w-full max-w-2xl rounded-2 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-primary">
                                Add New Expense
                            </h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-primary-50 hover:text-primary"
                            >
                                ×
                            </button>
                        </div>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    id="expense-date"
                                    label="Date"
                                    type="date"
                                    required
                                />
                                <InputField
                                    id="vendor"
                                    label="Vendor"
                                    placeholder="Enter vendor name"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        Category
                                    </label>
                                    <select className="w-full px-4 py-2 border border-primary-10 rounded-2 text-sm text-primary focus:outline-none focus:border-primary">
                                        {CATEGORIES.map((category) => (
                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <InputField
                                    id="amount"
                                    label="Amount"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <InputField
                                id="description"
                                label="Description"
                                placeholder="Enter description"
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium text-primary mb-2">
                                    Payment Method
                                </label>
                                <select className="w-full px-4 py-2 border border-primary-10 rounded-2 text-sm text-primary focus:outline-none focus:border-primary">
                                    <option>Credit Card</option>
                                    <option>Bank Transfer</option>
                                    <option>Check</option>
                                    <option>Cash</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="flex-1"
                                >
                                    Add Expense
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expensespage;
