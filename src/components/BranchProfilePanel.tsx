'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, Users, TrendingDown, Download, Building2, BarChart3 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { BranchDetail } from '@/data/mockData';
import { downloadCSV } from '@/lib/exportCSV';

type Props = {
  territory: BranchDetail | null;
  onClose: () => void;
};

export default function BranchProfilePanel({ territory, onClose }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (territory) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [territory, onClose]);

  if (!territory) return null;

  const t = territory;
  const activeRate = ((t.activeBranches / t.branchCount) * 100).toFixed(1);

  function exportTerritoryReport() {
    const date = new Date().toISOString().slice(0, 10);
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Territory', t.territory],
      ['Region', t.region],
      ['Manager', t.manager],
      ['Total Branches', t.branchCount],
      ['Active Branches', t.activeBranches],
      ['Inactive Branches', t.inactiveBranches],
      ['Active Rate', `${activeRate}%`],
      ['Pre Avg Monthly', `$${(t.preAvgMonthly / 1000).toFixed(0)}K`],
      ['Post Run Rate', `$${(t.postRunRate / 1000).toFixed(0)}K`],
      ['Delta', `${t.deltaPct}%`],
      ['Total Enrollments', t.totalEnrollments],
      ['Avg Ticket', `$${t.keyMetrics.avgTicket.toLocaleString()}`],
      ['Conversion Rate', `${t.keyMetrics.conversionRate}%`],
      ['Funding Rate', `${t.keyMetrics.fundingRate}%`],
      ['OSRs', t.osrs.join(', ')],
      ['', ''],
      ['TOP BRANCHES', ''],
      ['Branch', 'City, State', 'Status', 'Monthly Volume', 'Enrollments'],
      ...t.topBranches.map(b => [b.name, `${b.city}, ${b.state}`, b.status, `$${(b.monthlyVolume / 1000).toFixed(1)}K`, b.enrollments]),
    ];
    downloadCSV(`EP_Territory_${t.territory}_${date}`, headers, rows);
  }

  const panel = (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        className="absolute right-0 top-0 bottom-0 w-full max-w-[520px] bg-white shadow-2xl flex flex-col animate-slideIn"
        style={{ animationDuration: '200ms' }}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{t.territory}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                  {t.region}
                </span>
              </div>
              <div className="text-sm text-[var(--color-text-secondary)]">{t.manager}</div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Branch KPIs */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3 flex items-center gap-1.5">
              <Building2 size={12} />
              Branch Overview
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <KPI label="Total Branches" value={t.branchCount.toString()} />
              <KPI label="Active" value={t.activeBranches.toString()} color="green" />
              <KPI label="Inactive" value={t.inactiveBranches.toString()} color={t.inactiveBranches > t.activeBranches ? 'red' : 'orange'} />
            </div>
          </div>

          {/* Performance KPIs */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3 flex items-center gap-1.5">
              <BarChart3 size={12} />
              Performance
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <KPI label="Pre Avg/Mo" value={`$${(t.preAvgMonthly / 1000).toFixed(0)}K`} />
              <KPI label="Post Run Rate" value={`$${(t.postRunRate / 1000).toFixed(0)}K`} />
              <KPI label="Delta" value={`${t.deltaPct}%`} color={t.deltaPct >= 0 ? 'green' : t.deltaPct >= -30 ? 'orange' : 'red'} />
              <KPI label="Active Rate" value={`${activeRate}%`} color={Number(activeRate) >= 50 ? 'green' : Number(activeRate) >= 35 ? 'orange' : 'red'} />
              <KPI label="Total Enrollments" value={t.totalEnrollments.toString()} />
              <KPI label="Avg Ticket" value={`$${t.keyMetrics.avgTicket.toLocaleString()}`} />
              <KPI label="Conversion Rate" value={`${t.keyMetrics.conversionRate}%`} color={t.keyMetrics.conversionRate >= 22 ? 'green' : t.keyMetrics.conversionRate >= 18 ? 'orange' : 'red'} />
              <KPI label="Funding Rate" value={`${t.keyMetrics.fundingRate}%`} color={t.keyMetrics.fundingRate >= 65 ? 'green' : t.keyMetrics.fundingRate >= 55 ? 'orange' : 'red'} />
            </div>
          </div>

          {/* Volume Trend Chart */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Performance Trend (6 Months)</h3>
            <div className="bg-gray-50 rounded-lg p-3 border border-[var(--color-border)]">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={t.monthlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(value: number, name: string) => [name === 'volume' ? `$${value.toLocaleString()}` : value, name === 'volume' ? 'Volume' : 'Enrollments']} />
                  <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Assigned OSRs */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3 flex items-center gap-1.5">
              <Users size={12} />
              Assigned OSRs
            </h3>
            <div className="flex flex-wrap gap-2">
              {t.osrs.map(osr => (
                <span key={osr} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                  <Users size={12} />
                  {osr}
                </span>
              ))}
            </div>
          </div>

          {/* Top Branches Table */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3 flex items-center gap-1.5">
              <TrendingDown size={12} />
              Top Branches
            </h3>
            <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-[var(--color-border)]">
                    <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">Branch</th>
                    <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">Location</th>
                    <th className="text-center px-3 py-2 text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">Status</th>
                    <th className="text-right px-3 py-2 text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {t.topBranches.map((b, i) => (
                    <tr key={i} className="border-b border-[var(--color-border)] last:border-0">
                      <td className="px-3 py-2 font-medium text-[var(--color-text-primary)]">{b.name}</td>
                      <td className="px-3 py-2 text-[var(--color-text-secondary)]">
                        <div className="flex items-center gap-1">
                          <MapPin size={10} className="text-[var(--color-text-muted)]" />
                          {b.city}, {b.state}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          b.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                        }`}>{b.status}</span>
                      </td>
                      <td className="px-3 py-2 text-right font-semibold tabular-nums">
                        {b.monthlyVolume > 0 ? `$${(b.monthlyVolume / 1000).toFixed(1)}K` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-[var(--color-border)] bg-gray-50">
          <button
            onClick={exportTerritoryReport}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-ep-blue)] text-white text-sm font-medium rounded-lg hover:brightness-110 transition-all cursor-pointer"
          >
            <Download size={15} />
            Download Territory Report
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(panel, document.body) : null;
}

function KPI({ label, value, color }: { label: string; value: string; color?: 'green' | 'orange' | 'red' }) {
  const colorClass = color === 'green' ? 'text-[var(--color-ep-green)]' : color === 'orange' ? 'text-[var(--color-ep-orange)]' : color === 'red' ? 'text-[var(--color-ep-red)]' : 'text-[var(--color-text-primary)]';
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-[var(--color-border)]">
      <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">{label}</div>
      <div className={`text-base font-bold tabular-nums ${colorClass}`}>{value}</div>
    </div>
  );
}
