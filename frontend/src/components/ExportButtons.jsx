import * as XLSX from 'xlsx';

const ExportButtons = ({ data, filename = 'export', columns }) => {
    const formatData = () => {
        if (!columns) return data;

        return data.map(row => {
            const formattedRow = {};
            columns.forEach(col => {
                formattedRow[col.header] = col.accessor(row);
            });
            return formattedRow;
        });
    };

    const exportToCSV = () => {
        const formattedData = formatData();
        if (formattedData.length === 0) {
            alert('Nu există date de exportat');
            return;
        }

        const headers = Object.keys(formattedData[0]);
        const csvContent = [
            headers.join(','),
            ...formattedData.map(row =>
                headers.map(header => {
                    const value = row[header];
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value ?? '';
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const exportToXLSX = () => {
        const formattedData = formatData();
        if (formattedData.length === 0) {
            alert('Nu există date de exportat');
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

        const colWidths = Object.keys(formattedData[0]).map(key => ({
            wch: Math.max(key.length, ...formattedData.map(row => String(row[key] || '').length))
        }));
        worksheet['!cols'] = colWidths;

        XLSX.writeFile(workbook, `${filename}.xlsx`);
    };

    return (
        <div className="export-buttons">
            <button onClick={exportToCSV} className="btn btn-secondary">
                Export CSV
            </button>
            <button onClick={exportToXLSX} className="btn btn-secondary">
                Export XLSX
            </button>
        </div>
    );
};

export default ExportButtons;
