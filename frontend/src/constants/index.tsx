import {
    FaCog,
    FaCommentDots,
    FaFileAlt,
    FaFileInvoiceDollar,
    FaReceipt,
    FaSignOutAlt,
    FaUpload,
} from 'react-icons/fa';
import {
    FaBook,
    FaBookJournalWhills,
    FaHouse,
    FaMoneyBillTransfer,
} from 'react-icons/fa6';
import { SidebarItemProps } from '../types';

export const SIDEBAR_ITEMS: SidebarItemProps[] = [
    {
        label: 'Dashboard',
        icon: <FaHouse />,
        path: '/dashboard',
    },
    {
        label: 'Transactions',
        icon: <FaMoneyBillTransfer />,
        path: '/transactions',
    },
    {
        label: 'Reports',
        icon: <FaFileAlt />,
        path: '/reports',
    },
    {
        label: 'Chart of Accounts',
        icon: <FaBook />,
        path: '/chart-of-accounts',
    },
    {
        label: 'Journal Entries',
        icon: <FaBookJournalWhills />,
        path: '/journal-entries',
    },
    {
        label: 'Invoices',
        icon: <FaFileInvoiceDollar />,
        path: '/invoices',
    },
    {
        label: 'Expenses',
        icon: <FaReceipt />,
        path: '/expenses',
    },
    {
        label: 'Documents',
        icon: <FaUpload />,
        path: '/documents',
    },
    {
        label: 'Client Review',
        icon: <FaCommentDots />,
        path: '/client-review',
    },
    {
        label: 'Settings',
        icon: <FaCog />,
        path: '/settings',
    },
];

export const LOGOUT_ITEM = {
    label: 'Logout',
    icon: <FaSignOutAlt />,
    path: '/logout',
};

export const APP_TITLE = 'BKeep Accounting';

export const USER_NAME = 'Mauank';
