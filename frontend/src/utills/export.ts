/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from 'xlsx';
import * as XLSXStyle from 'xlsx-js-style';

export interface ExportData {
    [key: string]: string | number;
}

// Theme colors - Primary: RGB(197, 90, 17)
const THEME_COLORS = {
    primary: 'C55A11', // RGB(197, 90, 17) in hex
    primaryLight: 'E8A87A', // Lighter version
    primaryVeryLight: 'F5E6D9', // Very light version
    primaryLighter: 'FFB366', // Even lighter for header banner
    text: '2C2C2C', // Dark text
    textLight: '666666', // Light text
    border: 'E0E0E0', // Light border
    background: 'FFFFFF', // White background
    sectionBg: 'F9F9F9', // Section background
    blue: '5E9BFF', // Blue accent color
    white: 'FFFFFF', // White
};

/**
 * Export data to CSV format
 */
export const exportToCSV = (
    data: ExportData[],
    filename: string = 'report'
): void => {
    if (!data || data.length === 0) {
        console.error('No data to export');
        return;
    }

    // Get headers from the first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
        headers.join(','), // Header row
        ...data.map((row) =>
            headers
                .map((header) => {
                    const value = row[header];
                    // Escape commas and quotes in values
                    if (
                        typeof value === 'string' &&
                        (value.includes(',') || value.includes('"'))
                    ) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                })
                .join(',')
        ),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};

/**
 * Export data to Excel format with modern, minimal styling
 */
export const exportToExcel = (
    data: ExportData[],
    filename: string = 'report',
    sheetName: string = 'Report',
    businessName?: string,
    period?: string,
    currency: string = 'CAD'
): void => {
    if (!data || data.length === 0) {
        console.error('No data to export');
        return;
    }

    // Create workbook
    const workbook = XLSXStyle.utils.book_new();
    const columns = Object.keys(data[0]);
    const maxCols = columns.length;

    // Prepare data with header banner
    const worksheetData: any[][] = [];
    let currentRow = 0;

    // Header banner row 1: Business name
    const businessNameRow: any[] = [];
    businessNameRow.push(`Business: ${businessName || 'Business Name'}`);
    for (let i = 1; i < maxCols; i++) {
        businessNameRow.push('');
    }
    worksheetData.push(businessNameRow);
    currentRow++;

    // Header banner row 2: "by BKeep Accounting"
    const byRow: any[] = [];
    byRow.push('by BKeep Accounting');
    for (let i = 1; i < maxCols; i++) {
        byRow.push('');
    }
    worksheetData.push(byRow);
    currentRow++;

    // Blue separator line (empty row with blue bottom border)
    worksheetData.push(new Array(maxCols).fill(''));
    currentRow++;

    // Metadata rows
    const exportDate = new Date().toISOString().split('T')[0];
    const periodValue = period || 'Yearly';

    // Export Date row
    const exportDateRow: any[] = [];
    exportDateRow.push('Export Date:');
    exportDateRow.push(exportDate);
    for (let i = 2; i < maxCols; i++) {
        exportDateRow.push('');
    }
    worksheetData.push(exportDateRow);
    currentRow++;

    // Period row
    const periodRow: any[] = [];
    periodRow.push('Period:');
    periodRow.push(periodValue);
    for (let i = 2; i < maxCols; i++) {
        periodRow.push('');
    }
    worksheetData.push(periodRow);
    currentRow++;

    // Currency row
    const currencyRow: any[] = [];
    currencyRow.push('Currency:');
    currencyRow.push(currency);
    for (let i = 2; i < maxCols; i++) {
        currencyRow.push('');
    }
    worksheetData.push(currencyRow);
    currentRow++;

    // Empty row before data
    worksheetData.push(new Array(maxCols).fill(''));
    currentRow++;

    // Add header row
    worksheetData.push(columns);
    const headerRowIndex = currentRow;
    currentRow++;

    // Add data rows
    data.forEach((row) => {
        worksheetData.push(columns.map((col) => row[col] || ''));
        currentRow++;
    });

    // Create worksheet from prepared data
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Define styles
    const businessNameStyle = {
        font: {
            name: 'Nunito',
            sz: 18,
            bold: true,
            color: { rgb: THEME_COLORS.white },
        },
        fill: {
            fgColor: { rgb: THEME_COLORS.primaryLighter },
        },
        alignment: {
            horizontal: 'center',
            vertical: 'center',
        },
    };

    const byTextStyle = {
        font: {
            name: 'Nunito',
            sz: 11,
            bold: false,
            color: { rgb: THEME_COLORS.white },
        },
        fill: {
            fgColor: { rgb: THEME_COLORS.primaryLighter },
        },
        alignment: {
            horizontal: 'center',
            vertical: 'center',
        },
    };

    const separatorStyle = {
        fill: {
            fgColor: { rgb: THEME_COLORS.primaryLighter },
        },
        border: {
            bottom: { style: 'medium', color: { rgb: THEME_COLORS.blue } },
        },
    };

    const metadataLabelStyle = {
        font: {
            name: 'Nunito',
            sz: 10,
            bold: true,
            color: { rgb: THEME_COLORS.white },
        },
        fill: {
            fgColor: { rgb: THEME_COLORS.primary },
        },
        alignment: {
            horizontal: 'left',
            vertical: 'center',
        },
        border: {
            right: { style: 'thin', color: { rgb: THEME_COLORS.border } },
        },
    };

    const metadataValueStyle = {
        font: {
            name: 'Nunito',
            sz: 10,
            bold: false,
            color: { rgb: THEME_COLORS.white },
        },
        fill: {
            fgColor: { rgb: THEME_COLORS.primary },
        },
        alignment: {
            horizontal: 'left',
            vertical: 'center',
            wrapText: true,
        },
    };

    const headerStyle = {
        font: {
            name: 'Nunito',
            sz: 12,
            bold: true,
            color: { rgb: THEME_COLORS.background },
        },
        fill: {
            fgColor: { rgb: THEME_COLORS.primary },
        },
        alignment: {
            horizontal: 'left',
            vertical: 'center',
            wrapText: true,
        },
        border: {
            top: { style: 'thin', color: { rgb: THEME_COLORS.primary } },
            bottom: { style: 'thin', color: { rgb: THEME_COLORS.primary } },
            left: { style: 'thin', color: { rgb: THEME_COLORS.primary } },
            right: { style: 'thin', color: { rgb: THEME_COLORS.primary } },
        },
    };

    const sectionHeaderStyle = {
        font: {
            name: 'Nunito',
            sz: 11,
            bold: true,
            color: { rgb: THEME_COLORS.primary },
        },
        fill: {
            fgColor: { rgb: THEME_COLORS.primaryVeryLight },
        },
        alignment: {
            horizontal: 'left',
            vertical: 'center',
        },
        border: {
            bottom: { style: 'thin', color: { rgb: THEME_COLORS.border } },
        },
    };

    const dataStyle = {
        font: {
            name: 'Nunito',
            sz: 10,
            color: { rgb: THEME_COLORS.text },
        },
        alignment: {
            horizontal: 'left',
            vertical: 'center',
        },
        border: {
            bottom: { style: 'thin', color: { rgb: THEME_COLORS.border } },
        },
    };

    const amountStyle = {
        font: {
            name: 'Nunito',
            sz: 10,
            bold: true,
            color: { rgb: THEME_COLORS.text },
        },
        alignment: {
            horizontal: 'right',
            vertical: 'center',
        },
        border: {
            bottom: { style: 'thin', color: { rgb: THEME_COLORS.border } },
        },
    };

    const emptyRowStyle = {
        fill: {
            fgColor: { rgb: THEME_COLORS.background },
        },
    };

    // Get range
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

    // Style header banner
    // Row 0: Business name
    for (let col = 0; col < maxCols; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!worksheet[cellAddress]) {
            worksheet[cellAddress] = {
                t: 's',
                v:
                    col === 0
                        ? `Business: ${businessName || 'Business Name'}`
                        : '',
            };
        }
        worksheet[cellAddress].s = businessNameStyle;
    }

    // Row 1: "by BKeep Accounting"
    for (let col = 0; col < maxCols; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 1, c: col });
        if (!worksheet[cellAddress]) {
            worksheet[cellAddress] = {
                t: 's',
                v: col === 0 ? 'by BKeep Accounting' : '',
            };
        }
        worksheet[cellAddress].s = byTextStyle;
    }

    // Row 2: Blue separator line
    for (let col = 0; col < maxCols; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 2, c: col });
        if (!worksheet[cellAddress]) {
            worksheet[cellAddress] = { t: 's', v: '' };
        }
        worksheet[cellAddress].s = separatorStyle;
    }

    // Merge header banner cells
    if (!worksheet['!merges']) worksheet['!merges'] = [];
    worksheet['!merges'].push(
        { s: { r: 0, c: 0 }, e: { r: 0, c: maxCols - 1 } }, // Business name
        { s: { r: 1, c: 0 }, e: { r: 1, c: maxCols - 1 } } // By text
    );

    // Style metadata rows (rows 3, 4, 5)
    const metadataRows = [3, 4, 5];
    metadataRows.forEach((row) => {
        for (let col = 0; col < maxCols; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (!worksheet[cellAddress]) {
                worksheet[cellAddress] = { t: 's', v: '' };
            }
            if (col === 0) {
                worksheet[cellAddress].s = metadataLabelStyle;
            } else {
                worksheet[cellAddress].s = metadataValueStyle;
            }
        }
    });

    // Data starts at row 7 (after header banner + separator + metadata + empty row)
    const dataStartRow = 7;

    // Style header row (row 6)
    for (let col = 0; col < columns.length; col++) {
        const cellAddress = XLSX.utils.encode_cell({
            r: headerRowIndex,
            c: col,
        });
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = headerStyle;
    }

    // Style data rows
    for (let row = dataStartRow; row <= range.e.r; row++) {
        const sectionCell = XLSX.utils.encode_cell({ r: row, c: 0 });
        const sectionValue = worksheet[sectionCell]?.v;

        // Check if this is a section header
        if (
            typeof sectionValue === 'string' &&
            (sectionValue.includes('Metrics') ||
                sectionValue.includes('Procedure') ||
                sectionValue.includes('Breakdown') ||
                sectionValue.includes('Aging') ||
                sectionValue.includes('Payers'))
        ) {
            // Style section header
            for (let col = 0; col < columns.length; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                if (!worksheet[cellAddress]) continue;
                worksheet[cellAddress].s = sectionHeaderStyle;
            }
        } else if (sectionValue === '' || sectionValue === null) {
            // Empty row for spacing
            for (let col = 0; col < columns.length; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                if (!worksheet[cellAddress]) {
                    worksheet[cellAddress] = { t: 's', v: '' };
                }
                worksheet[cellAddress].s = emptyRowStyle;
            }
        } else {
            // Regular data row
            for (let col = 0; col < columns.length; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                if (!worksheet[cellAddress]) continue;

                // Style amount column differently
                if (columns[col] === 'Amount' && worksheet[cellAddress].v) {
                    worksheet[cellAddress].s = amountStyle;
                } else {
                    worksheet[cellAddress].s = dataStyle;
                }
            }
        }
    }

    // Set column widths for better readability
    const colWidths = columns.map((col) => {
        if (col === 'Section') return { wch: 30 };
        if (col === 'Value') return { wch: 20 };
        if (col === 'Amount') return { wch: 18 };
        return { wch: 15 };
    });
    worksheet['!cols'] = colWidths;

    XLSXStyle.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate Excel file and download
    XLSXStyle.writeFile(workbook, `${filename}.xlsx`);
};

/**
 * Prepare report data for export with better structure
 */
export const prepareReportData = (reportData: any) => {
    const exportData: ExportData[] = [];

    // Add summary metrics
    exportData.push({ Section: 'SUMMARY METRICS', Value: '', Amount: '' });
    exportData.push({
        Section: 'Net Production',
        Value: reportData.metrics.netProduction,
        Amount: `$${reportData.metrics.netProduction.toLocaleString()}`,
    });
    exportData.push({
        Section: 'Total Collections',
        Value: reportData.metrics.totalCollections,
        Amount: `$${reportData.metrics.totalCollections.toLocaleString()}`,
    });
    exportData.push({
        Section: 'Collection Rate',
        Value: `${reportData.metrics.collectionRate}%`,
        Amount: '',
    });
    exportData.push({
        Section: 'New Patients',
        Value: reportData.metrics.newPatients,
        Amount: '',
    });
    exportData.push({ Section: '', Value: '', Amount: '' });

    // Add revenue by procedure
    exportData.push({ Section: 'REVENUE BY PROCEDURE', Value: '', Amount: '' });
    reportData.revenueByProcedure.forEach((item: any) => {
        exportData.push({
            Section: item.name,
            Value: item.percentage,
            Amount: `$${item.revenue.toLocaleString()}`,
        });
    });
    exportData.push({ Section: '', Value: '', Amount: '' });

    // Add expense breakdown
    exportData.push({ Section: 'EXPENSE BREAKDOWN', Value: '', Amount: '' });
    reportData.expenseBreakdown.forEach((item: any) => {
        exportData.push({
            Section: item.category,
            Value: item.percentage,
            Amount: `$${item.amount.toLocaleString()}`,
        });
    });
    exportData.push({ Section: '', Value: '', Amount: '' });

    // Add aging buckets
    exportData.push({ Section: 'RECEIVABLES AGING', Value: '', Amount: '' });
    reportData.agingBuckets.forEach((item: any) => {
        exportData.push({
            Section: item.bucket,
            Value: item.percent,
            Amount: `$${item.amount.toLocaleString()}`,
        });
    });
    exportData.push({ Section: '', Value: '', Amount: '' });

    // Add top payers
    exportData.push({ Section: 'TOP INSURANCE PAYERS', Value: '', Amount: '' });
    reportData.topPayers.forEach((item: any) => {
        exportData.push({
            Section: item.payer,
            Value: `${item.claims} claims, ${item.avgDays} days avg`,
            Amount: `$${item.amount.toLocaleString()}`,
        });
    });

    return exportData;
};
