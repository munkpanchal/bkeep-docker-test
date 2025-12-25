import { useState } from 'react';
import {
    FaCheckCircle,
    FaClock,
    FaEdit,
    FaEye,
    FaFileInvoiceDollar,
    FaFilter,
    FaPlus,
    FaSearch,
    FaTimesCircle,
    FaTrash,
} from 'react-icons/fa';
import CreateInvoiceModal from '../../components/invoice/CreateInvoiceModal';
import Button from '../../components/typography/Button';
import { InputField } from '../../components/typography/InputFields';

type Invoice = {
    id: string;
    invoiceNumber: string;
    clientName: string;
    date: string;
    dueDate: string;
    amount: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
    description: string;
};

const MOCK_INVOICES: Invoice[] = [
    {
        id: '1',
        invoiceNumber: 'INV-2024-001',
        clientName: 'Acme Corporation',
        date: '2024-01-15',
        dueDate: '2024-02-15',
        amount: 5000,
        status: 'paid',
        description: 'Monthly accounting services',
    },
    {
        id: '2',
        invoiceNumber: 'INV-2024-002',
        clientName: 'Tech Solutions Inc',
        date: '2024-01-20',
        dueDate: '2024-02-20',
        amount: 7500,
        status: 'sent',
        description: 'Q1 Financial reporting',
    },
    {
        id: '3',
        invoiceNumber: 'INV-2024-003',
        clientName: 'Global Enterprises',
        date: '2024-01-25',
        dueDate: '2024-02-25',
        amount: 12000,
        status: 'overdue',
        description: 'Annual audit services',
    },
    {
        id: '4',
        invoiceNumber: 'INV-2024-004',
        clientName: 'Startup Co',
        date: '2024-02-01',
        dueDate: '2024-03-01',
        amount: 3000,
        status: 'draft',
        description: 'Bookkeeping services',
    },
];

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
});

const statusConfig = {
    draft: {
        label: 'Draft',
        color: 'bg-gray-100 text-gray-700',
        icon: FaFileInvoiceDollar,
    },
    sent: { label: 'Sent', color: 'bg-blue-100 text-blue-700', icon: FaClock },
    paid: {
        label: 'Paid',
        color: 'bg-green-100 text-green-700',
        icon: FaCheckCircle,
    },
    overdue: {
        label: 'Overdue',
        color: 'bg-red-100 text-red-700',
        icon: FaTimesCircle,
    },
};

const Invoicepage = () => {
    const [invoices] = useState<Invoice[]>(MOCK_INVOICES);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const filteredInvoices = invoices.filter((invoice) => {
        const matchesSearch =
            invoice.invoiceNumber
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            invoice.clientName
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === 'all' || invoice.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalAmount = filteredInvoices.reduce(
        (sum, invoice) => sum + invoice.amount,
        0
    );
    const paidAmount = filteredInvoices
        .filter((inv) => inv.status === 'paid')
        .reduce((sum, invoice) => sum + invoice.amount, 0);
    const pendingAmount = filteredInvoices
        .filter((inv) => inv.status !== 'paid')
        .reduce((sum, invoice) => sum + invoice.amount, 0);

    // When modal is open, show it instead of the regular content
    if (showCreateModal) {
        return (
            <div className="relative h-full -m-4">
                <CreateInvoiceModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSaveDraft={(data) => {
                        console.log('Saving draft:', data);
                        setShowCreateModal(false);
                    }}
                    onSendInvoice={(data) => {
                        console.log('Sending invoice:', data);
                        setShowCreateModal(false);
                    }}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Header with Create Button */}
            <div className="flex justify-end">
                <Button onClick={() => setShowCreateModal(true)}>
                    <FaPlus className="w-3 h-3" />
                    Create Invoice
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2 shadow-sm border border-primary-10 p-4">
                    <div className="text-sm text-primary-50 mb-1">
                        Total Invoices
                    </div>
                    <div className="text-2xl font-bold text-primary">
                        {currencyFormatter.format(totalAmount)}
                    </div>
                    <div className="text-xs text-primary-50 mt-1">
                        {filteredInvoices.length} invoices
                    </div>
                </div>
                <div className="bg-white rounded-2 shadow-sm border border-primary-10 p-4">
                    <div className="text-sm text-primary-50 mb-1">Paid</div>
                    <div className="text-2xl font-bold text-green-600">
                        {currencyFormatter.format(paidAmount)}
                    </div>
                    <div className="text-xs text-primary-50 mt-1">
                        {
                            filteredInvoices.filter(
                                (inv) => inv.status === 'paid'
                            ).length
                        }{' '}
                        invoices
                    </div>
                </div>
                <div className="bg-white rounded-2 shadow-sm border border-primary-10 p-4">
                    <div className="text-sm text-primary-50 mb-1">Pending</div>
                    <div className="text-2xl font-bold text-orange-600">
                        {currencyFormatter.format(pendingAmount)}
                    </div>
                    <div className="text-xs text-primary-50 mt-1">
                        {
                            filteredInvoices.filter(
                                (inv) => inv.status !== 'paid'
                            ).length
                        }
                        invoices
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2 shadow-sm border border-primary-10 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-50 w-4 h-4" />
                            <InputField
                                id="search-invoices"
                                placeholder="Search invoices..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
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
                            <option value="draft">Draft</option>
                            <option value="sent">Sent</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-2 shadow-sm border border-primary-10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-primary-10">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                                    Invoice #
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                                    Client
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                                    Date
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                                    Due Date
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-primary">
                                    Amount
                                </th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-primary">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-primary w-32">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-8 text-center text-primary-50"
                                    >
                                        No invoices found
                                    </td>
                                </tr>
                            ) : (
                                filteredInvoices.map((invoice) => {
                                    const StatusIcon =
                                        statusConfig[invoice.status].icon;
                                    return (
                                        <tr
                                            key={invoice.id}
                                            className="border-b border-primary-10 hover:bg-primary-5"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-primary">
                                                    {invoice.invoiceNumber}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-primary">
                                                    {invoice.clientName}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-primary-75">
                                                {new Date(
                                                    invoice.date
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-primary-75">
                                                {new Date(
                                                    invoice.dueDate
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold text-primary">
                                                {currencyFormatter.format(
                                                    invoice.amount
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-center">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[invoice.status].color}`}
                                                    >
                                                        <StatusIcon className="w-3 h-3" />
                                                        {
                                                            statusConfig[
                                                                invoice.status
                                                            ].label
                                                        }
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        className="p-2 text-primary-50 hover:text-primary hover:bg-primary-10 rounded transition-colors"
                                                        title="View"
                                                    >
                                                        <FaEye className="w-4 h-4" />
                                                    </button>
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
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Invoicepage;
