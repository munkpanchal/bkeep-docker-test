import { useState } from 'react';
import { FaFilter, FaSearch } from 'react-icons/fa';
import { useTransactions } from '../../services/apis/transactions';
import TransactionTableItem from './TransactionTableItem';

const TransactionsTable = () => {
    const { data, isLoading, isError, error } = useTransactions();
    const [searchTerm, setSearchTerm] = useState('');

    if (isLoading) {
        return (
            <div className="bg-white rounded-2 shadow-sm border border-primary-10 p-12">
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-25 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-sm text-primary-50">
                        Loading transactions...
                    </p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                <p className="text-sm text-red-700 font-medium">
                    Error: {error?.message || 'Failed to load transactions'}
                </p>
            </div>
        );
    }

    const filteredTransactions = data?.filter((transaction) => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        const firstSplit = transaction.splits?.[0];
        const description =
            firstSplit?.senderDescription?.toLowerCase() ||
            firstSplit?.recipientDescription?.toLowerCase() ||
            '';
        const categoryName =
            firstSplit?.categoryAndGifi?.[0]?.displayLabel?.toLowerCase() ||
            firstSplit?.categoryAndGifi?.[0]?.name?.toLowerCase() ||
            '';
        const itemType = transaction.itemType?.toLowerCase() || '';

        return (
            description.includes(searchLower) ||
            categoryName.includes(searchLower) ||
            itemType.includes(searchLower) ||
            transaction.totalAmount?.includes(searchLower)
        );
    });

    return (
        <div className="bg-white max-h-[calc(100vh-100px)] rounded-2 shadow-sm border border-primary-10 overflow-y-auto">
            {/* Table Header with Search */}
            <div className="p-4 border-b border-primary-10 sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-50 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-primary-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-25 focus:border-primary text-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-primary-10 rounded-lg hover:bg-primary-10 transition-colors text-sm font-medium text-primary">
                        <FaFilter className="w-4 h-4" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-primary-10">
                        <tr>
                            <th className="transaction-table-header">Date</th>
                            <th className="transaction-table-header">
                                Description
                            </th>
                            <th className="transaction-table-header">Type</th>
                            <th className="transaction-table-header">Amount</th>
                            <th className="transaction-table-header">
                                Balance
                            </th>
                            <th className="transaction-table-header">Tags</th>
                            <th className="transaction-table-header">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-10">
                        {filteredTransactions &&
                        filteredTransactions.length > 0 ? (
                            filteredTransactions.map((transaction) => (
                                <TransactionTableItem
                                    key={transaction.id}
                                    transaction={transaction}
                                />
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="text-center py-12 text-primary-50"
                                >
                                    {searchTerm
                                        ? 'No transactions found matching your search'
                                        : 'No transactions available'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Table Footer */}
            {filteredTransactions && filteredTransactions.length > 0 && (
                <div className="p-4 border-t border-primary-10 bg-primary-10">
                    <div className="flex items-center justify-between text-sm text-primary-75">
                        <span>
                            Showing {filteredTransactions.length} of{' '}
                            {data?.length || 0} transactions
                        </span>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1 rounded hover:bg-primary-25 transition-colors">
                                Previous
                            </button>
                            <button className="px-3 py-1 rounded hover:bg-primary-25 transition-colors">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionsTable;
