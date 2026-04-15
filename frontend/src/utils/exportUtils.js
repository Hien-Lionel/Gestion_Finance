/**
 * Export utilities — CSV, PDF, and JSON exports for all data tables
 */

// ── Enterprise helper ──
export const getActiveEnterpriseName = () => {
  try {
    const id = localStorage.getItem('sf_active_enterprise');
    const enterprises = JSON.parse(localStorage.getItem('sf_enterprises') || '[]');
    const ent = enterprises.find(e => e.id === id);
    return ent ? ent.name : 'Faso Finance';
  } catch {
    return 'Faso Finance';
  }
};

// ── CSV Export ──
export const exportToCSV = (data, columns, filename = 'export') => {
  if (!data || data.length === 0) return;

  const headers = columns.map(col => col.title).join(',');
  const rows = data.map(row =>
    columns.map(col => {
      let value = row[col.dataIndex] ?? '';
      // Escape commas and quotes
      value = String(value).replace(/"/g, '""');
      if (String(value).includes(',') || String(value).includes('"') || String(value).includes('\n')) {
        value = `"${value}"`;
      }
      return value;
    }).join(',')
  );

  const csvContent = [headers, ...rows].join('\n');
  const BOM = '\uFEFF'; // UTF-8 BOM for Excel
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const entName = getActiveEnterpriseName().replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const safeFilename = entName !== 'sant__finance' ? `${filename}_${entName}` : filename;
  
  triggerDownload(blob, `${safeFilename}.csv`);
};

// ── JSON Export ──
export const exportToJSON = (data, filename = 'export') => {
  if (!data || data.length === 0) return;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  triggerDownload(blob, `${filename}.json`);
};

// ── PDF Export (HTML-based, opens print dialog to save as PDF) ──
export const exportToPDF = (data, columns, title = 'Rapport', filename = 'rapport') => {
  if (!data || data.length === 0) return;

  const headerRow = columns.map(col =>
    `<th style="border:1px solid #ddd;padding:10px 14px;background:#3F51B5;color:#fff;text-align:left;font-size:13px">${col.title}</th>`
  ).join('');

  const bodyRows = data.map(row =>
    '<tr>' + columns.map(col => {
      const value = row[col.dataIndex] ?? '';
      return `<td style="border:1px solid #eee;padding:8px 14px;font-size:13px">${value}</td>`;
    }).join('') + '</tr>'
  ).join('');

  const html = buildPDFHTML(title, `
    <table>
      <thead><tr>${headerRow}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>
  `);

  openPrintWindow(html);
};

// ── Invoice PDF Export ──
export const exportInvoicePDF = (invoice, formatMoney) => {
  if (!invoice) return;

  const paid = invoice.paid || 0;
  const remaining = invoice.amount - paid;
  const statusText = { paye: 'Payée', en_attente: 'En attente', en_retard: 'En retard' };
  const statusColor = { paye: '#4CAF50', en_attente: '#FF9800', en_retard: '#f44336' };

  const paymentRows = (invoice.paymentHistory || []).filter(p => p.amount > 0).map(p => `
    <tr>
      <td style="border:1px solid #eee;padding:8px 14px;font-size:13px">${p.date}</td>
      <td style="border:1px solid #eee;padding:8px 14px;font-size:13px">${p.note || '-'}</td>
      <td style="border:1px solid #eee;padding:8px 14px;font-size:13px;text-align:right;color:#4CAF50;font-weight:600">${formatMoney(p.amount)}</td>
    </tr>
  `).join('');

  const content = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:30px">
      <div>
        <h2 style="color:#2d3436;margin:0 0 6px;font-size:24px">FACTURE ${invoice.reference}</h2>
        <p style="color:#636e72;margin:0;font-size:14px">Client: <strong>${invoice.client}</strong></p>
        <p style="color:#636e72;margin:4px 0 0;font-size:14px">Échéance: ${invoice.dueDate}</p>
      </div>
      <div style="text-align:right">
        <span style="background:${statusColor[invoice.status] || '#FF9800'};color:#fff;padding:4px 16px;border-radius:20px;font-size:13px;font-weight:600">
          ${statusText[invoice.status] || 'En attente'}
        </span>
      </div>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
      <tr style="background:#f8f9fa">
        <td style="padding:14px;font-size:13px;color:#636e72;border:1px solid #eee">Montant Total</td>
        <td style="padding:14px;font-size:18px;font-weight:800;text-align:right;border:1px solid #eee;color:#2d3436">${formatMoney(invoice.amount)}</td>
      </tr>
      <tr>
        <td style="padding:14px;font-size:13px;color:#636e72;border:1px solid #eee">Montant Payé</td>
        <td style="padding:14px;font-size:16px;font-weight:700;text-align:right;border:1px solid #eee;color:#4CAF50">${formatMoney(paid)}</td>
      </tr>
      <tr style="background:#f8f9fa">
        <td style="padding:14px;font-size:13px;color:#636e72;border:1px solid #eee">Reste à Payer</td>
        <td style="padding:14px;font-size:16px;font-weight:700;text-align:right;border:1px solid #eee;color:#E91E63">${formatMoney(remaining)}</td>
      </tr>
    </table>

    ${paymentRows ? `
    <h3 style="font-size:16px;color:#2d3436;margin:20px 0 12px">Historique des Paiements</h3>
    <table style="width:100%;border-collapse:collapse">
      <thead>
        <tr>
          <th style="border:1px solid #ddd;padding:10px;background:#3F51B5;color:#fff;text-align:left;font-size:12px">Date</th>
          <th style="border:1px solid #ddd;padding:10px;background:#3F51B5;color:#fff;text-align:left;font-size:12px">Description</th>
          <th style="border:1px solid #ddd;padding:10px;background:#3F51B5;color:#fff;text-align:right;font-size:12px">Montant</th>
        </tr>
      </thead>
      <tbody>${paymentRows}</tbody>
    </table>
    ` : ''}
  `;

  const html = buildPDFHTML(`Facture ${invoice.reference}`, content);
  openPrintWindow(html);
};

// ── Database Export (exports all localStorage data as JSON) ──
export const exportDatabase = () => {
  const dbData = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('sf_') || key === 'accessToken' || key === 'userRole' || key === 'userInfo') {
      try {
        dbData[key] = JSON.parse(localStorage.getItem(key));
      } catch {
        dbData[key] = localStorage.getItem(key);
      }
    }
  }
  const blob = new Blob([JSON.stringify(dbData, null, 2)], { type: 'application/json' });
  triggerDownload(blob, `sante-finance-backup-${new Date().toISOString().split('T')[0]}.json`);
};


// ── Shared PDF HTML builder ──
const buildPDFHTML = (title, bodyContent) => {
  const entName = getActiveEnterpriseName();
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>${title} - ${entName}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Inter', sans-serif; padding: 40px; background: #fff; color: #2d3436; }
      .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #3F51B5; }
      .logo { display: flex; align-items: center; gap: 12px; }
      .logo-icon { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #4a148c, #d81b60); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 13px; }
      .logo-text { font-size: 20px; font-weight: 700; color: #2d3436; }
      .date { color: #636e72; font-size: 13px; }
      h1 { font-size: 22px; color: #2d3436; margin-bottom: 20px; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      tr:nth-child(even) { background: #f9f9ff; }
      .footer { margin-top: 30px; padding-top: 16px; border-top: 1px solid #eee; color: #b2bec3; font-size: 11px; text-align: center; }
      @media print {
        body { padding: 20px; }
        @page { margin: 15mm; }
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="logo">
        <div class="logo-icon">${entName !== 'Faso Finance' ? entName.substring(0, 2).toUpperCase() : 'SF'}</div>
        <div class="logo-text">${entName}</div>
      </div>
      <div class="date">Généré le ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
    </div>
    <h1>${title}</h1>
    ${bodyContent}
    <div class="footer">© ${new Date().getFullYear()} ${entName} — Document confidentiel</div>
  </body>
  </html>
  `;
};

// ── Open print window helper ──
const openPrintWindow = (html) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 600);
  }
};

// ── Download helper ──
const triggerDownload = (blob, filename) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
