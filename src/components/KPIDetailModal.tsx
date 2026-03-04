'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, TrendingUp, TrendingDown, Minus, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts';

export type KPIDetailData = {
  history?: { period: string; value: number }[];
  breakdown?: { label: string; value: string | number; pct?: number; status?: 'green' | 'orange' | 'red' }[];
  insights?: string[];
  target?: number | string;
};

type KPIDetailModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  value: string | number;
  tooltip?: string;
  trend?: number | null;
  trendDir?: 'up' | 'down' | 'flat';
  status?: 'green' | 'orange' | 'red' | 'blue' | 'default';
  detail?: KPIDetailData;
};

export default function KPIDetailModal({
  open,
  onClose,
  title,
  value,
  tooltip,
  trend,
  trendDir,
  status = 'green',
  detail,
}: KPIDetailModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const direction = trendDir || (trend !== undefined && trend !== null ? (trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat') : 'flat');
  const trendColor = direction === 'up' ? 'text-[var(--color-ep-green)]' : direction === 'down' ? 'text-[var(--color-ep-red)]' : 'text-[var(--color-text-muted)]';
  const statusAccent = {
    green: 'var(--color-ep-green)',
    orange: 'var(--color-ep-orange)',
    red: 'var(--color-ep-red)',
    blue: 'var(--color-ep-blue)',
    default: 'var(--color-border)',
  }[status];

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto mx-4"
        style={{ borderTop: `3px solid ${statusAccent}` }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium mb-1">
              {title}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold tabular-nums text-[var(--color-text-primary)]">{value}</span>
              {trend !== undefined && trend !== null && (
                <span className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
                  {direction === 'up' && <TrendingUp size={16} />}
                  {direction === 'down' && <TrendingDown size={16} />}
                  {direction === 'flat' && <Minus size={16} />}
                  {trend > 0 ? '+' : ''}{trend}%
                </span>
              )}
            </div>
            {detail?.target && (
              <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--color-text-muted)]">
                <Target size={12} />
                Target: {detail.target}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Description */}
        {tooltip && (
          <div className="px-6 pb-4">
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{tooltip}</p>
          </div>
        )}

        {/* Trend Chart */}
        {detail?.history && detail.history.length > 0 && (
          <div className="px-6 pb-4">
            <div className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium mb-3">
              Historical Trend
            </div>
            <div className="bg-[#f8fafc] rounded-lg p-4 border border-[var(--color-border)]">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={detail.history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke={statusAccent} strokeWidth={2} dot={{ r: 3, fill: statusAccent }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Breakdown Table */}
        {detail?.breakdown && detail.breakdown.length > 0 && (
          <div className="px-6 pb-4">
            <div className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium mb-3">
              Breakdown
            </div>
            <div className="bg-white rounded-lg border border-[var(--color-border)] overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {detail.breakdown.map((row, i) => (
                    <tr key={i} className="border-b border-[var(--color-border)] last:border-0">
                      <td className="px-4 py-2.5 text-[var(--color-text-secondary)]">{row.label}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums font-medium">{row.value}</td>
                      {row.pct !== undefined && (
                        <td className="px-4 py-2.5 text-right tabular-nums text-[var(--color-text-muted)] w-20">{row.pct}%</td>
                      )}
                      {row.status && (
                        <td className="px-4 py-2.5 text-right w-8">
                          {row.status === 'green' && <CheckCircle size={14} className="text-[var(--color-ep-green)] ml-auto" />}
                          {row.status === 'orange' && <AlertTriangle size={14} className="text-[var(--color-ep-orange)] ml-auto" />}
                          {row.status === 'red' && <AlertTriangle size={14} className="text-[var(--color-ep-red)] ml-auto" />}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Insights */}
        {detail?.insights && detail.insights.length > 0 && (
          <div className="px-6 pb-6">
            <div className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium mb-3">
              Key Insights
            </div>
            <ul className="space-y-2">
              {detail.insights.map((insight, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: statusAccent }} />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* No detail data fallback */}
        {!detail && (
          <div className="px-6 pb-6 text-center text-sm text-[var(--color-text-muted)]">
            Detailed drill-down data will be available once connected to EAC.
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
