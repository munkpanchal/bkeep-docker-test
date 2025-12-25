import { useState } from 'react';
import {
    FaCheckCircle,
    FaClock,
    FaComment,
    FaExclamationTriangle,
    FaFilter,
    FaSave,
    FaSearch,
    FaTimes,
} from 'react-icons/fa';
import Button from '../../components/typography/Button';
import {
    InputField,
    TextareaField,
} from '../../components/typography/InputFields';

type Transaction = {
    id: string;
    date: string;
    description: string;
    amount: number;
    suggestedCategory?: string;
    status: 'pending' | 'reviewed' | 'approved';
    clientComment?: string;
    aiConfidence?: number;
};

const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: '1',
        date: '2024-01-15',
        description: 'Payment to Vendor XYZ - Invoice #12345',
        amount: 1250.0,
        suggestedCategory: 'Office Supplies',
        status: 'pending',
        aiConfidence: 65,
    },
    {
        id: '2',
        date: '2024-01-18',
        description: 'Bank Transfer - Monthly Subscription',
        amount: 99.99,
        suggestedCategory: 'Software',
        status: 'pending',
        aiConfidence: 72,
    },
    {
        id: '3',
        date: '2024-01-20',
        description: 'Payment - Unclear Transaction',
        amount: 450.0,
        status: 'pending',
        aiConfidence: 45,
    },
    {
        id: '4',
        date: '2024-01-22',
        description: 'Refund from Client ABC',
        amount: -500.0,
        suggestedCategory: 'Refunds',
        status: 'reviewed',
        clientComment: 'This is a refund for overpayment',
        aiConfidence: 80,
    },
];

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
});

const ClientReviewpage = () => {
    const [transactions, setTransactions] =
        useState<Transaction[]>(MOCK_TRANSACTIONS);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedTransaction, setSelectedTransaction] =
        useState<Transaction | null>(null);
    const [comment, setComment] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const filteredTransactions = transactions.filter((transaction) => {
        const matchesSearch =
            transaction.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            transaction.suggestedCategory
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === 'all' || transaction.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const pendingCount = transactions.filter(
        (t) => t.status === 'pending'
    ).length;
    const reviewedCount = transactions.filter(
        (t) => t.status === 'reviewed'
    ).length;

    const handleReview = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setComment(transaction.clientComment || '');
        setSelectedCategory(transaction.suggestedCategory || '');
    };

    const handleSaveReview = () => {
        if (!selectedTransaction) return;

        const updatedTransactions = transactions.map((t) =>
            t.id === selectedTransaction.id
                ? {
                      ...t,
                      status: 'reviewed' as const,
                      clientComment: comment,
                      suggestedCategory:
                          selectedCategory || t.suggestedCategory,
                  }
                : t
        );
        setTransactions(updatedTransactions);
        setSelectedTransaction(null);
        setComment('');
        setSelectedCategory('');
    };

    const handleApprove = (transactionId: string) => {
        const updatedTransactions = transactions.map((t) =>
            t.id === transactionId ? { ...t, status: 'approved' as const } : t
        );
        setTransactions(updatedTransactions);
    };

    const getStatusIcon = (status: Transaction['status']) => {
        switch (status) {
            case 'approved':
                return <FaCheckCircle className="w-4 h-4 text-green-600" />;
            case 'reviewed':
                return <FaClock className="w-4 h-4 text-blue-600" />;
            case 'pending':
                return (
                    <FaExclamationTriangle className="w-4 h-4 text-orange-600" />
                );
        }
    };

    const getStatusColor = (status: Transaction['status']) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-700';
            case 'reviewed':
                return 'bg-blue-100 text-blue-700';
            case 'pending':
                return 'bg-orange-100 text-orange-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-primary">
                        Client Review
                    </h2>
                    <p className="text-sm text-primary-50 mt-1">
                        Review and categorize transactions that need your input
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2 shadow-sm border border-primary-10 p-4">
                    <div className="flex items-center gap-3">
                        <FaExclamationTriangle className="w-8 h-8 text-orange-600" />
                        <div>
                            <div className="text-sm text-primary-50">
                                Pending Review
                            </div>
                            <div className="text-2xl font-bold text-primary">
                                {pendingCount}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2 shadow-sm border border-primary-10 p-4">
                    <div className="flex items-center gap-3">
                        <FaClock className="w-8 h-8 text-blue-600" />
                        <div>
                            <div className="text-sm text-primary-50">
                                Reviewed
                            </div>
                            <div className="text-2xl font-bold text-primary">
                                {reviewedCount}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2 shadow-sm border border-primary-10 p-4">
                    <div className="flex items-center gap-3">
                        <FaCheckCircle className="w-8 h-8 text-green-600" />
                        <div>
                            <div className="text-sm text-primary-50">
                                Total Transactions
                            </div>
                            <div className="text-2xl font-bold text-primary">
                                {transactions.length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2 shadow-sm border border-primary-10 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <InputField
                                id="search-transactions"
                                placeholder="Search transactions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                icon={<FaSearch />}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaFilter className="text-primary-50" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-primary-10 rounded-2 text-sm text-primary focus:outline-none focus:border-primary"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="approved">Approved</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-2 shadow-sm border border-primary-10 overflow-hidden">
                <div className="divide-y divide-primary-10">
                    {filteredTransactions.length === 0 ? (
                        <div className="px-4 py-8 text-center text-primary-50">
                            No transactions found
                        </div>
                    ) : (
                        filteredTransactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="p-4 hover:bg-primary-5 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            {getStatusIcon(transaction.status)}
                                            <div className="flex-1">
                                                <div className="font-medium text-primary">
                                                    {transaction.description}
                                                </div>
                                                <div className="text-sm text-primary-50 mt-1">
                                                    {new Date(
                                                        transaction.date
                                                    ).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div
                                                    className={`font-semibold ${
                                                        transaction.amount < 0
                                                            ? 'text-red-600'
                                                            : 'text-green-600'
                                                    }`}
                                                >
                                                    {currencyFormatter.format(
                                                        transaction.amount
                                                    )}
                                                </div>
                                                {transaction.aiConfidence && (
                                                    <div className="text-xs text-primary-50">
                                                        AI Confidence:{' '}
                                                        {
                                                            transaction.aiConfidence
                                                        }
                                                        %
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {transaction.suggestedCategory && (
                                            <div className="mt-2">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-10 text-primary rounded-full text-xs font-medium">
                                                    Suggested:{' '}
                                                    {
                                                        transaction.suggestedCategory
                                                    }
                                                </span>
                                            </div>
                                        )}
                                        {transaction.clientComment && (
                                            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                                                <div className="flex items-start gap-2">
                                                    <FaComment className="w-4 h-4 text-blue-600 mt-0.5" />
                                                    <div className="text-sm text-blue-800">
                                                        {
                                                            transaction.clientComment
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                transaction.status
                                            )}`}
                                        >
                                            {transaction.status}
                                        </span>
                                        {transaction.status === 'pending' && (
                                            <Button
                                                onClick={() =>
                                                    handleReview(transaction)
                                                }
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-1"
                                            >
                                                <FaComment />
                                                Review
                                            </Button>
                                        )}
                                        {transaction.status === 'reviewed' && (
                                            <Button
                                                onClick={() =>
                                                    handleApprove(
                                                        transaction.id
                                                    )
                                                }
                                                variant="primary"
                                                size="sm"
                                                className="flex items-center gap-1"
                                            >
                                                <FaCheckCircle />
                                                Approve
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Review Modal */}
            {selectedTransaction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                    <div className="w-full max-w-2xl rounded-2 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-primary">
                                Review Transaction
                            </h3>
                            <button
                                onClick={() => {
                                    setSelectedTransaction(null);
                                    setComment('');
                                    setSelectedCategory('');
                                }}
                                className="text-primary-50 hover:text-primary"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-primary-10 rounded-2">
                                <div className="text-sm text-primary-50 mb-1">
                                    Transaction Details
                                </div>
                                <div className="font-medium text-primary">
                                    {selectedTransaction.description}
                                </div>
                                <div className="text-sm text-primary-75 mt-2">
                                    Date:{' '}
                                    {new Date(
                                        selectedTransaction.date
                                    ).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-primary-75">
                                    Amount:{' '}
                                    {currencyFormatter.format(
                                        selectedTransaction.amount
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-primary mb-2">
                                    Category
                                </label>
                                <InputField
                                    id="category"
                                    placeholder="Enter or select category"
                                    value={selectedCategory}
                                    onChange={(e) =>
                                        setSelectedCategory(e.target.value)
                                    }
                                />
                                {selectedTransaction.suggestedCategory && (
                                    <p className="text-xs text-primary-50 mt-1">
                                        AI Suggested:{' '}
                                        {selectedTransaction.suggestedCategory}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-primary mb-2">
                                    Your Comment
                                </label>
                                <TextareaField
                                    id="comment"
                                    placeholder="Add any notes or comments about this transaction..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={4}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        setSelectedTransaction(null);
                                        setComment('');
                                        setSelectedCategory('');
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveReview}
                                    variant="primary"
                                    className="flex-1 flex items-center justify-center gap-2"
                                >
                                    <FaSave />
                                    Save Review
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientReviewpage;
