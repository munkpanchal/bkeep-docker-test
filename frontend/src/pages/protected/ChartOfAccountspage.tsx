import { useState, useMemo } from 'react';
import {
    FaChevronDown,
    FaChevronRight,
    FaEdit,
    FaFilter,
    FaPlus,
    FaSearch,
    FaTrash,
} from 'react-icons/fa';
import Button from '../../components/typography/Button';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import Popup from '../../components/shared/Popup';
import { InputField, SelectField } from '../../components/typography/InputFields';
import Loading from '../../components/shared/Loading';
import {
    useChartOfAccounts,
    useCreateChartOfAccount,
    useUpdateChartOfAccount,
    useDeleteChartOfAccount,
    type ChartOfAccount,
    type AccountType,
    type AccountDetailType,
    type CreateChartOfAccountPayload,
} from '../../services/apis/chartsAccountApi';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
});

// Account Type Display Mapping
const ACCOUNT_TYPE_DISPLAY: Record<AccountType, string> = {
    asset: 'Asset',
    liability: 'Liability',
    equity: 'Equity',
    income: 'Income',
    expense: 'Expense',
};

// Account Type Options
const ACCOUNT_TYPE_OPTIONS: { value: AccountType; label: string }[] = [
    { value: 'asset', label: 'Asset' },
    { value: 'liability', label: 'Liability' },
    { value: 'equity', label: 'Equity' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
];

// Account Detail Type Options
const ACCOUNT_DETAIL_TYPE_OPTIONS: { value: AccountDetailType; label: string }[] =
    [
        { value: 'checking', label: 'Checking' },
        { value: 'savings', label: 'Savings' },
        { value: 'cash', label: 'Cash' },
        { value: 'accounts-receivable', label: 'Accounts Receivable' },
        { value: 'inventory', label: 'Inventory' },
        { value: 'fixed-asset', label: 'Fixed Asset' },
        { value: 'accounts-payable', label: 'Accounts Payable' },
        { value: 'credit-card', label: 'Credit Card' },
        { value: 'loan', label: 'Loan' },
        { value: 'retained-earnings', label: 'Retained Earnings' },
        { value: 'revenue', label: 'Revenue' },
        { value: 'cost-of-goods-sold', label: 'Cost of Goods Sold' },
        { value: 'expense', label: 'Expense' },
        { value: 'other', label: 'Other' },
    ];

const ChartOfAccountspage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<AccountType | 'all'>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingAccount, setEditingAccount] = useState<ChartOfAccount | null>(
        null
    );
    const [deleteAccount, setDeleteAccount] = useState<ChartOfAccount | null>(
        null
    );

    // Form state
    const [formData, setFormData] = useState<CreateChartOfAccountPayload>({
        accountName: '',
        accountType: 'asset',
        accountDetailType: 'checking',
        openingBalance: 0,
        description: '',
    });
    const [formErrors, setFormErrors] = useState<
        Record<string, string>
    >({});

    // API hooks
    const { data, isLoading, error } = useChartOfAccounts({
        search: searchQuery || undefined,
        accountType: selectedType !== 'all' ? selectedType : undefined,
    });

    const createMutation = useCreateChartOfAccount();
    const updateMutation = useUpdateChartOfAccount();
    const deleteMutation = useDeleteChartOfAccount();

    const accounts = useMemo(() => {
        return data?.data?.items || [];
    }, [data]);

    // Handle form reset
    const resetForm = () => {
        setFormData({
            accountName: '',
            accountType: 'asset',
            accountDetailType: 'checking',
            openingBalance: 0,
            description: '',
        });
        setFormErrors({});
        setEditingAccount(null);
    };

    // Handle open add modal
    const handleOpenAddModal = () => {
        resetForm();
        setShowAddModal(true);
    };

    // Handle open edit modal
    const handleOpenEditModal = (account: ChartOfAccount) => {
        setFormData({
            accountName: account.accountName,
            accountType: account.accountType,
            accountDetailType: account.accountDetailType,
            openingBalance: parseFloat(account.openingBalance),
            description: account.description || '',
        });
        setFormErrors({});
        setEditingAccount(account);
    };

    // Handle close modal
    const handleCloseModal = () => {
        setShowAddModal(false);
        resetForm();
    };

    // Validate form
    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.accountName.trim()) {
            errors.accountName = 'Account name is required';
        }

        if (!formData.accountType) {
            errors.accountType = 'Account type is required';
        }

        if (!formData.accountDetailType) {
            errors.accountDetailType = 'Account detail type is required';
        }

        if (formData.openingBalance === undefined || formData.openingBalance === null) {
            errors.openingBalance = 'Opening balance is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            if (editingAccount) {
                // Update existing account
                if (!editingAccount.id) {
                    throw new Error('Account ID is required for update');
                }
                await updateMutation.mutateAsync({
                    id: editingAccount.id,
                    payload: {
                        accountName: formData.accountName,
                        accountType: formData.accountType,
                        accountDetailType: formData.accountDetailType,
                        openingBalance: formData.openingBalance,
                        description: formData.description,
                    },
                });
            } else {
                // Create new account
                await createMutation.mutateAsync(formData);
            }
            handleCloseModal();
        } catch (error) {
            // Error is handled by the mutation
            console.error('Form submission error:', error);
        }
    };

    // Handle delete
    const handleDelete = async () => {
        if (!deleteAccount) return;

        try {
            await deleteMutation.mutateAsync(deleteAccount.id);
            setDeleteAccount(null);
        } catch (error) {
            // Error is handled by the mutation
            console.error('Delete error:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-500 mb-4">
                        Failed to load chart of accounts
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleOpenAddModal}
                        variant="primary"
                        icon={<FaPlus />}
                    >
                        New Account
                    </Button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-2 shadow-sm border border-primary-10 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <InputField
                                id="search-accounts"
                                placeholder="Search accounts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                icon={<FaSearch />}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaFilter className="text-primary-50" />
                        <SelectField
                            id="filter-account-type"
                            value={selectedType}
                            onChange={(e) =>
                                setSelectedType(
                                    e.target.value as AccountType | 'all'
                                )
                            }
                            options={[
                                { value: 'all', label: 'All Types' },
                                ...ACCOUNT_TYPE_OPTIONS,
                            ]}
                        />
                    </div>
                </div>
            </div>

            {/* Accounts Table */}
            <div className="bg-white rounded-2 shadow-sm border border-primary-10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-primary-10">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                                    Account Name
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                                    Type
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                                    Detail Type
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-primary">
                                    Current Balance
                                </th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-primary w-24">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-8 text-center text-primary-50"
                                    >
                                        No accounts found
                                    </td>
                                </tr>
                            ) : (
                                accounts.map((account) => (
                                    <tr
                                        key={account.id || account.accountName}
                                        className="border-b border-primary-10 hover:bg-primary-10 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-primary">
                                                {account.accountName}
                                            </div>
                                            <div className="text-xs text-primary-50 mt-1">
                                                {account.accountNumber}
                                            </div>
                                            {account.description && (
                                                <div className="text-xs text-primary-50 mt-1">
                                                    {account.description}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-primary">
                                                {
                                                    ACCOUNT_TYPE_DISPLAY[
                                                        account.accountType
                                                    ]
                                                }
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-primary-75 capitalize">
                                                {account.accountDetailType.replace(
                                                    /-/g,
                                                    ' '
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="font-semibold text-primary">
                                                {currencyFormatter.format(
                                                    parseFloat(account.currentBalance || account.openingBalance)
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleOpenEditModal(
                                                            account
                                                        )
                                                    }
                                                    className="p-2 text-primary-50 hover:text-primary hover:bg-primary-10 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setDeleteAccount(account)
                                                    }
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

            {/* Add/Edit Account Modal */}
            <Popup
                isOpen={showAddModal || !!editingAccount}
                onClose={handleCloseModal}
                title={editingAccount ? 'Edit Account' : 'New Account'}
                size="md"
                loading={
                    createMutation.isPending || updateMutation.isPending
                }
                footer={
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCloseModal}
                            disabled={
                                createMutation.isPending ||
                                updateMutation.isPending
                            }
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={
                                createMutation.isPending ||
                                updateMutation.isPending
                            }
                            disabled={
                                createMutation.isPending ||
                                updateMutation.isPending
                            }
                            form="chart-of-account-form"
                        >
                            {editingAccount ? 'Update' : 'Create'}
                        </Button>
                    </div>
                }
            >
                <form
                    id="chart-of-account-form"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div>
                        <InputField
                            id="account-name"
                            label="Account Name"
                            placeholder="Enter account name"
                            value={formData.accountName}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    accountName: e.target.value,
                                });
                                if (formErrors.accountName) {
                                    setFormErrors((prev) => ({
                                        ...prev,
                                        accountName: '',
                                    }));
                                }
                            }}
                            required
                        />
                        {formErrors.accountName && (
                            <p className="text-red-500 text-xs mt-1">
                                {formErrors.accountName}
                            </p>
                        )}
                    </div>

                    <div>
                        <SelectField
                            id="account-type"
                            label="Account Type"
                            value={formData.accountType}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    accountType: e.target.value as AccountType,
                                });
                                if (formErrors.accountType) {
                                    setFormErrors((prev) => ({
                                        ...prev,
                                        accountType: '',
                                    }));
                                }
                            }}
                            required
                            options={ACCOUNT_TYPE_OPTIONS}
                        />
                        {formErrors.accountType && (
                            <p className="text-red-500 text-xs mt-1">
                                {formErrors.accountType}
                            </p>
                        )}
                    </div>

                    <div>
                        <SelectField
                            id="account-detail-type"
                            label="Account Detail Type"
                            value={formData.accountDetailType}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    accountDetailType:
                                        e.target.value as AccountDetailType,
                                });
                                if (formErrors.accountDetailType) {
                                    setFormErrors((prev) => ({
                                        ...prev,
                                        accountDetailType: '',
                                    }));
                                }
                            }}
                            required
                            options={ACCOUNT_DETAIL_TYPE_OPTIONS}
                        />
                        {formErrors.accountDetailType && (
                            <p className="text-red-500 text-xs mt-1">
                                {formErrors.accountDetailType}
                            </p>
                        )}
                    </div>

                    <div>
                        <InputField
                            id="opening-balance"
                            label="Opening Balance"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.openingBalance.toString()}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                setFormData({
                                    ...formData,
                                    openingBalance: value,
                                });
                                if (formErrors.openingBalance) {
                                    setFormErrors((prev) => ({
                                        ...prev,
                                        openingBalance: '',
                                    }));
                                }
                            }}
                            required
                        />
                        {formErrors.openingBalance && (
                            <p className="text-red-500 text-xs mt-1">
                                {formErrors.openingBalance}
                            </p>
                        )}
                    </div>

                    <div>
                        <InputField
                            id="description"
                            label="Description"
                            placeholder="Enter description (optional)"
                            value={formData.description || ''}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                });
                            }}
                        />
                    </div>
                </form>
            </Popup>

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={!!deleteAccount}
                onClose={() => setDeleteAccount(null)}
                onConfirm={handleDelete}
                title="Delete Account"
                message={`Are you sure you want to delete "${deleteAccount?.accountName}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                confirmVariant="danger"
                loading={deleteMutation.isPending}
            />
        </div>
    );
};

export default ChartOfAccountspage;
