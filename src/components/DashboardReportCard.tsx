'use client';

import { PinOff, Table2, BarChart3, List } from 'lucide-react';
import type { SavedReport } from '@/lib/chat/chatTypes';

type DashboardReportCardProps = {
  report: SavedReport;
  onUnpin: () => void;
  showUnpin?: boolean;
};

export default function DashboardReportCard({ report, onUnpin, showUnpin = true }: DashboardReportCardProps) {
  const typeIcon = report.data.type === 'table' ? Table2 : report.data.type === 'kpi' ? BarChart3 : List;
  const TypeIcon = typeIcon;
  const typeLabel = report.data.type === 'table'
    ? `Table · ${report.data.rows.length} rows`
    : report.data.type === 'kpi'
    ? `${report.data.items.length} KPIs`
    : `${report.data.items.length} items`;

  return (
    <div className="bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-2">
        <TypeIcon size={14} className="text-[var(--color-ep-blue)] flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-[var(--color-text-primary)] truncate">{report.name}</div>
          <div className="text-[10px] text-[var(--color-text-muted)]">
            {typeLabel} · {report.source === 'finley' ? 'Finley' : 'Custom Report'}
          </div>
        </div>
        {showUnpin && (
          <button
            onClick={onUnpin}
            className="p-1 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-ep-red)] hover:bg-[var(--color-hover-bg)] transition-all cursor-pointer flex-shrink-0"
            title="Remove from dashboard"
          >
            <PinOff size={13} />
          </button>
        )}
      </div>

      {/* Data Preview */}
      <div className="border-t border-[var(--color-border)] bg-[var(--color-hover-bg)]">
        {report.data.type === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  {report.data.headers.slice(0, 5).map(h => (
                    <th key={h} className="text-left px-3 py-1.5 text-[9px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.data.rows.slice(0, 3).map((row, i) => (
                  <tr key={i} className="border-b border-[var(--color-border)] last:border-0">
                    {row.slice(0, 5).map((cell, j) => (
                      <td key={j} className="px-3 py-1 text-[var(--color-text-primary)] whitespace-nowrap">
                        {j === 0 ? <span className="font-medium">{cell}</span> : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {report.data.rows.length > 3 && (
              <div className="px-3 py-1 text-[9px] text-[var(--color-text-muted)]">
                +{report.data.rows.length - 3} more rows
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
                  +{report.data.items.length - 4} more items
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
