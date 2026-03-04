/**
 * CSV Export Utility — zero dependencies.
 * Handles proper escaping, Blob creation, and programmatic download.
 */

function escapeCSV(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function downloadCSV(
  filename: string,
  headers: string[],
  rows: (string | number | null | undefined)[][],
) {
  const headerLine = headers.map(escapeCSV).join(',');
  const bodyLines = rows.map((row) => row.map(escapeCSV).join(','));
  const csv = [headerLine, ...bodyLines].join('\r\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export a MerchantProfile as a downloadable CSV report.
 */
export function exportMerchantReport(merchant: {
  id: string;
  name: string;
  dba: string;
  industry: string;
  state: string;
  city: string;
  phone: string;
  email: string;
  enrolledDate: string;
  firstFundedDate: string | null;
  status: string;
  tier: string;
  assignedRep: string;
  territory: string;
  volumeMTD: number;
  volumeYTD: number;
  dealsMTD: number;
  dealsYTD: number;
  approvalRate: number;
  avgTicket: number;
  fundingRate: number;
  autoPayAttachRate: number;
  delinquencyRate: number;
  chargebackRate: number;
  fpdRate: number;
  monthlyVolume: { month: string; volume: number; deals: number }[];
  recentActivity: { date: string; type: string; note: string }[];
}) {
  const m = merchant;
  const rows: (string | number | null)[][] = [
    // Profile section
    ['--- MERCHANT PROFILE ---', '', ''],
    ['Field', 'Value', ''],
    ['Merchant ID', m.id, ''],
    ['Legal Name', m.name, ''],
    ['DBA', m.dba, ''],
    ['Industry', m.industry, ''],
    ['Location', `${m.city}, ${m.state}`, ''],
    ['Phone', m.phone, ''],
    ['Email', m.email, ''],
    ['Enrolled Date', m.enrolledDate, ''],
    ['First Funded Date', m.firstFundedDate, ''],
    ['Status', m.status, ''],
    ['Tier', m.tier, ''],
    ['Assigned Rep', m.assignedRep, ''],
    ['Territory', m.territory, ''],
    ['', '', ''],
    // Performance section
    ['--- PERFORMANCE METRICS ---', '', ''],
    ['Metric', 'Value', ''],
    ['Volume MTD', `$${m.volumeMTD.toLocaleString()}`, ''],
    ['Volume YTD', `$${m.volumeYTD.toLocaleString()}`, ''],
    ['Deals MTD', m.dealsMTD, ''],
    ['Deals YTD', m.dealsYTD, ''],
    ['Approval Rate', `${m.approvalRate}%`, ''],
    ['Funding Rate', `${m.fundingRate}%`, ''],
    ['Avg Ticket', `$${m.avgTicket.toLocaleString()}`, ''],
    ['AutoPay Attach Rate', `${m.autoPayAttachRate}%`, ''],
    ['', '', ''],
    // Risk section
    ['--- RISK INDICATORS ---', '', ''],
    ['Metric', 'Value', ''],
    ['Delinquency Rate', `${m.delinquencyRate}%`, ''],
    ['Chargeback Rate', `${m.chargebackRate}%`, ''],
    ['FPD Rate', `${m.fpdRate}%`, ''],
    ['', '', ''],
    // Monthly Volume
    ['--- MONTHLY VOLUME TREND ---', '', ''],
    ['Month', 'Volume', 'Deals'],
    ...m.monthlyVolume.map((mv) => [mv.month, `$${mv.volume.toLocaleString()}`, mv.deals] as (string | number | null)[]),
    ['', '', ''],
    // Recent Activity
    ['--- RECENT ACTIVITY ---', '', ''],
    ['Date', 'Type', 'Note'],
    ...m.recentActivity.map((a) => [a.date, a.type, a.note] as (string | number | null)[]),
  ];

  const headers = ['', '', ''];
  const filename = `${m.name.replace(/[^a-zA-Z0-9]/g, '_')}_Report_${new Date().toISOString().slice(0, 10)}`;
  downloadCSV(filename, headers, rows);
}
