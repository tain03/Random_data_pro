document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const rangeConfig = document.getElementById('range-config');
    const patternConfig = document.getElementById('pattern-config');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const exportBtn = document.getElementById('export-btn');
    const dataTable = document.getElementById('data-table');
    const tableWrapper = document.getElementById('table-wrapper');
    const toast = document.getElementById('toast');

    // Inputs
    const minValInput = document.getElementById('min-val');
    const maxValInput = document.getElementById('max-val');
    const decimalsInput = document.getElementById('decimals');
    const patternStrInput = document.getElementById('pattern-str');
    const rowsInput = document.getElementById('rows');
    const colsInput = document.getElementById('cols');

    let currentMode = 'range'; // 'range' or 'pattern'
    let generatedData = [];

    // Tab Switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentMode = btn.dataset.type;
            if (currentMode === 'range') {
                rangeConfig.classList.remove('hidden');
                patternConfig.classList.add('hidden');
            } else {
                rangeConfig.classList.add('hidden');
                patternConfig.classList.remove('hidden');
            }
        });
    });

    // Data Generation Logic
    function generateRandomInRange(min, max, decimals) {
        const rand = Math.random() * (max - min) + min;
        return rand.toFixed(decimals);
    }

    function generateRandomByPattern(pattern) {
        return pattern.replace(/x/g, () => Math.floor(Math.random() * 10));
    }

    function generateData() {
        const rows = parseInt(rowsInput.value) || 10;
        const cols = parseInt(colsInput.value) || 3;
        const min = parseFloat(minValInput.value) || 0;
        const max = parseFloat(maxValInput.value) || 100;
        const decimals = parseInt(decimalsInput.value) || 0;
        const pattern = patternStrInput.value || 'ID-xxxx';

        generatedData = [];

        for (let r = 0; r < rows; r++) {
            const rowData = [];
            for (let c = 0; c < cols; c++) {
                if (currentMode === 'range') {
                    rowData.push(generateRandomInRange(min, max, decimals));
                } else {
                    rowData.push(generateRandomByPattern(pattern));
                }
            }
            generatedData.push(rowData);
        }

        renderTable();
    }

    // Table Rendering
    function renderTable() {
        if (generatedData.length === 0) return;

        // Clear empty state
        const emptyState = tableWrapper.querySelector('.empty-state');
        if (emptyState) emptyState.remove();

        const cols = generatedData[0].length;
        
        let html = '<thead><tr>';
        for (let c = 0; c < cols; c++) {
            html += `<th>Cột ${c + 1}</th>`;
        }
        html += '</tr></thead><tbody>';

        generatedData.forEach((row, rowIndex) => {
            html += '<tr>';
            row.forEach((cell, colIndex) => {
                html += `<td contenteditable="true" data-row="${rowIndex}" data-col="${colIndex}">${cell}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody>';

        dataTable.innerHTML = html;

        // Add listeners for editing
        const cells = dataTable.querySelectorAll('td');
        cells.forEach(cell => {
            cell.addEventListener('blur', (e) => {
                const r = e.target.dataset.row;
                const c = e.target.dataset.col;
                generatedData[r][c] = e.target.innerText;
            });
        });
    }

    // Export & Copy
    function copyToClipboard() {
        if (generatedData.length === 0) return;

        const csvContent = generatedData.map(row => row.join('\t')).join('\n');
        navigator.clipboard.writeText(csvContent).then(() => {
            showToast();
        });
    }

    function exportToCSV() {
        if (generatedData.length === 0) return;

        const csvContent = generatedData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'random_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    // Event Listeners
    generateBtn.addEventListener('click', generateData);
    copyBtn.addEventListener('click', copyToClipboard);
    exportBtn.addEventListener('click', exportToCSV);
});
