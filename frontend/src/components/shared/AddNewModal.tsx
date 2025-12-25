import { FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import Popup from './Popup';

type AddNewOption = {
    id: string;
    label: string;
    path: string;
    hasIcon?: boolean;
};

const ADD_NEW_OPTIONS: AddNewOption[] = [
    {
        id: 'accounts-payable-aging-summary',
        label: 'Accounts payable aging summary',
        path: '/reports',
        hasIcon: true,
    },
    {
        id: 'accounts-payable-aging-detail',
        label: 'Accounts payable aging detail',
        path: '/reports',
        hasIcon: true,
    },
    {
        id: 'accounts-receivable-aging-summary',
        label: 'Accounts receivable aging summary',
        path: '/reports',
        hasIcon: true,
    },
    {
        id: 'accounts-receivable-aging-detail',
        label: 'Accounts receivable aging detail',
        path: '/reports',
        hasIcon: true,
    },
    {
        id: 'balance-sheet',
        label: 'Balance Sheet',
        path: '/reports/balance-sheet',
        hasIcon: false,
    },
    {
        id: 'statement-of-cash-flows',
        label: 'Statement of Cash Flows',
        path: '/reports',
        hasIcon: true,
    },
    {
        id: 'general-ledger',
        label: 'General Ledger',
        path: '/transactions',
        hasIcon: false,
    },
    {
        id: 'profit-and-loss',
        label: 'Profit and Loss',
        path: '/reports/income-statement',
        hasIcon: false,
    },
    {
        id: 'unpaid-bills',
        label: 'Unpaid Bills',
        path: '/invoices',
        hasIcon: true,
    },
];

type AddNewModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const AddNewModal = ({ isOpen, onClose }: AddNewModalProps) => {
    const navigate = useNavigate();

    const handleOptionClick = (path: string) => {
        navigate(path);
        onClose();
    };

    // Split options into two columns
    const leftColumn = ADD_NEW_OPTIONS.slice(
        0,
        Math.ceil(ADD_NEW_OPTIONS.length / 2)
    );
    const rightColumn = ADD_NEW_OPTIONS.slice(
        Math.ceil(ADD_NEW_OPTIONS.length / 2)
    );

    return (
        <Popup
            isOpen={isOpen}
            onClose={onClose}
            title="Add New"
            size="4xl"
            contentClassName="p-0"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Left Column */}
                <div className="divide-y divide-primary-10">
                    {leftColumn.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => handleOptionClick(option.path)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-primary-10 transition-colors group"
                        >
                            {option.hasIcon && (
                                <FaFileAlt className="w-4 h-4 text-primary-50 group-hover:text-primary transition-colors shrink-0" />
                            )}
                            <span className="text-sm text-primary-75 group-hover:text-primary transition-colors">
                                {option.label}
                            </span>
                        </button>
                    ))}
                </div>
                {/* Right Column */}
                <div className="divide-y divide-primary-10 border-l border-primary-10 md:border-l">
                    {rightColumn.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => handleOptionClick(option.path)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-primary-10 transition-colors group"
                        >
                            {option.hasIcon && (
                                <FaFileAlt className="w-4 h-4 text-primary-50 group-hover:text-primary transition-colors shrink-0" />
                            )}
                            <span className="text-sm text-primary-75 group-hover:text-primary transition-colors">
                                {option.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </Popup>
    );
};

export default AddNewModal;
