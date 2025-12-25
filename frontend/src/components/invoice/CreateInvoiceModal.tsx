import { useEffect, useRef, useState } from 'react';
import {
    FaChevronDown,
    FaPlus,
    FaSearch,
    FaTimes,
    FaTrash,
    FaUpload,
} from 'react-icons/fa';

type Customer = {
    id: string;
    name: string;
    email?: string;
    address?: string;
};

type LineItem = {
    id: string;
    description: string;
    qty: number;
    price: number;
    tax: number;
};

type CompanyInfo = {
    name: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    email: string;
    logo?: string;
};

type InvoiceFormData = {
    invoiceNumber: string;
    customer: Customer | null;
    issueDate: string;
    dueDate: string;
    paymentMethods: {
        interacTransfer: boolean;
        eftTransfer: boolean;
    };
    isRecurring: boolean;
    ccEmail: string;
    memo: string;
    notes: string;
    lineItems: LineItem[];
    subtotal: number;
    taxRate: number;
    discount: number;
    discountType: 'percentage' | 'fixed';
};

const MOCK_CUSTOMERS: Customer[] = [
    {
        id: '1',
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        address: '123 Business St, City, State 12345',
    },
    {
        id: '2',
        name: 'Blue Ocean Enterprises',
        email: 'info@blueocean.com',
        address: '456 Commerce Ave, City, State 67890',
    },
    { id: '3', name: 'Cyberdyne Systems', email: 'hello@cyberdyne.com' },
    { id: '4', name: 'Delta Dynamics', email: 'contact@delta.com' },
    { id: '5', name: 'Emerald Innovations', email: 'info@emerald.com' },
    { id: '6', name: 'Firefly Technologies', email: 'hello@firefly.com' },
    { id: '7', name: 'Galactic Industries', email: 'contact@galactic.com' },
];

type CreateInvoiceModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSaveDraft?: (data: InvoiceFormData) => void;
    onSendInvoice?: (data: InvoiceFormData) => void;
};

const CreateInvoiceModal = ({
    isOpen,
    onClose,
    onSaveDraft,
    onSendInvoice,
}: CreateInvoiceModalProps) => {
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
        name: 'Excel Studio Inc.',
        address: '1401 Rockland Ave',
        city: 'Victoria, BC',
        country: 'Canada',
        postalCode: 'V8S 1V9',
        email: 'ar@excel.studio',
    });

    const [formData, setFormData] = useState<InvoiceFormData>({
        invoiceNumber: 'INV-' + Math.floor(Math.random() * 10000),
        customer: null,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        paymentMethods: {
            interacTransfer: false,
            eftTransfer: false,
        },
        isRecurring: false,
        ccEmail: '',
        memo: '',
        notes: 'Thank you for your business!',
        lineItems: [],
        subtotal: 0,
        taxRate: 13,
        discount: 0,
        discountType: 'percentage',
    });

    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
    const [customerSearch, setCustomerSearch] = useState('');
    const [activeTab, setActiveTab] = useState<
        'details' | 'items' | 'settings'
    >('details');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filter customers based on search
    const filteredCustomers = MOCK_CUSTOMERS.filter((customer) =>
        customer.name.toLowerCase().includes(customerSearch.toLowerCase())
    );

    // Calculate totals
    const subtotal = formData.lineItems.reduce(
        (sum, item) => sum + item.qty * item.price,
        0
    );

    const discountAmount =
        formData.discountType === 'percentage'
            ? (subtotal * formData.discount) / 100
            : formData.discount;

    const taxableAmount = subtotal - discountAmount;
    const totalTax = (taxableAmount * formData.taxRate) / 100;
    const total = taxableAmount + totalTax;

    // Handle ESC key and click outside
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (showCustomerDropdown) {
                    setShowCustomerDropdown(false);
                } else {
                    onClose();
                }
            }
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setShowCustomerDropdown(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose, showCustomerDropdown]);

    if (!isOpen) return null;

    const handleSelectCustomer = (customer: Customer) => {
        setFormData({ ...formData, customer });
        setShowCustomerDropdown(false);
        setCustomerSearch('');
    };

    const handleAddCustomer = () => {
        console.log('Add new customer');
        setShowCustomerDropdown(false);
    };

    const handleAddLineItem = () => {
        const newItem: LineItem = {
            id: Date.now().toString(),
            description: '',
            qty: 1,
            price: 0,
            tax: 0,
        };
        setFormData({
            ...formData,
            lineItems: [...formData.lineItems, newItem],
        });
    };

    const handleUpdateLineItem = (
        id: string,
        field: keyof LineItem,
        value: string | number
    ) => {
        setFormData({
            ...formData,
            lineItems: formData.lineItems.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        });
    };

    const handleDeleteLineItem = (id: string) => {
        setFormData({
            ...formData,
            lineItems: formData.lineItems.filter((item) => item.id !== id),
        });
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCompanyInfo({
                    ...companyInfo,
                    logo: reader.result as string,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD',
        }).format(amount);
    };

    return (
        <div className="absolute inset-0 z-40 bg-lightBg flex flex-col rounded-2 overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-primary-10 bg-white">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-primary-10 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <FaTimes className="w-4 h-4 text-primary" />
                    </button>
                    <h1 className="text-lg font-semibold text-primary">
                        Create invoice
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onSaveDraft?.(formData)}
                        className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-75 transition-colors"
                    >
                        Save as draft
                    </button>
                    <button
                        onClick={() => onSendInvoice?.(formData)}
                        disabled={
                            !formData.customer ||
                            formData.lineItems.length === 0
                        }
                        className="px-4 py-2 text-sm font-medium bg-primary-10 text-primary-50 rounded-2 cursor-not-allowed disabled:opacity-50 enabled:bg-primary enabled:text-white enabled:cursor-pointer enabled:hover:bg-primary-75 transition-colors"
                    >
                        Send invoice
                    </button>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Side - Form */}
                <div className="w-full md:w-[480px] border-r border-primary-10 overflow-y-auto bg-white flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b border-primary-10">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                                activeTab === 'details'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-primary-50 hover:text-primary'
                            }`}
                        >
                            Details
                        </button>
                        <button
                            onClick={() => setActiveTab('items')}
                            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                                activeTab === 'items'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-primary-50 hover:text-primary'
                            }`}
                        >
                            Items
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                                activeTab === 'settings'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-primary-50 hover:text-primary'
                            }`}
                        >
                            Settings
                        </button>
                    </div>

                    <div className="flex-1 p-6">
                        {/* Details Tab */}
                        {activeTab === 'details' && (
                            <div className="space-y-6">
                                {/* Invoice Number */}
                                <div>
                                    <label className="input-label">
                                        Invoice Number
                                    </label>
                                    <div className="input-wrap">
                                        <input
                                            type="text"
                                            value={formData.invoiceNumber}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    invoiceNumber:
                                                        e.target.value,
                                                })
                                            }
                                            className="input px-4"
                                        />
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="input-label">
                                            Issue Date
                                        </label>
                                        <div className="input-wrap">
                                            <input
                                                type="date"
                                                value={formData.issueDate}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        issueDate:
                                                            e.target.value,
                                                    })
                                                }
                                                className="input px-4"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="input-label">
                                            Due Date
                                        </label>
                                        <div className="input-wrap">
                                            <input
                                                type="date"
                                                value={formData.dueDate}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        dueDate: e.target.value,
                                                    })
                                                }
                                                className="input px-4"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Selection */}
                                <div>
                                    <label className="input-label">
                                        Customer
                                    </label>
                                    <div className="relative" ref={dropdownRef}>
                                        <div
                                            onClick={() =>
                                                setShowCustomerDropdown(
                                                    !showCustomerDropdown
                                                )
                                            }
                                            className="input-wrap flex items-center justify-between px-4 py-2 cursor-pointer"
                                        >
                                            <span
                                                className={
                                                    formData.customer
                                                        ? 'text-primary text-sm'
                                                        : 'text-primary-50 text-sm'
                                                }
                                            >
                                                {formData.customer?.name ||
                                                    'Find or add a customer...'}
                                            </span>
                                            <FaChevronDown
                                                className={`w-3 h-3 text-primary-50 transition-transform ${showCustomerDropdown ? 'rotate-180' : ''}`}
                                            />
                                        </div>

                                        {/* Dropdown */}
                                        {showCustomerDropdown && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-primary-10 rounded-2 shadow-lg z-10 max-h-80 overflow-hidden">
                                                <div className="p-3 border-b border-primary-10">
                                                    <div className="input-wrap flex items-center gap-2 px-3">
                                                        <FaSearch className="w-3 h-3 text-primary-50" />
                                                        <input
                                                            type="text"
                                                            value={
                                                                customerSearch
                                                            }
                                                            onChange={(e) =>
                                                                setCustomerSearch(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Find or add a customer..."
                                                            className="input"
                                                            autoFocus
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleAddCustomer}
                                                    className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-primary-10 transition-colors border-b border-primary-10"
                                                >
                                                    <FaPlus className="w-3 h-3 text-primary" />
                                                    <span className="text-sm font-medium text-primary">
                                                        Add customer
                                                    </span>
                                                </button>
                                                <div className="max-h-52 overflow-y-auto">
                                                    {filteredCustomers.map(
                                                        (customer) => (
                                                            <button
                                                                key={
                                                                    customer.id
                                                                }
                                                                onClick={() =>
                                                                    handleSelectCustomer(
                                                                        customer
                                                                    )
                                                                }
                                                                className={`w-full px-4 py-3 text-left text-sm hover:bg-primary-10 transition-colors ${
                                                                    formData
                                                                        .customer
                                                                        ?.id ===
                                                                    customer.id
                                                                        ? 'bg-primary-10 text-primary font-medium'
                                                                        : 'text-primary-75'
                                                                }`}
                                                            >
                                                                <div>
                                                                    {
                                                                        customer.name
                                                                    }
                                                                </div>
                                                                {customer.email && (
                                                                    <div className="text-xs text-primary-50 mt-1">
                                                                        {
                                                                            customer.email
                                                                        }
                                                                    </div>
                                                                )}
                                                            </button>
                                                        )
                                                    )}
                                                    {filteredCustomers.length ===
                                                        0 && (
                                                        <div className="px-4 py-3 text-sm text-primary-50">
                                                            No customers found
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Payment Methods */}
                                <div>
                                    <label className="input-label">
                                        Payment collection methods
                                    </label>
                                    <div className="space-y-3 mt-2">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    formData.paymentMethods
                                                        .interacTransfer
                                                }
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        paymentMethods: {
                                                            ...formData.paymentMethods,
                                                            interacTransfer:
                                                                e.target
                                                                    .checked,
                                                        },
                                                    })
                                                }
                                                className="w-4 h-4 rounded border-primary-25 text-primary focus:ring-primary accent-primary"
                                            />
                                            <span className="text-sm text-primary-75">
                                                Interac e-transfer
                                            </span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    formData.paymentMethods
                                                        .eftTransfer
                                                }
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        paymentMethods: {
                                                            ...formData.paymentMethods,
                                                            eftTransfer:
                                                                e.target
                                                                    .checked,
                                                        },
                                                    })
                                                }
                                                className="w-4 h-4 rounded border-primary-25 text-primary focus:ring-primary accent-primary"
                                            />
                                            <span className="text-sm text-primary-75">
                                                EFT transfer
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Recurring Invoice */}
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label className="input-label mb-0!">
                                            Recurring invoice
                                        </label>
                                        <button
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    isRecurring:
                                                        !formData.isRecurring,
                                                })
                                            }
                                            className={`relative w-10 h-5 rounded-full transition-colors ${
                                                formData.isRecurring
                                                    ? 'bg-primary'
                                                    : 'bg-primary-25'
                                            }`}
                                        >
                                            <span
                                                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                                                    formData.isRecurring
                                                        ? 'translate-x-5'
                                                        : 'translate-x-0'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* CC Email */}
                                <div>
                                    <label className="input-label">
                                        CC email (optional)
                                    </label>
                                    <div className="input-wrap">
                                        <input
                                            type="email"
                                            value={formData.ccEmail}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    ccEmail: e.target.value,
                                                })
                                            }
                                            placeholder="email@example.com"
                                            className="input px-4"
                                        />
                                    </div>
                                </div>

                                {/* Memo */}
                                <div>
                                    <label className="input-label">
                                        Memo (optional)
                                    </label>
                                    <div className="input-wrap">
                                        <textarea
                                            value={formData.memo}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    memo: e.target.value,
                                                })
                                            }
                                            rows={2}
                                            placeholder="Internal notes..."
                                            className="input px-4 resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="input-label">
                                        Notes (shown on invoice)
                                    </label>
                                    <div className="input-wrap">
                                        <textarea
                                            value={formData.notes}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    notes: e.target.value,
                                                })
                                            }
                                            rows={3}
                                            placeholder="Thank you for your business!"
                                            className="input px-4 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Items Tab */}
                        {activeTab === 'items' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-semibold text-primary">
                                        Line Items
                                    </h3>
                                    <button
                                        onClick={handleAddLineItem}
                                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-primary-10 rounded-lg transition-colors"
                                    >
                                        <FaPlus className="w-3 h-3" />
                                        Add Item
                                    </button>
                                </div>

                                {formData.lineItems.length === 0 ? (
                                    <div className="text-center py-8 text-primary-50 text-sm">
                                        No items added yet. Click "Add Item" to
                                        get started.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {formData.lineItems.map(
                                            (item, index) => (
                                                <div
                                                    key={item.id}
                                                    className="border border-primary-10 rounded-lg p-4 space-y-3"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium text-primary">
                                                            Item {index + 1}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteLineItem(
                                                                    item.id
                                                                )
                                                            }
                                                            className="text-red-500 hover:text-red-700 transition-colors"
                                                        >
                                                            <FaTrash className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <label className="input-label">
                                                            Description
                                                        </label>
                                                        <div className="input-wrap">
                                                            <input
                                                                type="text"
                                                                value={
                                                                    item.description
                                                                }
                                                                onChange={(e) =>
                                                                    handleUpdateLineItem(
                                                                        item.id,
                                                                        'description',
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="Item description"
                                                                className="input px-4"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-3">
                                                        <div>
                                                            <label className="input-label">
                                                                Qty
                                                            </label>
                                                            <div className="input-wrap">
                                                                <input
                                                                    type="number"
                                                                    value={
                                                                        item.qty
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleUpdateLineItem(
                                                                            item.id,
                                                                            'qty',
                                                                            parseFloat(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            ) ||
                                                                                0
                                                                        )
                                                                    }
                                                                    min="0"
                                                                    step="1"
                                                                    className="input px-4"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="input-label">
                                                                Price
                                                            </label>
                                                            <div className="input-wrap">
                                                                <input
                                                                    type="number"
                                                                    value={
                                                                        item.price
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleUpdateLineItem(
                                                                            item.id,
                                                                            'price',
                                                                            parseFloat(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            ) ||
                                                                                0
                                                                        )
                                                                    }
                                                                    min="0"
                                                                    step="0.01"
                                                                    className="input px-4"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="input-label">
                                                                Total
                                                            </label>
                                                            <div className="text-sm font-medium text-primary pt-2">
                                                                {formatCurrency(
                                                                    item.qty *
                                                                        item.price
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}

                                {/* Tax and Discount */}
                                <div className="pt-4 border-t border-primary-10 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="input-label">
                                                Tax Rate (%)
                                            </label>
                                            <div className="input-wrap">
                                                <input
                                                    type="number"
                                                    value={formData.taxRate}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            taxRate:
                                                                parseFloat(
                                                                    e.target
                                                                        .value
                                                                ) || 0,
                                                        })
                                                    }
                                                    min="0"
                                                    step="0.1"
                                                    className="input px-4"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="input-label">
                                                Discount
                                            </label>
                                            <div className="flex gap-2">
                                                <div className="input-wrap flex-1">
                                                    <input
                                                        type="number"
                                                        value={
                                                            formData.discount
                                                        }
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                discount:
                                                                    parseFloat(
                                                                        e.target
                                                                            .value
                                                                    ) || 0,
                                                            })
                                                        }
                                                        min="0"
                                                        step="0.01"
                                                        className="input px-4"
                                                    />
                                                </div>
                                                <select
                                                    value={
                                                        formData.discountType
                                                    }
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            discountType: e
                                                                .target
                                                                .value as
                                                                | 'percentage'
                                                                | 'fixed',
                                                        })
                                                    }
                                                    className="px-3 py-2 border border-primary-10 rounded-lg text-sm text-primary focus:outline-none focus:border-primary"
                                                >
                                                    <option value="percentage">
                                                        %
                                                    </option>
                                                    <option value="fixed">
                                                        $
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="space-y-6">
                                {/* Company Info */}
                                <div>
                                    <h3 className="text-sm font-semibold text-primary mb-4">
                                        Company Information
                                    </h3>
                                    <div className="space-y-4">
                                        {/* Logo Upload */}
                                        <div>
                                            <label className="input-label">
                                                Company Logo
                                            </label>
                                            <div className="flex items-center gap-4">
                                                {companyInfo.logo && (
                                                    <img
                                                        src={companyInfo.logo}
                                                        alt="Company Logo"
                                                        className="w-16 h-16 object-contain border border-primary-10 rounded-lg"
                                                    />
                                                )}
                                                <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary-10 rounded-lg transition-colors cursor-pointer border border-primary-10">
                                                    <FaUpload className="w-3 h-3" />
                                                    Upload Logo
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={
                                                            handleLogoUpload
                                                        }
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="input-label">
                                                Company Name
                                            </label>
                                            <div className="input-wrap">
                                                <input
                                                    type="text"
                                                    value={companyInfo.name}
                                                    onChange={(e) =>
                                                        setCompanyInfo({
                                                            ...companyInfo,
                                                            name: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="input px-4"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="input-label">
                                                Address
                                            </label>
                                            <div className="input-wrap">
                                                <input
                                                    type="text"
                                                    value={companyInfo.address}
                                                    onChange={(e) =>
                                                        setCompanyInfo({
                                                            ...companyInfo,
                                                            address:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="input px-4"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="input-label">
                                                    City
                                                </label>
                                                <div className="input-wrap">
                                                    <input
                                                        type="text"
                                                        value={companyInfo.city}
                                                        onChange={(e) =>
                                                            setCompanyInfo({
                                                                ...companyInfo,
                                                                city: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        className="input px-4"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="input-label">
                                                    Postal Code
                                                </label>
                                                <div className="input-wrap">
                                                    <input
                                                        type="text"
                                                        value={
                                                            companyInfo.postalCode
                                                        }
                                                        onChange={(e) =>
                                                            setCompanyInfo({
                                                                ...companyInfo,
                                                                postalCode:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="input px-4"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="input-label">
                                                Country
                                            </label>
                                            <div className="input-wrap">
                                                <input
                                                    type="text"
                                                    value={companyInfo.country}
                                                    onChange={(e) =>
                                                        setCompanyInfo({
                                                            ...companyInfo,
                                                            country:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="input px-4"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="input-label">
                                                Email
                                            </label>
                                            <div className="input-wrap">
                                                <input
                                                    type="email"
                                                    value={companyInfo.email}
                                                    onChange={(e) =>
                                                        setCompanyInfo({
                                                            ...companyInfo,
                                                            email: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="input px-4"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side - Invoice Preview */}
                <div className="hidden md:flex flex-1 bg-lightBg items-center justify-center p-8 overflow-y-auto">
                    <div className="w-full max-w-xl bg-white rounded-2 shadow-sm border border-primary-10 p-8">
                        {/* Logo and Invoice Header */}
                        <div className="flex justify-between items-start mb-6">
                            {companyInfo.logo ? (
                                <img
                                    src={companyInfo.logo}
                                    alt="Company Logo"
                                    className="w-16 h-16 object-contain"
                                />
                            ) : (
                                <div></div>
                            )}
                            <h2 className="text-3xl font-light text-primary">
                                Invoice
                            </h2>
                        </div>

                        {/* Invoice Details */}
                        <div className="mb-6 text-sm">
                            <div className="flex gap-8">
                                <div>
                                    <div className="text-primary-75 font-medium">
                                        Invoice number
                                    </div>
                                    <div className="text-primary-75 mt-1">
                                        Issue date
                                    </div>
                                    <div className="text-primary-75">
                                        Due date
                                    </div>
                                </div>
                                <div>
                                    <div className="text-primary">
                                        {formData.invoiceNumber}
                                    </div>
                                    <div className="text-primary mt-1">
                                        {formatDate(formData.issueDate)}
                                    </div>
                                    <div className="text-primary">
                                        {formatDate(formData.dueDate)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Company & Bill To */}
                        <div className="flex justify-between mb-8 text-sm">
                            <div>
                                <div className="font-medium text-primary">
                                    {companyInfo.name}
                                </div>
                                <div className="text-primary-75 mt-1">
                                    {companyInfo.address}
                                </div>
                                <div className="text-primary-75">
                                    {companyInfo.city}
                                </div>
                                <div className="text-primary-75">
                                    {companyInfo.country}
                                </div>
                                <div className="text-primary-75">
                                    {companyInfo.postalCode}
                                </div>
                                <div className="text-primary-75">
                                    {companyInfo.email}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-primary-75 font-medium">
                                    Bill to
                                </div>
                                {formData.customer && (
                                    <>
                                        <div className="text-primary mt-1">
                                            {formData.customer.name}
                                        </div>
                                        {formData.customer.email && (
                                            <div className="text-primary-75 text-xs mt-1">
                                                {formData.customer.email}
                                            </div>
                                        )}
                                        {formData.customer.address && (
                                            <div className="text-primary-75 text-xs mt-1">
                                                {formData.customer.address}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Amount Due */}
                        <div className="mb-6">
                            <div className="text-2xl font-medium text-primary">
                                {formatCurrency(total)} due{' '}
                                {formatDate(formData.dueDate)}
                            </div>
                        </div>

                        {/* Line Items Table */}
                        <div className="border-t border-primary-10 pt-4">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-primary-75">
                                        <th className="text-left py-2 font-normal">
                                            Description
                                        </th>
                                        <th className="text-center py-2 font-normal w-16">
                                            Qty
                                        </th>
                                        <th className="text-right py-2 font-normal w-20">
                                            Price
                                        </th>
                                        <th className="text-right py-2 font-normal w-20">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.lineItems.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="py-8 text-center text-primary-50"
                                            >
                                                No items added
                                            </td>
                                        </tr>
                                    )}
                                    {formData.lineItems.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-t border-primary-10"
                                        >
                                            <td className="py-2 text-primary">
                                                {item.description ||
                                                    'Untitled Item'}
                                            </td>
                                            <td className="text-center py-2 text-primary">
                                                {item.qty}
                                            </td>
                                            <td className="text-right py-2 text-primary">
                                                {formatCurrency(item.price)}
                                            </td>
                                            <td className="text-right py-2 text-primary">
                                                {formatCurrency(
                                                    item.qty * item.price
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="border-t border-primary-10 pt-4 mt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-primary-75">
                                    Subtotal
                                </span>
                                <span className="text-primary">
                                    {formatCurrency(subtotal)}
                                </span>
                            </div>
                            {formData.discount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-primary-75">
                                        Discount (
                                        {formData.discountType === 'percentage'
                                            ? `${formData.discount}%`
                                            : formatCurrency(formData.discount)}
                                        )
                                    </span>
                                    <span className="text-primary">
                                        -{formatCurrency(discountAmount)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-primary-75">
                                    Tax ({formData.taxRate}%)
                                </span>
                                <span className="text-primary">
                                    {formatCurrency(totalTax)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm py-1 border-t border-primary-10 pt-3">
                                <span className="font-medium text-primary">
                                    Amount due
                                </span>
                                <span className="font-medium text-primary">
                                    {formatCurrency(total)}
                                </span>
                            </div>
                        </div>

                        {/* Notes */}
                        {formData.notes && (
                            <div className="mt-6 pt-6 border-t border-primary-10">
                                <div className="text-xs font-medium text-primary-75 mb-2">
                                    Notes:
                                </div>
                                <div className="text-xs text-primary-75 whitespace-pre-wrap">
                                    {formData.notes}
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="mt-auto pt-16 text-xs text-primary-50 flex justify-between">
                            <span>
                                Invoice {formData.invoiceNumber} •{' '}
                                {formatCurrency(total)} due{' '}
                                {formatDate(formData.dueDate)}
                            </span>
                            <span>Page 1 of 1</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateInvoiceModal;
