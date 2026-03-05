'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, FileText, Trash2, Download, MessageSquare, BarChart3 } from 'lucide-react';
import type { SavedReport, ChatResponseData } from '@/lib/chat/chatTypes';
import { downloadCSV } from '@/lib/exportCSV';

type Props = {
  open: boolean;
  onClose: () => void;
  reports: SavedReport[];
  onDelete: (id: string) => void;
};

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function exportReportCSV(report: SavedReport) {
  const date = new Date().toISOString().slice(0, 10);
  const safeName = report.name.replace(/[^a-zA-Z0-9]/g, '_');

  if (report.data.type === 'table') {
    downloadCSV(`Saved_${safeName}_${date}`, report.data.headers, report.data.rows);
  } else if (report.data.type === 'kpi') {
    downloadCSV(
      `Saved_${safeName}_${date}`,
      ['Metric', 'Value'],
      report.data.items.map(item => [item.label, item.value]),
    );
  } else if (report.data.type === 'list') {
    downloadCSV(
      `Saved_${safeName}_${date}`,
      [report.data.title],
      report.data.items.map(item => [item]),
    );
  }
}

function dataPreview(data: ChatResponseData): string {
  if (data.type === 'table') return `Table · ${data.rows.length} rows`;
  if (data.type === 'kpi') return `${data.items.length} KPIs`;
  if (data.type === 'list') return `${data.items.length} items`;
  return '';
}

export default function SavedReportsPanel({ open, onClose, reports, onDelete }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  const panel = (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-[520px] bg-[var(--color-card-bg)] shadow-2xl flex flex-col animate-slideIn">
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-[#1a2332] to-[#2d4a6f] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <FileText size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Saved Reports</h2>
                <p className="text-xs text-white/60">
                  {reports.length} report{reports.length !== 1 ? 's' : ''} saved
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={18} className="text-white/70" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-hover-bg)] flex items-center justify-center mb-4">
                <FileText size={28} className="text-gray-300" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">No saved reports yet</h3>
              <p className="text-xs text-[var(--color-text-muted)] max-w-[260px]">
                Ask Finley a question, then click the bookmark icon on any data result to save it here for quick access.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {reports.map(report => (
                <div
                  key={report.id}
                  className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Report header */}
                  <div className="px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                          {report.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {report.source === 'finley' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full">
                              <MessageSquare size={8} />
                              Finley
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded-full">
                              <BarChart3 size={8} />
                              Custom Report
                            </span>
                          )}
                          <span className="text-[10px] text-[var(--color-text-muted)]">
                            {dataPreview(report.data)}
                          </span>
                          <span className="text-[10px] text-[var(--color-text-muted)]">
                            · {formatDate(report.savedAt)}
                          </span>
                        </div>
                        {report.query && (
                          <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5 italic truncate">
                            &ldquo;{report.query}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => exportReportCSV(report)}
                          className="p-1.5 rounded-lg hover:bg-[var(--color-hover-bg)] transition-colors cursor-pointer"
                          title="Export as CSV"
                        >
                          <Download size={14} className="text-[var(--color-text-muted)]" />
                        </button>
                        <button
                          onClick={() => onDelete(report.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete report"
                        >
                          <Trash2 size={14} className="text-[var(--color-text-muted)] hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Data preview */}
                  <div className="border-t border-[var(--color-border)] bg-[var(--color-hover-bg)]">
                    {report.data.type === 'table' && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-[11px]">
                          <thead>
                            <tr className="border-b border-[var(--color-border)]">
                              {report.data.headers.map(h => (
                                <th key={h} className="text-left px-3 py-1.5 text-[9px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)] bg-[var(--color-hover-bg)]">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {report.data.rows.slice(0, 4).map((row, i) => (
                              <tr key={i} className="border-b border-[var(--color-border)] last:border-0">
                                {row.map((cell, j) => (
                                  <td key={j} className="px-3 py-1 text-[var(--color-text-primary)] whitespace-nowrap">
                                    {j === 0 ? <span className="font-medium">{cell}</span> : cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {report.data.rows.length > 4 && (
                          <div className="px-3 py-1 text-[9px] text-[var(--color-text-muted)] bg-[var(--color-hover-bg)]">
                            +{report.data.rows.length - 4} more rows
                          </div>
                        )}
                      </div>
                    )}

                    {report.data.type === 'kpi' && (
                      <div className="grid grid-cols-2 gap-1.5 p-2.5">
                        {report.data.items.slice(0, 4).map(item => {
                          const colorClass =
                            item.status === 'green' ? 'text-[var(--color-ep-green)]'
                            : item.status === 'orange' ? 'text-[var(--color-ep-orange)]'
                            : item.status === 'red' ? 'text-[var(--color-ep-red)]'
                            : 'text-[var(--color-text-primary)]';
                          return (
                            <div key={item.label} className="bg-[var(--color-card-bg)] rounded-lg p-2 border border-[var(--color-border)]">
                              <div className="text-[8px] uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">{item.label}</div>
                              <div className={`text-xs font-bold tabular-nums ${colorClass}`}>{item.value}</div>
                            </div>
                          );
                        })}
                        {report.data.items.length > 4 && (
                          <div className="col-span-2 text-[9px] text-[var(--color-text-muted)] text-center py-1">
                            +{report.data.items.length - 4} more KPIs
                          </div>
                        )}
                      </div>
                    )}

                    {report.data.type === 'list' && (
                      <div className="p-3">
                        <ul className="space-y-0.5">
                          {report.data.items.slice(0, 4).map(item => (
                            <li key={item} className="text-[11px] text-[var(--color-text-secondary)] flex items-start gap-1.5">
                              <span className="text-[var(--color-ep-green)] mt-0.5">&#8226;</span>
                              {item}
                            </li>
                          ))}
                          {report.data.items.length > 4 && (
                            <li className="text-[9px] text-[var(--color-text-muted)]">
                              +{report.data.items.length - 4} more
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {reports.length > 0 && (
          <div className="flex-shrink-0 px-4 py-3 bg-[var(--color-hover-bg)] border-t border-[var(--color-border)]">
            <p className="text-[10px] text-[var(--color-text-muted)] text-center">
              Reports are stored locally in your browser
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(panel, document.body);
}
