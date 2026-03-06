'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Pin, PinOff, FileText, Table2, BarChart3, List } from 'lucide-react';
import { useDashboard } from '@/lib/DashboardContext';
import type { SavedReport } from '@/lib/chat/chatTypes';

type ReportPinSelectorProps = {
  open: boolean;
  onClose: () => void;
};

export default function ReportPinSelector({ open, onClose }: ReportPinSelectorProps) {
  const { pinnedReportIds, pinReport, unpinReport, isReportPinned } = useDashboard();
  const [search, setSearch] = useState('');
  const [reports, setReports] = useState<SavedReport[]>([]);

  // Load saved reports from localStorage
  useEffect(() => {
    if (!open) return;
    try {
      const stored = localStorage.getItem('ep-saved-reports');
      if (stored) setReports(JSON.parse(stored));
      else setReports([]);
    } catch { setReports([]); }
  }, [open]);

  if (!open) return null;

  const filtered = reports.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.query && r.query.toLowerCase().includes(search.toLowerCase()))
  );

  const typeIcon = (type: string) => {
    if (type === 'table') return Table2;
    if (type === 'kpi') return BarChart3;
    return List;
  };

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
        <div className="bg-[var(--color-card-bg)] rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col border border-[var(--color-border)] animate-fadeInUp">
          {/* Header */}
          <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-[var(--color-border)]">
            <div>
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Pin Reports to Dashboard</h2>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                {pinnedReportIds.length} report{pinnedReportIds.length !== 1 ? 's' : ''} pinned · {reports.length} available
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[var(--color-hover-bg)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Search */}
          <div className="px-5 py-2 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-hover-bg)] rounded-lg border border-[var(--color-border)]">
              <Search size={14} className="text-[var(--color-text-muted)]" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search reports..."
                className="flex-1 text-xs bg-transparent outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
              />
            </div>
          </div>

          {/* Report List */}
          <div className="flex-1 overflow-y-auto px-3 py-2">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText size={32} className="text-[var(--color-text-muted)] mb-3" />
                <p className="text-sm text-[var(--color-text-muted)]">
                  {reports.length === 0 ? 'No saved reports yet' : 'No matching reports'}
                </p>
                <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                  {reports.length === 0 ? 'Ask Finley a question or build a custom report first.' : 'Try a different search term.'}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {filtered.map(report => {
                  const pinned = isReportPinned(report.id);
                  const TypeIcon = typeIcon(report.data.type);
                  const typeLabel = report.data.type === 'table'
                    ? `Table · ${report.data.rows.length} rows`
                    : report.data.type === 'kpi'
                    ? `${report.data.items.length} KPIs`
                    : `${report.data.items.length} items`;

                  return (
                    <button
                      key={report.id}
                      onClick={() => pinned ? unpinReport(report.id) : pinReport(report.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                        pinned
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-[var(--color-ep-green)]/30'
                          : 'hover:bg-[var(--color-hover-bg)] border border-transparent'
                      }`}
                    >
                      <TypeIcon size={16} className={pinned ? 'text-[var(--color-ep-green)]' : 'text-[var(--color-text-muted)]'} />
                      <div className="flex-1 text-left min-w-0">
                        <div className="text-xs font-medium text-[var(--color-text-primary)] truncate">{report.name}</div>
                        <div className="text-[10px] text-[var(--color-text-muted)] truncate">
                          {typeLabel} · {report.source === 'finley' ? 'Finley' : 'Custom'}
                          {report.query && ` · "${report.query}"`}
                        </div>
                      </div>
                      {pinned ? (
                        <PinOff size={14} className="text-[var(--color-ep-green)] flex-shrink-0" />
                      ) : (
                        <Pin size={14} className="text-[var(--color-text-muted)] flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-[var(--color-border)] flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[var(--color-ep-green)] text-white hover:brightness-110 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
