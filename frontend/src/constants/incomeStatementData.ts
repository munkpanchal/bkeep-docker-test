export interface IncomeStatementPeriod {
    label: string;
    startDate: string;
    endDate: string;
}

export interface IncomeStatementLineItem {
    code?: string;
    label: string;
    values: number[];
}

export interface IncomeStatementSection {
    id: string;
    label: string;
    type: 'expandable' | 'static' | 'calculated' | 'final';
    totalValues: number[];
    items?: IncomeStatementLineItem[];
    collapsible?: boolean;
}

export const incomeStatementPeriods: IncomeStatementPeriod[] = [
    {
        label: 'Dec 01, 2024 - Jan 01, 2025',
        startDate: '2024-12-01',
        endDate: '2025-01-01',
    },
    {
        label: 'Jan 01, 2025 - Feb 01, 2025',
        startDate: '2025-01-01',
        endDate: '2025-02-01',
    },
    {
        label: 'Feb 01, 2025 - Mar 01, 2025',
        startDate: '2025-02-01',
        endDate: '2025-03-01',
    },
    {
        label: 'Mar 01, 2025 - Apr 01, 2025',
        startDate: '2025-03-01',
        endDate: '2025-04-01',
    },
];

export const incomeStatementSections: IncomeStatementSection[] = [
    {
        id: 'revenue',
        label: 'Revenue',
        type: 'expandable',
        collapsible: true,
        totalValues: [2053319, 382235, 267326, 321410],
        items: [
            {
                code: '8000',
                label: 'Trade sales of goods and services',
                values: [2061167, 379569, 267569, 322179],
            },
            {
                code: '8231',
                label: 'gains/losses',
                values: [-7848, 2666, -243, -769],
            },
            {
                code: '80078',
                label: 'Trade sales of goods and services',
                values: [240117, 349569, 254569, 322179],
            },
            {
                code: '8256',
                label: 'Foreign exchange gains/losses',
                values: [-7848, 2666, -2473, -769],
            },
        ],
    },
    {
        id: 'costOfSales',
        label: 'Cost of Sales',
        type: 'static',
        collapsible: false,
        totalValues: [0, 0, 0, 0],
    },
    {
        id: 'grossProfit',
        label: 'Gross Profit',
        type: 'calculated',
        collapsible: false,
        totalValues: [2053319, 382235, 267326, 321410],
    },
    {
        id: 'operatingExpenses',
        label: 'Operating Expenses',
        type: 'expandable',
        collapsible: true,
        totalValues: [1239091, 174592, 135809, 163082],
        items: [
            {
                code: '8523',
                label: 'Meals and entertainment',
                values: [252883, 64476, 22613, 35115],
            },
            {
                code: '8811',
                label: 'Office stationery and supplies',
                values: [32141, 0, 0, 0],
            },
            {
                code: '9150',
                label: 'Computer-related expenses',
                values: [217065, 0, 26843, 37957],
            },
            {
                code: '9200',
                label: 'Travel expenses',
                values: [163165, 35659, 23809, 0],
            },
            {
                label: 'Uncategorized Operating expenses',
                values: [573837, 74457, 62544, 90010],
            },
        ],
    },
    {
        id: 'netProfitBeforeExtraordinary',
        label: 'Net Profit Before Extraordinary Items',
        type: 'calculated',
        collapsible: false,
        totalValues: [814228, 207643, 131517, 158328],
    },
    {
        id: 'extraordinaryItems',
        label: 'Extraordinary Items and Taxes',
        type: 'static',
        collapsible: false,
        totalValues: [0, 0, 0, 0],
    },
    {
        id: 'netProfit',
        label: 'Net Profit',
        type: 'final',
        collapsible: false,
        totalValues: [814228, 207643, 131517, 158328],
    },
];
