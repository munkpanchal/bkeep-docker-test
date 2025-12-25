import { useNavigate, useParams } from 'react-router';
import { JournalEntryForm } from '../../components/journal/JournalEntryForm';
import Loading from '../../components/shared/Loading';
import PageHeader from '../../components/shared/PageHeader';
import {
    useJournalEntry,
    useUpdateJournalEntry,
} from '../../services/apis/journalApi';
import type { CreateJournalEntryPayload } from '../../types/journal';

export default function EditJournalEntrypage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data, isLoading } = useJournalEntry(id!);
    const { mutate: updateEntry, isPending } = useUpdateJournalEntry();

    const journalEntry = data?.data?.journalEntry;

    const handleSubmit = (payload: CreateJournalEntryPayload) => {
        if (!id) return;

        updateEntry(
            { id, payload },
            {
                onSuccess: () => {
                    navigate('/journal-entries');
                },
            }
        );
    };

    const handleCancel = () => {
        navigate('/journal-entries');
    };

    if (isLoading) {
        return <Loading />;
    }

    if (!journalEntry) {
        return (
            <div className="text-center py-12">
                <p className="text-sm text-red-600">Journal entry not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <PageHeader
                title={`Edit Journal Entry ${journalEntry.journalNo}`}
                subtitle="Update journal entry details"
            />

            <div className="bg-white rounded-lg border border-primary-10 p-4">
                <JournalEntryForm
                    initialData={{
                        entryNumber: journalEntry.journalNo, // Map journalNo to entryNumber
                        entryDate: journalEntry.journalDate, // Map journalDate to entryDate
                        entryType: journalEntry.isAdjusting
                            ? 'adjusting'
                            : 'standard',
                        isAdjusting: journalEntry.isAdjusting,
                        lines: journalEntry.lines.map((line, index) => ({
                            accountId: line.accountId,
                            lineNumber: index + 1,
                            debit: line.debit,
                            credit: line.credit,
                            description: line.description,
                            memo: line.description, // Use description as memo if memo not available
                        })),
                        description: journalEntry.memo,
                    }}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isPending}
                />
            </div>
        </div>
    );
}
