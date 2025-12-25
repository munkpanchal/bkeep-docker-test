/**
 * Journal Entry Types
 */

export type JournalEntryLine = {
    accountId: string;
    lineNumber: number;
    debit: number;
    credit: number;
    description: string;
    memo?: string;
};

export type JournalEntry = {
    id: string;
    journalNo: string;
    journalDate: string;
    isAdjusting: boolean;
    lines: JournalEntryLine[];
    memo?: string;
    attachments?: string[];
    status: 'draft' | 'posted' | 'voided';
    isRecurring?: boolean;
    recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    totalDebit: number;
    totalCredit: number;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    tenantId?: string;
};

export type CreateJournalEntryPayload = {
    entryNumber?: string;
    entryDate: string;
    entryType?: 'standard' | 'adjusting' | 'closing' | 'reversing';
    isAdjusting: boolean;
    isClosing?: boolean;
    isReversing?: boolean;
    reversalDate?: string | null;
    description?: string;
    reference?: string;
    sourceModule?: string;
    sourceId?: string;
    lines: JournalEntryLine[];
    attachments?: File[];
};

export type UpdateJournalEntryPayload = Partial<CreateJournalEntryPayload>;

export type JournalEntriesListResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        journalEntries: JournalEntry[];
        total: number;
        page: number;
        limit: number;
    };
};

export type JournalEntryResponse = {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        journalEntry: JournalEntry;
    };
};

export type JournalEntryFilters = {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'draft' | 'posted' | 'voided';
    startDate?: string;
    endDate?: string;
    isAdjusting?: boolean;
};
