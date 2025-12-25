import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { TransactionType2 } from '../../types';

type TransactionTableItemProps = {
    transaction: TransactionType2;
};

const TransactionTableItem = ({ transaction }: TransactionTableItemProps) => {
    // Get the first split for display purposes
    const firstSplit = transaction.splits?.[0];
    const amount = parseFloat(transaction.totalAmount || '0');
    const isCredit = amount >= 0;

    const formattedDate = new Date(
        transaction.latestPostedDate || transaction.createdAt
    ).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: transaction.currency?.toUpperCase() || 'USD',
    }).format(Math.abs(amount));

    const description =
        firstSplit?.senderDescription ||
        firstSplit?.recipientDescription ||
        transaction.itemType ||
        'N/A';

    return (
        <tr className="transaction-table-row">
            <td className="transaction-table-cell">
                <div className="flex items-center gap-2">
                    <div
                        className={`w-2 h-2 rounded-full ${
                            isCredit ? 'bg-green-500' : 'bg-red-500'
                        }`}
                    ></div>
                    <span className="text-sm font-medium text-primary">
                        {formattedDate}
                    </span>
                </div>
            </td>
            <td className="transaction-table-cell">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-primary">
                        {description}
                    </span>
                    {firstSplit?.categoryAndGifi?.[0]?.displayLabel && (
                        <span className="text-xs text-primary-50">
                            {firstSplit.categoryAndGifi[0].displayLabel}
                        </span>
                    )}
                </div>
            </td>
            <td className="transaction-table-cell">
                <span className="text-xs text-primary-50 bg-primary-10 px-2 py-1 rounded">
                    {transaction.itemType || 'N/A'}
                </span>
            </td>
            <td className="transaction-table-cell">
                <div
                    className={`flex items-center gap-1 font-semibold ${
                        isCredit ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                    {isCredit ? (
                        <FaArrowUp className="w-3 h-3" />
                    ) : (
                        <FaArrowDown className="w-3 h-3" />
                    )}
                    <span>
                        {isCredit ? '+' : '-'}
                        {formattedAmount}
                    </span>
                </div>
            </td>
            <td className="transaction-table-cell">
                <span className="text-sm text-primary-75">
                    {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: transaction.currency?.toUpperCase() || 'USD',
                    }).format(0)}
                </span>
            </td>
            <td className="transaction-table-cell">
                <div className="flex items-center gap-2">
                    {transaction.pending && (
                        <span className="text-xs text-primary-50 bg-primary-10 px-2 py-1 rounded">
                            Pending
                        </span>
                    )}
                    {firstSplit?.pendingTransfer && (
                        <span className="text-xs text-primary-50 bg-primary-10 px-2 py-1 rounded">
                            Transfer
                        </span>
                    )}
                    {transaction.matchedReceiptDocs &&
                        transaction.matchedReceiptDocs.length > 0 && (
                            <span className="text-xs text-primary-50 bg-primary-10 px-2 py-1 rounded">
                                Receipt
                            </span>
                        )}
                </div>
            </td>
            <td className="transaction-table-cell">
                <button className="text-primary hover:text-primary-75 text-sm font-medium">
                    View
                </button>
            </td>
        </tr>
    );
};

export default TransactionTableItem;
