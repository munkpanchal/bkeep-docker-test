import { useRef, useState } from 'react';
import {
    FaDownload,
    FaEye,
    FaFile,
    FaFileExcel,
    FaFileImage,
    FaFilePdf,
    FaFileWord,
    FaFilter,
    FaFolder,
    FaSearch,
    FaTrash,
    FaUpload,
} from 'react-icons/fa';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import { InputField } from '../../components/typography/InputFields';

type Document = {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedDate: string;
    category: string;
    uploadedBy: string;
};

const MOCK_DOCUMENTS: Document[] = [
    {
        id: '1',
        name: 'Invoice_2024_001.pdf',
        type: 'pdf',
        size: 245760,
        uploadedDate: '2024-01-15',
        category: 'Invoices',
        uploadedBy: 'John Doe',
    },
    {
        id: '2',
        name: 'Receipt_Office_Supplies.jpg',
        type: 'image',
        size: 1024000,
        uploadedDate: '2024-01-18',
        category: 'Receipts',
        uploadedBy: 'Jane Smith',
    },
    {
        id: '3',
        name: 'Financial_Report_Q1.xlsx',
        type: 'excel',
        size: 512000,
        uploadedDate: '2024-01-20',
        category: 'Reports',
        uploadedBy: 'John Doe',
    },
    {
        id: '4',
        name: 'Contract_Agreement.docx',
        type: 'word',
        size: 128000,
        uploadedDate: '2024-01-22',
        category: 'Contracts',
        uploadedBy: 'Jane Smith',
    },
];

const CATEGORIES = [
    'All',
    'Invoices',
    'Receipts',
    'Reports',
    'Contracts',
    'Tax Documents',
    'Other',
];

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

const getFileIcon = (type: string) => {
    switch (type) {
        case 'pdf':
            return <FaFilePdf className="w-6 h-6 text-red-600" />;
        case 'image':
            return <FaFileImage className="w-6 h-6 text-green-600" />;
        case 'excel':
            return <FaFileExcel className="w-6 h-6 text-green-700" />;
        case 'word':
            return <FaFileWord className="w-6 h-6 text-blue-600" />;
        default:
            return <FaFile className="w-6 h-6 text-primary-50" />;
    }
};

const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    if (['pdf'].includes(extension)) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(extension))
        return 'image';
    if (['xls', 'xlsx', 'csv'].includes(extension)) return 'excel';
    if (['doc', 'docx'].includes(extension)) return 'word';
    return 'file';
};

const getCategoryFromFileName = (fileName: string): string => {
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('invoice')) return 'Invoices';
    if (lowerName.includes('receipt')) return 'Receipts';
    if (lowerName.includes('report')) return 'Reports';
    if (lowerName.includes('contract')) return 'Contracts';
    if (lowerName.includes('tax')) return 'Tax Documents';
    return 'Other';
};

const Documentspage = () => {
    const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('All');
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<string | null>(
        null
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredDocuments = documents.filter((doc) => {
        const matchesSearch = doc.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesCategory =
            categoryFilter === 'All' || doc.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(Array.from(e.target.files));
        }
        // Reset input value to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFiles = async (files: File[]) => {
        setIsUploading(true);

        try {
            // Process each file
            const newDocuments: Document[] = files.map((file) => {
                const fileType = getFileType(file.name);
                const category = getCategoryFromFileName(file.name);
                const uploadedBy = 'Current User'; // You can get this from auth context

                return {
                    id:
                        Date.now().toString() +
                        Math.random().toString(36).substr(2, 9),
                    name: file.name,
                    type: fileType,
                    size: file.size,
                    uploadedDate: new Date().toISOString().split('T')[0],
                    category: category,
                    uploadedBy: uploadedBy,
                };
            });

            // Simulate upload delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Add new documents to the list
            setDocuments((prevDocuments) => [
                ...newDocuments,
                ...prevDocuments,
            ]);
        } catch (error) {
            console.error('Error uploading files:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleUploadAreaClick = () => {
        fileInputRef.current?.click();
    };

    const handleDeleteClick = (documentId: string) => {
        setDocumentToDelete(documentId);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (documentToDelete) {
            setDocuments((prevDocuments) =>
                prevDocuments.filter((doc) => doc.id !== documentToDelete)
            );
            setDeleteDialogOpen(false);
            setDocumentToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setDocumentToDelete(null);
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.xls,.xlsx,.csv,.doc,.docx"
                onChange={handleFileInputChange}
                className="hidden"
            />

            {/* Upload Area */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleUploadAreaClick}
                className={`w-full max-w-3xl mx-auto border-2 border-dashed rounded-2 p-10 sm:p-12 text-center transition-all cursor-pointer shadow-sm ${
                    dragActive
                        ? 'border-primary bg-primary-10 shadow-md scale-[1.01]'
                        : 'border-primary-25 bg-primary-5 hover:border-primary hover:bg-primary-10'
                }`}
            >
                <FaUpload className="w-12 h-12 text-primary-50 mx-auto mb-4" />
                <p className="text-lg font-semibold text-primary mb-2">
                    Drag and drop files here
                </p>
                <p className="text-sm text-primary-50 mb-4">
                    or click here to browse files
                </p>
                <p className="text-xs text-primary-50">
                    Supported formats: PDF, Images, Excel, Word
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2 shadow-sm border border-primary-10 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-50 w-4 h-4" />
                            <InputField
                                id="search-documents"
                                placeholder="Search documents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaFilter className="text-primary-50" />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2 border border-primary-10 rounded-2 text-sm text-primary focus:outline-none focus:border-primary"
                        >
                            {CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Documents Grid */}
            {isUploading && (
                <div className="bg-blue-50 border border-blue-200 rounded-2 p-4 text-center">
                    <p className="text-blue-700 font-medium">
                        Uploading files...
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredDocuments.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-primary-50">
                        No documents found
                    </div>
                ) : (
                    filteredDocuments.map((doc) => (
                        <div
                            key={doc.id}
                            className="bg-white rounded-2 shadow-sm border border-primary-10 p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {getFileIcon(doc.type)}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-primary truncate">
                                            {doc.name}
                                        </div>
                                        <div className="text-xs text-primary-50">
                                            {formatFileSize(doc.size)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 mb-3">
                                <div className="flex items-center gap-2 text-xs text-primary-50">
                                    <FaFolder className="w-3 h-3" />
                                    <span>{doc.category}</span>
                                </div>
                                <div className="text-xs text-primary-50">
                                    Uploaded:{' '}
                                    {new Date(
                                        doc.uploadedDate
                                    ).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-primary-50">
                                    By: {doc.uploadedBy}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-3 border-t border-primary-10">
                                <button
                                    className="flex-1 px-3 py-2 text-xs font-medium text-primary bg-primary-10 rounded-lg hover:bg-primary-25 transition-colors"
                                    title="View"
                                >
                                    <FaEye className="w-3 h-3 mx-auto" />
                                </button>
                                <button
                                    className="flex-1 px-3 py-2 text-xs font-medium text-primary bg-primary-10 rounded-lg hover:bg-primary-25 transition-colors"
                                    title="Download"
                                >
                                    <FaDownload className="w-3 h-3 mx-auto" />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(doc.id)}
                                    className="flex-1 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                    title="Delete"
                                >
                                    <FaTrash className="w-3 h-3 mx-auto" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={deleteDialogOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Delete Document"
                message="Are you sure you want to delete this document? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                confirmVariant="danger"
            />
        </div>
    );
};

export default Documentspage;
