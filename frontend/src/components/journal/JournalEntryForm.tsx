import { useState, useMemo } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import type {
    CreateJournalEntryPayload,
    JournalEntryLine,
} from '../../types/journal';
import { useChartOfAccounts } from '../../services/apis/chartsAccountApi';
import Button from '../typography/Button';
import { InputField, SelectField } from '../typography/InputFields';

type JournalEntryFormProps = {
    initialData?: Partial<CreateJournalEntryPayload>;
    onSubmit: (data: CreateJournalEntryPayload) => void;
    onCancel: () => void;
    isLoading?: boolean;
};

export function JournalEntryForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
}: JournalEntryFormProps) {
    // Fetch chart of accounts
    const { data: accountsData } = useChartOfAccounts();
    const accounts = useMemo(() => {
        return accountsData?.data?.items || [];
    }, [accountsData]);

    // Account options for dropdown
    const accountOptions = useMemo(() => {
        return accounts.map((account) => ({
            value: account.id,
            label: `${account.accountNumber} - ${account.accountName}`,
        }));
    }, [accounts]);

    const [entryNumber, setEntryNumber] = useState(
        initialData?.entryNumber || ''
    );
    const [entryDate, setEntryDate] = useState(
        initialData?.entryDate || new Date().toISOString().split('T')[0]
    );
    const [entryType, setEntryType] = useState<
        'standard' | 'adjusting' | 'closing' | 'reversing'
    >(initialData?.entryType || 'standard');
    const [isAdjusting, setIsAdjusting] = useState(
        initialData?.isAdjusting || false
    );
    const [isClosing, setIsClosing] = useState(
        initialData?.isClosing || false
    );
    const [isReversing, setIsReversing] = useState(
        initialData?.isReversing || false
    );
    const [description, setDescription] = useState(
        initialData?.description || ''
    );
    const [reference, setReference] = useState(initialData?.reference || '');
    const [lines, setLines] = useState<JournalEntryLine[]>(
        initialData?.lines || [
            {
                accountId: '',
                lineNumber: 1,
                debit: 0,
                credit: 0,
                description: '',
            },
            {
                accountId: '',
                lineNumber: 2,
                debit: 0,
                credit: 0,
                description: '',
            },
        ]
    );

    const calculateTotals = () => {
        const totalDebit = lines.reduce(
            (sum, line) => sum + (Number(line.debit) || 0),
            0
        );
        const totalCredit = lines.reduce(
            (sum, line) => sum + (Number(line.credit) || 0),
            0
        );
        return { totalDebit, totalCredit };
    };

    const { totalDebit, totalCredit } = calculateTotals();
    const isBalanced = totalDebit === totalCredit;

    const handleAddLine = () => {
        setLines([
            ...lines,
            {
                accountId: '',
                lineNumber: lines.length + 1,
                debit: 0,
                credit: 0,
                description: '',
            },
        ]);
    };

    const handleRemoveLine = (index: number) => {
        if (lines.length > 2) {
            const updatedLines = lines
                .filter((_, i) => i !== index)
                .map((line, idx) => ({
                    ...line,
                    lineNumber: idx + 1,
                }));
            setLines(updatedLines);
        }
    };

    const handleLineChange = (
        index: number,
        field: keyof JournalEntryLine,
        value: string | number
    ) => {
        const updatedLines = [...lines];
        updatedLines[index] = {
            ...updatedLines[index],
            [field]: value,
        };
        setLines(updatedLines);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isBalanced) {
            alert('Debits and Credits must balance!');
            return;
        }

        // Validate all lines have account IDs
        const hasEmptyAccounts = lines.some((line) => !line.accountId);
        if (hasEmptyAccounts) {
            alert('Please select an account for all lines');
            return;
        }

        const payload: CreateJournalEntryPayload = {
            entryNumber: entryNumber || undefined,
            entryDate,
            entryType,
            isAdjusting,
            isClosing,
            isReversing,
            description: description || undefined,
            reference: reference || undefined,
            lines: lines.map((line, index) => ({
                accountId: line.accountId,
                lineNumber: line.lineNumber || index + 1,
                debit: Number(line.debit),
                credit: Number(line.credit),
                description: line.description,
                memo: line.memo || '',
            })),
        };

        onSubmit(payload);
    };

    const handleClearAll = () => {
        setLines([
            {
                accountId: '',
                lineNumber: 1,
                debit: 0,
                credit: 0,
                description: '',
            },
            {
                accountId: '',
                lineNumber: 2,
                debit: 0,
                credit: 0,
                description: '',
            },
        ]);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <InputField
                    label="Entry Date"
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    required
                />

                <InputField
                    label="Entry Number"
                    type="text"
                    value={entryNumber}
                    onChange={(e) => setEntryNumber(e.target.value)}
                    placeholder="Auto-generated if empty"
                />

                <SelectField
                    label="Entry Type"
                    value={entryType}
                    onChange={(e) =>
                        setEntryType(
                            e.target.value as
                                | 'standard'
                                | 'adjusting'
                                | 'closing'
                                | 'reversing'
                        )
                    }
                    options={[
                        { value: 'standard', label: 'Standard' },
                        { value: 'adjusting', label: 'Adjusting' },
                        { value: 'closing', label: 'Closing' },
                        { value: 'reversing', label: 'Reversing' },
                    ]}
                />
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputField
                    label="Description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Office supply purchase"
                />

                <InputField
                    label="Reference"
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="e.g., INV-88922"
                />
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isAdjusting"
                        checked={isAdjusting}
                        onChange={(e) => setIsAdjusting(e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label
                        htmlFor="isAdjusting"
                        className="text-sm font-medium text-primary"
                    >
                        Is Adjusting Entry
                    </label>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isClosing"
                        checked={isClosing}
                        onChange={(e) => setIsClosing(e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label
                        htmlFor="isClosing"
                        className="text-sm font-medium text-primary"
                    >
                        Is Closing Entry
                    </label>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isReversing"
                        checked={isReversing}
                        onChange={(e) => setIsReversing(e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label
                        htmlFor="isReversing"
                        className="text-sm font-medium text-primary"
                    >
                        Is Reversing Entry
                    </label>
                </div>
            </div>

            {/* Journal Lines Table */}
            <div className="overflow-x-auto border border-primary-10 rounded-lg">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-2 py-2 text-left text-xs font-medium text-primary-75 uppercase tracking-wider">
                                #
                            </th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-primary-75 uppercase tracking-wider">
                                ACCOUNT
                            </th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-primary-75 uppercase tracking-wider">
                                DEBITS
                            </th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-primary-75 uppercase tracking-wider">
                                CREDITS
                            </th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-primary-75 uppercase tracking-wider">
                                DESCRIPTION
                            </th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-primary-75 uppercase tracking-wider">
                                MEMO
                            </th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-primary-75 uppercase tracking-wider"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {lines.map((line, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-sm text-primary">
                                    {line.lineNumber || index + 1}
                                </td>
                                <td className="px-2 py-2">
                                    <SelectField
                                        value={line.accountId}
                                        onChange={(e) =>
                                            handleLineChange(
                                                index,
                                                'accountId',
                                                e.target.value
                                            )
                                        }
                                        required
                                        options={[
                                            { value: '', label: 'Select Account' },
                                            ...accountOptions,
                                        ]}
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={line.debit}
                                        onChange={(e) =>
                                            handleLineChange(
                                                index,
                                                'debit',
                                                parseFloat(e.target.value) || 0
                                            )
                                        }
                                        className="w-full px-2 py-1 text-sm border border-primary-10 rounded focus:ring-1 focus:ring-primary focus:border-transparent"
                                        placeholder="0.00"
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={line.credit}
                                        onChange={(e) =>
                                            handleLineChange(
                                                index,
                                                'credit',
                                                parseFloat(e.target.value) || 0
                                            )
                                        }
                                        className="w-full px-2 py-1 text-sm border border-primary-10 rounded focus:ring-1 focus:ring-primary focus:border-transparent"
                                        placeholder="0.00"
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    <input
                                        type="text"
                                        value={line.description}
                                        onChange={(e) =>
                                            handleLineChange(
                                                index,
                                                'description',
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-2 py-1 text-sm border border-primary-10 rounded focus:ring-1 focus:ring-primary focus:border-transparent"
                                        placeholder="Description"
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    <input
                                        type="text"
                                        value={line.memo || ''}
                                        onChange={(e) =>
                                            handleLineChange(
                                                index,
                                                'memo',
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-2 py-1 text-sm border border-primary-10 rounded focus:ring-1 focus:ring-primary focus:border-transparent"
                                        placeholder="Memo"
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    {lines.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveLine(index)
                                            }
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                        <tr>
                            <td
                                colSpan={2}
                                className="px-2 py-2 text-right font-semibold text-sm text-primary"
                            >
                                Total
                            </td>
                            <td className="px-2 py-2 font-semibold text-sm text-primary">
                                ${totalDebit.toFixed(2)}
                            </td>
                            <td className="px-2 py-2 font-semibold text-sm text-primary">
                                ${totalCredit.toFixed(2)}
                            </td>
                            <td colSpan={3}></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {!isBalanced && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                    <p className="text-xs text-red-800 font-medium">
                        ⚠️ Debits and Credits must balance! Difference: $
                        {Math.abs(totalDebit - totalCredit).toFixed(2)}
                    </p>
                </div>
            )}

            {/* Action Buttons for Lines */}
            <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleAddLine}>
                    <FaPlus className="w-4 h-4" />
                    Add lines
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearAll}
                >
                    Clear all lines
                </Button>
            </div>

            {/* Form Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-primary-10">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>

                <div className="flex gap-2">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isLoading || !isBalanced}
                        loading={isLoading}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </form>
    );
}
